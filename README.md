# MktCMS

A file based CMS for self-hosted Nuxt apps.

![Screenshot of Admin UI](https://raw.githubusercontent.com/mktcode/mktcms/refs/heads/main/docs/screenshot.png)

This is my personal, minimalist alternative to @nuxt/content and Studio, which are fantastic projects, but sometimes lacking the kind of complete documentation I’m looking for. Over time I will maybe migrate more and more (MDC already supported), and just keep [the website template](https://github.com/mktcode/mktcms-website-template) and the [server utility](https://github.com/mktcode/mktcms-server). If you find this useful, feel free to use it and contribute to it.

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]
[![Nuxt][nuxt-src]][nuxt-href]

- [✨ &nbsp;Release Notes](/CHANGELOG.md)
<!-- - [🏀 Online playground](https://stackblitz.com/github/mktcode/mktcms?file=playground%2Fapp.vue) -->
<!-- - [📖 &nbsp;Documentation](https://example.com) -->

## Features

- Simple Admin UI with Git integration to manage content
- Admin chat endpoint and UI with routing between conversation and coding agents
- Composables to use the content in your Nuxt app
- `sendMail` utility to send emails via SMTP
- [MDC](https://github.com/nuxt-content/mdc) support

## Setup

```bash
npx nuxi module add mktcms
```

```bash
NUXT_PUBLIC_MKTCMS_SITE_URL="http://localhost:3000"
NUXT_PUBLIC_MKTCMS_SHOW_VERSIONING=false

NUXT_MKTCMS_ADMIN_AUTH_KEY="your-admin-auth-key"
NUXT_MKTCMS_AUTH_COOKIE_MAX_AGE_SECONDS=604800
NUXT_MKTCMS_AUTH_COOKIE_PATH="/"
NUXT_MKTCMS_AUTH_COOKIE_SAME_SITE="lax"
NUXT_MKTCMS_AUTH_COOKIE_SECURE=true
NUXT_MKTCMS_LOGIN_RATE_LIMIT_MAX_ATTEMPTS=5
NUXT_MKTCMS_LOGIN_RATE_LIMIT_WINDOW_SECONDS=300
NUXT_MKTCMS_LOGIN_RATE_LIMIT_BLOCK_SECONDS=600
NUXT_MKTCMS_UPLOAD_MAX_BYTES=52428800
NUXT_MKTCMS_OPENAI_API_KEY="your-openai-api-key"
NUXT_MKTCMS_OPENAI_MODEL="gpt-5.4-mini"

NUXT_MKTCMS_SMTP_HOST="your-smtp-host"
NUXT_MKTCMS_SMTP_PORT=465
NUXT_MKTCMS_SMTP_SECURE=true
NUXT_MKTCMS_SMTP_USER="your-smtp-user"
NUXT_MKTCMS_SMTP_PASS="your-smtp-pass"
NUXT_MKTCMS_MAILER_FROM="your-mailer-from-address"
NUXT_MKTCMS_MAILER_TO="your-mailer-to-address"

NUXT_MKTCMS_GIT_USER="your-github-username"
NUXT_MKTCMS_GIT_REPO="owner/repository.git"
NUXT_MKTCMS_GIT_TOKEN="your-github-personal-access-token"
```

> **Note:** To generate a GitHub Personal Access Token, go to GitHub Settings → Developer settings → Personal access tokens → Tokens (classic) → Generate new token. Grant it `repo` scope for full repository access.

## Usage

```
.storage/
  Home.md
  Articles/
    Article 1.md
    Article 2.md
```

```markdown
<!-- Home.md -->
---
title: Home
---
Welcome to **MKT CMS**!

::alert
Your alert component.
::
```

```vue
<script setup lang="ts">
const home = await useMdContent<{ title: string }>('Home.md')
const articles = await useMdContents('Articles')
</script>

<template>
  <h1>{{ home.title }}</h1>
  <MDC :value="home.markdown" />
  <article v-for="article in articles" :key="article.key">
    <MDC :value="article.markdown" />
  </article>
</template>
```

### Mailer

```ts
await sendMail({
  subject: 'Notification from MKT CMS',
  fields: {
    Name: 'Jane Smith',
    Message: 'Hello, this is a test message.',
  },
  replyTo: 'jane.smith@example.com',
})
```

### Admin Chat

When `NUXT_MKTCMS_OPENAI_API_KEY` is configured, the admin UI exposes [admin chat](./src/runtime/app/pages/admin/chat.vue) at `/admin/chat`.

- A routing step classifies each admin message as either `conversation` or `coding`
- Conversation requests cover copy, planning, content, and general admin help
- Coding requests cover technical implementation, configuration, debugging, and API questions
- The default model is `gpt-5.4-mini`

## Contribution

<details>
  <summary>Local development</summary>
  
  ```bash
  # Install dependencies
  npm install
  
  # Generate type stubs
  npm run dev:prepare
  
  # Develop with the playground
  npm run dev
  
  # Build the playground
  npm run dev:build
  
  # Run ESLint
  npm run lint
  
  # Run Vitest
  npm run test
  npm run test:watch
  
  # Release new version
  npm run release
  ```

</details>


<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/v/mktcms/latest.svg?style=flat&colorA=020420&colorB=00DC82
[npm-version-href]: https://npmjs.com/package/mktcms

[npm-downloads-src]: https://img.shields.io/npm/dm/mktcms.svg?style=flat&colorA=020420&colorB=00DC82
[npm-downloads-href]: https://npm.chart.dev/mktcms

[license-src]: https://img.shields.io/npm/l/mktcms.svg?style=flat&colorA=020420&colorB=00DC82
[license-href]: https://npmjs.com/package/mktcms

[nuxt-src]: https://img.shields.io/badge/Nuxt-020420?logo=nuxt
[nuxt-href]: https://nuxt.com
