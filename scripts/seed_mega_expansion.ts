import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase keys");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const articles = [
  // CLUSTER: Agentic AI & Workflows
  {
    content_type: "guide",
    title: "How to Build a Multi-Agent Swarm with CrewAI and the Model Context Protocol (MCP)",
    slug: "how-to-build-multi-agent-swarm-crewai-mcp",
    content_language: "en",
    status: "published",
    is_indexable: true,
    tags: ["agentic-ai", "mcp", "crewai", "software", "local-ai"],
    body_markdown: `**Building a multi-agent swarm with CrewAI and MCP allows autonomous AI agents to collaborate seamlessly while securely querying your local machine's context without fragile API wrappers.** The Model Context Protocol (MCP) acts as the universal bridge, letting agents pass files and vectors natively.

## The CrewAI + MCP Architecture

Traditionally, creating an autonomous agent workflow in [CrewAI](/glossary/what-is-crewai) required custom Python functions to let agents read databases or perform web searches. By using the [Model Context Protocol (MCP)](/glossary/what-is-mcp-model-context-protocol), you expose standard "Resources" and "Tools".

1. **The MCP Server Layer:** A lightweight local server that hosts the tools (e.g., SQLite connection, vector search).
2. **The Swarm Layer:** CrewAI agents initialized with an MCP client wrapper. When an agent needs data to perform its task, it requests it over MCP.

## Implementation Steps

First, install the required packages. Ensure you have the official MCP Python SDK and CrewAI installed.

\`\`\`bash
pip install crewai model-context-protocol
\`\`\`

Next, wrap the MCP tools into CrewAI tasks. Instead of hardcoding prompts, define roles where agents know they can "Ask the MCP server" for missing [Local AI](/glossary/local-ai) context before proceeding to synthesis.
`
  },
  {
    content_type: "glossary",
    title: "O que é Agentic RAG (Retrieval-Augmented Generation Ativo)?",
    slug: "o-que-e-agentic-rag-retrieval-augmented-generation-ativo",
    content_language: "pt",
    status: "published",
    is_indexable: true,
    tags: ["agentic-ai", "rag", "software", "enterprise"],
    body_markdown: `**Agentic RAG é uma evolução do RAG tradicional onde um Agente Autônomo de IA decide dinamicamente quando, onde e como buscar informações em bancos de dados, em vez de depender de uma única busca vetorial fixa.** Ele adiciona raciocínio ativo ao processo de recuperação.

## RAG Clássico vs. Agentic RAG

No modelo tradicional, quando um usuário faz uma pergunta, o sistema converte a pergunta em um *embedding*, busca os trechos mais próximos no banco de dados e os joga no [LLM (Large Language Model)](/glossary/what-is-an-llm) para gerar uma resposta. O problema é que, se a busca inicial falhar, a IA alucina.

No **Agentic RAG**, o agente de [Inteligência Artificial](/glossary/ai) recebe a tarefa e pensa: *"Preciso buscar no banco vetorial. O resultado não foi suficiente. Vou reformular a busca. Agora vou cruzar com um banco SQL de clientes. Pronto, agora tenho a resposta"*.

## O Futuro das Arquiteturas B2B

Para adoção empresarial (Enterprise AI), o Agentic RAG é obrigatório. Ferramentas que implementam o [Model Context Protocol (MCP)](/glossary/what-is-mcp-model-context-protocol) são fundamentais, pois permitem que o agente navegue de forma segura por diversos silos de dados corporativos para encontrar respostas com precisão cirúrgica.`
  },
  {
    content_type: "launch",
    title: "The Shift from Chatbots to Autonomous Agents: Enterprise Adoption in 2026",
    slug: "shift-chatbots-to-autonomous-agents-enterprise-adoption-2026",
    content_language: "en",
    status: "published",
    is_indexable: true,
    launch_confidence: "confirmed",
    tags: ["agentic-ai", "enterprise", "software"],
    body_markdown: `**In 2026, enterprise software is officially moving past passive Chatbots toward fully autonomous Agentic AI workflows, fundamentally changing how B2B operations function.** Static knowledge retrieval is being replaced by multi-agent swarms capable of end-to-end task execution.

## The End of "Copilots"

The industry is moving away from the "Copilot" paradigm—where humans prompt AI for every micro-step—toward "Autopilots" or [Agentic AI](/glossary/agentic-ai). Frameworks like [CrewAI](/glossary/what-is-crewai) and AutoGPT have matured into production-ready platforms.

This transition is accelerating due to the standardization of the [Model Context Protocol (MCP)](/glossary/what-is-mcp-model-context-protocol), which finally allows secure, universal access to enterprise data silos without custom integrations for every new LLM.

## Impact on B2B SaaS

Enterprise software companies must adapt. Products that only offer a "chat interface" over their data are becoming obsolete. The new standard requires exposing capabilities as tools for external agents to invoke autonomously.`
  },

  // CLUSTER: Edge AI & Hardware Local
  {
    content_type: "guide",
    title: "Guia Definitivo: Treinando Modelos GGUF no Windows com WSL2 e DirectML",
    slug: "guia-treinando-modelos-gguf-windows-wsl2-directml",
    content_language: "pt",
    status: "published",
    is_indexable: true,
    tags: ["hardware", "local-ai", "gpu", "software"],
    body_markdown: `**Treinar e fazer fine-tuning de modelos quantizados (GGUF) no Windows tornou-se viável e altamente performático através da combinação do WSL2 (Windows Subsystem for Linux) com as pontes nativas do DirectML.** Isso elimina a necessidade de dual-boot para engenheiros de IA focados no ecossistema local.

## O Desafio do Windows no Machine Learning

Historicamente, frameworks de IA e bibliotecas CUDA focavam exclusivamente em ambientes Linux nativos. No entanto, o avanço da arquitetura [Local AI](/glossary/local-ai) exige que desenvolvedores corporativos e entusiastas utilizem as GPUs que já possuem em suas máquinas de trabalho.

O formato **GGUF** revolucionou a inferência em CPU/GPU mista, mas o treinamento exigia ambientes limpos.

## Configurando o Ambiente (WSL2 + DirectML)

1. **Instalação do WSL2:** Certifique-se de estar rodando o Ubuntu 22.04+ no WSL2 e que seus drivers NVIDIA (ou AMD Radeon) para Windows estejam na última versão. O WSL2 passará a GPU automaticamente.
2. **Setup do DirectML:** Se você não possui uma [NVIDIA GPU](/glossary/gpu) e depende de hardware AMD ou Intel NPUs, instalar o pacote \`onnxruntime-directml\` no Python dentro do WSL2 permite aceleração de hardware nativa.
3. **Unsloth & Llama.cpp:** Utilize bibliotecas como Unsloth para aceleração de matrizes esparsas durante o fine-tuning LoRA, antes de exportar o resultado final de volta para o formato \`GGUF\` universal.`
  },
  {
    content_type: "launch",
    title: "Apple Intelligence CoreML vs WebNN: What Developers Need to Know",
    slug: "apple-intelligence-coreml-vs-webnn-developers-guide",
    content_language: "en",
    status: "published",
    is_indexable: true,
    launch_confidence: "announced",
    tags: ["edge-ai", "webnn", "hardware", "software"],
    body_markdown: `**The collision between Apple's proprietary CoreML API and the open W3C WebNN standard is defining the future of on-device Edge AI.** While Apple locks native performance behind iOS/macOS frameworks, WebNN promises near-native AI acceleration directly inside the browser.

## The Closed Ecosystem: Apple Intelligence

Apple's integration of small LLMs natively into the OS relies heavily on their Neural Engines ([NPUs](/glossary/what-is-an-npu-and-is-it-worth-paying-for)) accessed via CoreML. For native Swift developers, this is incredibly fast and battery-efficient, but it locks the AI capabilities strictly within the Apple ecosystem.

## The Open Standard: Web Neural Network API

Conversely, [WebNN](/glossary/what-is-webnn-web-neural-network-api) provides a JavaScript API to hardware-accelerated machine learning graphs. Supported actively by Intel, Microsoft, and Google, WebNN aims to run [Local AI](/glossary/local-ai) natively in Edge and Chrome without downloading binaries.

For cross-platform developers building web apps, WebNN is the holy grail. It bypasses the need for Apple's App Store review for AI features, routing matrix multiplications directly to the user's NPU, whether it's a Snapdragon X Elite or an Apple M4, right from the browser.`
  },
  {
    content_type: "glossary",
    title: "What is a Small Language Model (SLM)?",
    slug: "what-is-a-small-language-model-slm",
    content_language: "en",
    status: "published",
    is_indexable: true,
    tags: ["edge-ai", "local-ai", "software"],
    body_markdown: `**A Small Language Model (SLM) is a highly optimized neural network—typically under 8 billion parameters—designed specifically to run efficiently on edge devices like phones, laptops, and IoT endpoints.** They offer privacy, zero latency, and offline capabilities.

## SLM vs LLM

While massive [Large Language Models (LLMs)](/glossary/what-is-an-llm) like GPT-4 rely on massive cloud data centers with thousands of GPUs, SLMs (like Llama 3 8B, Phi-3, or Gemma) are distilled. They are trained on extremely curated datasets to "punch above their weight."

## Why SLMs matter for Edge AI

In the world of [Edge Computing](/glossary/edge-ai), moving data to the cloud is expensive, slow, and a privacy risk. SLMs can be loaded entirely into the RAM of a smartphone or edge server. Supported by hardware like [NPUs](/glossary/what-is-an-npu-and-is-it-worth-paying-for) and standard APIs like [WebNN](/glossary/what-is-webnn-web-neural-network-api), SLMs are the critical software layer enabling the decentralized AI revolution.`
  },
  {
    content_type: "guide",
    title: "Deploying WebNN Applications in Next.js: A Step-by-Step Guide",
    slug: "deploying-webnn-applications-in-nextjs-guide",
    content_language: "en",
    status: "published",
    is_indexable: true,
    tags: ["webnn", "edge-ai", "software", "diy"],
    body_markdown: `**Deploying WebNN within a Next.js architecture allows developers to serve highly interactive, client-side AI applications without incurring massive cloud inference costs.** By utilizing the browser's native hardware access, you shift the computational burden to the user's device.

## Prerequisites for WebNN in React

Before implementing [WebNN](/glossary/what-is-webnn-web-neural-network-api), ensure your target browser supports the API (currently enabled via flags in Edge and Chrome). Next.js excels here because you can statically serve the model weights (like ONNX files) from your \`/public\` directory.

## Integrating ONNX Runtime Web

The easiest way to consume WebNN is through the ONNX Runtime Web API.

1. **Install dependencies:** Add \`onnxruntime-web\` to your Next.js project.
2. **Configure Webpack:** Update your \`next.config.js\` to correctly bundle the WASM fallbacks in case the user's browser doesn't have an [NPU](/glossary/what-is-an-npu-and-is-it-worth-paying-for).
3. **Execution Provider:** When initializing your inference session in your React component, explicitly request the \`webnn\` execution provider before falling back to \`wasm\`.

This setup guarantees zero-latency, private, [Edge AI](/glossary/edge-ai) execution right inside your React application.`
  },

  // CLUSTER: Digital Twins & IoT
  {
    content_type: "launch",
    title: "Matter 1.3 Update: Is Your IoT Digital Twin Ready?",
    slug: "matter-1-3-update-iot-digital-twin-ready",
    content_language: "en",
    status: "published",
    is_indexable: true,
    launch_confidence: "announced",
    tags: ["iot", "digital-twins", "standards", "hardware"],
    body_markdown: `**The release of the Matter 1.3 specification introduces robust data telemetry for water and energy management, unlocking entirely new use cases for industrial and home Digital Twins.** This standard fundamentally changes how edge devices report state to centralized AI observers.

## Beyond Smart Bulbs

While early iterations of the [Matter Protocol](/glossary/what-is-the-matter-iot-protocol) focused on basic interoperability (turning lights on and off across Apple HomeKit and Google Home), version 1.3 expands the schema to heavy appliances, EV chargers, and energy tracking.

For developers building [Digital Twins](/glossary/digital-twins), this is a watershed moment. You no longer need proprietary APIs to read the power consumption of an edge device. The standardized telemetry can stream directly into your virtual simulation.

## Preparing the Digital Twin

To ingest Matter 1.3 telemetry into an [Agentic AI](/glossary/agentic-ai) workflow:
1. Ensure your Edge router supports IPv6 and Thread.
2. Map the new Matter clusters (like Energy Management) to your existing Digital Twin schema.
3. Allow your autonomous agents to read this real-time state using the [Model Context Protocol (MCP)](/glossary/what-is-mcp-model-context-protocol).`
  },
  {
    content_type: "guide",
    title: "Securing IoT Digital Twins: A Deep Dive into Zero Trust at the Edge",
    slug: "securing-iot-digital-twins-zero-trust-edge",
    content_language: "en",
    status: "published",
    is_indexable: true,
    tags: ["digital-twins", "iot", "security", "enterprise"],
    body_markdown: `**Implementing a Zero Trust architecture for IoT Digital Twins is critical, as any compromise at the physical edge (IoT sensor) instantly corrupts the virtual model and autonomous decision-making.** Security must be cryptographically enforced at the firmware level.

## The Threat Landscape of Digital Twins

A [Digital Twin](/glossary/digital-twins) relies entirely on the integrity of the data streaming from the physical world. If a malicious actor spoofs temperature sensor data, an [Agentic AI](/glossary/agentic-ai) might autonomously shut down a factory cooling system. 

## Implementing Zero Trust

To secure the boundary between the physical hardware and the digital representation:

1. **Hardware Root of Trust:** Ensure all IoT endpoints utilize cryptographic secure enclaves (like TPMs) to sign every data packet sent.
2. **Mutual TLS (mTLS):** The Digital Twin server should never accept unauthenticated telemetry. Utilizing the [Matter Protocol's](/glossary/what-is-the-matter-iot-protocol) native PKI (Public Key Infrastructure) ensures device authenticity.
3. **Ephemeral Access:** When autonomous agents use [MCP](/glossary/what-is-mcp-model-context-protocol) to act on the Digital Twin, access tokens should be strictly short-lived and scoped to minimal permissions.`
  },
  {
    content_type: "glossary",
    title: "What is the Matter IoT Protocol?",
    slug: "what-is-the-matter-iot-protocol",
    content_language: "en",
    status: "published",
    is_indexable: true,
    tags: ["iot", "standards", "hardware", "digital-twins"],
    body_markdown: `**The Matter IoT Protocol is an open-source, royalty-free connectivity standard designed to increase interoperability among smart home devices and industrial IoT, regardless of the manufacturer.** Built on IP (Internet Protocol), it serves as the universal language for the physical edge.

## Why Matter Changes Everything

Before Matter, the IoT ecosystem was deeply fragmented. Devices were locked into walled gardens (Apple HomeKit, Amazon Alexa, Google Home, Samsung SmartThings) requiring cloud-to-cloud integrations that caused latency and privacy concerns.

Matter allows devices to communicate **locally** over Wi-Fi and Thread. 

## The Backbone for Digital Twins

Because Matter standardizes the "schema" of devices (e.g., how a thermostat reports its state), it is the perfect physical foundation for building [Digital Twins](/glossary/digital-twins). It guarantees that a virtual representation of a physical space receives deterministic, standardized telemetry, enabling highly accurate [Local AI](/glossary/local-ai) simulations.`
  }
];

async function seedMegaExpansion() {
  console.log("Seeding 10 Mega Expansion Articles...");
  for (const article of articles) {
    const { data: existing } = await supabase
      .from("editorial_pages")
      .select("id")
      .eq("slug", article.slug)
      .single();

    if (existing) {
      console.log(`[SKIPPED] ${article.slug} already exists.`);
      continue;
    }

    const { error } = await supabase.from("editorial_pages").insert(article);
    if (error) {
      console.error(`[ERROR] ${article.slug}: `, error.message);
    } else {
      console.log(`[SUCCESS] ${article.slug}`);
    }
  }
  console.log("Mega Expansion Editorial seeding completed.");
}

seedMegaExpansion();
