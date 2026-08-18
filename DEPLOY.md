# Deploy — Fathom Layer

Estado do repositório: build de produção passando, 29 testes verdes, migrations
0001–0011 aplicadas no Supabase `etpqfcbwyosplyaiqxhm`.

O que falta é infraestrutura, e são três passos.

---

## 1. Importar o projeto na Vercel

Em [vercel.com/new](https://vercel.com/new), importar `scorpiontitech-debug/Fathomlayer`.

A Vercel detecta Next.js sozinha. **Não** sobrescreva os comandos de build —
o padrão (`next build`) é o correto.

| Campo | Valor |
|---|---|
| Framework | Next.js (detectado) |
| Build command | padrão |
| Output directory | padrão |
| Install command | padrão |
| Node.js version | 20.x ou superior (fixado em `engines` no package.json) |

---

## 2. Variáveis de ambiente

Cadastrar em **Project Settings → Environment Variables**, marcando
**Production** e **Preview** em todas. A lista canônica com explicação de cada
uma está em [`.env.example`](.env.example).

### Obrigatórias — sem elas o build falha

O `supabasePublic()` lê estas no carregamento do módulo, e as páginas de
produto são geradas em build. Faltando qualquer uma, o build quebra em vez de
publicar um site vazio — que é o comportamento desejado.

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
```

### Obrigatórias para o site funcionar de verdade

Sem elas o build passa, mas funcionalidade some em silêncio:

| Variável | O que quebra sem ela |
|---|---|
| `SUPABASE_SECRET_KEY` | `/admin` mostra aviso de configuração; `/out/{id}` redireciona mas **não grava o clique** — ou seja, receita sem atribuição; o rate limit do chat não roda |
| `ADMIN_EMAIL` | nenhuma sessão passa pelo `/admin` |
| `ANTHROPIC_API_KEY` | `/api/chat` responde erro e os agentes não executam |
| `REVALIDATION_TOKEN` | `POST /api/revalidate` rejeita tudo com 401 |
| `NEXT_PUBLIC_SITE_URL` | o MCP server monta links com o domínio padrão |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | o Search Console não valida a propriedade |

> A conta da Anthropic está **sem saldo** neste momento. O `/api/chat` está
> tecnicamente correto — chega na API e o rate limit registra — mas devolve
> erro de crédito até a conta ser recarregada.

---

## 3. Domínio

Apontar `fathomlayer.com` em **Settings → Domains**. O
`metadataBase` em `app/layout.tsx` já está fixado nesse domínio, então os
canonical, o sitemap e as OG images saem corretos assim que o DNS propagar.

Plano Hobby é uma decisão consciente do roadmap; subir para Pro **no primeiro
aviso de limite**, não depois.

---

## Depois do primeiro deploy

1. **Conferir `/robots.txt` e `/sitemap.xml`.** O sitemap é particionado em sete
   arquivos e só lista o que a RLS realmente serve.
2. **Submeter o sitemap no Search Console** e acompanhar a taxa de indexação.
   Abaixo de 50%, o roadmap manda cortar o ritmo de publicação pela metade;
   abaixo de 30%, parar e corrigir qualidade.
3. **Abastecer `/admin/links`.** A tabela `links` está vazia: 62 produtos
   visíveis e nenhum caminho de receita. Filtrar por "No link yet" e começar
   pelos itens de maior ticket.
4. **Rodar o MCP server** onde ele for útil (`npm run mcp`) e registrar no
   cliente MCP:
   ```json
   { "fathom-layer": { "command": "npx", "args": ["tsx", "mcp-server/fathom_layer_server.ts"] } }
   ```

---

## Verificação local antes de qualquer push

```bash
npm run test && npm run build
```

Migrations novas vão para `supabase/migrations/` e são aplicadas pelo painel do
Supabase ou pela CLI — a Vercel não executa migration.
