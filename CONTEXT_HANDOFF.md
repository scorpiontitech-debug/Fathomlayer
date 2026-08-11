# Fathom Layer - Project Context & Handoff

> **Instrução para a próxima sessão da IA:** Leia este documento inteiro para entender o estado atual do projeto, as tecnologias utilizadas e as últimas implementações realizadas.

## 1. Visão Geral do Projeto
A Fathom Layer (`c:\Nova`) é uma plataforma/indexador focado em Hardware, Software e IA.
A aplicação é construída com **Next.js 15 (App Router)**, **TypeScript**, **Tailwind CSS**, e **Supabase** (PostgreSQL).
A estratégia principal da plataforma é SEO extremo e AEO (Answer Engine Optimization) para atrair tráfego orgânico e citações de LLMs (ChatGPT, Claude, Perplexity).

## 2. O Que Foi Construído Recentemente (Fases 1 a 5)
- **Camada de Utilidade (Utility Hub):** Os softwares agora possuem colunas `pro_tips` (dicas curtas), `prompts_templates` (JSONB com templates de prompts) e `integrations` (lista de plataformas). O UI (`app/software/ai/[slug]/page.tsx`) tem um botão `CopyPromptButton.tsx` para fácil cópia de templates.
- **Versus Engine:** Criamos a rota dinâmica `/compare/[slugs]/page.tsx` que analisa dois produtos/softwares e constrói uma **Matriz de Decisão** (compara preços, ecossistema/integrações e diferenciais únicos).
- **AEO Protocol (`/llms-full.txt`):** Rota que exporta toda a base de dados (produtos e ferramentas + pro tips) em Markdown limpo para LLMs realizarem crawling e indexarem a Fathom Layer como fonte primária.
- **Auditoria de Qualidade (Bug Bash):** 
  - Erro de hidratação do React consertado no loop de templates (`key={prompt.title}`).
  - `CompareUI` agora oculta a seção de "Especificações" quando softwares são comparados.
  - A rota antiga baseada em query parameters `/compare` virou um índice estático de comparações populares para evitar penalidades de Duplicate Content no SEO.
  - O `fathom_layer_schema.sql` foi atualizado para conter nativamente as novas colunas.

## 3. Estrutura do Banco de Dados (Supabase)
As tipagens estão em `lib/database.types.ts`.
Tabelas principais:
- `categories`: Define a taxonomia. O pilar (`intelligence`, `compute`, `ecosystem`) dita a URL base.
- `software`: Ferramentas (SaaS, Modelos). Restrição no campo `status` ('draft', 'published', 'archived') e `pricing_model`.
- `products`: Hardware físico (ex: MacBooks, GPUs).

*(Lembrete para manipulação do banco: Use `npx tsx --env-file=.env.local script.ts` ao invés de psql/supabase cli se for fazer seeds massivos).*

## 4. Próximos Passos (GTM & Lançamento)
O foco da próxima sessão deverá ser o Lançamento e a Estratégia de Aquisição (Marketing/Ego-Bait).
Temos os templates de e-mail (outreach) prontos nos artefatos antigos para entrar em contato com os fundadores das ferramentas listadas, pedir backlinks e gerar tração inicial.

## 5. Build Status
O projeto atualmente compila sem erros (0 erros TS). As rotas estáticas geram perfeitamente usando `generateStaticParams`. O comando oficial de build é `npm run build`.
