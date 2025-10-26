# Manual Setup Guide - Enable File Search

The files are already uploaded to OpenAI! Now you just need to attach them to your assistant.

## ✅ Files Uploaded:
- `file-W35ynT9Zndrdadt7Pkb3so` - unilag-general.txt
- `file-Pp7HgmMZhTXeFqYhcs4cC5` - departments-and-hods.json
- `file-P996CjcyU8xxR7ZJAcULZ2` - campus-facilities.txt
- `file-Pyr2Wu6kJHyHUHXP245fws` - academic-procedures.txt
- `file-34qgTvEWXHTSAE1nQDbPaE` - contacts-and-urls.json
- `file-276n2GFTCB7VkzRf1HUXom` - faq.txt

---

## 🔧 Steps to Enable File Search (5 minutes):

### 1. Go to OpenAI Platform
Open: **https://platform.openai.com/assistants**

### 2. Find Your Assistant
- Look for assistant ID: `asst_X7DVRdYmsdMh4NN7PJr2UHZq`
- OR search for "UNILAG" if you renamed it
- Click to open it

### 3. Enable File Search Tool
- Scroll to the **"Tools"** section
- Click the **"+ Add"** button or checkbox
- Enable **"File Search"**
- Save/confirm

### 4. Add Files to Assistant
- Look for **"Files"** or **"Knowledge"** section
- Click **"Add files"** or **"Attach files"**
- You should see your uploaded files listed
- Select all 6 files:
  - unilag-general.txt
  - departments-and-hods.json
  - campus-facilities.txt
  - academic-procedures.txt
  - contacts-and-urls.json
  - faq.txt
- Click **"Attach"** or **"Save"**

### 5. Update Instructions (Optional but Recommended)
In the **"Instructions"** field, paste this:

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

### 6. Save Changes
- Click **"Save"** or **"Update Assistant"**
- Wait for confirmation

---

## ✅ Test Your Assistant

1. Go back to your app: **http://localhost:3000**
2. Refresh the page
3. Ask: **"Where is the admin block?"**

### Expected Answer:
Should now give a detailed response like:
> "The main administrative block at UNILAG is the Senate Building, located in the central area of the Akoka main campus. It houses the Vice Chancellor's office, Registrar's office, and Bursary department..."

---

## 🎯 Alternative: Use Playground to Test First

1. Go to **https://platform.openai.com/playground**
2. Select your assistant (asst_X7DVRdYmsdMh4NN7PJr2UHZq)
3. Ask: "Where is the admin block?"
4. If it works there, it will work in your app!

---

## 🔍 Troubleshooting

### Files not showing?
- Go to **https://platform.openai.com/storage/files**
- Verify the 6 files are listed
- Check they have purpose: "assistants"

### File search not working?
- Make sure "File Search" tool is enabled (checked)
- Verify files are attached to the assistant
- Try creating a new thread in your app

### Still generic answers?
- Clear your browser cache
- Create a new conversation (click "Clear Chat")
- Restart your development server

---

## 📝 Quick Checklist

- [ ] Open OpenAI Assistants page
- [ ] Find your assistant (asst_X7DVRdYmsdMh4NN7PJr2UHZq)
- [ ] Enable "File Search" tool
- [ ] Attach all 6 knowledge base files
- [ ] Update instructions (optional)
- [ ] Save changes
- [ ] Test in your app

---

## 🎉 Done!

Once you complete these steps, your assistant will:
- ✅ Answer UNILAG-specific questions accurately
- ✅ Provide detailed facility locations
- ✅ Give step-by-step procedures
- ✅ Include portal URLs and contacts

**Total time**: 5 minutes
**Difficulty**: Easy (just point and click)

---

Need help? The interface is very intuitive - just look for "Tools", "Files", or "Knowledge" sections in your assistant settings.

Good luck! 🚀
