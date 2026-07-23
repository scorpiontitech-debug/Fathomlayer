-- Submissão de ferramentas para monetização B2B Fast-Track
CREATE TABLE tool_submissions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  website_url text NOT NULL,
  description text NOT NULL,
  category text,
  payment_status text DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'free')),
  review_status text DEFAULT 'pending' CHECK (review_status IN ('pending', 'approved', 'rejected')),
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE tool_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can insert submissions." ON tool_submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can view own submissions." ON tool_submissions FOR SELECT USING (auth.uid() = user_id);
