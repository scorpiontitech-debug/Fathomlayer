import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

// This script should be run with: npx tsx --env-file=.env.local scripts/export_leads.ts

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SECRET_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function exportLeads() {
  console.log("Fetching software and categories from Supabase...");
  
  const { data, error } = await supabase
    .from('software')
    .select(`
      name,
      slug,
      website_url,
      status,
      categories (
        name,
        pillar
      )
    `)
    .eq('status', 'published'); // Only target published software

  if (error) {
    console.error("Error fetching data:", error);
    return;
  }

  if (!data || data.length === 0) {
    console.log("No published software found.");
    return;
  }

  console.log(`Found ${data.length} published software entries.`);

  // Prepare CSV content
  const headers = ['Name', 'Slug', 'Category', 'Pillar', 'Website', 'Contact Email / Twitter (Manual)', 'Status'];
  const csvRows = [headers.join(',')];

  for (const item of data) {
    // @ts-ignore
    const categoryName = item.categories?.name || 'Unknown';
    // @ts-ignore
    const categoryPillar = item.categories?.pillar || 'Unknown';
    
    // Escape quotes if website URL has them (unlikely, but safe)
    const website = item.website_url ? `"${item.website_url}"` : '""';
    
    // Fill 'Contact' column empty for manual entry
    const row = [
      `"${item.name}"`,
      item.slug,
      `"${categoryName}"`,
      categoryPillar,
      website,
      '""', // Contact column empty
      'Pending' // Status of outreach
    ];
    csvRows.push(row.join(','));
  }

  const csvContent = csvRows.join('\n');
  const outPath = path.join(process.cwd(), 'scripts', 'leads.csv');
  
  fs.writeFileSync(outPath, csvContent, 'utf-8');
  console.log(`Successfully exported leads to: ${outPath}`);
}

exportLeads();
