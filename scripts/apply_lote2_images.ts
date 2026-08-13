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

const imageMap = {
  'thinkpad_t14s_gen6_1786536931285.jpg': 'thinkpad-t14s-gen6-snapdragon',
  'plaud_notepin_1786536941277.jpg': 'plaud-notepin',
  'whoop_4_0_1786536949584.jpg': 'whoop-4-0',
  'keychron_k3_he_1786536958717.jpg': 'keychron-k3-he',
  'dell_xps_14_1786536967315.jpg': 'dell-xps-14-core-ultra',
  'oura_ring_gen_3_1786537003659.jpg': 'oura-ring-gen-3',
  'macbook_pro_16_m3_max_1786537013909.jpg': 'macbook-pro-16-m3-max',
  'ultrahuman_ring_air_1786537024262.jpg': 'ultrahuman-ring-air',
  'samsung_galaxy_ring_1786537035837.jpg': 'samsung-galaxy-ring',
  'mac_mini_m4_pro_64gb_1786537047752.jpg': 'mac-mini-m4-pro-64gb',
  'minisforum_ms_01_1786537133234.jpg': 'minisforum-ms-01',
  'gmktec_evo_x2_128gb_1786537143970.jpg': 'gmktec-evo-x2-128gb',
  'threadripper_pro_dual_rtx_4090_build_1786537154835.jpg': 'threadripper-pro-dual-rtx-4090-build'
};

const artifactDir = 'C:\\Users\\rodri\\.gemini\\antigravity\\brain\\dc8c1cdf-4fbf-4df1-8d4a-fa0663d53f59';
const publicDir = 'c:\\Nova\\public\\products';

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

async function run() {
  for (const [filename, slug] of Object.entries(imageMap)) {
    const sourcePath = path.join(artifactDir, filename);
    const destPath = path.join(publicDir, filename);

    if (fs.existsSync(sourcePath)) {
      fs.copyFileSync(sourcePath, destPath);
      const imageUrl = `/products/${filename}`;
      
      const { error } = await supabase
        .from('products')
        .update({ image_url: imageUrl })
        .eq('slug', slug);

      if (error) {
        console.error(`Error updating ${slug}:`, error);
      } else {
        console.log(`Updated ${slug} with ${imageUrl}`);
      }
    } else {
      console.warn(`File not found: ${sourcePath}`);
    }
  }
}

run();
