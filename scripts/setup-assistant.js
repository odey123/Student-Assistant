// Script to upload knowledge base files to OpenAI Assistant and configure vector store
// Run this with: node scripts/setup-assistant.js

require('dotenv').config();
const { default: OpenAI } = require('openai');
const fs = require('fs');
const path = require('path');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function uploadKnowledgeBase() {
  console.log('🚀 Starting UNILAG Knowledge Base Upload...\n');

  try {
    // 1. Create a Vector Store
    console.log('📦 Creating vector store...');
    const vectorStore = await openai.vectorStores.create({
      name: "UNILAG Knowledge Base",
    });
    console.log(`✅ Vector Store created: ${vectorStore.id}\n`);

    // 2. Upload files
    const knowledgeBasePath = path.join(__dirname, '..', 'knowledge-base');
    const files = [
      'unilag-general.txt',
      'departments-and-hods.json',
      'campus-facilities.txt',
      'academic-procedures.txt',
      'contacts-and-urls.json',
      'faq.txt',
      'unilag-leadership.txt',
      'unilag-school-fees.txt',
      'unilag-cutoff-marks.txt',
      'CITS.txt'
    ];

    console.log('📤 Uploading knowledge base files...');
    const fileIds = [];

    for (const filename of files) {
      const filePath = path.join(knowledgeBasePath, filename);

      if (!fs.existsSync(filePath)) {
        console.log(`⚠️  Skipping ${filename} - file not found`);
        continue;
      }

      console.log(`   Uploading: ${filename}...`);
      const fileStream = fs.createReadStream(filePath);

      const file = await openai.files.create({
        file: fileStream,
        purpose: 'assistants',
      });

      fileIds.push(file.id);
      console.log(`   ✅ Uploaded: ${filename} (${file.id})`);
    }

    console.log(`\n✅ All files uploaded successfully!\n`);

    // 3. Add files to vector store
    console.log('🔗 Adding files to vector store...');
    await openai.vectorStores.fileBatches.create(vectorStore.id, {
      file_ids: fileIds,
    });
    console.log('✅ Files added to vector store\n');

    // 4. Update or create assistant
    const assistantId = process.env.OPENAI_ASSISTANT_ID;

    if (assistantId) {
      console.log('🔧 Updating existing assistant...');
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
        model: "gpt-4-turbo-preview",
        tools: [
          { type: "file_search" }
        ],
        tool_resources: {
          file_search: {
            vector_store_ids: [vectorStore.id]
          }
        }
      });
      console.log(`✅ Assistant updated: ${assistant.id}\n`);
    } else {
      console.log('🆕 Creating new assistant...');
      const assistant = await openai.beta.assistants.create({
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
        model: "gpt-4-turbo-preview",
        tools: [
          { type: "file_search" }
        ],
        tool_resources: {
          file_search: {
            vector_store_ids: [vectorStore.id]
          }
        }
      });
      console.log(`✅ New assistant created: ${assistant.id}`);
      console.log(`\n⚠️  Add this to your .env file:`);
      console.log(`OPENAI_ASSISTANT_ID=${assistant.id}\n`);
    }

    console.log('🎉 Setup completed successfully!');
    console.log('\n📋 Summary:');
    console.log(`   Vector Store ID: ${vectorStore.id}`);
    console.log(`   Files uploaded: ${fileIds.length}`);
    console.log(`   Assistant configured with file_search tool`);
    console.log('\n✨ Your UNILAG assistant is now ready to answer questions!\n');

  } catch (error) {
    console.error('❌ Error during setup:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
    process.exit(1);
  }
}

uploadKnowledgeBase();
