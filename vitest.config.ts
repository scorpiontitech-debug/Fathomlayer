import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node', // ou 'jsdom' se estiver testando UI
    setupFiles: ['./tests/setup-network-isolation.ts'],
  },
})
