---
name: project-swarm-orchestrator
description: Diretrizes para orquestração de subagentes neste projeto
---

# Project Swarm Orchestrator

Esta skill define o protocolo para invocar a equipe de subagentes especializada (Teamwork).

## Subagentes Disponíveis
1. **browser_qa_agent**: Especializado em UI e Design System. Ferramentas: Apenas leitura. Use para revisar componentes visuais e layouts.
2. **secops_tester_agent**: Especializado em Segurança e Testes. Ferramentas: Leitura e Escrita. Use para rodar npm audit, checar isolamento de rede (MSW) e executar suites de testes em background.

## Como Orquestrar
Para tarefas complexas, invoque os agentes usando a tool `invoke_subagent`.
Exemplo de Workflow de Qualidade e Segurança:
1. Lance o `secops_tester_agent` para rodar `npm audit` e os testes isolados (`vitest run`).
2. Lance o `browser_qa_agent` para inspecionar os componentes visuais.
3. Aguarde o feedback e aplique os patches necessários com base no que reportarem.

Não exite em usar o swarm para manter a Matriz Agentic rodando suavemente.
