import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { supabasePublic } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ message: "Anthropic API Key missing. Please configure it." }, { status: 500 });
    }

    const anthropic = new Anthropic({ apiKey });

    // Fetch a simplified context from the database to inject into the prompt
    // In a production environment with thousands of items, we would use pgvector and embeddings.
    // For this MVP, we will inject a summary of top software/products.
    const [softwareRes, productRes] = await Promise.all([
      supabasePublic().from("software").select("name, description, pricing_model, design_score, slug").order("design_score", { ascending: false }).limit(20),
      supabasePublic().from("product").select("title, description, price_text, design_score, slug").order("design_score", { ascending: false }).limit(20),
    ]);

    const softwareContext = softwareRes.data?.map(s => `- ${s.name} (Score: ${s.design_score}, Price: ${s.pricing_model}): ${s.description}. Link: /software/ai/${s.slug}`).join("\n");
    const productContext = productRes.data?.map(p => `- ${p.title} (Score: ${p.design_score}, Price: ${p.price_text}): ${p.description}. Link: /hardware/gpu/${p.slug}`).join("\n");

    const systemPrompt = `You are the Fathom Layer AI Stack Copilot. Your job is to recommend technology stacks, hardware, and tools based on the user's requirements. 
    You have access to the Fathom Layer directory database. 
    Always use the provided context to recommend tools, and always include the Link provided in the context so the user can click it. Format links as HTML <a href="link" class="text-accent hover:underline">Tool Name</a>.
    
    Database Context:
    Software:
    ${softwareContext}
    
    Hardware:
    ${productContext}
    `;

    const formattedMessages = messages.map((m: any) => ({
      role: m.role,
      content: m.content
    }));

    const response = await anthropic.messages.create({
      model: "claude-3-5-haiku-20241022",
      max_tokens: 1000,
      system: systemPrompt,
      messages: formattedMessages,
    });

    const reply = (response.content[0] as any).text;

    return NextResponse.json({ message: reply });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ message: "Error generating response" }, { status: 500 });
  }
}
