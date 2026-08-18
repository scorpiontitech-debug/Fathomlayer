-- ============================================================
-- NEXUS TECH HUB — MIGRATION 0006: RLS Hardening
-- ============================================================

-- Drop das policies antigas e frágeis
drop policy if exists "public_read_links" on links;
drop policy if exists "public_read_setup_items" on setup_items;

-- Nova policy para links: Checa se a entidade (produto ou software) está publicada e indexável
create policy "public_read_links" on links
    for select using (
        (entity_type = 'product' and exists (
            select 1 from products where products.id = links.entity_id and status = 'published' and is_indexable = true
        ))
        or
        (entity_type = 'software' and exists (
            select 1 from software where software.id = links.entity_id and status = 'published' and is_indexable = true
        ))
    );

-- Nova policy para setup_items: Checa o setup PAI E o item FILHO
create policy "public_read_setup_items" on setup_items
    for select using (
        exists (
            select 1 from setups
            where setups.id = setup_items.setup_id
            and setups.status = 'published'
            and setups.is_indexable = true
        )
        and
        (
            (item_type = 'product' and exists (
                select 1 from products where products.id = setup_items.item_id and status = 'published' and is_indexable = true
            ))
            or
            (item_type = 'software' and exists (
                select 1 from software where software.id = setup_items.item_id and status = 'published' and is_indexable = true
            ))
        )
    );
