-- Correção de um defeito introduzido pela 0007.
--
-- consume_rate_limit e prune_rate_limits são SECURITY DEFINER e, por padrão,
-- o Postgres concede EXECUTE ao role `public`. Isso as deixava chamáveis por
-- anon via /rest/v1/rpc/... — ou seja, qualquer pessoa podia inflar o bucket
-- de OUTRO visitante (negação de serviço direcionada ao chat dele) ou encher
-- a tabela de linhas.
--
-- O /api/chat usa a service key, que ignora estes GRANTs, então fechar aqui
-- não quebra o caminho legítimo.

revoke all on function public.consume_rate_limit(text, int, int) from public, anon, authenticated;
revoke all on function public.prune_rate_limits() from public, anon, authenticated;

grant execute on function public.consume_rate_limit(text, int, int) to service_role;
grant execute on function public.prune_rate_limits() to service_role;

drop policy if exists "rate_limits: service role only" on public.rate_limits;
create policy "rate_limits: service role only"
  on public.rate_limits
  for all
  to authenticated, anon
  using (false)
  with check (false);

comment on function public.consume_rate_limit(text, int, int) is
  'Janela fixa por bucket. Retorna false quando a chamada estourou o limite. EXECUTE restrito a service_role — o bucket é escolhido pelo servidor, nunca pelo cliente.';
