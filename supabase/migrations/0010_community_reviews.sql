-- Criação da tabela de Avaliações da Comunidade (UGC)
CREATE TABLE community_reviews (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
  entity_type text NOT NULL CHECK (entity_type IN ('product', 'software')),
  entity_id uuid NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Um usuário só pode deixar um review por item
ALTER TABLE community_reviews ADD CONSTRAINT unique_user_review UNIQUE (user_id, entity_type, entity_id);

-- RLS
ALTER TABLE community_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Reviews are viewable by everyone." ON community_reviews FOR SELECT USING (true);
CREATE POLICY "Users can insert their own reviews." ON community_reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own reviews." ON community_reviews FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own reviews." ON community_reviews FOR DELETE USING (auth.uid() = user_id);
