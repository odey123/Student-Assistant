# UNILAG Knowledge Base

This folder contains comprehensive information about the University of Lagos (UNILAG) to power the AI assistant.

## Files Overview:

### 1. `unilag-general.txt`
General information about UNILAG including:
- History and establishment
- Vision and mission
- List of faculties
- Campus facilities overview
- Student population and motto

### 2. `departments-and-hods.json`
Structured data containing:
- All faculties and their departments
- Department names
- HOD placeholders (to be updated with current information)

### 3. `campus-facilities.txt`
Detailed information about campus locations:
- Administrative buildings (Senate building, etc.)
- Academic buildings and lecture theatres
- Library (Kenneth Dike Library)
- Health facilities
- Halls of residence
- Sports facilities
- Dining facilities
- Banking services
- Bookshops and ICT centers
- Transport and main gates

### 4. `academic-procedures.txt`
Step-by-step procedures for:
- Course registration process
- School fees payment
- Examination procedures
- Result checking
- Clearance procedures
- Academic advising
- Deferred exams
- Carryover courses

### 5. `contacts-and-urls.json`
Important links and contact information:
- Official websites and portals
- Student portal URL
- Social media handles
- Emergency contacts
- Administrative contacts
- Email addresses and phone numbers

### 6. `faq.txt`
Frequently asked questions covering:
- General UNILAG information
- Admission questions
- Portal and registration
- Fees and payment
- Campus life
- Academic issues
- Facilities and services
- Transportation
- Graduation

## How to Update:

### Update Current Information:
1. **HODs and Deans**: Edit `departments-and-hods.json` with current office holders
2. **Contact Numbers**: Update `contacts-and-urls.json` with verified phone numbers
3. **Fee Amounts**: Add specific fee information to `academic-procedures.txt`
4. **New Facilities**: Add any new campus buildings to `campus-facilities.txt`

### Adding New Content:
- Create new `.txt` or `.json` files in this folder
- Run the setup script again to upload to OpenAI

## Upload Instructions:

After updating the knowledge base:

1. Ensure you have Node.js installed
2. Set your OpenAI API key in `.env` file
3. Run the upload script:
   ```bash
   node scripts/setup-assistant.js
   ```

This will:
- Create a vector store
- Upload all knowledge base files
- Configure your assistant with file search capability

## Important Notes:

- **Accuracy**: Always verify information before adding it to the knowledge base
- **Updates**: HODs and administrative positions change regularly - update periodically
- **Sources**: Get information from official UNILAG sources
- **Format**: Keep plain text files readable with clear headings
- **Size**: Each file should be under 512MB (current files are tiny)

## Need Help?

If you need to add more specific information:
1. Visit the official UNILAG website: https://unilag.edu.ng
2. Contact relevant departments for verified information
3. Check faculty notice boards for current announcements

---

**Last Updated**: January 2025
**Maintainer**: Update this with your name/team
