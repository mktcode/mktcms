import z from 'zod'
import { createError, defineEventHandler, readValidatedBody } from 'h3'
import syncGitContent from '../../utils/syncGitContent'
import { toGitErrorMessage } from '../../utils/gitVersioning'
import { runDelegationAgent } from '../../utils/agent/delegationAgent'
import { executeContentEdits, planContentEdits } from '../../utils/agent/contentEditingAgent'

const answerSchema = z.object({
  id: z.string().trim().min(1),
  answer: z.string().trim().min(1),
})

const attachmentSchema = z.object({
  name: z.string().trim().min(1),
  type: z.string().trim().default('application/octet-stream'),
  size: z.number().int().nonnegative().default(0),
  textContent: z.string().max(25000).optional(),
  base64Content: z.string().max(500000).optional(),
})

const bodySchema = z.object({
  prompt: z.string().trim().min(1),
  answers: z.array(answerSchema).max(20).default([]),
  attachments: z.array(attachmentSchema).max(8).default([]),
})

export default defineEventHandler(async (event) => {
  const { prompt, answers, attachments } = await readValidatedBody(event, body => bodySchema.parse(body))

  let delegation
  try {
    delegation = await runDelegationAgent({
      prompt,
      answers,
      attachments,
    })
  }
  catch (error) {
    console.error('Delegation-Agent Fehler:', error)
    throw createError({
      statusCode: 502,
      statusMessage: 'KI-Agent aktuell nicht verfügbar',
    })
  }

  if (delegation.route === 'unsupported') {
    return {
      status: 'unsupported',
      message: delegation.shortReply || 'Diese Anfrage liegt außerhalb der aktuellen Agent-Funktionen.',
    }
  }

  if (delegation.route === 'clarify' || delegation.questions.length > 0) {
    return {
      status: 'question',
      message: delegation.shortReply || 'Ich brauche noch Details, bevor ich etwas ändere.',
      questions: delegation.questions,
    }
  }

  const plan = await planContentEdits({
    prompt,
    condensedTask: delegation.condensedTask,
    constraints: delegation.constraints,
    answers,
    attachments,
  })

  if (plan.questions.length > 0) {
    return {
      status: 'question',
      message: plan.shortReply || 'Ich brauche noch Details zur Ausführung.',
      questions: plan.questions,
    }
  }

  if (!plan.commitMessage?.trim()) {
    return {
      status: 'question',
      message: plan.shortReply || 'Bitte gib einen Commit-Kommentar an.',
      questions: [
        {
          id: 'commit_message',
          question: 'Welchen Kommentar soll ich für den Commit verwenden?',
          options: [
            { label: 'Inhalt aktualisiert', value: 'Inhalt aktualisiert' },
            { label: 'Dateireferenzen angepasst', value: 'Dateireferenzen angepasst' },
            { label: 'Markdown überarbeitet', value: 'Markdown überarbeitet' },
          ],
          allowCustomInput: true,
        },
      ],
    }
  }

  const execution = await executeContentEdits(plan.operations)

  if (execution.changedFiles.length === 0) {
    return {
      status: 'done',
      message: plan.shortReply || 'Keine Änderungen erforderlich.',
      changedFiles: [],
      warnings: execution.warnings,
      gitSync: 'skipped',
    }
  }

  let gitSync: 'ok' | 'failed' = 'ok'

  try {
    await syncGitContent(plan.commitMessage, execution.changedFiles)
  }
  catch (error) {
    gitSync = 'failed'
    console.error('Git-Fehler:', toGitErrorMessage(error, 'Git sync failed'))
  }

  return {
    status: 'done',
    message: plan.shortReply || 'Änderungen wurden durchgeführt.',
    changedFiles: execution.changedFiles,
    warnings: execution.warnings,
    gitSync,
  }
})
