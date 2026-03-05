# Copilot instructions for mktcms

These notes are for this repository only. Keep them in mind when editing `src/`.

## Project-specific architecture

- This module mounts Nitro storage namespace `content` to `./.storage` (filesystem driver). Content APIs and admin flows depend on this mount.
- Internal content paths are **storage keys**, not filesystem paths. Nested segments are colon-delimited (for example `Articles:Post.md`).
- Public/admin route contracts are fixed and coupled to UI + middleware:
  - Admin UI: `/admin`, `/admin/login`, `/admin/new`, `/admin/edit/file/:path`, `/admin/edit/markdown/:path`, `/admin/delete/:path`
  - Admin API: `/api/admin/*`
  - Public content API: `/api/content/list`, `/api/content/:path`

## Path and file safety rules

- Always validate/normalize user-provided paths with `normalizeContentKey` or `normalizeContentPrefix` from `runtime/server/utils/contentKey.ts`.
- Do not manually split or trust route/query path input in server handlers.
- Keep traversal protection behavior intact (`/`, `\\`, drive prefixes, `.`/`..`, control chars, empty segments).

## Auth and security behavior

- Admin protection is implemented by middleware in `runtime/server/middleware/auth.ts`.
- Middleware allows only login routes unauthenticated; all other `/admin` and `/api/admin` paths require cookie `mktcms_admin_auth_key` matching `runtimeConfig.mktcms.adminAuthKey`.
- API auth failures return `401`; UI failures redirect to `/admin/login`.
- Login rate limiting is in-memory and IP-based (`runtime/server/utils/loginRateLimit.ts`). Preserve this behavior unless intentionally redesigning deployment semantics.

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

## UI/data conventions worth preserving

- Admin UI and several status/commit texts are German; keep language consistent when touching nearby UX copy.
- English is still the primary language for code, comments, logs, and conversation with developers.
- Frontend path params for nested content use `:` separators (see `usePathParam.ts` and admin pages).
- `useFileType` + extension helpers are the source of truth for editor/file treatment.
