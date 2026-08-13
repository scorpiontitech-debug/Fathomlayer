import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

const envPath = path.resolve(process.cwd(), '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');

let SUPABASE_URL = '';
let SUPABASE_SECRET_KEY = '';

envContent.split('\n').forEach(line => {
  if (line.startsWith('NEXT_PUBLIC_SUPABASE_URL=')) SUPABASE_URL = line.split('=')[1].trim();
  if (line.startsWith('SUPABASE_SECRET_KEY=')) SUPABASE_SECRET_KEY = line.split('=')[1].trim();
});

const supabase = createClient(SUPABASE_URL, SUPABASE_SECRET_KEY);

async function listMissingImages() {
  const { data: pData } = await supabase.from('products').select('slug, title, brand').is('image_url', null);
  const { data: sData } = await supabase.from('software').select('slug, name, developer').is('image_url', null);
  
  fs.writeFileSync('c:\\Nova\\scripts\\missing_images.json', JSON.stringify({ products: pData, software: sData }, null, 2));
  console.log('List of missing images saved to missing_images.json');
}

listMissingImages();
