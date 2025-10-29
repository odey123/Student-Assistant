// Simple script to setup a university assistant
// Usage: node scripts/setup-university-simple.js unilorin

require('dotenv').config();
const { default: OpenAI } = require('openai');
const fs = require('fs');
const path = require('path');

const universityId = process.argv[2];

if (!universityId) {
  console.error('❌ Please provide a university ID');
  console.log('Usage: node scripts/setup-university-simple.js <university-id>');
  console.log('Example: node scripts/setup-university-simple.js unilorin');
  process.exit(1);
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function getFullUniversityName(id) {
  const names = {
    'unilag': 'University of Lagos',
    'unilorin': 'University of Ilorin',
    'ui': 'University of Ibadan',
    'oau': 'Obafemi Awolowo University',
    'uniben': 'University of Benin',
    'unn': 'University of Nigeria, Nsukka',
    'futa': 'Federal University of Technology, Akure',
    'covenant': 'Covenant University',
    'babcock': 'Babcock University',
    'abu': 'Ahmadu Bello University',
    'buk': 'Bayero University, Kano',
    'unizik': 'Nnamdi Azikiwe University',
    'uniport': 'University of Port Harcourt',
    'uct': 'University of Cape Town',
    'harvard': 'Harvard University',
    'mit': 'Massachusetts Institute of Technology',
    'oxford': 'University of Oxford'
  };
  return names[id] || id.toUpperCase();
}

async function setupUniversity() {
  console.log(`\n🚀 Setting up ${universityId.toUpperCase()} Assistant...\n`);

  try {
    const knowledgeBasePath = path.join(__dirname, '..', 'knowledge-base', universityId);

    if (!fs.existsSync(knowledgeBasePath)) {
      console.error(`❌ Knowledge base folder not found: ${knowledgeBasePath}`);
      process.exit(1);
    }

    // 1. Create Vector Store
    console.log('📦 Creating vector store...');
    const vectorStore = await openai.vectorStores.create({
      name: `${universityId.toUpperCase()} Knowledge Base`,
    });
    console.log(`✅ Vector Store created: ${vectorStore.id}\n`);

    // 2. Upload all files from knowledge base
    console.log('📤 Uploading knowledge base files...');
    const files = fs.readdirSync(knowledgeBasePath)
      .filter(f => f.endsWith('.txt') || f.endsWith('.json'));

    const fileIds = [];
    for (const filename of files) {
      const filePath = path.join(knowledgeBasePath, filename);
      console.log(`   Uploading: ${filename}...`);

      const fileStream = fs.createReadStream(filePath);
      const file = await openai.files.create({
        file: fileStream,
        purpose: 'assistants',
      });

      fileIds.push(file.id);
      console.log(`   ✅ ${filename} (${file.id})`);
    }

    console.log(`\n✅ Uploaded ${fileIds.length} files\n`);

    // 3. Add files to vector store
    console.log('🔗 Adding files to vector store...');
    await openai.vectorStores.fileBatches.create(vectorStore.id, {
      file_ids: fileIds,
    });
    console.log('✅ Files added to vector store\n');

    // 4. Create Assistant
    console.log('🤖 Creating assistant...');
    const assistant = await openai.beta.assistants.create({
      name: `${universityId.toUpperCase()} Student Assistant`,
      instructions: `You are a helpful and knowledgeable assistant EXCLUSIVELY for ${universityId.toUpperCase()} (${getFullUniversityName(universityId)}) students.

CRITICAL: You can ONLY answer questions about ${universityId.toUpperCase()}. If asked about ANY other university (UNILAG, UNILORIN, UI, etc.), politely tell the user: "I'm the ${universityId.toUpperCase()} Student Assistant and can only provide information about ${universityId.toUpperCase()}. Please use the university selector at the top to switch to the appropriate university assistant."

Your role is to provide accurate information about ${universityId.toUpperCase()}:
- Campus facilities and their locations
- Academic procedures (course registration, fee payment, exams, results)
- Departments, faculties, and administrative information
- Student services and campus life
- Admission processes and requirements
- School fees and payment methods
- Leadership and contacts

Guidelines:
1. Always be friendly, helpful, and professional
2. Use the knowledge base to provide accurate ${universityId.toUpperCase()}-specific information ONLY
3. NEVER answer questions about other universities - redirect them to switch universities
4. If you don't know something about ${universityId.toUpperCase()}, admit it and suggest contacting the relevant department
5. Provide step-by-step guidance for procedures
6. Include relevant portal URLs and contact information when applicable
7. Be concise but comprehensive in your responses
8. Use the file search tool to find information from the knowledge base

Important reminders:
- Leadership positions and fees may change regularly - advise students to verify current information
- Direct students to official ${universityId.toUpperCase()} portals and websites for the most current information
- For urgent matters, recommend contacting the relevant department directly`,
      model: "gpt-4o",
      tools: [{ type: "file_search" }],
      tool_resources: {
        file_search: {
          vector_store_ids: [vectorStore.id]
        }
      }
    });

    console.log(`✅ Assistant created: ${assistant.id}\n`);

    // 5. Show environment variable
    const envVarName = `${universityId.toUpperCase()}_ASSISTANT_ID`;
    console.log('🎉 Setup completed successfully!\n');
    console.log('📋 Summary:');
    console.log(`   Assistant ID: ${assistant.id}`);
    console.log(`   Vector Store ID: ${vectorStore.id}`);
    console.log(`   Files: ${fileIds.length} uploaded\n`);
    console.log('⚠️  Add this to your .env file:');
    console.log(`${envVarName}=${assistant.id}\n`);

  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.response) {
      console.error('Details:', error.response.data);
    }
    process.exit(1);
  }
}

setupUniversity();
