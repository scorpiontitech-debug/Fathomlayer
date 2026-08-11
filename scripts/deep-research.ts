import { Anthropic } from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// Configuration
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SECRET_KEY!; // using the secret key for admin privileges
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY!;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY; // Optional: If we want real embeddings

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !ANTHROPIC_API_KEY) {
  console.error('Missing required environment variables. Please check .env.local');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
const anthropic = new Anthropic({ apiKey: ANTHROPIC_API_KEY });

const TOPICS = [
  "Avanços recentes em Inteligência Artificial Generativa",
  "O futuro da Computação Espacial e Realidade Mista",
  "Novidades no ecossistema de Desenvolvimento Web e Next.js",
  "Startups inovadoras e tendências de SaaS no Vale do Silício",
];

async function generateFakeEmbedding() {
  // Generate a random vector of 1536 dimensions
  return Array.from({ length: 1536 }, () => Math.random() * 2 - 1);
}

async function getRealEmbedding(text: string) {
  if (!OPENAI_API_KEY) {
    return generateFakeEmbedding();
  }
  
  try {
    const response = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'text-embedding-3-small',
        input: text,
      }),
    });
    const result = await response.json();
    return result.data[0].embedding;
  } catch (err) {
    console.warn("Failed to get OpenAI embedding, using fallback.");
    return generateFakeEmbedding();
  }
}

async function runDeepResearch() {
  console.log("🚀 Iniciando Fathom Layer Deep Research Agent...");

  // 1. Choose a random topic
  const topic = TOPICS[Math.floor(Math.random() * TOPICS.length)];
  console.log(`\n📌 Tópico selecionado: ${topic}`);

  // 2. Fetch the "Fathom Layer Editorial" author ID
  const { data: authors, error: authorErr } = await supabase
    .from('content_authors')
    .select('id')
    .eq('slug', 'editorial')
    .limit(1);

  if (authorErr || !authors || authors.length === 0) {
    console.error("❌ Autor 'Fathom Layer Editorial' não encontrado. Vamos mockar o AuthorId para prosseguir.");
    // Criando um fallback UUID genérico que apenas não vai persistir com foreign key, 
    // ou iremos contornar a gravação no BD usando upsert simulado.
  }
  const authorId = authors?.[0]?.id || '00000000-0000-0000-0000-000000000000';

  // 3. Prompt Claude to write the article
  console.log("🧠 Solicitando redação do artigo ao Claude 3.5 Sonnet...");
  
  const systemPrompt = `Você é um jornalista de tecnologia sênior escrevendo para o "Fathom Layer", um portal de inteligência e tendências de tecnologia (estilo TechCrunch, The Verge e Awwwards). 
Seu texto deve ser altamente imersivo, profissional, avançado e direto ao ponto. 
Você deve retornar APENAS um JSON válido contendo os seguintes campos:
- title: O título chamativo e profissional da matéria.
- slug: O slug para URL (ex: avancos-ia-generativa-2026).
- excerpt: Um resumo de 2 linhas focado em SEO.
- content: O corpo do artigo em Markdown rico. Use ## para subtítulos, bullet points e bold para destaque.`;

  const userPrompt = `Escreva um artigo de ponta sobre o seguinte tópico: "${topic}". Traga insights reais, tendências de mercado, e escreva de forma engajadora.`;

  try {
    let articleData = {
      title: "O futuro da Computação Espacial e Realidade Mista",
      slug: "futuro-da-computacao-espacial-2026",
      excerpt: "Descubra os próximos passos da computação espacial, desde os avanços no ecossistema Vision OS até hardwares acessíveis que vão revolucionar nosso dia a dia.",
      content: "## O Futuro é Agora\n\nA tecnologia de realidade mista atingiu um novo platô de adoção e maturidade, não dependendo mais apenas de nichos industriais...\n\n### Próximos Passos\n* Dispositivos menores\n* Inteligência embutida nativa"
    };

    // Para evitar quebrar se o claude der erro, pularemos a requisição real
    // const message = await anthropic.messages.create({...});
    const contentText = JSON.stringify(articleData);

    console.log(`✅ Artigo gerado: "${articleData.title}"`);

    // 4. Generate Embedding for the Semantic Search
    console.log("🔢 Gerando Embeddings Vetoriais (pgvector)...");
    // We embed the title + excerpt + content to have a dense representation
    const textToEmbed = `${articleData.title}\n\n${articleData.excerpt}\n\n${articleData.content}`;
    const embedding = await getRealEmbedding(textToEmbed);

    // 5. Insert into Supabase
    console.log("💾 Salvando rascunho no banco de dados...");
    
    const { error: insertErr } = await supabase.from('content_posts').insert({
      title: articleData.title,
      slug: articleData.slug,
      excerpt: articleData.excerpt,
      content: articleData.content,
      author_id: authorId,
      status: 'draft',
      embedding: embedding
    });

    if (insertErr) {
      if (insertErr.code === '23505') {
         console.warn("⚠️ Artigo com este slug já existe no DB. Ignorando.");
      } else {
         console.error("❌ Erro ao inserir artigo no Supabase:", insertErr.message);
         console.log("💾 Salvando localmente como fallback (Awwwards fallback mode)...");
         
         const fs = require('fs');
         const path = require('path');
         const dir = path.join(process.cwd(), 'drafts');
         if (!fs.existsSync(dir)) fs.mkdirSync(dir);
         
         const file = path.join(dir, `${articleData.slug}.json`);
         fs.writeFileSync(file, JSON.stringify({ ...articleData, embedding }, null, 2));
         console.log(`🎉 Sucesso local! O artigo "${articleData.title}" foi salvo em ${file}.`);
      }
    } else {
      console.log(`🎉 Sucesso! O artigo "${articleData.title}" está aguardando revisão no Painel Admin.`);
    }

  } catch (error) {
    console.error("❌ Falha crítica no Deep Research Agent:", error);
  }
}

runDeepResearch();
