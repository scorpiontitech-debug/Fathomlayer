# Fathom Layer OS — Painel Operacional para o Solo Operator

Documento de handoff para implementação via Claude Code. Ler em conjunto com `fathom-layer-gaps-roadmap.md` (fila de revisão, agentes) e `fathom_layer_schema.sql`. Equivalente funcional ao Infinity OS, adaptado à natureza do Fathom Layer: não é gestão de relacionamento com poucos clientes, é triagem de volume contínuo.

## 0. Filosofia — por que isso não é um dashboard de analytics comum

A diferença estrutural entre a Infinity e o Fathom Layer é operacional: a Infinity termina de exigir atenção quando o site fica pronto; o Fathom Layer **começa** a exigir atenção depois disso — preço desatualiza, servidor MCP muda de status de segurança, indexação oscila, toda semana. Sem um painel único, o operador solo (15-30h/semana, sem escrever código) volta a gastar tempo manual checando cada fonte separadamente — exatamente o problema que os agentes (seção 3) deveriam resolver.

**Princípio central: é uma fila de triagem, não um dashboard de métricas pra admirar.** Cada tela existe pra gerar uma decisão rápida (aprovar/rejeitar/editar/ignorar), não pra contemplação de gráfico. Otimizado pra sessões curtas e frequentes (15-20 min, várias vezes por semana), inclusive pelo celular — o mesmo padrão de uso desta própria conversa.

## 1. Arquitetura técnica

- Rota protegida `/admin` no mesmo projeto Next.js (App Router, route group `(admin)`), sem app separado
- Autenticação via Supabase Auth, usuário único (mesmo padrão já definido no roadmap para `/admin/review`)
- Lê/escreve nas mesmas tabelas já existentes (`products`, `software`, `editorial_pages`, `ingestion_staging`, `link_clicks`, `content_synthesis_log`) — nenhum banco separado, nenhuma duplicação de dado
- Responsivo mobile-first — triagem rápida precisa funcionar no celular, não só desktop
- Supabase Realtime (opcional, Fase 2) para sinais de agente aparecerem sem precisar recarregar a página

## 2. Telas

### 2.1 Central de Comando (home do `/admin`)
Visão de 10 segundos ao abrir: contagem de itens pendentes por tipo (revisão de conteúdo, sinal de preço/link, sinal de segurança MCP, rascunho de lançamento), status de saúde de indexação (verde/âmbar/vermelho, aplicando a regra de ritmo já definida no roadmap item 11), e resumo de conversão da semana (`link_clicks` agregado). Nenhum gráfico decorativo — só o que exige decisão hoje.

### 2.2 Fila de Revisão Unificada (tela central, MVP)
Todo item que precisa de decisão humana cai aqui, com a origem marcada (`pending_review` manual, sinal de agente, rascunho de lançamento) — não são telas separadas por fonte, é uma fila só, filtrável.
- Aprovar / Rejeitar / Editar inline, sem sair da lista
- Atalhos de teclado (A = aprovar, R = rejeitar, E = editar) — é o que faz revisão de volume não consumir a semana inteira
- Aprovação em lote (selecionar múltiplos itens do mesmo tipo, aprovar de uma vez)
- Cada item mostra só o que falta decidir (ex: "preço mudou de $349 para $299 — confirmar?"), não o registro inteiro

### 2.3 Saúde de Conteúdo
Taxa de indexação por cluster (categoria com `launch_phase = 1`), aplicando visualmente a regra do roadmap: verde (≥50%), âmbar (30-50%, ritmo cortado pela metida automaticamente), vermelho (<30%, publicação pausada). Status de cada categoria (`launch_phase` atual, `active_listing_count`, quando foi a última publicação).

### 2.4 Painel de Controle dos Agentes
Cada um dos 5 agentes (ver seção 3) tem: liga/desliga, horário da última execução, log de erro se falhou, botão de disparo manual. **Nenhum agente decide sozinho** (exceto o Vigia de Indexação, que só pode desacelerar publicação, nunca acelerar) — este painel existe pra você confiar no que está automatizado, não pra escondê-lo.

### 2.5 Analytics
`link_clicks` por categoria/produto (o que converte, pra decidir onde investir as próximas horas de curadoria) — dado que já alimenta a decisão de priorização, não é vaidade de métrica. Fase 2: uso de API (quando a API freemium existir).

### 2.6 Configurações Operacionais
Parâmetros hoje "hardcoded" nos documentos, editáveis sem precisar do Claude Code: Banned-Phrase Blocklist, limiar mínimo de campos do Quality Gate, `launch_phase` por categoria. Reduz dependência de reabrir o Claude Code pra ajustes operacionais pequenos.

## 3. Agentes integrados (mesmos 5 já definidos, formalizados aqui como fonte de dado do painel)

| Agente | Alimenta qual tela | Ação autônoma permitida |
|---|---|---|
| Vigia de Preço/Link | Fila de Revisão (2.2) | Nenhuma — só sinaliza `pending_review` |
| Vigia de Segurança MCP | Fila de Revisão (2.2) | Nenhuma — atualiza `tags` de sinal, não o status de publicação |
| Rascunhador de Radar de Lançamentos | Fila de Revisão (2.2) | Nenhuma — todo rascunho nasce `draft` |
| Vigia de Indexação | Saúde de Conteúdo (2.3) | Única exceção: pode reduzir ritmo de publicação sozinho (nunca aumentar ou publicar) |
| Triagem de Quality Gate | Fila de Revisão (2.2) | Pré-filtra e ordena por prioridade, não aprova nada |

Implementação técnica: Supabase Edge Functions agendadas (mesmo padrão já previsto para o cron de link rot no roadmap), chamando a API do Claude quando precisar de síntese/análise, gravando resultado nas tabelas existentes — o painel só lê o que os agentes já gravaram.

## 4. Prioridade de construção — não é big-bang

**MVP (junto com o restante do Launch v1):** só a seção 2.2 (Fila de Revisão), na forma simples já prevista no roadmap original (`/admin/review`) — cobre `pending_review` manual, sem agentes ainda.

**Cresce junto com cada agente da Fase 2:** cada agente novo pluga uma origem a mais na mesma Fila de Revisão — não é painel novo por agente. A Central de Comando (2.1), Saúde de Conteúdo (2.3) e Painel de Controle de Agentes (2.4) só fazem sentido depois que o primeiro agente existir; não construir antes disso.

**Fase 2 avançada:** Analytics (2.5) completo e Configurações Operacionais (2.6) — melhoram a operação, mas o painel funciona sem eles no início.
