import harlos from '@harlos/eslint-config/react'
import { defineConfig } from 'eslint/config'

export default defineConfig(
  {
    ignores: ['node_modules', 'dist', 'docs'],
  },
  {
    extends: [
      harlos,
    ],
  },
)
