const fs = require('fs');
const filePath = 'C:/Users/rodri/.gemini/antigravity/brain/71ab7185-2a33-4cc7-bc7f-86ece6d41e1a/.system_generated/steps/23/output.txt';
const raw = fs.readFileSync(filePath, 'utf8');

const wrapper = JSON.parse(raw);
const resultStr = wrapper.result;

const start = resultStr.indexOf('[');
const end = resultStr.lastIndexOf(']');
const jsonStr = resultStr.substring(start, end + 1);

const data = JSON.parse(jsonStr);

const analysis = {
  total: data.length,
  types: {},
  status: {},
  languages: {},
  indexable: 0,
  tags: {},
  avgLength: 0,
};

let totalLength = 0;

data.forEach(item => {
  analysis.types[item.content_type] = (analysis.types[item.content_type] || 0) + 1;
  analysis.status[item.status] = (analysis.status[item.status] || 0) + 1;
  analysis.languages[item.content_language] = (analysis.languages[item.content_language] || 0) + 1;
  if (item.is_indexable) analysis.indexable++;
  
  if (item.tags && Array.isArray(item.tags)) {
    item.tags.forEach(tag => {
      analysis.tags[tag] = (analysis.tags[tag] || 0) + 1;
    });
  }
  
  totalLength += (item.body_markdown ? item.body_markdown.length : 0);
});

analysis.avgLength = totalLength / data.length;

console.log(JSON.stringify(analysis, null, 2));

console.log('\n--- TITLES ---');
data.forEach(item => {
  console.log('[' + item.content_type.toUpperCase() + '] [' + item.status + '] (' + item.content_language + ') ' + item.title);
});
