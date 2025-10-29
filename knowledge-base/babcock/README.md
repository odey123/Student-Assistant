# Babcock University Knowledge Base

This folder contains comprehensive information about Babcock University for the AI assistant.

## Files Overview

1. **general-info.txt** - University overview, history, vision, mission, and core values
2. **leadership.txt** - Principal officers, deans, and administrative structure
3. **faculties-and-departments.json** - All schools and departments with programs
4. **campus-facilities.txt** - Campus facilities, locations, and amenities
5. **academic-procedures.txt** - Registration, exams, results, and academic processes
6. **school-fees.txt** - Fee structure, payment options, and financial information
7. **admission-requirements.txt** - JAMB, O'Level, Post-UTME, and other requirements
8. **faq.txt** - Frequently asked questions and answers
9. **contacts.json** - Contact information for all departments and offices

## University Information

- **Name**: Babcock University
- **Short Name**: Babcock / BU
- **Location**: Ilishan-Remo, Ogun State, Nigeria
- **Type**: Private Christian University (Seventh-day Adventist)
- **Founded**: 1999 (as university), 1959 (as ACWA)
- **Website**: https://www.babcock.edu.ng/
- **Motto**: Knowledge, Truth, Service

## Key Characteristics

- Fully residential university (mandatory on-campus living)
- Faith-based education with compulsory religious activities
- Comprehensive fee structure (includes tuition, accommodation, feeding)
- Strong emphasis on character development and discipline
- Own teaching hospital (BUTH)
- One of the first three private universities in Nigeria

## Setup Instructions

To activate the Babcock assistant:

1. Ensure all files in this folder are complete and accurate
2. Run the setup script:
   ```bash
   node scripts/setup-university-simple.js babcock
   ```
3. Copy the assistant ID to your `.env` file:
   ```
   BABCOCK_ASSISTANT_ID=asst_xxxxx
   ```
4. Update `universities.ts` to set `enabled: true` for Babcock
5. Restart your development server

## Maintenance

- Update leadership information annually
- Verify fee structures each academic session
- Keep admission requirements current
- Update contact information as needed
- Review and update FAQs based on common queries

## Notes

- All information is for the 2024/2025 academic session
- Students should verify current information from official sources
- Leadership positions may change - encourage students to confirm
- Fees are subject to annual review and adjustment

Last Updated: 2024/2025 Academic Session
