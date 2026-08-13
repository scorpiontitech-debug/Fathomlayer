-- Add global consumer UX fields to products table
ALTER TABLE products
ADD COLUMN lifecycle_status VARCHAR DEFAULT 'neutral', -- 'buy_now', 'neutral', 'dont_buy_updates_soon'
ADD COLUMN human_translation JSONB DEFAULT '{}'::jsonb,
ADD COLUMN score_battery NUMERIC,
ADD COLUMN score_value NUMERIC,
ADD COLUMN score_performance NUMERIC,
ADD COLUMN colors TEXT[] DEFAULT '{}',
ADD COLUMN in_the_box TEXT[] DEFAULT '{}',
ADD COLUMN repairability_score NUMERIC,
ADD COLUMN accessories TEXT[] DEFAULT '{}';

-- Optional constraint for lifecycle status
ALTER TABLE products
ADD CONSTRAINT valid_lifecycle_status 
CHECK (lifecycle_status IN ('buy_now', 'neutral', 'dont_buy_updates_soon'));
