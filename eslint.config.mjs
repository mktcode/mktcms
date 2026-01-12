// @ts-check
import { createConfigForNuxt } from '@nuxt/eslint-config/flat'

// Run `npx @eslint/config-inspector` to inspect the resolved config interactively
export default createConfigForNuxt({
  features: {
    // Rules for module authors
    tooling: true,
    // Rules for formatting
    stylistic: true,
  },
  dirs: {
    src: [
      './playground',
    ],
  },
})
  .append(
    // disable vue mulsti-word-component-names rule
    {
      files: ['**/*.vue'],
      rules: {
        'vue/multi-word-component-names': 'off',
      },
    },
    // allow unexpected any
    {
      files: ['**/*.ts', '**/*.vue'],
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
      },
    },
  )
