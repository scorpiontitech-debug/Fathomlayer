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

const supabase = createClient(SUPABASE_URL, SUPABASE_SECRET_KEY);

async function attachImages() {
  console.log('🚀 Iniciando associação de imagens no banco de dados...');

  // 1. Laptops
  await supabase.from('products').update({ image_url: '/products/laptop_premium.jpg' })
    .in('slug', ['macbook-pro-16-m3-max', 'surface-laptop-7-snapdragon', 'macbook-pro-16-m4-max', 'dell-xps-14-intel-core-ultra', 'thinkpad-t14s-gen-6-snapdragon']);
    
  // 2. Wearables (Smart Rings)
  await supabase.from('products').update({ image_url: '/products/smart_ring.jpg' })
    .in('slug', ['oura-ring-gen-3', 'oura-ring-4', 'ultrahuman-ring-air', 'samsung-galaxy-ring', 'whoop-4-0']);
    
  // 3. AR Glasses (Vision Pro)
  await supabase.from('products').update({ image_url: '/products/vision_pro.jpg' })
    .in('slug', ['apple-vision-pro', 'ray-ban-meta-smart-glasses']);

  // 4. Workstations
  await supabase.from('products').update({ image_url: '/products/workstation.jpg' })
    .in('slug', ['mac-mini-m4-pro-64gb', 'threadripper-pro-dual-rtx-4090-build', 'minisforum-ms-01', 'gmktec-evo-x2-128gb', 'ryzen-5-rtx-4060-ti-build', 'mac-studio-m2-ultra', 'nvidia-geforce-rtx-4090']);
    
  // Outros products genéricos usarão a logo ou um placeholder (fallback já existe no frontend)
  // Ou podemos associar o workstation aos que sobraram.
  
  // 5. Software de IA (todos na tabela software)
  const { data: softwareData } = await supabase.from('software').select('id');
  if (softwareData) {
    const ids = softwareData.map(s => s.id);
    await supabase.from('software').update({ image_url: '/products/ai_software.jpg' }).in('id', ids);
  }

  console.log('✅ Imagens associadas com sucesso aos produtos e softwares!');
}

attachImages();
