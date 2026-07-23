-- Ativação da funcionalidade de SaaS Público (Auth e UGC)

-- 1. Perfis de usuário (ligados ao auth.users do Supabase)
CREATE TABLE user_profiles (
  id uuid REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  username text UNIQUE NOT NULL,
  avatar_url text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Habilitar RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public profiles are viewable by everyone." ON user_profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile." ON user_profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile." ON user_profiles FOR UPDATE USING (auth.uid() = id);

-- 2. Itens Salvos ("My Stack")
CREATE TABLE user_saves (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
  entity_type text NOT NULL CHECK (entity_type IN ('product', 'software')),
  entity_id uuid NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, entity_type, entity_id)
);

ALTER TABLE user_saves ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Saves are viewable by everyone." ON user_saves FOR SELECT USING (true);
CREATE POLICY "Users can insert their own saves." ON user_saves FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own saves." ON user_saves FOR DELETE USING (auth.uid() = user_id);
