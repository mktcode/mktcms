# MktCMS

A simple CMS module for Nuxt applications.

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]
[![Nuxt][nuxt-src]][nuxt-href]

I'm building this because I want the freedom and development speed that Nuxt provides when building websites, but occasionally a customer wants to edit content themselves. I don't want to use WordPress or some SaaS solution for content management. I want everything to be in one place and as minimal as possible.

- [✨ &nbsp;Release Notes](/CHANGELOG.md)
<!-- - [🏀 Online playground](https://stackblitz.com/github/your-org/mktcms?file=playground%2Fapp.vue) -->
<!-- - [📖 &nbsp;Documentation](https://example.com) -->

## Features

- Local database for content
- File storage for uploads (local or S3)
- Admin interface
- Composables for fetching content
- A flexible contact form endpoint

## Setup

Install the module and dependencies to your Nuxt application:

```bash
npm i drizzle-orm
npm i --save-dev drizzle-kit
npx nuxi module add mktcms
```

Add `drizzle.config.ts` to your project root with the following content or modify it to your needs:

```ts
import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './drizzle',
  schema: './db/schema.ts',
  dialect: 'sqlite',
  dbCredentials: {
    url: process.env.DB_FILE_NAME!,
  },
});
```

Create a `db/schema.ts` file with the following content or modify it to your needs:

```ts
import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const pagesTable = sqliteTable("pages", {
  id: int().primaryKey({ autoIncrement: true }),
  title: text().notNull(),
  slug: text().notNull(),
  body: text().notNull(),
});
```

Create a `db/index.ts` file with the following content:

```ts
import 'dotenv/config'
import { drizzle } from 'drizzle-orm/libsql'

const db = drizzle(process.env.DB_FILE_NAME!)

export default db
```

Create a `.env` file in your project root with the following content:

```bash
DB_FILE_NAME=file:local.db
MKTCMS_AUTH_KEY=supersecret
```

Run the following command to create the initial migration:

```bash
npx drizzle-kit push
```

For the admin pages to work, make sure your app.vue contains the `<NuxtPage />` component:

```vue
<template>
  <NuxtPage />
</template>
```

In your main CSS file instruct Tailwind to scan the module's runtime folder for classes and import the main CSS file.

Assuming your main CSS file is located at `app/assets/css/main.css`, add the following lines:

```css
@import "../../../modules/mktcms/main.css";
@source "../../../modules/mktcms/runtime/components/";
@source "../../../modules/mktcms/runtime/pages/";
```

That's it! You can now login to the admin interface at `/admin` using the auth key you set in the `.env` file.

## File Storage

Access uploaded files via the `mktcmsUploads` storage driver in Nitro:

```ts
const storage = useStorage('mktcmsUploads')
```

You will want to exclude the upload folder from version control by adding the following line to your `.gitignore` file:

```
.mktcms/uploads
```

### S3 (comming soon)

To use S3 for file storage, simply add your credentials to your environment variables:

```env
MKTCMS_S3_ACCESS_KEY_ID=your-access-key-id
MKTCMS_S3_SECRET_ACCESS_KEY=your-secret-access-key
MKTCMS_S3_REGION=your-region
MKTCMS_S3_BUCKET=your-bucket-name
```

In development the module will always use the local filesystem for uploads. In production the module will automatically switch to S3 if the above environment variables are set.

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
