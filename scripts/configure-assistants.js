#!/usr/bin/env node
/*
  Script: configure-assistants.js
  - Updates all assistants with proper instructions and settings
  - Ensures they use file_search and provide accurate information

  Usage:
    export OPENAI_API_KEY='sk-...'
    node scripts/configure-assistants.js
*/

import fs from 'fs';
import path from 'path';

const OPENAI_KEY = process.env.OPENAI_API_KEY;
if (!OPENAI_KEY) {
  console.error('ERROR: Set OPENAI_API_KEY environment variable before running.');
  process.exit(1);
}

const repoRoot = process.cwd();

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

// Map of assistant env vars to university names
const assistantMapping = {
  'UNILAG_ASSISTANT_ID': 'University of Lagos (UNILAG)',
  'UI_ASSISTANT_ID': 'University of Ibadan (UI)',
  'UNN_ASSISTANT_ID': 'University of Nigeria, Nsukka (UNN)',
  'ABU_ASSISTANT_ID': 'Ahmadu Bello University (ABU)',
  'BUK_ASSISTANT_ID': 'Bayero University, Kano (BUK)',
  'UNIZIK_ASSISTANT_ID': 'Nnamdi Azikiwe University (UNIZIK)',
  'OAU_ASSISTANT_ID': 'Obafemi Awolowo University (OAU)',
  'UNIBEN_ASSISTANT_ID': 'University of Benin (UNIBEN)',
  'UNIPORT_ASSISTANT_ID': 'University of Port Harcourt (UNIPORT)',
  'UNILORIN_ASSISTANT_ID': 'University of Ilorin (UNILORIN)',
  'FUTA_ASSISTANT_ID': 'Federal University of Technology, Akure (FUTA)',
  'COVENANT_ASSISTANT_ID': 'Covenant University',
  'BABCOCK_ASSISTANT_ID': 'Babcock University',
  'UCT_ASSISTANT_ID': 'University of Cape Town (UCT)',
  'OXFORD_ASSISTANT_ID': 'University of Oxford',
  'HARVARD_ASSISTANT_ID': 'Harvard University',
  'MIT_ASSISTANT_ID': 'Massachusetts Institute of Technology (MIT)',
};

async function updateAssistant(assistantId, universityName) {
  const instructions = `You are a helpful university information assistant for ${universityName}.

Your role is to provide accurate, specific information about ${universityName} based on the knowledge base files attached to you.

IMPORTANT GUIDELINES:
1. ALWAYS search the knowledge base files first before answering any question
2. Provide SPECIFIC information from the knowledge base (e.g., exact fees, specific requirements, actual course names)
3. If you find the answer in the knowledge base, provide it directly and clearly
4. Include relevant details like amounts, dates, requirements, or procedures when available
5. If information is not in your knowledge base, say so clearly: "I don't have specific information about that in my knowledge base for ${universityName}"
6. Do NOT ask the user for more details if the answer is in your knowledge base
7. Do NOT give generic answers - always provide specific information from the knowledge base

EXAMPLE GOOD RESPONSES:
- "The school fees for undergraduate programs at ${universityName} range from ₦150,000 to ₦300,000 per session, depending on the faculty."
- "The minimum JAMB score for Post-UTME eligibility is 180."
- "The Vice-Chancellor is Professor [Name] as stated in our records."

EXAMPLE BAD RESPONSES:
- "Could you provide more details about which program?" (when you have the general fees in the knowledge base)
- "School fees vary by program" (without giving specific ranges you have)

Remember: Your knowledge base contains detailed information. Use it to give specific, helpful answers!`;

  const payload = {
    instructions,
    model: 'gpt-4o-mini',
    temperature: 0.3, // Lower temperature for more consistent, factual responses
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
  console.log('Configuring assistants with proper instructions...\n');

  let successCount = 0;
  let failCount = 0;

  for (const [envVar, universityName] of Object.entries(assistantMapping)) {
    const assistantId = envVars[envVar];

    if (!assistantId) {
      console.log(`⚠️  ${universityName}: No assistant ID found for ${envVar}, skipping`);
      continue;
    }

    try {
      console.log(`🔧 Configuring ${universityName}...`);
      await updateAssistant(assistantId, universityName);
      console.log(`   ✓ Successfully configured ${assistantId}\n`);
      successCount++;
    } catch (err) {
      console.error(`   ✗ Failed to configure ${universityName}:`, err.message);
      console.log('');
      failCount++;
    }
  }

  console.log(`\n✅ Configuration complete!`);
  console.log(`   Success: ${successCount}`);
  console.log(`   Failed: ${failCount}`);
}

run().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
