import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase keys in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const articles = [
  {
    content_type: 'launch',
    title: 'SearchGPT and the Shift to Answer Engine Optimization (AEO)',
    slug: 'searchgpt-and-the-shift-to-answer-engine-optimization-aeo',
    content_language: 'en',
    status: 'published',
    is_indexable: true,
    launch_confidence: 'confirmed',
    tags: ['ai', 'aeo', 'searchgpt', 'seo'],
    body_markdown: `**Answer Engine Optimization (AEO) is the evolution of traditional SEO, focusing on providing direct, deterministic answers to AI models rather than optimizing for web page links.** With the launch of SearchGPT and similar AI-first search paradigms, traffic distribution is shifting from ten blue links to synthesized, zero-click answers.

## The SearchGPT Paradigm Shift

OpenAI's SearchGPT represents a structural change in how information is retrieved on the internet. Instead of crawling web pages to rank them based on keyword density and backlinks, Answer Engines parse structured data (like JSON-LD) and semantic relationships to construct an immediate response.

For publishers and B2B platforms, this means that the [traditional SEO](/glossary/seo) playbook is no longer sufficient. If your content is buried under marketing fluff, AI models will skip it in favor of clear, dense factual data.

## How to Optimize for AEO

1. **BLUF (Bottom Line Up Front):** Always answer the core question in the first 160 characters.
2. **Deterministic Data:** Use exact specifications, pricing, and pros/cons formatted in markdown tables or bullet points.
3. **Structured Data:** Implement \`TechArticle\` or \`FAQPage\` JSON-LD schemas natively.
4. **LLMs.txt:** Expose a clean, machine-readable \`/llms-full.txt\` endpoint containing your platform's raw data for AI crawlers to ingest during their scheduled indexing.`
  },
  {
    content_type: 'launch',
    title: 'NVIDIA Blackwell B200: Arquitetura e Impacto em Clusters Locais',
    slug: 'nvidia-blackwell-b200-arquitetura-e-impacto-em-clusters-locais',
    content_language: 'pt',
    status: 'published',
    is_indexable: true,
    launch_confidence: 'announced',
    tags: ['hardware', 'gpu', 'local-ai', 'enterprise'],
    body_markdown: `**A arquitetura NVIDIA Blackwell B200 representa um salto massivo na inferência de LLMs corporativos, reduzindo o custo e o consumo de energia em até 25x comparado à geração Hopper (H100).** Para datacenters locais e clusters B2B, a B200 introduz o NVLink de quinta geração e motores de transformação de precisão FP4 dedicados.

## Especificações Técnicas (B200 GPU)

Ao planejar infraestruturas de [Inteligência Artificial Local](/glossary/local-ai), a densidade de VRAM e a largura de banda são os gargalos principais. A Blackwell resolve isso empacotando duas matrizes de GPU em um único chip.

* **Memória:** 192 GB HBM3e
* **Largura de Banda:** 8 TB/s
* **Interconexão:** NVLink de 1.8 TB/s bidirecional
* **TDP:** Até 1000W por módulo

## O Impacto em Deployments B2B

Atualmente, montar [clusters baseados em RTX 3090 ou Tesla P40](/guides/como-montar-um-servidor-local-de-ia-com-gpus-usadas-o-guia-rtx-3090-tesla-p40) tem sido a saída de custo-benefício para rodar modelos de 70B parâmetros (como o Llama 3). No entanto, para inferência em tempo real multicanal, a geração Blackwell aniquila a necessidade de dezenas de GPUs legadas. 

O suporte nativo a formato **FP4** (4-bit floating point) permite que modelos densos rodem sem quantização destrutiva extrema (GGUF tradicional), mantendo o *perplexity* intacto enquanto dobra a velocidade de geração de tokens.`
  },
  {
    content_type: 'guide',
    title: 'How to Connect Local RAG with the Model Context Protocol (MCP)',
    slug: 'how-to-connect-local-rag-with-model-context-protocol-mcp',
    content_language: 'en',
    status: 'published',
    is_indexable: true,
    tags: ['mcp', 'local-ai', 'rag', 'software'],
    body_markdown: `**Connecting a Local RAG (Retrieval-Augmented Generation) pipeline to an LLM via the Model Context Protocol (MCP) standardizes context injection, eliminating custom API wrappers.** By building an MCP server for your local vector database, any compatible client (like Claude Desktop) can seamlessly query your private documents.

## Why MCP for RAG?

Historically, implementing [Local AI](/glossary/local-ai) pipelines required brittle scripts mapping LangChain to specific LLM endpoints. The [Model Context Protocol (MCP)](/glossary/what-is-mcp-model-context-protocol) abstracts the data layer. Your LLM asks the MCP server for specific context, and the MCP server retrieves it from your local ChromaDB, Qdrant, or Postgres (pgvector) instance.

## Step 1: The MCP Server Architecture

An MCP server exposes \`tools\` and \`resources\`. For RAG, you will define a single tool: \`search_knowledge_base\`.

1. Initialize an MCP Server instance in TypeScript or Python.
2. Connect to your local vector database.
3. Expose the semantic search function to the MCP protocol.

## Step 2: Security Considerations

When exposing local RAG via MCP, implement stringent validation. The LLM acts autonomously and can craft malicious search queries if prompted (Prompt Injection). 
Ensure your [MCP Security](/guides/vulnerabilidades-na-era-dos-agentes-seguranca-no-model-context-protocol-mcp) posture relies on strictly parameterized queries rather than raw text execution.`
  },
  {
    content_type: 'glossary',
    title: 'What is WebNN (Web Neural Network API)?',
    slug: 'what-is-webnn-web-neural-network-api',
    content_language: 'en',
    status: 'published',
    is_indexable: true,
    tags: ['webnn', 'standards', 'edge-ai'],
    body_markdown: `**WebNN (Web Neural Network API) is an emerging web standard that allows browser-based applications to execute machine learning models directly on the user's local hardware (NPU, GPU, or CPU).** It bridges the gap between web apps and native silicon accelerators without requiring complex backend infrastructure.

## Core Capabilities of WebNN

Unlike traditional WebGL or WebGPU which were designed for graphics rendering and adapted for matrix multiplication, **WebNN** is built exclusively for AI tensors and graph execution. 

* **Hardware Abstraction:** It automatically delegates the workload to the best available silicon, prominently leveraging modern [NPUs (Neural Processing Units)](/glossary/what-is-an-npu-and-is-it-worth-paying-for).
* **Privacy by Design:** Because the inferencing happens entirely on-device, sensitive user data never leaves the browser. This is the cornerstone of Edge AI.
* **Near-Native Performance:** WebNN hooks directly into OS-level APIs (like Windows DirectML, Apple CoreML, or Android NNAPI).

## WebNN vs WebGPU

While WebGPU is fantastic for general-purpose compute on the browser, WebNN operates at a higher abstraction level (graph level rather than shader level). For developers deploying small SLMs (Small Language Models) or image segmentation models, WebNN provides optimized execution paths with significantly less boilerplate code.`
  }
];

async function insertArticles() {
  console.log("Inserting 4 AEO-optimized articles...");
  let successCount = 0;

  for (const article of articles) {
    // Upsert logic based on slug
    const { data: existing, error: fetchErr } = await supabase
      .from('editorial_pages')
      .select('id')
      .eq('slug', article.slug)
      .single();

    if (existing) {
      console.log(`[SKIPPED] Article already exists: ${article.slug}`);
      continue;
    }

    const { error: insertErr } = await supabase
      .from('editorial_pages')
      .insert(article);

    if (insertErr) {
      console.error(`[ERROR] Failed to insert ${article.slug}:`, insertErr);
    } else {
      console.log(`[SUCCESS] Inserted: ${article.slug}`);
      successCount++;
    }
  }

  console.log(`\nOperation complete. Successfully inserted ${successCount} new articles.`);
}

insertArticles();
