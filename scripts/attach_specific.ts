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

async function attachSpecificImages() {
  console.log('🚀 Iniciando associação de imagens INDIVIDUAIS no banco de dados...');

  const updates = [
    { slug: 'macbook-pro-16-m4-max', image_url: '/products/macbook_m4.jpg' },
    { slug: 'surface-laptop-7-snapdragon', image_url: '/products/surface_laptop_7.jpg' },
    { slug: 'apple-vision-pro', image_url: '/products/apple_vision_pro.jpg' },
    { slug: 'oura-ring-4', image_url: '/products/oura_ring_4.jpg' },
    { slug: 'mac-studio-m2-ultra', image_url: '/products/mac_studio.jpg' },
    { slug: 'nvidia-rtx-4090-fe', image_url: '/products/rtx_4090.jpg' },
    { slug: 'ray-ban-meta', image_url: '/products/ray_ban_meta.jpg' },
  ];

  for (const item of updates) {
    const { error } = await supabase
      .from('products')
      .update({ image_url: item.image_url })
      .eq('slug', item.slug);
      
    if (error) {
      console.error(`❌ Erro ao atualizar ${item.slug}:`, error.message);
    } else {
      console.log(`✅ ${item.slug} atualizado com a imagem única!`);
    }
  }

  console.log('Concluído!');
}

attachSpecificImages();
