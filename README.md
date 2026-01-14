# Simple CMS module for Nuxt (pre-alpha)

This module is my personal, minimalist, opinionated, independent alternative to @nuxt/content and to a large portion of the WordPress projects I’ve worked on.

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]
[![Nuxt][nuxt-src]][nuxt-href]

- [✨ &nbsp;Release Notes](/CHANGELOG.md)
<!-- - [🏀 Online playground](https://stackblitz.com/github/mktcode/mktcms?file=playground%2Fapp.vue) -->
<!-- - [📖 &nbsp;Documentation](https://example.com) -->

## Features

- S3 bucket explorer/editor at `/admin`
- API routes at `/api/admin`
- `ADMIN_AUTH_KEY` env var to set a password
- `useContent` composable

## Setup

```bash
npx nuxi module add mktcms
```

```bash
MKTCMS_ADMIN_AUTH_KEY="your-admin-auth-key"
MKTCMS_S3_ACCESS_KEY_ID=your-s3-access-key-id
MKTCMS_S3_SECRET_ACCESS_KEY=your-s3-secret-access-key
MKTCMS_S3_BUCKET=your-s3-bucket-name
MKTCMS_S3_REGION=your-s3-bucket-region
MKTCMS_S3_PREFIX="your-project"
MKTCMS_SMTP_HOST="your-smtp-host"
MKTCMS_SMTP_PORT=465
MKTCMS_SMTP_SECURE=true
MKTCMS_SMTP_USER="your-smtp-user"
MKTCMS_SMTP_PASS="your-smtp-pass"
MKTCMS_MAILER_FROM="your-mailer-from-address"
MKTCMS_MAILER_TO="your-mailer-to-address"
```

Add local development storage folder in `.gitignore`:

```
.storage
```

(S3 is only used if `NODE_ENV=production`.)

## Usage

Assuming json files in S3 like `your-project:articles:article-1.json`:

```vue
<script setup lang="ts">
import { useContent } from 'mktcms'

type Article = {
  id: string
  title: string
  content: string
}

const { data: articles } = await useContent<Article[]>('articles')
</script>

<template>
  <article v-for="article in articles" :key="article.id">
    <h2>{{ article.title }}</h2>
    <p>{{ article.content }}</p>
  </article>
</template>
```

For a specific article:

```vue
<script setup lang="ts">
import { useContent } from 'mktcms'

type Article = {
  id: string
  title: string
  content: string
}

const { data: article } = await useContent<Article>('articles/article-1.json')
</script>

<template>
  <article>
    <h2>{{ article.title }}</h2>
    <p>{{ article.content }}</p>
  </article>
</template>
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
