import { mkdir, readdir, rename, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { createError } from 'h3'
import { SessionManager, type SessionEntry, type SessionInfo } from '@mariozechner/pi-coding-agent'
import type { AdminChatAgent, AdminChatMessage, AdminChatSessionDetail, AdminChatSessionSummary } from './adminChatShared'

const TURN_METADATA_TYPE = 'mktcms_admin_chat_turn'
const EMPTY_SESSION_LABEL = 'Neue Sitzung'
const EMPTY_SESSION_PREVIEW = 'Noch keine Nachrichten'

type AdminChatSessionContext = {
  cwd?: string
  sessionDir?: string
}

type AdminChatTurnMetadata = {
  targetId: string
  agent: AdminChatAgent
}

export function getAdminChatSessionDir(cwd = process.cwd()) {
  return resolve(cwd, '.pi/admin-chat/sessions')
}

function getLegacyAdminChatSessionDir(cwd = process.cwd()) {
  return resolve(cwd, '.storage/admin-chat/sessions')
}

async function migrateLegacyAdminChatSessions(cwd: string, sessionDir: string) {
  const legacyDir = getLegacyAdminChatSessionDir(cwd)

  if (legacyDir === sessionDir) {
    return
  }

  let legacyEntries

  try {
    legacyEntries = await readdir(legacyDir, { withFileTypes: true })
  }
  catch {
    return
  }

  for (const entry of legacyEntries) {
    if (!entry.isFile() || !entry.name.endsWith('.jsonl')) {
      continue
    }

    const sourcePath = resolve(legacyDir, entry.name)
    const targetPath = resolve(sessionDir, entry.name)

    try {
      await rename(sourcePath, targetPath)
    }
    catch {
      continue
    }
  }
}

async function ensureAdminChatSessionDir(cwd: string, sessionDir: string) {
  await mkdir(sessionDir, { recursive: true })
  await migrateLegacyAdminChatSessions(cwd, sessionDir)
}

function collapseWhitespace(value: string) {
  return value.replace(/\s+/g, ' ').trim()
}

function truncateText(value: string, maxLength: number) {
  if (value.length <= maxLength) {
    return value
  }

  return `${value.slice(0, maxLength - 1).trimEnd()}...`
}

function toSessionLabel(name: string | undefined, firstMessage: string) {
  const normalizedName = collapseWhitespace(name || '')
  if (normalizedName) {
    return normalizedName
  }

  const normalizedMessage = collapseWhitespace(firstMessage)
  if (!normalizedMessage || normalizedMessage === '(no messages)') {
    return EMPTY_SESSION_LABEL
  }

  return truncateText(normalizedMessage, 72)
}

function toSessionPreview(name: string | undefined, firstMessage: string) {
  const normalizedName = collapseWhitespace(name || '')
  if (normalizedName) {
    return truncateText(normalizedName, 120)
  }

  const normalizedMessage = collapseWhitespace(firstMessage)
  if (!normalizedMessage || normalizedMessage === '(no messages)') {
    return EMPTY_SESSION_PREVIEW
  }

  return truncateText(normalizedMessage, 120)
}

function toSessionSummary(info: SessionInfo): AdminChatSessionSummary {
  const name = collapseWhitespace(info.name || '') || null

  return {
    id: info.id,
    name,
    label: toSessionLabel(info.name, info.firstMessage),
    preview: toSessionPreview(info.name, info.firstMessage),
    createdAt: info.created.toISOString(),
    updatedAt: info.modified.toISOString(),
    messageCount: info.messageCount,
  }
}

function extractMessageText(content: unknown) {
  if (typeof content === 'string') {
    return content.trim()
  }

  if (!Array.isArray(content)) {
    return ''
  }

  return content
    .filter(part => part && part.type === 'text' && typeof part.text === 'string')
    .map(part => part.text.trim())
    .filter(Boolean)
    .join('')
    .trim()
}

function isAdminChatAgent(value: unknown): value is AdminChatAgent {
  return value === 'conversation' || value === 'coding'
}

function parseTurnMetadata(entry: SessionEntry): AdminChatTurnMetadata | null {
  if (entry.type !== 'custom' || entry.customType !== TURN_METADATA_TYPE || !entry.data || typeof entry.data !== 'object') {
    return null
  }

  const data = entry.data as Record<string, unknown>
  const targetId = typeof data.targetId === 'string' ? data.targetId : ''
  const agent = data.agent

  if (!targetId || !isAdminChatAgent(agent)) {
    return null
  }

  return { targetId, agent }
}

function mapSessionEntriesToMessages(entries: SessionEntry[]): AdminChatMessage[] {
  const agentByTargetId = new Map<string, AdminChatAgent>()

  for (const entry of entries) {
    const metadata = parseTurnMetadata(entry)
    if (metadata) {
      agentByTargetId.set(metadata.targetId, metadata.agent)
    }
  }

  const messages: AdminChatMessage[] = []

  for (const entry of entries) {
    if (entry.type !== 'message') {
      continue
    }

    const role = entry.message.role
    if (role !== 'user' && role !== 'assistant') {
      continue
    }

    const content = extractMessageText(entry.message.content)
    if (!content) {
      continue
    }

    messages.push({
      role,
      content,
      agent: role === 'assistant' ? agentByTargetId.get(entry.id) : undefined,
    })
  }

  return messages
}

function withDefaultContext(context: AdminChatSessionContext = {}) {
  const cwd = context.cwd || process.cwd()
  const sessionDir = context.sessionDir || getAdminChatSessionDir(cwd)

  return { cwd, sessionDir }
}

async function findSessionInfo(sessionId: string, context: AdminChatSessionContext = {}) {
  const { cwd, sessionDir } = withDefaultContext(context)
  await ensureAdminChatSessionDir(cwd, sessionDir)

  const sessions = await SessionManager.list(cwd, sessionDir)
  const sessionInfo = sessions.find(session => session.id === sessionId)

  if (!sessionInfo) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Chat session not found',
    })
  }

  return {
    cwd,
    sessionDir,
    sessionInfo,
  }
}

