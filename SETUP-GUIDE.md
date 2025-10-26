# UNILAG Student Assistant - Setup Guide

## What Has Been Improved

### 1. ✅ Knowledge Base Created
Created comprehensive UNILAG data files in the `knowledge-base/` folder:
- `unilag-general.txt` - General university information
- `departments-and-hods.json` - All faculties and departments
- `campus-facilities.txt` - Campus locations and facilities
- `academic-procedures.txt` - Step-by-step procedures
- `contacts-and-urls.json` - Important links and contacts
- `faq.txt` - Frequently asked questions

### 2. ✅ File Search/Vector Store Script
Created `scripts/setup-assistant.js` to upload knowledge base to OpenAI

### 3. ✅ UI/UX Improvements
- Welcome message on first load
- Better suggested questions (6 UNILAG-specific questions)
- Loading indicator with animated typing dots
- Auto-scroll to bottom on new messages
- Message history persistence (localStorage)
- Clear chat button
- Quick links to Portal and Website
- Error handling for API failures

---

## Setup Instructions

### Step 1: Update Knowledge Base (Optional but Recommended)

Before uploading to OpenAI, update the knowledge base files with accurate information:

1. Open `knowledge-base/departments-and-hods.json`
   - Add current HODs for each department
   - Update Dean names

2. Open `knowledge-base/contacts-and-urls.json`
   - Verify all URLs are correct
   - Add specific phone numbers if available

3. Open `knowledge-base/academic-procedures.txt`
   - Add current fee amounts
   - Update deadlines if you know them

4. Add any additional information to existing files

### Step 2: Upload Knowledge Base to OpenAI

**Option A: Using the Script (Recommended)**

1. Make sure you have Node.js installed
2. Ensure your `.env` file has your OpenAI API key:
   ```
   OPENAI_API_KEY=sk-...
   OPENAI_ASSISTANT_ID=asst_...
   ```

3. Run the setup script:
   ```bash
   node scripts/setup-assistant.js
   ```

4. The script will:
   - Create a vector store
   - Upload all knowledge base files
   - Update your assistant with file_search capability
   - Display success message

**Option B: Manual Upload via OpenAI Dashboard**

1. Go to https://platform.openai.com/assistants
2. Find your assistant (ID: `asst_X7DVRdYmsdMh4NN7PJr2UHZq`)
3. Click "Edit"
4. In the "Tools" section, enable "File Search"
5. Upload all files from the `knowledge-base/` folder
6. Update the instructions with:

```
You are a helpful and knowledgeable assistant for University of Lagos (UNILAG) students. Your role is to provide accurate information about:

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
- For urgent matters, recommend contacting the relevant department directly
```

7. Save the assistant

### Step 3: Test Your Assistant

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Open http://localhost:3000

3. Test with these questions:
   - "Where is the admin block?"
   - "How do I register for courses?"
   - "How do I pay my school fees?"
   - "What are the faculties in UNILAG?"
   - "Where is the library?"
   - "Who is the HOD of Computer Science?"

4. Verify the assistant is using the knowledge base by checking if answers are detailed and UNILAG-specific

---

## New Features

### Welcome Message
- Shows automatically when user first opens the app
- Explains what the assistant can help with

### Suggested Questions
Updated to be more UNILAG-specific:
- "Where is the admin block?"
- "How do I register for courses?"
- "How do I pay my school fees?"
- "What are the faculties in UNILAG?"
- "Where is the library?"
- "How do I check my results?"

### Loading Indicator
- Animated typing dots appear while assistant is generating response
- Input is disabled while loading to prevent duplicate messages

### Auto-Scroll
- Chat automatically scrolls to bottom when new messages arrive
- Smooth scrolling animation

### Message Persistence
- Chat history is saved to browser localStorage
- History persists across page refreshes
- Clear chat button to reset conversation

### Quick Links
- Direct links to UNILAG Portal
- Direct link to UNILAG Website
- Clear Chat button

### Error Handling
- Shows friendly error message if API fails
- Re-enables input after errors

---

## For Your Demo Presentation

### What to Highlight:

1. **Knowledge Base**
   - "The assistant has comprehensive UNILAG-specific information"
   - Show the knowledge-base folder
   - Explain it can be easily updated

2. **AI-Powered**
   - "Uses OpenAI's GPT-4 with file search capability"
   - "Vector store allows semantic search through knowledge base"

3. **User-Friendly**
   - Welcome message guides users
   - Suggested questions for quick access
   - Loading indicators provide feedback
   - Persistent chat history

4. **Accurate Information**
   - Ask specific questions like:
     - "How do I register for courses?" (gets step-by-step procedure)
     - "Where is the Kenneth Dike Library?" (gets location details)
     - "What is the UNILAG portal URL?" (gets exact link)

5. **Easy to Update**
   - Show how easy it is to update knowledge base files
   - Run the setup script to upload changes

### Demo Flow:

1. Open the app - show welcome message
2. Click a suggested question - show quick response
3. Ask a complex question like "How do I pay school fees?" - show detailed answer
4. Show the loading animation
5. Show the knowledge base folder structure
6. Mention it's easy to update and maintain

---

## Troubleshooting

### Assistant Not Giving UNILAG-Specific Answers
- Make sure you ran the setup script: `node scripts/setup-assistant.js`
- Verify file_search tool is enabled on your assistant
- Check the OpenAI dashboard to confirm files are uploaded

### Script Fails to Upload
- Verify `OPENAI_API_KEY` is set in `.env`
- Check your OpenAI account has API access
- Ensure you have credits in your OpenAI account

### Chat Not Saving History
- Check browser allows localStorage
- Try clearing browser cache and reload

### Loading Indicator Stuck
- Check browser console for errors
- Verify API endpoint is working
- Check OpenAI API status

---

## Next Steps (Optional Enhancements)

### For Future Development:

1. **Add More Knowledge**
   - Campus maps (images)
   - Academic calendar (specific dates)
   - Scholarship information
   - Student clubs and organizations

2. **Function Calling**
   - Create functions for specific queries (portal links, HOD lookup)
   - Real-time data integration

3. **Analytics**
   - Track popular questions
   - Show statistics in admin dashboard

4. **Mobile App**
   - Convert to React Native
   - Push notifications for updates

5. **Multi-language Support**
   - Add Yoruba or Pidgin English support

---

## Files Modified/Created

### New Files:
- `knowledge-base/` (entire folder with 6 data files)
- `scripts/setup-assistant.js`
- `SETUP-GUIDE.md` (this file)

### Modified Files:
- `app/components/chat.tsx` (major improvements)
- `app/components/chat.module.css` (new styles)

---

## Support

If you need help:
1. Check the knowledge-base/README.md
2. Review OpenAI Assistants API documentation
3. Check console for error messages

---

**Last Updated**: January 2025

Good luck with your demo! 🎉
