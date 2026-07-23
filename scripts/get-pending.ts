import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SECRET_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing env vars');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  const { data, error } = await supabase
    .from('products')
    .select('id, title, brand, category_id')
    .eq('status', 'pending_review');

  if (error) {
    console.error('Error fetching products:', error);
  } else {
    console.log(`--- PRODUCTS PENDING REVIEW (${data.length}) ---`);
    console.log(JSON.stringify(data, null, 2));
  }

  const { data: softwareData, error: swError } = await supabase
    .from('software')
    .select('id, name, category_id')
    .eq('status', 'pending_review');

  if (swError) {
    console.error('Error fetching software:', swError);
  } else {
    console.log(`--- SOFTWARE PENDING REVIEW (${softwareData.length}) ---`);
    console.log(JSON.stringify(softwareData, null, 2));
  }
}

main();
