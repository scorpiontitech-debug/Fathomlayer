import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SECRET_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing env vars');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const updates = [
  {
    id: "d72cfe44-a8eb-4456-a835-439980737d26",
    design_score: 9.5,
    pros: ["64GB unified memory accessible by GPU", "Near-silent operation at 100% load", "Class-leading performance-per-watt"],
    cons: ["Zero post-purchase upgradeability", "Lacks native CUDA ecosystem support"],
    ideal_for: ["Running 70B+ LLMs locally", "Quiet home office environments"],
    editorial_notes: "The M4 Pro with 64GB unified memory represents the most cost-effective path to running large models (70B+ parameters) locally. Because the integrated GPU can access the entire 64GB memory pool, it outperforms comparably priced discrete PC builds in raw memory capacity, despite lacking native CUDA ecosystem support.",
    status: "published",
    published_at: new Date().toISOString()
  },
  {
    id: "e8e65acf-9ecc-43ff-92dd-25553c610479",
    design_score: 9.2,
    pros: ["48GB total VRAM for heavy inference", "Massive PCIe lane bandwidth", "64-core compute headroom"],
    cons: ["Extreme power consumption (1500W+ peak)", "High noise levels under sustained load"],
    ideal_for: ["Fine-tuning 70B parameter models", "Continuous 3D rendering pipelines"],
    editorial_notes: "The definitive ceiling for local workstation AI. Running dual RTX 4090s provides the 48GB VRAM necessary for reliable 70B model inference at q4 precision. This configuration eliminates the ongoing costs of cloud compute for heavy production workflows, though it requires significant thermal management.",
    status: "published",
    published_at: new Date().toISOString()
  },
  {
    id: "14e57536-62ff-4d62-ac36-ea4f892db3d9",
    design_score: 8.5,
    pros: ["Dual 10GbE networking ports", "PCIe x8 slot for hardware expansion", "Robust cooling for a 1L chassis"],
    cons: ["Limited to half-height single-slot GPUs", "External power brick is bulky"],
    ideal_for: ["Edge AI nodes", "Dense homelab virtualization"],
    editorial_notes: "An enterprise-grade workstation condensed into a 1L chassis. The inclusion of a PCIe x8 slot makes it uniquely adaptable for local LLM inference when paired with a low-profile GPU. Thermal limits require careful component selection, but the dual 10GbE networking provides excellent data throughput.",
    status: "published",
    published_at: new Date().toISOString()
  },
  {
    id: "deda85c8-278c-4cfe-908c-099ab32196f6",
    design_score: 8.0,
    pros: ["128GB massive memory pool", "Ultra-compact form factor", "Dual NVMe storage slots"],
    cons: ["APU graphics bottleneck token generation speed", "Audible fan noise under sustained load"],
    ideal_for: ["High-capacity context retrieval", "CPU-based LLM inference"],
    editorial_notes: "Packing 128GB of RAM into a mini-PC chassis enables running massive models that simply will not fit in standard consumer VRAM. While inference speed via CPU/APU is slower than discrete GPUs, the sheer memory capacity unlocks use cases previously restricted to cloud servers.",
    status: "published",
    published_at: new Date().toISOString()
  },
  {
    id: "d9aeec9a-40b3-4de9-9dae-00be1ed01ebe",
    design_score: 7.5,
    pros: ["16GB VRAM at entry-level pricing", "Accessible upgrade path", "Low power draw (160W GPU limit)"],
    cons: ["Limited to 8B/14B models for fast inference", "Memory bandwidth restricts larger batch sizes"],
    ideal_for: ["Entry-level local AI experimentation", "Running Llama 3 8B locally"],
    editorial_notes: "The 16GB variant of the RTX 4060 Ti is the most economical entry point into CUDA-accelerated local AI. It provides enough VRAM to comfortably run and fine-tune models in the 8B to 14B parameter range, making it the default recommendation for budget-constrained setups.",
    status: "published",
    published_at: new Date().toISOString()
  },
  {
    id: "4bfc34ab-2018-4f29-97f5-9f01cd5affe2",
    design_score: 8.8,
    pros: ["Magnetic Hall Effect switches", "Ultra-low profile design", "Customizable actuation points"],
    cons: ["Battery life is shorter at 1000Hz polling", "ABS keycaps on standard variants"],
    ideal_for: ["Rapid typing for code generation", "Minimalist desktop setups"],
    editorial_notes: "The integration of Hall Effect magnetic switches into a low-profile chassis provides precise actuation control. It bridges the gap between mechanical typing feel and the low-travel requirements of extended coding sessions, featuring dynamic actuation points for different workflows.",
    status: "published",
    published_at: new Date().toISOString()
  }
];

async function main() {
  for (const update of updates) {
    const { id, ...data } = update;
    const { error } = await supabase.from('products').update(data).eq('id', id);
    if (error) {
      console.error(`Failed to update ${id}:`, error);
    } else {
      console.log(`Updated and published: ${id}`);
    }
  }
  
  const { data: cats, error: catError } = await supabase
    .from('categories')
    .select('name, active_listing_count, is_indexable');
    
  console.log('\n--- Category Statuses ---');
  if (catError) console.error(catError);
  else console.table(cats?.filter(c => c.active_listing_count > 0));
}

main();
