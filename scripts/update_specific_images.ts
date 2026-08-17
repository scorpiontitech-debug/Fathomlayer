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

const supabase = createClient(SUPABASE_URL, SUPABASE_SECRET_KEY);

const updates = [
  { slug: 'keychron-k3-he', image: '/products/keychron_k3_he_1786536958717.jpg' },
  { slug: 'thinkpad-t14s-gen6-snapdragon', image: '/products/thinkpad_t14s_gen6_1786536931285.jpg' },
  { slug: 'whoop-4-0', image: '/products/whoop_4_0_1786536949584.jpg' },
  { slug: 'dell-xps-14-core-ultra', image: '/products/dell_xps_14_1786536967315.jpg' },
  { slug: 'plaud-notepin', image: '/products/plaud_notepin_1786536941277.jpg' },
  { slug: 'oura-ring-gen-3', image: '/products/oura_ring_gen_3_1786537003659.jpg' },
  { slug: 'macbook-pro-16-m3-max', image: '/products/macbook_pro_16_m3_max_1786537013909.jpg' },
  { slug: 'macbook-pro-16-m4-max', image: '/products/macbook_pro_16_m3_max_1786537013909.jpg' },
  { slug: 'ultrahuman-ring-air', image: '/products/ultrahuman_ring_air_1786537024262.jpg' },
  { slug: 'samsung-galaxy-ring', image: '/products/samsung_galaxy_ring_1786537035837.jpg' },
  { slug: 'mac-mini-m4-pro-64gb', image: '/products/mac_mini_m4_pro_64gb_1786537047752.jpg' },
  { slug: 'threadripper-pro-dual-rtx-4090-build', image: '/products/threadripper_pro_dual_rtx_4090_build_1786537154835.jpg' },
  { slug: 'minisforum-ms-01', image: '/products/minisforum_ms_01_1786537133234.jpg' },
  { slug: 'gmktec-evo-x2-128gb', image: '/products/gmktec_evo_x2_128gb_1786537143970.jpg' },
  { slug: 'ryzen-5-rtx-4060-ti-build', image: '/products/ryzen_5_build.jpg' },
];

async function run() {
  console.log('🔄 Atualizando URLs das imagens geradas por IA no banco de dados...');
  for (const item of updates) {
    const { error } = await supabase.from('products').update({ image_url: item.image }).eq('slug', item.slug);
    if (error) console.error(`Erro ao atualizar ${item.slug}:`, error.message);
    else console.log(`✅ Atualizado ${item.slug} -> ${item.image}`);
  }
  console.log('✨ Concluído!');
}

run();
