import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// Load .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase keys in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

function toKebabCase(str) {
  return str.trim().toLowerCase().replace(/\s+/g, '-');
}

async function run() {
  console.log("Fetching editorial pages...");
  const { data: pages, error: fetchError } = await supabase
    .from('editorial_pages')
    .select('id, tags');

  if (fetchError) {
    console.error("Error fetching pages:", fetchError);
    return;
  }

  let updatedCount = 0;

  for (const page of pages) {
    if (!page.tags || page.tags.length === 0) continue;

    const normalizedTags = Array.from(new Set(page.tags.map(toKebabCase)));
    
    // Check if changed
    const isDifferent = page.tags.length !== normalizedTags.length || !page.tags.every((val, index) => val === normalizedTags[index]);

    if (isDifferent) {
      const { error: updateError } = await supabase
        .from('editorial_pages')
        .update({ tags: normalizedTags })
        .eq('id', page.id);
        
      if (updateError) {
        console.error(`Error updating page ${page.id}:`, updateError);
      } else {
        console.log(`Updated page ${page.id}: ${page.tags.join(', ')} -> ${normalizedTags.join(', ')}`);
        updatedCount++;
      }
    }
  }

  console.log(`Finished. Updated ${updatedCount} pages.`);
}

run();
