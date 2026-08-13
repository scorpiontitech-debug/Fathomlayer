import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!
);

async function seedEditorials() {
  console.log("Seeding Editorials for SEO & AEO...");

  const editorials = [
    {
      title: "Como montar um cluster de Tesla P40 para IA local",
      slug: "guia-cluster-tesla-p40",
      content_type: "guide",
      body_markdown: `
# Como montar um cluster de Tesla P40 para IA local

Se você está buscando rodar modelos de 70B parâmetros (como o Llama 3.3 70B) localmente, provavelmente já se deparou com o gargalo absurdo de VRAM. A solução mais econômica em 2026? A humilde NVIDIA Tesla P40.

## Por que a Tesla P40?
A Tesla P40 oferece 24GB de VRAM GDDR5. Apesar de lenta para treinamento (falta de Tensor Cores), ela é incrivelmente capaz para inferência (GGUF/llama.cpp) quando você junta várias delas em paralelo.

### O Setup Básico
1. **Placa Mãe e CPU:** Uma plataforma X99 antiga com Xeon v4 ou Threadripper de primeira geração (muitas linhas PCIe).
2. **Refrigeração:** As Tesla P40 não possuem ventoinhas! Você precisará imprimir dutos 3D e acoplar fans de servidor ou adaptar refrigeração líquida.
3. **Software:** Use \`llama.cpp\` que suporta offloading massivo para as P40 através da API vulkan ou CUDA clássico.

Com cerca de $500, você tem 48GB de VRAM (duas P40), suficiente para modelos massivos. Para Agentes Autônomos rodando Mastra, isso é a independência total.
      `,
      tags: ["AI", "Hardware", "DIY", "Local AI"]
    },
    {
      title: "Guia Definitivo: Llama 3 vs DeepSeek R1 localmente",
      slug: "guia-llama3-vs-deepseek",
      content_type: "guide",
      body_markdown: `
# Guia Definitivo: Llama 3 vs DeepSeek R1 localmente

O mercado de código aberto em 2026 é dominado por dois colossos. Qual você deve escolher para o seu "Local AI Appliance"?

## Llama 3.3 (70B)
A aposta segura da Meta.
- **Vantagens:** Ecossistema gigante. Todas as ferramentas (Mastra, LangChain) têm suporte de primeira classe.
- **Uso ideal:** Assistentes gerais e roleplay B2B.

## DeepSeek R1
O desafiante hiper-eficiente.
- **Vantagens:** Destrói benchmarks matemáticos e de código. O modelo MoE permite rodar com menor VRAM ativa.
- **Uso ideal:** Codificação avançada (Copilot substituto) e análise de dados complexa.
      `,
      tags: ["LLM", "Benchmark", "Software"]
    },
    {
      title: "O que é o Model Context Protocol (MCP)?",
      slug: "o-que-e-mcp",
      content_type: "glossary",
      body_markdown: `
# O que é o Model Context Protocol (MCP)?

O MCP (Model Context Protocol) é um padrão aberto introduzido para resolver o maior problema dos Agentes de IA: o acesso a dados seguros.

## A Revolução B2B
Em vez de colar documentos em um prompt, o MCP permite que ferramentas (como o Mastra ou o Claude Desktop) abram conexões seguras com servidores locais (banco de dados, Slack, Notion) e puxem contexto sob demanda.

**Por que importa?** É o que separa um chatbot de brinquedo de uma IA Enterprise. Com o MCP, a IA da Fathom Layer pode ler especificações técnicas ao vivo do Supabase sem risco de alucinação.
      `,
      tags: ["MCP", "Glossary", "AEO"]
    },
    {
      title: "O Fim do Burn-in: O que é MicroLED nos Wearables?",
      slug: "microled-em-wearables",
      content_type: "glossary",
      body_markdown: `
# O Fim do Burn-in: O que é MicroLED nos Wearables?

Por anos, o ecrã OLED foi o rei indiscutível dos relógios inteligentes e óculos AR. Mas o OLED tem um inimigo fatal: o burn-in, especialmente em telas "Always-On".

## A Chegada do MicroLED
O MicroLED usa materiais inorgânicos. Ele oferece o contraste infinito do OLED (pretos perfeitos) mas pode alcançar 10.000 nits de brilho sem se degradar.

Em dispositivos de realidade aumentada (como os protótipos avançados do Snap e XREAL), isso significa que os hologramas finalmente podem ser vistos em plena luz do sol no deserto.
      `,
      tags: ["Displays", "Wearables", "AR"]
    },
    {
      title: "O que é um Local AI Appliance?",
      slug: "local-ai-appliance",
      content_type: "glossary",
      body_markdown: `
# O que é um Local AI Appliance?

Um **Local AI Appliance** é uma categoria nova (2025-2026) de hardware focado 100% em ser um servidor de IA privado de baixo consumo para sua casa.

Pense neles como o roteador da sua internet, mas para inteligência. Dispositivos como o *ClawBox* consomem menos de 20W e rodam modelos de linguagem 24/7. Isso permite que você tenha a Alexa do futuro, totalmente privada, que nunca envia sua voz para a nuvem.
      `,
      tags: ["Privacy", "Local AI", "Hardware"]
    }
  ];

  for (const page of editorials) {
    const { error } = await (supabase as any).from("editorial_pages").upsert({
      title: page.title,
      slug: page.slug,
      content_type: page.content_type,
      body_markdown: page.body_markdown,
      content_language: "pt",
      status: "published",
      is_indexable: true,
      tags: page.tags,
      published_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }, { onConflict: "slug" });

    if (error) {
      console.error(`Erro inserindo ${page.slug}:`, error);
    } else {
      console.log(`✅ Editorial inserido: ${page.title}`);
    }
  }

  console.log("Editorials Seed Complete.");
}

seedEditorials().catch(console.error);