export async function listAdminChatSessions(context: AdminChatSessionContext = {}) {
  const { cwd, sessionDir } = withDefaultContext(context)
  await ensureAdminChatSessionDir(cwd, sessionDir)

  const sessions = await SessionManager.list(cwd, sessionDir)

  return sessions
    .map(toSessionSummary)
    .sort((left, right) => new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime())
}

export async function createAdminChatSession(context: AdminChatSessionContext = {}): Promise<AdminChatSessionDetail> {
  const { cwd, sessionDir } = withDefaultContext(context)
  await ensureAdminChatSessionDir(cwd, sessionDir)

  const sessionManager = SessionManager.create(cwd, sessionDir)
  const sessionFile = sessionManager.getSessionFile()
  const header = sessionManager.getHeader()

  if (!sessionFile || !header) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Chat session could not be created',
    })
  }

  await writeFile(sessionFile, `${JSON.stringify(header)}\n`, 'utf8')

  return {
    session: {
      id: header.id,
      name: null,
      label: EMPTY_SESSION_LABEL,
      preview: EMPTY_SESSION_PREVIEW,
      createdAt: header.timestamp,
      updatedAt: header.timestamp,
      messageCount: 0,
    },
    messages: [],
  }
}

export async function openAdminChatSessionManager(sessionId: string, context: AdminChatSessionContext = {}) {
  const { sessionDir, sessionInfo } = await findSessionInfo(sessionId, context)

  return SessionManager.open(sessionInfo.path, sessionDir)
}

export async function getAdminChatSessionDetail(sessionId: string, context: AdminChatSessionContext = {}): Promise<AdminChatSessionDetail> {
  const { sessionDir, sessionInfo } = await findSessionInfo(sessionId, context)
  const sessionManager = SessionManager.open(sessionInfo.path, sessionDir)
  const messages = mapSessionEntriesToMessages(sessionManager.getEntries())

  return {
    session: {
      ...toSessionSummary(sessionInfo),
      messageCount: messages.length,
    },
    messages,
  }
}

export function deriveAdminChatSessionName(prompt: string) {
  const normalizedPrompt = collapseWhitespace(prompt)
  if (!normalizedPrompt) {
    return ''
  }

  return truncateText(normalizedPrompt, 72)
}

export function maybeNameAdminChatSession(sessionManager: SessionManager, prompt: string) {
  if (sessionManager.getSessionName()) {
    return
  }

  const name = deriveAdminChatSessionName(prompt)
  if (name) {
    sessionManager.appendSessionInfo(name)
  }
}

export function appendAdminChatTurnMetadata(sessionManager: SessionManager, agent: AdminChatAgent) {
  const latestAssistantEntry = [...sessionManager.getEntries()]
    .reverse()
    .find(entry => entry.type === 'message' && entry.message.role === 'assistant')

  if (!latestAssistantEntry) {
    return
  }

  sessionManager.appendCustomEntry(TURN_METADATA_TYPE, {
    targetId: latestAssistantEntry.id,
    agent,
  })
}
