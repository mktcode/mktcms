# Security Audit Report — MktCMS

**Date:** 2026-03-02  
**Auditor:** GitHub Copilot (GPT-5.3-Codex)  
**Method:** Static code review only (no runtime execution)  
**Scope:** `src/**` and security-relevant repository configuration (`playground/**` excluded)

---

## 1) Scope, Constraints, and Threat Model

### In Scope
- Server and app runtime code under `src/`
- Route/module wiring in `src/module.ts`
- Security-relevant project config and workflow files

### Out of Scope
- `playground/**`
- Dynamic penetration testing or runtime verification
- External infrastructure controls not represented in the repository (proxy, WAF, TLS termination)
- Clustered deployment and horizontal scaling considerations

### Threat Model
- Admin API/UI may be internet-exposed.
- Both unauthenticated attacks and authenticated-admin abuse are considered.

---

## 2) Executive Summary

The codebase includes meaningful hardening controls (input validation, centralized content-key normalization, upload limits, cookie hardening, login throttling, and git error sanitization). The dominant remaining risks are architectural/authentication model strength, CSRF guarantees, markdown HTML rendering safety, and git credential handling design.

### Overall Risk Posture
- **High:** 1
- **Medium:** 3
- **Low:** 2

### Highest-Priority Remaining Risks
1. Shared-secret admin authentication model remains a single-point compromise.
2. CSRF controls are not explicit for state-changing admin routes.
3. Markdown-to-HTML output may enable stored XSS if rendered unsafely downstream.

---

## 3) Architecture & Attack Surface Summary

- Admin and content routes are registered via `src/module.ts`.
- Content persists via Unstorage FS driver (`content` mount to `./.storage`).
- Admin auth uses a cookie (`mktcms_admin_auth_key`) checked by global middleware.
- Public endpoints include `/api/content/list` and `/api/content/:path`.
- Admin mutation endpoints include content editing/upload/deletion plus git-assisted synchronization and branch/versioning endpoints.

---

## 4) Detailed Findings

## HIGH-01 — Shared-secret admin authentication model remains high impact

**Severity:** High  
**Confidence:** High

### Evidence
- Login validates a single configured `adminAuthKey` and sets cookie auth state in `src/runtime/server/api/admin/login.ts`.
- Middleware authorizes admin access by cookie equality against the same static secret in `src/runtime/server/middleware/auth.ts`.

### Why this matters
- A long-lived shared secret is still a single credential for full admin control.
- Secret leakage (ops, logs, human handling, backups, endpoint compromise) immediately grants broad access.

### Current mitigations present
- Login rate limiting is implemented (`src/runtime/server/utils/loginRateLimit.ts`).
- Cookie attributes are hardened and centralized (`src/runtime/server/utils/authCookie.ts`).

### Recommendation
- Replace shared-secret equality with server-issued sessions (or equivalent short-lived token model), revocation support, and optional second factor for admin flows.

---

## MEDIUM-01 — CSRF controls are not explicit on admin state-changing routes

**Severity:** Medium  
**Confidence:** Medium

### Evidence
- Admin mutation routes rely on cookie-authenticated requests.
- No explicit CSRF token mechanism or explicit Origin/Referer enforcement middleware was identified in the server runtime routes.

### Why this matters
- Cookie-based auth can be vulnerable to cross-site request forgery depending on browser behavior, deployment, and user interaction patterns.

### Current mitigations present
- Cookie `sameSite` is configurable and defaults to hardened behavior.

### Recommendation
- Add explicit CSRF defenses on mutation endpoints (token pattern and/or strict Origin/Referer validation).

---

## MEDIUM-02 — Stored XSS risk remains dependent on markdown HTML consumers

**Severity:** Medium  
**Confidence:** Medium

### Evidence
- Markdown is transformed to HTML via `marked.parse(...)` in:
  - `src/runtime/server/utils/parsedFile.ts`
  - `src/runtime/server/api/content/list.ts`
- API responses include generated `html` fields.

### Why this matters
- If consuming UIs render returned HTML unsafely (e.g. direct raw HTML sinks), untrusted markdown content can become executable script payload.

### Recommendation
- Sanitize generated HTML server-side or enforce a strict safe-rendering pipeline that avoids unsafe raw HTML sinks.

---

## MEDIUM-03 — Git credential-in-URL design still carries residual exposure risk

**Severity:** Medium  
**Confidence:** Medium

### Evidence
- Authenticated git client constructs URL-based credentials in `src/runtime/server/utils/gitVersioning.ts`.

### Why this matters
- Even with response/log sanitization, URL-embedded credentials can remain sensitive in process-level contexts, diagnostics, or integrations.

### Current mitigations present
- Git API responses use sanitized client-safe messages.
- Git sync logging paths use sanitized error mapping and avoid raw error object exposure.

### Recommendation
- Move away from credential-bearing remote URLs where possible (credential helper/environment-based auth) and preserve strict redaction at all error boundaries.

---

## LOW-01 — Dynamic EJS mail templates require strict trust boundaries

**Severity:** Low  
**Confidence:** Low-Medium

### Evidence
- `sendMail` renders optional templates via `ejs.render(...)` in `src/runtime/server/utils/sendMail.ts`.

### Why this matters
- If templates/fields are not tightly controlled by trusted code paths, this can introduce injection risk in outbound mail content.

### Recommendation
- Keep templates trusted-only and sanitize/escape interpolated values according to output context.

---

## 5) Security Controls Observed

The following controls are present in current code:

- Centralized content key normalization and validation for storage paths.
- Server-side upload size limits with configurable max bytes.
- Centralized file extension/type policy for upload and classification paths.
- Hardened auth cookie options (`httpOnly`, configurable `secure`/`sameSite`/`path`/TTL).
- Login rate limiting with lockout window and retry-after support.
- Git error redaction/sanitization in API responses and git sync logging.
- Broad schema validation usage via `zod` in request parsing.

---

## 6) Prioritized Remediation Plan

## Immediate (0–7 days)
1. Add explicit CSRF protection for all admin state-changing endpoints.
2. Keep git error boundaries strictly sanitized (already in place) and document operational logging policy.

## Near Term (1–3 weeks)
1. Migrate admin auth from shared secret to server-issued session model with revocation.
2. Add markdown HTML sanitization or strict safe-rendering contract.

## Mid Term (1–2 months)
1. Evaluate replacing URL-embedded git credentials with safer auth transport mechanisms.

---

## 7) Verification Checklist

- Admin mutation endpoints reject CSRF attempts by token/origin policy.
- Cookie attributes are visible and correct across environments (`secure`, `sameSite`, scoped `path`).
- Login throttling behavior and lockout timing are consistent under repeated failures.
- Git API responses and logs contain no credential fragments or raw internal stack/CLI messages.
- Markdown payloads containing script/event-handler vectors are neutralized before rendering.

---

## 8) Assumptions and Unknowns

- External infrastructure controls (proxy/WAF/rate limiting/TLS) were not validated in runtime.
- Downstream rendering behavior for returned markdown `html` fields may vary by consuming app usage.

---

## 9) Conclusion

The current implementation demonstrates substantial security hardening in path handling, upload enforcement, authentication cookie policy, login throttling, and git error sanitization. Remaining risk is concentrated in architectural authentication model strength, explicit CSRF coverage, markdown HTML rendering safety, and git credential transport design.
