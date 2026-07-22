-- ============================================================
-- 0005 — Visibilidade pública de itens arquivados (roadmap #21)
-- ============================================================
-- Regra: quando um produto sai de linha ou um software fecha, a página
-- PERMANECE LIVE (200). Nunca 410/301 automático. Remoção só manual, em
-- caso de pedido legal recebido via /contact.
--
-- Motivo: 410 descarta o equity de link acumulado pela página; manter live
-- com dado errado destrói confiança. A saída correta é manter a página,
-- marcá-la como descontinuada e remover o caminho de compra.
--
-- Antes desta migration a RLS expunha apenas `status = 'published'`, então
-- arquivar um item fazia a página virar 404 — o oposto do que a regra pede.
-- ============================================================

-- Produtos: published OU archived, desde que já tenham passado pelo gate.
-- `is_indexable` continua sendo a prova de que o item foi publicado alguma
-- vez (a action de publicação o define como true); um item que nunca saiu
-- de draft tem is_indexable = false e segue invisível ao arquivar.
drop policy if exists "public_read_products" on products;
create policy "public_read_products" on products
    for select using (status in ('published', 'archived') and is_indexable = true);

drop policy if exists "public_read_software" on software;
create policy "public_read_software" on software
    for select using (status in ('published', 'archived') and is_indexable = true);

-- ------------------------------------------------------------
-- O que NÃO muda, de propósito
-- ------------------------------------------------------------
-- 1. `refresh_category_listing_count()` continua contando apenas
--    `status = 'published'`. Item arquivado sai de `active_listing_count`
--    imediatamente, como a regra exige — nenhuma alteração necessária.
--
-- 2. INTERAÇÃO IMPORTANTE COM O QUALITY GATE: se arquivar um item derrubar
--    a categoria abaixo de 3 publicados, a categoria perde `is_indexable`,
--    a policy `public_read_categories` deixa de retorná-la e TODAS as
--    páginas daquela categoria passam a 404 — inclusive as arquivadas,
--    porque a página de detalhe resolve a categoria antes do item.
--    Isso é o Quality Gate funcionando, não regressão: uma categoria com
--    menos de 3 itens vivos não deveria estar indexada de qualquer forma.
--    No caso normal (um item de vários sai de linha) a página sobrevive.
--
-- 3. `links` continua com leitura pública irrestrita. A supressão do
--    caminho de compra em item arquivado é feita no servidor, na página de
--    detalhe — preserva a linha de afiliado para auditoria histórica em vez
--    de apagá-la do banco.
