import { createClient } from "@supabase/supabase-js";
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!
);

async function seedMasterPlanPart2() {
  console.log("Seeding Master Plan Part 2...");

  // Get categories
  const { data: categories } = await supabase.from("categories").select("id, slug");
  if (!categories) {
    console.error("No categories found");
    return;
  }
  const catMap = Object.fromEntries(categories.map(c => [c.slug, c.id]));

  const products = [
    // Smartphones
    {
      title: "Samsung Galaxy S26 Ultra", slug: "samsung-galaxy-s26-ultra", categorySlug: "smartphones", brand: "Samsung",
      description: "O produto mais procurado globalmente em 2026. Snapdragon 8 Elite, Privacy Display, IA nativa avançada (Galaxy AI).",
      price_from: 1299, pros: ["Snapdragon 8 Elite", "Privacy Display", "Galaxy AI avançada"], cons: ["Tamanho e peso proibitivos para mãos pequenas"]
    },
    {
      title: "Apple iPhone 17 Pro Max", slug: "apple-iphone-17-pro-max", categorySlug: "smartphones", brand: "Apple",
      description: "Ecossistema Apple Intelligence hermético, chips A-series imbatíveis em eficiência, captura de vídeo ProRes.",
      price_from: 1199, pros: ["Ecossistema Apple Intelligence", "Chips ultra eficientes", "Captura ProRes"], cons: ["Inovações focadas estritamente em retenção do ecossistema", "Baixa adoção de formatos abertos"]
    },
    // Premium Audio
    {
      title: "Sony WF-1000XM6", slug: "sony-wf-1000xm6", categorySlug: "premium-audio", brand: "Sony",
      description: "Cancelamento via condução óssea IA e Gemini Live integrado.",
      price_from: 299, pros: ["Condução óssea IA", "Gemini Live"], cons: []
    },
    {
      title: "Sony WH-1000XM6", slug: "sony-wh-1000xm6", categorySlug: "premium-audio", brand: "Sony",
      description: "A variante de conchas completas para máxima fidelidade acústica.",
      price_from: 399, pros: ["Fidelidade acústica extrema", "Cancelamento de ruído premium"], cons: []
    },
    {
      title: "Apple AirPods Pro 3", slug: "apple-airpods-pro-3", categorySlug: "premium-audio", brand: "Apple",
      description: "10 horas contínuas de bateria e cancelamento de ruído supremo no ecossistema iOS.",
      price_from: 249, pros: ["10 horas de bateria", "Integração iOS perfeita"], cons: []
    },
    {
      title: "Bose QuietComfort Ultra", slug: "bose-quietcomfort-ultra", categorySlug: "premium-audio", brand: "Bose",
      description: "O líder invicto em conforto ergonômico em longas viagens.",
      price_from: 429, pros: ["Ergonomia suprema", "Áudio imersivo"], cons: []
    },
    // Premium Laptops
    {
      title: "Apple MacBook Air (M5)", slug: "apple-macbook-air-m5", categorySlug: "premium-laptops", brand: "Apple",
      description: "O expoente máximo de eficiência passiva sem ventoinhas (Fanless).",
      price_from: 1099, pros: ["Eficiência passiva", "Chip M5"], cons: []
    },
    {
      title: "Apple MacBook Neo", slug: "apple-macbook-neo", categorySlug: "premium-laptops", brand: "Apple",
      description: "A aposta mais acessível e design em alumínio premium para democratizar a arquitetura Apple.",
      price_from: 799, pros: ["Acessível", "Design Premium"], cons: []
    },
    {
      title: "Lenovo ThinkPad X1 Carbon Gen 13", slug: "lenovo-thinkpad-x1-carbon-gen-13", categorySlug: "premium-laptops", brand: "Lenovo",
      description: "O padrão B2B absoluto. Teclados incomparáveis.",
      price_from: 1599, pros: ["Padrão B2B", "Teclado incomparável"], cons: []
    },
    {
      title: "HP OmniBook X Flip 16", slug: "hp-omnibook-x-flip-16", categorySlug: "premium-laptops", brand: "HP",
      description: "A representação do Copilot+ AI com arquitetura Windows otimizada.",
      price_from: 1399, pros: ["Copilot+ AI", "Windows otimizado"], cons: []
    },
    // Local AI Hardware
    {
      title: "Nvidia GeForce RTX 5090 (32GB)", slug: "nvidia-geforce-rtx-5090-32gb", categorySlug: "local-ai-workstations", brand: "Nvidia",
      description: "A placa mais brutal de consumo. Focada em velocidade absurda e 32GB de memória GDDR7.",
      price_from: 1999, pros: ["Velocidade absurda", "32GB GDDR7"], cons: ["Consumo extremo", "Preço altíssimo"]
    },
    {
      title: "Nvidia GeForce RTX 5080 (16GB)", slug: "nvidia-geforce-rtx-5080-16gb", categorySlug: "local-ai-workstations", brand: "Nvidia",
      description: "A placa de atualização sólida em performance sobre a 5070 Ti, sem o custo da 5090.",
      price_from: 999, pros: ["Performance high-end", "Boa arquitetura de memória"], cons: []
    },
    {
      title: "Nvidia GeForce RTX 5070 Ti (16GB)", slug: "nvidia-geforce-rtx-5070-ti-16gb", categorySlug: "local-ai-workstations", brand: "Nvidia",
      description: "O verdadeiro campeão de custo-benefício que atingiu o ponto de equilíbrio dos criadores.",
      price_from: 699, pros: ["Custo-benefício", "16GB VRAM ideal"], cons: []
    },
    {
      title: "Nvidia GeForce RTX 3090 (Usada)", slug: "nvidia-geforce-rtx-3090-usada", categorySlug: "local-ai-workstations", brand: "Nvidia",
      description: "A queridinha do mercado secundário para clusters baratos de 72GB VRAM.",
      price_from: 600, pros: ["24GB VRAM barata", "Excelente para SLI/Clusters"], cons: ["Sem garantia", "Consumo alto"]
    },
    {
      title: "Mac Studio (M3 Ultra)", slug: "mac-studio-m3-ultra", categorySlug: "local-ai-workstations", brand: "Apple",
      description: "Atualização da workstation Apple agora atingindo absurdos 819 GB/s de banda de memória unificada.",
      price_from: 3999, pros: ["819 GB/s de banda de memória", "VRAM unificada massiva"], cons: []
    },
    {
      title: "Minisforum MS-S1 Max", slug: "minisforum-ms-s1-max", categorySlug: "local-ai-workstations", brand: "Minisforum",
      description: "A resposta da AMD com Strix Halo alojando 128GB de RAM LPDDR5x soldada.",
      price_from: 1299, pros: ["128GB RAM", "Strix Halo"], cons: []
    },
    // Wearables
    {
      title: "Garmin Enduro 3", slug: "garmin-enduro-3", categorySlug: "wearables", brand: "Garmin",
      description: "Focado puramente na bateria quase infinita via ecrã MIP e assistência solar para ultra-maratonas extremas.",
      price_from: 899, pros: ["Bateria quase infinita", "Assistência solar"], cons: ["Ecrã MIP não tão vibrante"]
    },
    {
      title: "Apple Watch Ultra 3", slug: "apple-watch-ultra-3", categorySlug: "wearables", brand: "Apple",
      description: "A resposta da Apple ao mercado tático.",
      price_from: 799, pros: ["Tela brutal", "Integração iOS perfeita"], cons: ["Bateria menor que Garmin"]
    },
    {
      title: "RingConn Gen 2", slug: "ringconn-gen-2", categorySlug: "wearables", brand: "RingConn",
      description: "Um anel livre de assinaturas desenhado especificamente para superar a autonomia de bateria do Oura.",
      price_from: 299, pros: ["Sem mensalidade", "Bateria superior ao Oura"], cons: []
    },
    // AR Glasses
    {
      title: "Even Realities G1", slug: "even-realities-g1", categorySlug: "ar-glasses", brand: "Even Realities",
      description: "Focado no micro-ecrã LED invisível verde (teleponto).",
      price_from: 599, pros: ["Design discreto", "MicroLED verde"], cons: []
    },
    {
      title: "XREAL One Pro", slug: "xreal-one-pro", categorySlug: "ar-glasses", brand: "XREAL",
      description: "Focado na criação de monitores virtuais para nômades digitais.",
      price_from: 499, pros: ["Telas massivas", "Bom software Windows/Mac"], cons: []
    },
    {
      title: "TCL RayNeo Air 4 Pro", slug: "tcl-rayneo-air-4-pro", categorySlug: "ar-glasses", brand: "TCL",
      description: "Óculos AR pesados focados puramente em exibição de mídia multimídia.",
      price_from: 399, pros: ["Display brilhante", "Foco multimídia"], cons: ["Pesados"]
    },
    {
      title: "Snap Specs", slug: "snap-specs", categorySlug: "ar-glasses", brand: "Snap",
      description: "Ferramenta developer-only acima de $2000.",
      price_from: 2000, pros: ["Sensores avançados", "Ótima plataforma AR"], cons: ["Extremamente caro", "Bateria curtíssima"]
    },
    // Peripherals
    {
      title: "Aula F75", slug: "aula-f75", categorySlug: "setup-peripherals", brand: "Aula",
      description: "A alternativa super econômica frente à falta de stock do Wooting 80HE.",
      price_from: 69, pros: ["Barato", "Boa qualidade"], cons: ["Sem Hall Effect"]
    },
    {
      title: "Wooting 80HE", slug: "wooting-80he", categorySlug: "setup-peripherals", brand: "Wooting",
      description: "O produto de hardware com maior índice de desejo/esgotamento, trucidando switches mecânicos clássicos com precisão analógica.",
      price_from: 199, pros: ["Switches Hall Effect", "Rapid Trigger absoluto"], cons: ["Sempre fora de stock"]
    }
  ];

  for (const p of products) {
    const categoryId = catMap[p.categorySlug];
    if (!categoryId) {
      console.log(`Category not found for ${p.categorySlug}`);
      continue;
    }
    const { error } = await (supabase as any).from("products").upsert({
      slug: p.slug,
      category_id: categoryId,
      title: p.title,
      brand: p.brand,
      description: p.description,
      price_from: p.price_from,
      pros: p.pros,
      cons: p.cons,
      status: "published",
      is_indexable: true,
      updated_at: new Date().toISOString()
    }, { onConflict: "slug" });
    
    if (error) console.error(`Error ${p.title}:`, error);
    else console.log(`✅ Injected product: ${p.title}`);
  }

  const software = [
    {
      name: "Qwen 3 MoE", slug: "qwen-3-moe", categorySlug: "ai-software",
      description: "O modelo Mixture of Experts massivo focado em independência geopolítica (originário da China).",
      price_text: "Open Source", pros: ["Extremamente rápido", "Performance de GPT-4"], cons: []
    }
  ];

  for (const s of software) {
    const categoryId = catMap[s.categorySlug];
    if (!categoryId) continue;
    const { error } = await (supabase as any).from("software").upsert({
      slug: s.slug,
      category_id: categoryId,
      name: s.name,
      description: s.description,
      price_text: s.price_text,
      pros: s.pros,
      cons: s.cons,
      status: "published",
      is_indexable: true,
      updated_at: new Date().toISOString()
    }, { onConflict: "slug" });

    if (error) console.error(`Error ${s.name}:`, error);
    else console.log(`✅ Injected software: ${s.name}`);
  }

  console.log("Master Plan Part 2 Seeding Complete.");
}

seedMasterPlanPart2().catch(console.error);
