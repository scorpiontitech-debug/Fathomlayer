-- O selo "Data verified X days ago" aparecia em todas as páginas de produto,
-- lendo last_verified_at. Só que a coluna era NOT NULL DEFAULT now(): todo item
-- inserido por script de seed nasceu carimbado como verificado, sem que
-- ninguém tivesse conferido nada. O schema tornava impossível representar
-- "não verificado", e a página fazia uma promessa de confiança — a única coisa
-- que a plataforma vende — que não sustentava em ~53 dos 62 itens.

alter table public.products alter column last_verified_at drop not null;
alter table public.products alter column last_verified_at drop default;
alter table public.software alter column last_verified_at drop not null;
alter table public.software alter column last_verified_at drop default;

comment on column public.products.last_verified_at is
  'Quando um humano conferiu as specs contra a fonte do fabricante. NULL = nunca verificado. Nunca preencher por default: o selo na página depende deste campo ser honesto.';
comment on column public.software.last_verified_at is
  'Quando um humano conferiu os dados contra a fonte oficial. NULL = nunca verificado.';

update public.products set last_verified_at = null
where last_verified_at < timestamptz '2026-08-18 19:00:00+00';
update public.software set last_verified_at = null;
