// Simple script to upload knowledge base files to your OpenAI Assistant
// Run this with: node scripts/upload-files-simple.js

require('dotenv').config();
const OpenAI = require('openai');
const fs = require('fs');
const path = require('path');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function uploadFiles() {
  console.log('🚀 Starting UNILAG Knowledge Base Upload...\n');

  try {
    const assistantId = process.env.OPENAI_ASSISTANT_ID;

    if (!assistantId) {
      console.error('❌ OPENAI_ASSISTANT_ID not found in .env file');
      process.exit(1);
    }

    // 1. Upload files
    const knowledgeBasePath = path.join(__dirname, '..', 'knowledge-base');
    const files = [
      'unilag-general.txt',
      'departments-and-hods.json',
      'campus-facilities.txt',
      'academic-procedures.txt',
      'contacts-and-urls.json',
      'faq.txt'
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

      try {
        const file = await openai.files.create({
          file: fs.createReadStream(filePath),
          purpose: 'assistants',
        });

        fileIds.push(file.id);
        console.log(`   ✅ Uploaded: ${filename} (${file.id})`);
      } catch (err) {
        console.log(`   ❌ Failed to upload ${filename}: ${err.message}`);
      }
    }

    console.log(`\n✅ Uploaded ${fileIds.length} files successfully!\n`);

    // 2. Update assistant with file_search tool and uploaded files
    console.log('🔧 Updating assistant configuration...');

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
          file_ids: fileIds
        }
      }
    });

    console.log(`✅ Assistant updated: ${assistant.id}\n`);

    console.log('🎉 Setup completed successfully!');
    console.log('\n📋 Summary:');
    console.log(`   Assistant ID: ${assistant.id}`);
    console.log(`   Files uploaded: ${fileIds.length}`);
    console.log(`   File IDs: ${fileIds.join(', ')}`);
    console.log('\n✨ Your UNILAG assistant is now ready to answer questions!\n');
    console.log('💡 Test it by asking: "Where is the admin block?"\n');

  } catch (error) {
    console.error('❌ Error during setup:', error.message);
    if (error.response) {
      console.error('Response:', JSON.stringify(error.response.data, null, 2));
    }
    console.error('\nFull error:', error);
    process.exit(1);
  }
}

uploadFiles();
