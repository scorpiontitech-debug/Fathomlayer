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

const abstracts = [
  'abstract_code_1787056662581.jpg',
  'abstract_chat_1787056672644.jpg',
  'abstract_creation_1787056682207.jpg',
  'abstract_automation_1787056690102.jpg'
];

const mappings: Record<string, string[]> = {
  'abstract_code_1787056662581.jpg': ['cursor', 'cursor-ai', 'github-copilot', 'mastra', 'lovable', 'bolt-new'],
  'abstract_chat_1787056672644.jpg': ['chatgpt', 'claude', 'google-gemini', 'perplexity-ai', 'qwen-3-moe', 'notion-ai', 'jasper-ai', 'lindy-ai', 'notebooklm'],
  'abstract_creation_1787056682207.jpg': ['midjourney', 'gamma', 'elevenlabs', 'google-veo', 'copy-ai', 'surfer-seo'],
  'abstract_automation_1787056690102.jpg': ['zapier', 'zapier-central', 'n8n', 'stripe-mcp-server', 'slack-mcp-server', 'github-mcp-server']
};

async function run() {
  console.log('🔄 Copiando imagens abstratas e atualizando banco de dados (Software)...');
  
  // 1. Copy the 4 abstract images
  for (const img of abstracts) {
    const srcPath = path.join(brainPath, img);
    const destPath = path.join(publicPath, img);
    if (fs.existsSync(srcPath)) {
      fs.copyFileSync(srcPath, destPath);
      console.log(`🖼️ Copiado: ${img}`);
    } else {
      console.log(`❌ Não encontrado: ${srcPath}`);
    }
  }

  // 2. Map in Supabase
  for (const [img, slugs] of Object.entries(mappings)) {
    const imageUrl = `/products/${img}`;
    for (const slug of slugs) {
      const { error } = await supabase.from('software').update({ image_url: imageUrl }).eq('slug', slug);
      if (error) {
        console.error(`Erro ao atualizar ${slug}:`, error.message);
      } else {
        console.log(`✅ Atualizado ${slug} com ${img}`);
      }
    }
  }

  console.log('✨ Concluído atualização dos softwares!');
}

run();
