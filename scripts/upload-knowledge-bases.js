#!/usr/bin/env node
/*
  Script: upload-knowledge-bases.js
  - Reads assistant IDs from .env
  - For each university with knowledge base files, creates a vector store
  - Uploads all .txt files from the university's knowledge-base directory
  - Attaches the vector store to the assistant

  Usage:
    export OPENAI_API_KEY='sk-...'
    node scripts/upload-knowledge-bases.js
*/

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OPENAI_KEY = process.env.OPENAI_API_KEY;
if (!OPENAI_KEY) {
  console.error('ERROR: Set OPENAI_API_KEY environment variable before running.');
  process.exit(1);
}

const repoRoot = process.cwd();

// Map of university folder names to their env var names
const universityMapping = {
  'unilag': 'UNILAG_ASSISTANT_ID',
  'ui': 'UI_ASSISTANT_ID',
  'unn': 'UNN_ASSISTANT_ID',
  'abu': 'ABU_ASSISTANT_ID',
  'buk': 'BUK_ASSISTANT_ID',
  'unizik': 'UNIZIK_ASSISTANT_ID',
  'oau': 'OAU_ASSISTANT_ID',
  'uniben': 'UNIBEN_ASSISTANT_ID',
  'uniport': 'UNIPORT_ASSISTANT_ID',
  'unilorin': 'UNILORIN_ASSISTANT_ID',
  'futa': 'FUTA_ASSISTANT_ID',
  'lautech': 'COVENANT_ASSISTANT_ID',
  'covenant': 'COVENANT_ASSISTANT_ID',
  'babcock': 'BABCOCK_ASSISTANT_ID',
  'uct': 'UCT_ASSISTANT_ID',
  'oxford': 'OXFORD_ASSISTANT_ID',
  'harvard': 'HARVARD_ASSISTANT_ID',
  'mit': 'MIT_ASSISTANT_ID',
};

// Read .env file
const envPath = path.join(repoRoot, '.env');
const envContent = fs.readFileSync(envPath, 'utf-8');
const envVars = {};
envContent.split(/\r?\n/).forEach(line => {
  const match = line.match(/^([A-Z_]+)=(.+)$/);
  if (match) {
    envVars[match[1]] = match[2];
  }
});

// Helper: Upload a file to OpenAI
async function uploadFile(filePath) {
  const formData = new FormData();
  const fileContent = fs.readFileSync(filePath);
  const blob = new Blob([fileContent], { type: 'text/plain' });
  const fileName = path.basename(filePath);

  formData.append('purpose', 'assistants');
  formData.append('file', blob, fileName);

  const res = await fetch('https://api.openai.com/v1/files', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENAI_KEY}`,
    },
    body: formData,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to upload file ${fileName}: ${res.status} ${text}`);
  }

  const data = await res.json();
  return data.id;
}

// Helper: Create a vector store
async function createVectorStore(name, fileIds) {
  const payload = {
    name,
    file_ids: fileIds,
  };

  const res = await fetch('https://api.openai.com/v1/vector_stores', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENAI_KEY}`,
      'Content-Type': 'application/json',
      'OpenAI-Beta': 'assistants=v2',
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to create vector store: ${res.status} ${text}`);
  }

  const data = await res.json();
  return data.id;
}

// Helper: Attach vector store to assistant
async function updateAssistant(assistantId, vectorStoreId) {
  const payload = {
    tool_resources: {
      file_search: {
        vector_store_ids: [vectorStoreId],
      },
    },
    tools: [{ type: 'file_search' }],
  };

  const res = await fetch(`https://api.openai.com/v1/assistants/${assistantId}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENAI_KEY}`,
      'Content-Type': 'application/json',
      'OpenAI-Beta': 'assistants=v2',
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to update assistant: ${res.status} ${text}`);
  }

  return await res.json();
}

async function run() {
  const kbDir = path.join(repoRoot, 'knowledge-base');
  const universities = fs.readdirSync(kbDir).filter(name => {
    const stat = fs.statSync(path.join(kbDir, name));
    return stat.isDirectory();
  });

  console.log(`Found ${universities.length} university knowledge bases\n`);

  for (const uniFolder of universities) {
    const envVar = universityMapping[uniFolder];
    if (!envVar) {
      console.log(`⚠️  ${uniFolder}: No environment variable mapping found, skipping`);
      continue;
    }

    const assistantId = envVars[envVar];
    if (!assistantId) {
      console.log(`⚠️  ${uniFolder}: No assistant ID found for ${envVar}, skipping`);
      continue;
    }

    const uniPath = path.join(kbDir, uniFolder);
    const files = fs.readdirSync(uniPath).filter(f => f.endsWith('.txt'));

    if (files.length === 0) {
      console.log(`⚠️  ${uniFolder}: No .txt files found, skipping`);
      continue;
    }

    console.log(`📚 Processing ${uniFolder} (${files.length} files)...`);

    try {
      // Upload all files
      console.log(`   Uploading ${files.length} files...`);
      const fileIds = [];
      for (const file of files) {
        const filePath = path.join(uniPath, file);
        try {
          const fileId = await uploadFile(filePath);
          fileIds.push(fileId);
          console.log(`   ✓ ${file} -> ${fileId}`);
        } catch (err) {
          console.error(`   ✗ Failed to upload ${file}:`, err.message);
        }
      }

      if (fileIds.length === 0) {
        console.log(`   ✗ No files uploaded successfully, skipping vector store creation`);
        continue;
      }

      // Create vector store
      console.log(`   Creating vector store...`);
      const vectorStoreName = `${uniFolder.toUpperCase()} Knowledge Base`;
      const vectorStoreId = await createVectorStore(vectorStoreName, fileIds);
      console.log(`   ✓ Vector store created: ${vectorStoreId}`);

      // Attach to assistant
      console.log(`   Attaching to assistant ${assistantId}...`);
      await updateAssistant(assistantId, vectorStoreId);
      console.log(`   ✓ Knowledge base attached successfully!\n`);

    } catch (err) {
      console.error(`   ✗ Error processing ${uniFolder}:`, err.message);
      console.log('');
    }
  }

  console.log('✅ Knowledge base upload complete!');
}

run().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
