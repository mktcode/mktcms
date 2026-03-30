import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { SessionManager } from '@mariozechner/pi-coding-agent'
import { appendAdminChatTurnMetadata, createAdminChatSession, deriveAdminChatSessionName, getAdminChatSessionDetail, getAdminChatSessionDir, listAdminChatSessions, maybeNameAdminChatSession } from '../../../../../src/runtime/server/utils/adminChatSessions'

function createAssistantMessage(text: string) {
  return {
    role: 'assistant' as const,
    content: [{ type: 'text' as const, text }],
    api: 'responses' as const,
    provider: 'openai' as const,
    model: 'gpt-5.4-mini',
    usage: {
      input: 1,
      output: 1,
      cacheRead: 0,
      cacheWrite: 0,
      totalTokens: 2,
      cost: {
        input: 0,
        output: 0,
        cacheRead: 0,
        cacheWrite: 0,
        total: 0,
      },
    },
    stopReason: 'stop' as const,
    timestamp: Date.now(),
  }
}

describe('adminChatSessions', () => {
  async function withSessionContext(run: (context: { cwd: string, sessionDir: string }) => Promise<void>) {
    const cwd = await mkdtemp(join(tmpdir(), 'mktcms-admin-chat-'))
    const sessionDir = join(cwd, '.pi/admin-chat/sessions')

    try {
      await run({ cwd, sessionDir })
    }
    finally {
      await rm(cwd, { force: true, recursive: true })
    }
  }

  it('creates and lists empty persisted sessions immediately', async () => {
    await withSessionContext(async (context) => {
      const detail = await createAdminChatSession(context)

      expect(detail.messages).toEqual([])
      expect(detail.session.label).toBe('Neue Sitzung')
      expect(detail.session.preview).toBe('Noch keine Nachrichten')

      const sessions = await listAdminChatSessions(context)

      expect(sessions).toHaveLength(1)
      expect(sessions[0]?.id).toBe(detail.session.id)
      expect(sessions[0]?.label).toBe('Neue Sitzung')
    })
  })

  it('migrates legacy sessions from .storage into .pi automatically', async () => {
    await withSessionContext(async (context) => {
      const legacyDir = join(context.cwd, '.storage/admin-chat/sessions')
      await createAdminChatSession({
        cwd: context.cwd,
        sessionDir: legacyDir,
      })

      const sessions = await listAdminChatSessions({ cwd: context.cwd })

      expect(getAdminChatSessionDir(context.cwd)).toBe(context.sessionDir)
      expect(sessions).toHaveLength(1)

      const migratedFile = join(context.sessionDir, `${sessions[0]?.createdAt.replace(/[:.]/g, '-')}_${sessions[0]?.id}.jsonl`)
      const fileContent = await readFile(migratedFile, 'utf8')

      expect(fileContent).toContain(sessions[0]?.id || '')
    })
  })

  it('maps persisted pi session messages and turn metadata back into UI messages', async () => {
    await withSessionContext(async (context) => {
      const created = await createAdminChatSession(context)
      const detailBefore = await getAdminChatSessionDetail(created.session.id, context)

      expect(detailBefore.messages).toEqual([])

      const sessionManager = SessionManager.open(join(context.sessionDir, `${created.session.createdAt.replace(/[:.]/g, '-')}_${created.session.id}.jsonl`), context.sessionDir)

      sessionManager.appendMessage({
        role: 'user',
        content: 'Bitte analysiere den Fehler im Build.',
        timestamp: Date.now(),
      })
      sessionManager.appendMessage(createAssistantMessage('Ich prüfe den Build-Fehler jetzt.'))
      appendAdminChatTurnMetadata(sessionManager, 'coding')
      maybeNameAdminChatSession(sessionManager, 'Bitte analysiere den Fehler im Build.')

      const detail = await getAdminChatSessionDetail(created.session.id, context)

      expect(detail.session.name).toBe('Bitte analysiere den Fehler im Build.')
      expect(detail.messages).toEqual([
        {
          role: 'user',
          content: 'Bitte analysiere den Fehler im Build.',
          agent: undefined,
        },
        {
          role: 'assistant',
          content: 'Ich prüfe den Build-Fehler jetzt.',
          agent: 'coding',
        },
      ])
    })
  })

  it('derives compact session names from the first prompt', () => {
    expect(deriveAdminChatSessionName('   Ein   sehr   langer   erster   Prompt   ')).toBe('Ein sehr langer erster Prompt')
    expect(deriveAdminChatSessionName('')).toBe('')
  })
})
