# Simple CMS module for Nuxt

![Screenshot of Admin UI](https://private-user-images.githubusercontent.com/6792578/543146782-2b316bad-28b8-4e4f-bb83-d4574be719e8.png?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3Njk4MjE1MjksIm5iZiI6MTc2OTgyMTIyOSwicGF0aCI6Ii82NzkyNTc4LzU0MzE0Njc4Mi0yYjMxNmJhZC0yOGI4LTRlNGYtYmI4My1kNDU3NGJlNzE5ZTgucG5nP1gtQW16LUFsZ29yaXRobT1BV1M0LUhNQUMtU0hBMjU2JlgtQW16LUNyZWRlbnRpYWw9QUtJQVZDT0RZTFNBNTNQUUs0WkElMkYyMDI2MDEzMSUyRnVzLWVhc3QtMSUyRnMzJTJGYXdzNF9yZXF1ZXN0JlgtQW16LURhdGU9MjAyNjAxMzFUMDEwMDI5WiZYLUFtei1FeHBpcmVzPTMwMCZYLUFtei1TaWduYXR1cmU9OTdiMmQ3NDgwNzIwOTE0NDFiMDQ2NjU1Yjg3YjJjMTBlOGZhZmVlNDg5ZWEwOWQwZTlhZjYzYjAxN2FjNDFlZiZYLUFtei1TaWduZWRIZWFkZXJzPWhvc3QifQ.MrhKMxJ11X20tVIwZBfGGF-N_YZU_sc0VuqNqwnbBNY)

This is my personal, minimalist alternative to @nuxt/content and Studio, which are fantastic projects, but for my needs they still feel a bit unstable, heavier than necessary for my needs, and sometimes lacking the kind of complete documentation I’m looking for.

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]
[![Nuxt][nuxt-src]][nuxt-href]

- [✨ &nbsp;Release Notes](/CHANGELOG.md)
<!-- - [🏀 Online playground](https://stackblitz.com/github/mktcode/mktcms?file=playground%2Fapp.vue) -->
<!-- - [📖 &nbsp;Documentation](https://example.com) -->

## Features

- Simple Admin UI to manage content files
- Composables to use the content in your Nuxt app
- `sendMail` utility to send emails via SMTP
- [MDC](https://github.com/nuxt-content/mdc) support

## What this is not

- Git-based
- horizontally scalable
- meant to be used once @nuxt/content and studio are stable

## Setup

```bash
npx nuxi module add mktcms
```

```bash
NUXT_PUBLIC_MKTCMS_SITE_URL="http://localhost:3000"
NUXT_MKTCMS_ADMIN_AUTH_KEY="your-admin-auth-key"
NUXT_MKTCMS_SMTP_HOST="your-smtp-host"
NUXT_MKTCMS_SMTP_PORT=465
NUXT_MKTCMS_SMTP_SECURE=true
NUXT_MKTCMS_SMTP_USER="your-smtp-user"
NUXT_MKTCMS_SMTP_PASS="your-smtp-pass"
NUXT_MKTCMS_MAILER_FROM="your-mailer-from-address"
NUXT_MKTCMS_MAILER_TO="your-mailer-to-address"
```

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
