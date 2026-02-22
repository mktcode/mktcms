import { mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { simpleGit } from 'simple-git'
import { getCurrentBranchName, mergeCounterpartBranchIntoCurrent } from '../../../../../src/runtime/server/utils/gitVersioning'

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

async function setupFixture(options: { withStaging?: boolean } = {}): Promise<GitFixture> {
  const { withStaging = true } = options
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
    await writeFile(join(seedDir, 'content.txt'), 'base\nfrom-staging\n', 'utf8')
    await seedRepo.raw(['add', '.'])
    await seedRepo.raw(['commit', '-m', 'feat: staging change'])
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

  it('fails with clear error when counterpart branch is missing', async () => {
    const noStagingFixture = await setupFixture({ withStaging: false })

    await expect(mergeCounterpartBranchIntoCurrent({
      baseDir: noStagingFixture.workDir,
      authUrlOverride: noStagingFixture.remoteDir,
    })).rejects.toThrowError(/Counterpart branch not found on remote: staging/)

    await rm(noStagingFixture.rootDir, { recursive: true, force: true })
  })
})
