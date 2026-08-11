import { http, HttpResponse } from 'msw'

export const handlers = [
  // Intercepte requisições genéricas ou específicas da sua aplicação aqui
  // Exemplo:
  // http.get('https://api.exemplo.com/data', () => {
  //   return HttpResponse.json({ mock: 'data' })
  // }),
]
