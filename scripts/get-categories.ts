import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseKey = process.env.SUPABASE_SECRET_KEY as string;
const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  const { data, error } = await supabase
    .from('categories')
    .select('id, name, slug, pillar')
    .order('pillar');

  if (error) {
    console.error(error);
  } else {
    console.table(data);
  }
}
main();
