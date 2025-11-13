#!/usr/bin/env node
/*
  Script: create-assistants-from-kb.js
  - Scans `app/config/universities.ts` for universities and their env var keys (assistantId: process.env.X)
  - For each university without an assistant id in the current environment, it creates a minimal assistant via OpenAI API
  - Writes the new assistant IDs to a copy of your .env file: `.env.assistants.new`

  Usage (PowerShell):
    $env:OPENAI_API_KEY = 'sk-...'
    node scripts/create-assistants-from-kb.js

  NOTE: This creates resources in the OpenAI project tied to your API key. Review `.env.assistants.new` before replacing your `.env`.
*/

import fs from 'fs';
import path from 'path';

const OPENAI_KEY = process.env.OPENAI_API_KEY;
if (!OPENAI_KEY) {
  console.error('ERROR: Set OPENAI_API_KEY environment variable before running.');
  process.exit(1);
}

const repoRoot = process.cwd();
const uniConfigPath = path.join(repoRoot, 'app', 'config', 'universities.ts');
if (!fs.existsSync(uniConfigPath)) {
  console.error('Cannot find app/config/universities.ts — run this script from the repo root.');
  process.exit(1);
}

const uniSrc = fs.readFileSync(uniConfigPath, 'utf8');

// Improved parser: directly search for object patterns containing id, name and assistantId: process.env.X
// This avoids nested-brace issues when using a naive block-scan.
const uniBlockRegex = /id:\s*['"]([a-zA-Z0-9_-]+)['"][\s\S]*?name:\s*['"]([^'"]+)['"][\s\S]*?assistantId:\s*process\.env\.([A-Z0-9_]+)/g;
const matches = [];
let m;
while ((m = uniBlockRegex.exec(uniSrc)) !== null) {
  const id = m[1];
  const name = m[2];
  const envVar = m[3];
  matches.push({ id, name, envVar });
}

if (matches.length === 0) {
  console.error('No universities with assistantId found in config.');
  process.exit(1);
}

async function listAssistants() {
  const res = await fetch('https://api.openai.com/v1/assistants', {
    headers: {
      Authorization: `Bearer ${OPENAI_KEY}`,
      'Content-Type': 'application/json',
      'OpenAI-Beta': 'assistants=v2'
    },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to list assistants: ${res.status} ${text}`);
  }
  const body = await res.json();
  return body.data || [];
}

async function createAssistant(name, description) {
  const payload = { name, description, model: 'gpt-4o-mini' };
  const res = await fetch('https://api.openai.com/v1/assistants', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${OPENAI_KEY}`,
      'Content-Type': 'application/json',
      'OpenAI-Beta': 'assistants=v2'
    },
    body: JSON.stringify(payload),
  });
  const body = await res.json();
  if (!res.ok) throw new Error(`Create assistant failed: ${res.status} ${JSON.stringify(body)}`);
  return body;
}

async function run() {
  console.log(`Found ${matches.length} universities in config with assistant env keys.`);
  const existing = await listAssistants().catch(err => { console.error('List failed:', err); return []; });
  const existingByName = {};
  for (const a of existing) {
    if (a.name) existingByName[a.name.toLowerCase()] = a;
  }

  const envPath = path.join(repoRoot, '.env');
  let envText = '';
  try { envText = fs.readFileSync(envPath, 'utf8'); } catch (e) { envText = ''; }
  const envLines = envText.split(/\r?\n/).filter(Boolean);
  const outEnv = new Map(envLines.map(l => { const idx = l.indexOf('='); if (idx>0) return [l.slice(0,idx), l.slice(idx+1)]; return null; }).filter(Boolean));

  const results = {};
  for (const u of matches) {
    const current = process.env[u.envVar] || outEnv.get(u.envVar);
    if (current) {
      console.log(`${u.id}: already configured via env ${u.envVar}=${current}`);
      results[u.envVar] = current;
      continue;
    }

    // create assistant with an obvious name
    const wantName = `${u.name} (student-assistant)`;
    if (existingByName[wantName.toLowerCase()]) {
      const found = existingByName[wantName.toLowerCase()];
      console.log(`${u.id}: found existing assistant ${found.id} (${found.name})`);
      results[u.envVar] = found.id;
      continue;
    }

    console.log(`${u.id}: creating assistant for ${u.name}...`);
    try {
      const created = await createAssistant(wantName, `Assistant for ${u.name} used by Student-Assistant repo.`);
      const asstId = created?.id || created?.assistant?.id || created;
      if (!asstId) throw new Error('Create returned no id: ' + JSON.stringify(created));
      console.log(`${u.id}: created assistant id ${asstId}`);
      results[u.envVar] = asstId;
      // add to existingByName to avoid duplicates
      existingByName[wantName.toLowerCase()] = { id: asstId, name: wantName };
    } catch (err) {
      console.error(`${u.id}: failed to create assistant:`, err?.message || err);
    }
  }

  // Write new .env copy
  const newEnvPath = envPath + '.assistants.new';
  let out = envText || '';
  for (const [k, v] of Object.entries(results)) {
    const re = new RegExp(`^${k}=.*$`, 'm');
    if (re.test(out)) out = out.replace(re, `${k}=${v}`);
    else out += `\n${k}=${v}`;
  }
  fs.writeFileSync(newEnvPath, out, 'utf8');
  console.log(`Wrote updated env to ${newEnvPath}. Review before replacing .env`);
}

run().catch(err => { console.error(err); process.exit(1); });
