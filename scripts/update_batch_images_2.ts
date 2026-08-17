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

const brainPath = "C:\\Users\\rodri\\.gemini\\antigravity\\brain\\dc8c1cdf-4fbf-4df1-8d4a-fa0663d53f59";
const publicPath = "c:\\Nova\\public\\products";

const updates = [
  { slug: 'even-realities-g1', src: 'even_realities_g1_1786967936150.jpg' },
  { slug: 'xreal-one-pro', src: 'xreal_one_pro_1786967948849.jpg' },
  { slug: 'mac-studio-m3-ultra', src: 'mac_studio_m3_1786967958532.jpg' },
  { slug: 'tcl-rayneo-air-4-pro', src: 'tcl_rayneo_1786967968044.jpg' },
  { slug: 'aula-f75', src: 'aula_f75_1786967979134.jpg' },
  { slug: 'samsung-galaxy-s26-ultra', src: 'samsung_s26_ultra_1786967989082.jpg' },
  { slug: 'apple-iphone-17-pro-max', src: 'iphone_17_pro_max_1786967997438.jpg' },
  { slug: 'lenovo-thinkpad-x1-carbon-gen-13', src: 'thinkpad_x1_gen13_1786968082662.jpg' },
  { slug: 'snap-specs', src: 'snap_specs_1786968092411.jpg' },
  { slug: 'nvidia-geforce-rtx-5090-32gb', src: 'rtx_5090_1786968102683.jpg' },
  { slug: 'nvidia-geforce-rtx-5080-16gb', src: 'rtx_5080_1786968111741.jpg' },
  { slug: 'nvidia-geforce-rtx-5070-ti-16gb', src: 'rtx_5070_ti_1786968121430.jpg' },
  { slug: 'nvidia-geforce-rtx-3090-usada', src: 'rtx_3090_usada_1786968129679.jpg' },
];

async function run() {
  console.log('🔄 Copiando imagens e atualizando banco de dados (Lote Final)...');
  for (const item of updates) {
    const srcPath = path.join(brainPath, item.src);
    const destPath = path.join(publicPath, item.src);
    
    // Copy file
    if (fs.existsSync(srcPath)) {
      fs.copyFileSync(srcPath, destPath);
      console.log(`🖼️ Copiado: ${item.src}`);
    } else {
      console.log(`❌ Não encontrado: ${srcPath}`);
    }

    // Update DB
    const imageUrl = `/products/${item.src}`;
    const { error } = await supabase.from('products').update({ image_url: imageUrl }).eq('slug', item.slug);
    if (error) console.error(`Erro ao atualizar ${item.slug}:`, error.message);
    else console.log(`✅ Atualizado ${item.slug} no DB`);
  }
  console.log('✨ Concluído Lote Final!');
}

run();
