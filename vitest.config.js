import {defineConfig} from 'vitest/config'

export default defineConfig({
  test: {
    tags: [
      {
        name: 'integration',
        description: 'Integration tests for local E2E test with a given backend.',
      }
    ]
  }
})
