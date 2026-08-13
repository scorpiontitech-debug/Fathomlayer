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

const productSpecs = {
  'macbook-pro-16-m4-max': {
    Processor: 'Apple M4 Max',
    RAM: 'Up to 128GB Unified',
    Storage: 'Up to 8TB SSD',
    Display: '16.2" Liquid Retina XDR',
    Battery: 'Up to 22 hours',
    NPU: '38 TOPS (Neural Engine)',
    Weight: '2.14 kg',
    Ports: '3x Thunderbolt 4, HDMI, SDXC, MagSafe 3'
  },
  'dell-xps-14-core-ultra': {
    Processor: 'Intel Core Ultra 7 155H',
    RAM: 'Up to 64GB LPDDR5x',
    Storage: 'Up to 4TB PCIe Gen4 SSD',
    Display: '14.5" 3.2K OLED Touch',
    NPU: 'Intel AI Boost (10 TOPS)',
    Weight: '1.68 kg',
    Ports: '3x Thunderbolt 4, microSD, Headphone jack'
  },
  'thinkpad-t14s-gen6-snapdragon': {
    Processor: 'Snapdragon X Elite X1E-78-100',
    RAM: '32GB LPDDR5x',
    Storage: '1TB PCIe Gen4 SSD',
    Display: '14" WUXGA Low Power',
    Battery: '58Wh (multi-day)',
    NPU: 'Qualcomm Hexagon (45 TOPS)',
    Weight: '1.24 kg',
    Ports: '2x USB4, 2x USB-A, HDMI 2.1'
  }
};

async function run() {
  for (const [slug, specs] of Object.entries(productSpecs)) {
    const { error } = await supabase
      .from('products')
      .update({ specs })
      .eq('slug', slug);

    if (error) {
      console.error(`Error updating ${slug}:`, error);
    } else {
      console.log(`Updated ${slug} with specs`);
    }
  }
}

run();
