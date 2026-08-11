import { setupServer } from 'msw/node'
import { handlers } from './mocks/handlers'

export const server = setupServer(...handlers)

// Quebra testes caso tentem fazer fetch em APIs reais (Zero Leakage)
server.listen({ onUnhandledRequest: 'error' })

// Reseta os handlers após cada teste
if (typeof afterEach !== 'undefined') {
  afterEach(() => server.resetHandlers())
}

// Fecha o servidor após todos os testes
if (typeof afterAll !== 'undefined') {
  afterAll(() => server.close())
}
