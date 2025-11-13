(async function(){
  // CommonJS-style script for Node
  const fs = require('fs');
  const path = require('path');
  // try to load dotenv if available
  try { require('dotenv').config(); } catch (e) { /* ok */ }

  const envPath = path.resolve(process.cwd(), '.env');
  if (!fs.existsSync(envPath)) {
    console.error('.env not found in project root. Please create one with OPENAI_API_KEY and assistant ids.');
    process.exit(2);
  }

  const envRaw = fs.readFileSync(envPath, 'utf-8');
  const lines = envRaw.split(/\r?\n/);
  const assistantEntries = [];
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#') || !trimmed.includes('=')) continue;
    const parts = trimmed.split('=');
    const key = parts.shift().trim();
    const value = parts.join('=').trim();
    if (key.endsWith('_ASSISTANT_ID')) assistantEntries.push({ key, id: value });
  }

  const apiKey = process.env.OPENAI_API_KEY || (envRaw.match(/OPENAI_API_KEY=(.+)/)?.[1]?.trim());
  if (!apiKey) {
    console.error('ERROR: OPENAI_API_KEY not set in environment or .env');
    process.exit(2);
  }

  if (assistantEntries.length === 0) {
    console.error('No *_ASSISTANT_ID entries found in .env');
    process.exit(2);
  }

  console.log('Using OPENAI_API_KEY length:', apiKey.length);

  // use global fetch if present, otherwise try node-fetch
  let fetchFn = (typeof fetch !== 'undefined') ? fetch : null;
  if (!fetchFn) {
    try { fetchFn = require('node-fetch'); } catch (e) { /* node-fetch not installed */ }
  }
  if (!fetchFn) {
    console.error('No fetch available. Install node-fetch (npm i node-fetch) or run on Node 18+ where fetch is global.');
    process.exit(2);
  }

  for (const entry of assistantEntries) {
    const id = entry.id;
    if (!id) {
      console.log(`Skipping ${entry.key} because it has no value`);
      continue;
    }
    console.log('\n----');
    console.log(`${entry.key} => ${id}`);
    try {
      const res = await fetchFn('https://api.openai.com/v1/assistants/' + encodeURIComponent(id), {
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + apiKey,
          'Content-Type': 'application/json',
          'OpenAI-Beta': 'assistants=v2'
        }
      });
      const text = await res.text();
      let json = undefined;
      try { json = JSON.parse(text); } catch (e) { }
      if (res.ok) {
        console.log(`FOUND: status=${res.status}`);
        if (json) console.log('Response:', JSON.stringify(json, null, 2));
        else console.log('Response body (non-JSON):', text.slice(0, 1000));
      } else {
        console.log(`MISSING or ERROR: status=${res.status}`);
        if (json) console.log('Error body:', JSON.stringify(json, null, 2));
        else console.log('Error body (non-JSON):', text.slice(0, 2000));
      }
    } catch (err) {
      console.log('Request error:', err && err.message ? err.message : err);
    }
  }
  console.log('\nDone.');
})();
