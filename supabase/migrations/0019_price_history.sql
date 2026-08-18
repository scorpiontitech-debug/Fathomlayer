-- Tabela de Histórico de Preços para Gráficos
create table price_history (
    id              uuid primary key default gen_random_uuid(),
    entity_type     text not null check (entity_type in ('product', 'software')),
    entity_id       uuid not null,
    price           numeric not null,
    currency        text not null default 'USD',
    recorded_at     timestamptz not null default now()
);

create index idx_price_history_entity on price_history(entity_type, entity_id);

-- Inserir dados mock para demonstração
-- Vamos fazer um trigger futuro para que, sempre que o price_from de um produto mudar, ele insira aqui.
-- Por enquanto apenas a estrutura e RLS
alter table price_history enable row level security;
create policy "public_read_price_history" on price_history for select using (true);
