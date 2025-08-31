// scripts/grammar-check.js
const fs = require('fs');
const path = require('path');

const CLIENT_ID  = process.env.CLIENT_ID  || 'unknown';
const AUDIT_TYPE = process.env.AUDIT_TYPE || 'single';
const TARGET_URL = process.env.TARGET_URL || '';

async function fetchText(url) {
  const r = await fetch(url, { redirect: 'follow' });
  const html = await r.text();
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

(async () => {
  fs.mkdirSync(path.join('out'), { recursive: true });

  let ok = true, notes = [], sample = '';
  try {
    const text = await fetchText(TARGET_URL);
    sample = text.slice(0, 600);

    const suspicious = (text.match(/\b(alot|irregardless|should of)\b/gi) || []).length;
    const doubles    = (text.match(/\b(\w+)\s+\1\b/gi) || []).length;
    if (suspicious) notes.push(`Found ${suspicious} known issues`);
    if (doubles)    notes.push(`Found ${doubles} duplicate words`);
  } catch (e) {
    ok = false;
    notes.push(`Fetch failed: ${e.message}`);
  }

  const result = {
    ok,
    client_id: CLIENT_ID,
    audit_type: AUDIT_TYPE,
    url: TARGET_URL,
    notes,
    sample,
    ts: new Date().toISOString()
  };

  fs.writeFileSync(path.join('out', 'results.json'), JSON.stringify(result, null, 2));
  console.log('Wrote out/results.json');
})();
