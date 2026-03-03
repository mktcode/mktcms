# Admin AI Agent — Technical Documentation

**Date:** 2026-03-03  
**Author:** GitHub Copilot (GPT-5.3-Codex)  
**Scope:** Admin AI workflow in `mktcms` (`/api/admin/agent` + admin modal integration)

---

## 1) Overview

The Admin AI Agent adds an AI-assisted editing workflow to the existing admin UI.

- **Backend entrypoint:** `POST /api/admin/agent`
- **Frontend entrypoint:** button **"KI-Agent"** in admin header (next to **"zur Website"**)
- **Auth:** existing admin middleware (`/api/admin/*` requires valid admin cookie)
- **Model backend:** OpenAI Chat Completions using default model `gpt-5.3-codex`

### Current capability focus

- Replace full file contents
- Replace text in specific files
- Replace references across multiple files
- Edit Markdown with explicit MDC safety guidance (`@nuxtjs/mdc` syntax preservation)

---

## 2) UX Flow

1. Admin opens modal via header button **"KI-Agent"**.
2. Admin enters a prompt (textarea).
3. Optional:
   - add temporary attachments (file picker)
   - use voice input (browser speech recognition, like message input UX)
4. Frontend sends prompt + answers + attachments to `POST /api/admin/agent`.
5. Backend delegation agent decides:
   - unsupported task,
   - needs clarification questions,
   - or continue to content-editing plan/execution.
6. If clarification is required, modal shows predefined answer buttons plus custom input.
7. On success, modal shows changed files, warnings, and Git sync status.

---

## 3) Frontend Implementation

### Files

- `src/runtime/app/components/header.vue`
  - Adds **KI-Agent** button and modal mount.
- `src/runtime/app/components/agentModal.vue`
  - Modal UI, prompt handling, Q&A flow, attachment preview, voice input.

### Modal behavior

- Keeps style pattern used by existing admin modals (overlay, dialog container, action buttons).
- Attachment handling is **temporary** per modal session.
- Supports preview for image uploads.
- Text-like files (`.md`, `.txt`, `.csv`, `.json`, `.yml`, `.yaml`) are sent as truncated text content.
- Non-text files are sent as truncated Base64 payload.

### Voice input

- Uses browser `SpeechRecognition` / `webkitSpeechRecognition` if available.
- Language set to `de-DE`.
- Appends transcript into prompt field.
- Gracefully shows error when speech recognition is not supported.

---

## 4) API Contract

## Endpoint

`POST /api/admin/agent`

## Request body

```json
{
  "prompt": "Bitte ersetze alle Referenzen von /assets/old.png auf /assets/new.png",
  "answers": [
    { "id": "commit_message", "answer": "Dateireferenzen angepasst" }
  ],
  "attachments": [
    {
      "name": "example.md",
      "type": "text/markdown",
      "size": 1200,
      "textContent": "# Example..."
    }
  ]
}
```

## Response variants

### A) Clarification required

```json
{
  "status": "question",
  "message": "Ich brauche noch Details, bevor ich etwas ändere.",
  "questions": [
    {
      "id": "target_path",
      "question": "Welche Datei soll geändert werden?",
      "options": [
        { "label": "Home.md", "value": "Home.md" },
        { "label": "Articles:Intro.md", "value": "Articles:Intro.md" }
      ],
      "allowCustomInput": true
    }
  ]
}
```

### B) Unsupported

```json
{
  "status": "unsupported",
  "message": "Diese Anfrage liegt außerhalb der aktuellen Agent-Funktionen."
}
```

### C) Done

```json
{
  "status": "done",
  "message": "Änderungen wurden durchgeführt.",
  "changedFiles": ["Articles:Intro.md"],
  "warnings": [],
  "gitSync": "ok"
}
```

`gitSync` values:
- `ok`
- `failed` (writes succeeded, Git sync failed)
- `skipped` (no file changes)

---

## 5) Subagent Architecture

## 5.1 Delegation Agent

**File:** `src/runtime/server/utils/agent/delegationAgent.ts`

Responsibilities:
- Understand user prompt + previous answers + attachment summaries.
- Decide route:
  - `content_edit`
  - `clarify`
  - `unsupported`
- Produce concise follow-up questions with:
  - predefined option buttons
  - `allowCustomInput: true`

Prompt engineering highlights:
- strict JSON-only output
- minimal but necessary clarification questions
- explicit capability boundaries
- context injected:
  - admin route intent
  - API route
  - colon-delimited content key format
  - supported editing capabilities

## 5.2 Content Editing Agent

**File:** `src/runtime/server/utils/agent/contentEditingAgent.ts`

Responsibilities:
- Build an executable content-edit plan.
- Ask follow-up questions if critical info is missing.
- Return operations + commit message suggestion.

Supported operation types:
- `overwrite_file`
- `replace_in_file`
- `replace_references`

Execution constraints:
- Only editable text extensions are modified: `md`, `txt`, `json`, `csv`.
- Paths are normalized with `normalizeContentKey`.
- Unsafe or non-editable operations produce warnings and are skipped.

MDC-focused prompt guidance:
- Keep frontmatter valid YAML
- Preserve MDC directives/blocks (`::`, `:::` etc.)
- Avoid breaking fenced code blocks

---

## 6) Backend Route Orchestration

**File:** `src/runtime/server/api/admin/agent.post.ts`

Server flow:
1. Validate payload via `zod`.
2. Run delegation agent.
3. Return `question` or `unsupported` when applicable.
4. Run content-editing planning.
5. If plan still needs details, return `question`.
6. Execute operations.
7. Attempt Git sync with existing `syncGitContent` flow (non-blocking by design).
8. Return `done` with `changedFiles`, `warnings`, and `gitSync` status.

Validation limits:
- max 20 answers
- max 8 attachments
- max text attachment length (server-side validated)
- max base64 attachment length (server-side validated)

---

## 7) OpenAI Integration

## Runtime config additions

Registered in `src/module.ts`:
- `mktcms.openaiApiKey`
- `mktcms.openaiBaseUrl` (default `https://api.openai.com/v1`)
- `mktcms.openaiModel` (default `gpt-5.3-codex`)

Documented in `README.md`:
- `NUXT_MKTCMS_OPENAI_API_KEY`
- `NUXT_MKTCMS_OPENAI_BASE_URL`
- `NUXT_MKTCMS_OPENAI_MODEL`

## OpenAI client utility

**File:** `src/runtime/server/utils/agent/openai.ts`

- Calls `POST /chat/completions`
- Requests JSON object output (`response_format: json_object`)
- Low temperature for stable structured output
- Throws clear errors for empty/invalid model responses

---

## 8) Security and Safety Notes

- Route is protected by existing admin auth middleware (`/api/admin/*`).
- Content path safety preserved via centralized normalization utilities.
- Editing scope intentionally narrow to reduce destructive behavior.
- Git sync remains non-blocking: content writes can succeed even if Git push fails.
- Attachment payloads are intentionally bounded/truncated.

---

## 9) Known Limitations (Current Version)

- No dedicated `/admin/agent` page yet; entry is modal-based in admin header.
- Voice input support depends on browser speech API availability.
- No dry-run preview mode of operation plan before write execution.
- Binary file editing is not supported by content-edit execution.

---

## 10) Future Extensions

Recommended next additions:
1. **Dry-run mode** (plan preview + explicit approval before writes)
2. **Operation audit trail** per request
3. **Granular role/permission checks** for sensitive operations
4. **Improved diff feedback** in modal before commit
5. **Optional branch-targeted agent execution** for staging workflows
