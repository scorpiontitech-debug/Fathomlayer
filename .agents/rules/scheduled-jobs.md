# Trabalhos Agendados (Cron Jobs)

Este arquivo lista os jobs autônomos que o Agente executa automaticamente (Pro-Active Autonomy).

## 1. Manutenção Autônoma de SecOps
- **Frequência:** Toda sexta-feira às 18:00 (Cron: `0 18 * * 5`)
- **Ação:** O agente desperta e aciona o subagente `secops_tester_agent` para realizar:
  1. Varredura de vulnerabilidades (`npm audit`).
  2. Validação da blindagem de rede (Testes com MSW).
  3. Atualização do log em `docs/architecture/AGENT_MEMORY.md`.
- **Nota:** Esta rotina não exige autorização explícita do usuário.
