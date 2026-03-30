# Instructions for mktcms

These notes are for this repository only. The main working directory is `src/`.

## Project-specific architecture

- This module mounts Nitro storage namespace `content` to `./.storage` (filesystem driver). Content APIs and admin flows depend on this mount.
- Admin chat persists project-local pi session files under `./.pi/admin-chat/sessions` and treats the server as the source of truth for chat history.
- Internal content paths are **storage keys**, not filesystem paths. Nested segments are colon-delimited (for example `Articles:Post.md`).
- Public/admin route contracts are fixed and coupled to UI + middleware:
  - Admin UI: `/admin`, `/admin/login`, `/admin/new`, `/admin/edit/file/:path`, `/admin/edit/markdown/:path`, `/admin/delete/:path`
  - Admin API: `/api/admin/*`, including chat endpoints `/api/admin/chat`, `/api/admin/chat/sessions`, and `/api/admin/chat/sessions/:id`
  - Public content API: `/api/content/list`, `/api/content/:path`
- Admin content views render inside a shared workspace shell with the file explorer/sidebar intact; avoid reintroducing standalone boxed/fullscreen page wrappers for `/admin/new` or `/admin/edit/*`.

## Path and file safety rules

- Always validate/normalize user-provided paths with `normalizeContentKey` or `normalizeContentPrefix` from `runtime/server/utils/contentKey.ts`.
- Do not manually split or trust route/query path input in server handlers.
- Keep traversal protection behavior intact (`/`, `\\`, drive prefixes, `.`/`..`, control chars, empty segments).

## Auth and security behavior

- Admin protection is implemented by middleware in `runtime/server/middleware/auth.ts`.
- Middleware allows only login routes unauthenticated; all other `/admin` and `/api/admin` paths require cookie `mktcms_admin_auth_key` matching `runtimeConfig.mktcms.adminAuthKey`.
- API auth failures return `401`; UI failures redirect to `/admin/login`.
- Login rate limiting is in-memory and IP-based (`runtime/server/utils/loginRateLimit.ts`). Preserve this behavior unless intentionally redesigning deployment semantics.
- Admin chat sessions are shared across authenticated admin browsers because auth is currently a single shared admin identity, not a per-user account model.

## Content API contracts

- `/api/content/:path` returns:
  - raw binary for images/PDFs,
  - parsed objects for markdown/csv/json/txt via `parsedFile`.
- `/api/content/list` requires `type` and filters by extension helpers in `runtime/shared/contentFiles.ts`.
- Markdown list responses include rendered HTML via `marked` + frontmatter parsing.

## Mutations and Git sync

- Admin write handlers (`md.post.ts`, `txt.post.ts`, `csv.post.ts`, upload/replace/delete endpoints) write storage first, then attempt Git sync.
- Current design is **non-blocking on Git failures**: sync errors are caught and logged; API still returns success.
- Keep commit-message-required behavior in write endpoints.
- `syncGitContent` sanitizes file paths into `.storage/...`, runs pull (`--rebase --autostash`), commit, push, and refreshes remote refs when possible.

## Versioning feature specifics

- Git versioning UI/API is feature-flagged by `runtimeConfig.public.mktcms.showVersioning`.
- Supported branches are intentionally restricted to `main` and `staging`.
- Update flow merges the counterpart branch into the current branch and pushes.

## Data conventions worth preserving

- Frontend path params for nested content use `:` separators (see `usePathParam.ts` and admin pages).
- `useFileType` + extension helpers are the source of truth for editor/file treatment.
- Admin chat UI stores only lightweight client preferences such as the last selected session id; persisted transcript continuity belongs to the server-side pi session files.

## UI/Design

The design system and Creative North Star are defined in `DESIGN.md`. Before working on any UI components or layouts, read that document for detailed guidance on colors, typography, spacing, and component usage to maintain a consistent, high-end user experience.

### Sidebar architecture

`adminWorkspace.vue` renders a left sidebar with two collapsible sections:
- An optional `#sidebarTop` slot section (visible when slot content is provided, e.g. the chat sessions list on the chat page). The slot label can be overridden via `#sidebarTopLabel`.
- A fixed file-explorer section (`Content` component).

All expand/collapse animations in sidebar sections use `grid-template-rows` CSS transitions (same pattern as `treeNode.vue`), not `v-show`.

`stats.vue` and `usage.vue` use design-system tokens (`bg-ds-surface-container-lowest rounded-[1.25rem]`) and follow the same animated expand/collapse pattern via `grid-template-rows`.

### File explorer action icons

File items in `treeNode.vue` and root-level files in `content/index.vue` each render `FileButtons compact` in a `group/fi` container (opacity-0, revealed on hover). The `compact` prop on `FileButtons` shows only the copy-template and delete icons (vs. all 4 in full mode). The CSS class `icon-button-sm` (1.75 rem, defined in `admin.css`) is used for compact action icons.

### Chat session sidebar

The chat session sidebar (`chat/sessionBar.vue`) is a flat file-explorer-style list, not a `<select>` dropdown. Each session row uses `file-item`-style layout with a hover-revealed trash icon (delete button). Sessions are passed as a prop array; the component emits `select`, `create`, and `delete` events.

Delete session is backed by `DELETE /api/admin/chat/sessions/:id` and `deleteAdminChatSession` in `runtime/server/utils/adminChatSessions.ts`.

## Updates to this document

After every significant change to the codebase, especially those affecting architecture, security, or API contracts, **update this `AGENTS.md`** document to reflect the new state of the system. All updates to this document must describe the **current state of the system only**. Write in a **declarative, present-tense style** (what *is*, not what *was*). The document must always read as if it were written from scratch to describe the system as it exists today.