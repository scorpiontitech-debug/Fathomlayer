import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

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
  { slug: 'wooting-80he', src: 'wooting_80he_1786644402616.jpg' },
  { slug: 'bose-quietcomfort-ultra', src: 'bose_qc_ultra_1786644412314.jpg' },
  { slug: 'apple-macbook-air-m5', src: 'macbook_air_m5_1786644422240.jpg' },
  { slug: 'apple-macbook-neo', src: 'macbook_neo_1786644431875.jpg' },
  { slug: 'hp-omnibook-x-flip-16', src: 'hp_omnibook_1786644441788.jpg' },
  { slug: 'sony-wf-1000xm6', src: 'sony_wf_1000xm6_1786644450683.jpg' },
  { slug: 'sony-wh-1000xm6', src: 'sony_wh_1000xm6_1786644460180.jpg' },
  { slug: 'apple-airpods-pro-3', src: 'airpods_pro_3_1786644468786.jpg' },
  { slug: 'minisforum-ms-s1-max', src: 'minisforum_s1_1786644520487.jpg' },
  { slug: 'garmin-enduro-3', src: 'garmin_enduro_3_1786644530295.jpg' },
  { slug: 'apple-watch-ultra-3', src: 'apple_watch_ultra_3_1786644538981.jpg' },
  { slug: 'ringconn-gen-2', src: 'ringconn_gen_2_1786644550164.jpg' },
];

async function run() {
  console.log('🔄 Copiando imagens e atualizando banco de dados...');
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
  console.log('✨ Concluído!');
}

run();
