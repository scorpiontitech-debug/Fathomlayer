import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

// Carrega o .env.local manualmente
const envPath = path.resolve(process.cwd(), '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');

let SUPABASE_URL = '';
let SUPABASE_SECRET_KEY = '';

envContent.split('\n').forEach(line => {
  if (line.startsWith('NEXT_PUBLIC_SUPABASE_URL=')) SUPABASE_URL = line.split('=')[1].trim();
  if (line.startsWith('SUPABASE_SECRET_KEY=')) SUPABASE_SECRET_KEY = line.split('=')[1].trim();
});

if (!SUPABASE_URL || !SUPABASE_SECRET_KEY) {
  console.error('❌ Faltam credenciais no .env.local (SUPABASE_URL ou SUPABASE_SECRET_KEY)');
  process.exit(1);
}

// Inicializa o client com a chave de admin (Service Role)
const supabase = createClient(SUPABASE_URL, SUPABASE_SECRET_KEY);

async function checkDatabase() {
  const { data: pData } = await supabase.from('products').select('id, status, title');
  const { data: sData } = await supabase.from('software').select('id, status, name');
  const { data: cData } = await supabase.from('categories').select('slug, is_indexable, active_listing_count');
  
  console.log('Products:', pData?.length || 0, pData);
  console.log('Software:', sData?.length || 0, sData);
  console.log('Categories:', cData?.filter(c => c.is_indexable) || []);
}

checkDatabase();
