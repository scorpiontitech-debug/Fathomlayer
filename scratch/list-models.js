import fs from 'fs';
const env = fs.readFileSync('c:/Nova/.env.local', 'utf-8');
const keyMatch = env.match(/GOOGLE_GENERATIVE_AI_API_KEY=\s*(.+)/);
const key = keyMatch ? keyMatch[1].trim() : '';

fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`)
  .then(res => res.json())
  .then(data => console.log(JSON.stringify(data.models.map(m => m.name), null, 2)))
  .catch(console.error);
