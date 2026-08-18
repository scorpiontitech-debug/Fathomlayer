import { generateText } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function main() {
  try {
    const { text } = await generateText({
      model: anthropic('claude-3-5-sonnet-latest'),
      prompt: 'Hello, world!',
    });
    console.log(text);
  } catch (e) {
    console.error("AI Error:", e);
  }
}
main();
