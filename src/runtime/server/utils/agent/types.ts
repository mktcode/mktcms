export type AgentAnswer = {
  id: string
  answer: string
}

export type AgentAttachment = {
  name: string
  type: string
  size: number
  textContent?: string
  base64Content?: string
}

export type AgentQuestionOption = {
  label: string
  value: string
}

export type AgentQuestion = {
  id: string
  question: string
  options: AgentQuestionOption[]
  allowCustomInput: boolean
}

export type DelegationDecision = {
  route: 'content_edit' | 'clarify' | 'unsupported'
  shortReply: string
  condensedTask: string
  constraints: string[]
  questions: AgentQuestion[]
}

export type ContentEditOperation =
  | {
    type: 'overwrite_file'
    path: string
    content: string
  }
  | {
    type: 'replace_in_file'
    path: string
    find: string
    replace: string
    replaceAll?: boolean
  }
  | {
    type: 'replace_references'
    find: string
    replace: string
    extensions?: string[]
  }

export type ContentEditPlan = {
  shortReply: string
  commitMessage: string
  questions: AgentQuestion[]
  operations: ContentEditOperation[]
}

export type ContentEditExecution = {
  changedFiles: string[]
  warnings: string[]
}
