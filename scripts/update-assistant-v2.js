// Update assistant to use file search with vector store (v2 API)
// Run this with: node scripts/update-assistant-v2.js

require('dotenv').config();
const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// File IDs from previous upload
const fileIds = [
  'file-W35ynT9Zndrdadt7Pkb3so',  // unilag-general.txt
  'file-Pp7HgmMZhTXeFqYhcs4cC5',  // departments-and-hods.json
  'file-P996CjcyU8xxR7ZJAcULZ2',  // campus-facilities.txt
  'file-Pyr2Wu6kJHyHUHXP245fws',  // academic-procedures.txt
  'file-34qgTvEWXHTSAE1nQDbPaE',  // contacts-and-urls.json
  'file-276n2GFTCB7VkzRf1HUXom'   // faq.txt
];

async function updateAssistant() {
  console.log('🚀 Updating UNILAG Assistant with File Search...\n');

  try {
    const assistantId = process.env.OPENAI_ASSISTANT_ID;

    if (!assistantId) {
      console.error('❌ OPENAI_ASSISTANT_ID not found in .env file');
      process.exit(1);
    }

    // First create a vector store
    console.log('📦 Creating vector store...');
    const vectorStore = await openai.beta.vectorStores.create({
      name: "UNILAG Knowledge Base",
      file_ids: fileIds
    });
    console.log(`✅ Vector Store created: ${vectorStore.id}\n`);

    // Update assistant
    console.log('🔧 Updating assistant...');
    const assistant = await openai.beta.assistants.update(assistantId, {
      name: "UNILAG Student Assistant",
      instructions: `You are a helpful and knowledgeable assistant for University of Lagos (UNILAG) students. Your role is to provide accurate information about:

- Campus facilities and their locations
- Academic procedures (course registration, fee payment, exams, results)
- Departments, faculties, and administrative information
- Student services and campus life
- Admission processes and requirements

Guidelines:
1. Always be friendly, helpful, and professional
2. Use the knowledge base to provide accurate UNILAG-specific information
3. If you don't know something, admit it and suggest the student contact the relevant department
4. Provide step-by-step guidance for procedures
5. Include relevant portal URLs and contact information when applicable
6. Be concise but comprehensive in your responses
7. Use the file search tool to find information from the knowledge base

Important reminders:
- HODs and administrative positions change regularly - advise students to verify current office holders
- Direct students to official UNILAG portals and websites for the most current information
- For urgent matters, recommend contacting the relevant department directly`,
      tools: [{ type: "file_search" }],
      tool_resources: {
        file_search: {
          vector_store_ids: [vectorStore.id]
        }
      }
    });

    console.log(`✅ Assistant updated: ${assistant.id}\n`);

    console.log('🎉 Setup completed successfully!');
    console.log('\n📋 Summary:');
    console.log(`   Assistant ID: ${assistant.id}`);
    console.log(`   Vector Store ID: ${vectorStore.id}`);
    console.log(`   Files: ${fileIds.length} knowledge base files`);
    console.log('\n✨ Your UNILAG assistant is now ready to answer questions!\n');
    console.log('💡 Test it by asking: "Where is the admin block?"\n');

  } catch (error) {
    console.error('❌ Error during update:', error.message);
    if (error.response) {
      console.error('Response:', JSON.stringify(error.response.data, null, 2));
    }
    console.error('\nFull error:', error);
    process.exit(1);
  }
}

updateAssistant();
