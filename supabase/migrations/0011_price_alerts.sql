-- Tabela para alertas de queda de preço (Monetização B2B / Afiliados)
CREATE TABLE price_alerts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  email text NOT NULL,
  entity_type text NOT NULL CHECK (entity_type IN ('product', 'software')),
  entity_id uuid NOT NULL,
  target_price numeric,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  notified_at timestamp with time zone
);

ALTER TABLE price_alerts ENABLE ROW LEVEL SECURITY;
-- Qualquer um logado pode inserir, ou até deslogado se usarmos trigger depois. Por enquanto, só insere.
CREATE POLICY "Users can insert alerts." ON price_alerts FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can view own alerts." ON price_alerts FOR SELECT USING (auth.uid() = user_id);
