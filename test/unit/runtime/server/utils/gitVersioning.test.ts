import { mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { simpleGit } from 'simple-git'
import { getBranchUpdateStatus, getCurrentBranchName, mergeCounterpartBranchIntoCurrent } from '../../../../../src/runtime/server/utils/gitVersioning'

vi.mock('nitropack/runtime', () => ({
  useRuntimeConfig: () => ({
    mktcms: {
      gitUser: 'test-user',
      gitRepo: 'test/repo',
      gitToken: 'test-token',
    },
  }),
}))

type GitFixture = {
  rootDir: string
  remoteDir: string
  seedDir: string
  workDir: string
}

async function setupFixture(options: { withStaging?: boolean, withStagingChange?: boolean } = {}): Promise<GitFixture> {
  const { withStaging = true, withStagingChange = true } = options
  const rootDir = await mkdtemp(join(tmpdir(), 'mktcms-git-versioning-'))
  const remoteDir = join(rootDir, 'remote.git')
  const seedDir = join(rootDir, 'seed')
  const workDir = join(rootDir, 'work')

  await simpleGit().raw(['init', '--bare', remoteDir])

  const seedGit = simpleGit()
  await seedGit.raw(['clone', remoteDir, seedDir])

  const seedRepo = simpleGit({ baseDir: seedDir })
  await seedRepo.raw(['config', 'user.name', 'Test User'])
  await seedRepo.raw(['config', 'user.email', 'test@example.com'])

  await seedRepo.raw(['checkout', '-b', 'main'])
  await writeFile(join(seedDir, 'content.txt'), 'base\n', 'utf8')
  await seedRepo.raw(['add', '.'])
  await seedRepo.raw(['commit', '-m', 'chore: initial'])
  await seedRepo.raw(['push', '-u', 'origin', 'main'])

  if (withStaging) {
    await seedRepo.raw(['checkout', '-b', 'staging'])
    if (withStagingChange) {
      await writeFile(join(seedDir, 'content.txt'), 'base\nfrom-staging\n', 'utf8')
      await seedRepo.raw(['add', '.'])
      await seedRepo.raw(['commit', '-m', 'feat: staging change'])
    }
    await seedRepo.raw(['push', '-u', 'origin', 'staging'])
  }

  await simpleGit().raw(['clone', '--branch', 'main', remoteDir, workDir])
  const workRepo = simpleGit({ baseDir: workDir })
  await workRepo.raw(['config', 'user.name', 'Test User'])
  await workRepo.raw(['config', 'user.email', 'test@example.com'])

  return {
    rootDir,
    remoteDir,
    seedDir,
    workDir,
  }
}

describe('gitVersioning', () => {
  let fixture: GitFixture

  beforeEach(async () => {
    if (fixture?.rootDir) {
      await rm(fixture.rootDir, { recursive: true, force: true })
    }

    fixture = await setupFixture()
  })

  afterAll(async () => {
    if (fixture?.rootDir) {
      await rm(fixture.rootDir, { recursive: true, force: true })
    }
  })

  it('reads currently checked out branch from repository', async () => {
    const branch = await getCurrentBranchName({
      baseDir: fixture.workDir,
      authUrlOverride: fixture.remoteDir,
    })

    expect(branch).toBe('main')
  })

  it('merges staging into main when main is checked out', async () => {
    const result = await mergeCounterpartBranchIntoCurrent({
      baseDir: fixture.workDir,
      authUrlOverride: fixture.remoteDir,
    })

    expect(result).toEqual({
      sourceBranch: 'staging',
      targetBranch: 'main',
    })

    const verifyDir = join(fixture.rootDir, 'verify-main')
    await simpleGit().raw(['clone', '--branch', 'main', fixture.remoteDir, verifyDir])
    const file = await simpleGit({ baseDir: verifyDir }).raw(['show', 'HEAD:content.txt'])
    expect(file).toContain('from-staging')
  })

  it('merges main into staging when staging is checked out', async () => {
    const seedRepo = simpleGit({ baseDir: fixture.seedDir })
    await seedRepo.raw(['checkout', 'main'])
    await writeFile(join(fixture.seedDir, 'main-only.txt'), 'from-main\n', 'utf8')
    await seedRepo.raw(['add', '.'])
    await seedRepo.raw(['commit', '-m', 'feat: main change'])
    await seedRepo.raw(['push', 'origin', 'main'])

    const stagingWorkDir = join(fixture.rootDir, 'work-staging')
    await simpleGit().raw(['clone', '--branch', 'staging', fixture.remoteDir, stagingWorkDir])
    const stagingRepo = simpleGit({ baseDir: stagingWorkDir })
    await stagingRepo.raw(['config', 'user.name', 'Test User'])
    await stagingRepo.raw(['config', 'user.email', 'test@example.com'])

    const result = await mergeCounterpartBranchIntoCurrent({
      baseDir: stagingWorkDir,
      authUrlOverride: fixture.remoteDir,
    })

    expect(result).toEqual({
      sourceBranch: 'main',
      targetBranch: 'staging',
    })

    const verifyDir = join(fixture.rootDir, 'verify-staging')
    await simpleGit().raw(['clone', '--branch', 'staging', fixture.remoteDir, verifyDir])
    const file = await simpleGit({ baseDir: verifyDir }).raw(['show', 'HEAD:main-only.txt'])
    expect(file).toContain('from-main')
  })

  it('reports source ahead count and non-identical state', async () => {
    const status = await getBranchUpdateStatus({
      baseDir: fixture.workDir,
      authUrlOverride: fixture.remoteDir,
    })

    expect(status.currentBranch).toBe('main')
    expect(status.sourceBranch).toBe('staging')
    expect(status.sourceAheadCount).toBe(1)
    expect(status.targetAheadCount).toBe(0)
    expect(status.isIdentical).toBe(false)
    expect(status.canUpdate).toBe(true)
  })

  it('reports identical branches when both branches have same history', async () => {
    const identicalFixture = await setupFixture({ withStaging: true, withStagingChange: false })

    const status = await getBranchUpdateStatus({
      baseDir: identicalFixture.workDir,
      authUrlOverride: identicalFixture.remoteDir,
    })

    expect(status.sourceAheadCount).toBe(0)
    expect(status.targetAheadCount).toBe(0)
    expect(status.isIdentical).toBe(true)
    expect(status.canUpdate).toBe(false)

    await rm(identicalFixture.rootDir, { recursive: true, force: true })
  })

  it('fails with clear error when counterpart branch is missing', async () => {
    const noStagingFixture = await setupFixture({ withStaging: false })

    await expect(mergeCounterpartBranchIntoCurrent({
      baseDir: noStagingFixture.workDir,
      authUrlOverride: noStagingFixture.remoteDir,
    })).rejects.toThrowError(/Counterpart branch not found on remote: staging/)

    const status = await getBranchUpdateStatus({
      baseDir: noStagingFixture.workDir,
      authUrlOverride: noStagingFixture.remoteDir,
    })

    expect(status.hasCounterpartBranch).toBe(false)
    expect(status.canUpdate).toBe(false)
    expect(status.updateBlockedReason).toContain('Counterpart branch not found')

    await rm(noStagingFixture.rootDir, { recursive: true, force: true })
  })
})
