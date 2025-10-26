# Knowledge Base Template for Universities

This document outlines what information is needed for each university to create a comprehensive student assistant.

## Required Files for Each University

For each university (e.g., `knowledge-base/ui/`, `knowledge-base/unn/`), provide these files:

---

### 1. **general-info.txt**

Basic university information and overview.

```
UNIVERSITY NAME - GENERAL INFORMATION

OFFICIAL NAME:
[Full official name]

ABBREVIATION/SHORT NAME:
[Common abbreviation, e.g., UI, UNN, ABU]

MOTTO:
[University motto in original language and English translation]

FOUNDED:
[Year established]

LOCATION:
- Main Campus: [City, State, Country]
- Other Campuses: [List if any]
- Campus Address: [Physical address]

OWNERSHIP:
[Federal, State, or Private]

ACCREDITATION:
[Accrediting bodies, e.g., NUC for Nigerian universities]

STUDENT POPULATION:
- Undergraduate: [Approximate number]
- Postgraduate: [Approximate number]
- Total: [Total enrollment]

ACADEMIC CALENDAR:
- Academic Session: [e.g., September - July]
- First Semester: [Months]
- Second Semester: [Months]

BRIEF HISTORY:
[2-3 paragraphs about the university's founding, evolution, and major milestones]

VISION:
[University's vision statement]

MISSION:
[University's mission statement]

CORE VALUES:
[List of core values]

RANKINGS & ACHIEVEMENTS:
[Notable rankings, awards, and achievements]

---
```

### 2. **leadership.txt**

Current university administration and leadership.

```
UNIVERSITY LEADERSHIP AND ADMINISTRATION

CHANCELLOR:
- Name: [Full name and titles]
- Role: [Brief description]

PRO-CHANCELLOR:
- Name: [Full name]
- Title: [Chairman of Governing Council, etc.]

VICE-CHANCELLOR:
- Name: [Full name]
- Appointed: [Year/Date]
- Office: [Location on campus]
- Email: [Email address]
- Special Notes: [e.g., First female VC, etc.]

DEPUTY VICE-CHANCELLORS:
1. Academic Affairs:
   - Name: [Full name]
   - Office: [Location]

2. Administration/Management:
   - Name: [Full name]
   - Office: [Location]

3. Development/Research (if applicable):
   - Name: [Full name]
   - Office: [Location]

REGISTRAR:
- Name: [Full name]
- Role: Chief Administrative Officer
- Office: [Location]

BURSAR:
- Name: [Full name]
- Role: Chief Financial Officer
- Office: [Location]

UNIVERSITY LIBRARIAN:
- Name: [Full name]
- Office: [Library name and location]

FACULTY DEANS:
[List all faculties and their deans]

Faculty of [Name]:
- Dean: Professor [Full name]
- Office: [Location]
- Email: [Email]
- Departments: [List all departments]

[Repeat for all faculties]

IMPORTANT NOTES:
- Leadership positions may change regularly
- Students should verify current office holders
- Official website: [URL for leadership page]
```

### 3. **faculties-and-departments.json**

Structured data about all faculties and departments.

```json
{
  "faculties": [
    {
      "name": "Faculty of [Name]",
      "dean": "Professor [Full Name]",
      "email": "faculty@university.edu",
      "office": "[Building name, Campus]",
      "departments": [
        {
          "name": "[Department Name]",
          "hod": "Dr. [Full Name]",
          "email": "dept@university.edu",
          "programs": [
            {
              "degree": "B.Sc.",
              "program": "[Program Name]",
              "duration": "4 years",
              "admission_requirements": "[Brief requirements]"
            }
          ]
        }
      ]
    }
  ]
}
```

### 4. **campus-facilities.txt**

Information about campus facilities and locations.

```
CAMPUS FACILITIES AND LOCATIONS

LIBRARIES:
1. [Main Library Name]:
   - Location: [Where on campus]
   - Opening Hours: [e.g., Monday-Friday 8am-10pm]
   - Services: [List key services]
   - Special Collections: [If any]

2. [Other libraries if any]

STUDENT ACCOMMODATION:
Hostels/Halls of Residence:
1. [Hall Name]:
   - Gender: [Male/Female/Mixed]
   - Capacity: [Number]
   - Location: [Where on campus]
   - Facilities: [What's available]

[List all halls]

Off-Campus Housing:
[Information about off-campus accommodation options]

ADMINISTRATIVE BUILDINGS:
1. Administration Block/Senate Building:
   - Location: [Where]
   - Offices Located Here: [List main offices]

2. Registry:
   - Location: [Where]
   - Services: [What students can do here]

3. Bursary/Accounts:
   - Location: [Where]
   - Services: [Payment, receipts, etc.]

ACADEMIC FACILITIES:
Lecture Halls/Theatres:
[List major lecture halls and their locations]

Laboratories:
[List major lab facilities]

Computer Centers:
[List and describe computer labs]

HEALTH SERVICES:
University Health Center/Clinic:
- Location: [Where]
- Services: [What's offered]
- Hours: [Operating hours]
- Emergency Contact: [Phone number]

SPORTS & RECREATION:
Stadium/Sports Complex:
- Location: [Where]
- Facilities: [Football pitch, basketball court, etc.]

Gymnasium:
- Location: [Where]
- Equipment: [What's available]

STUDENT SERVICES:
1. Student Affairs Office:
   - Location: [Where]
   - Services: [What they handle]

2. Counseling Center:
   - Location: [Where]
   - Services: [Mental health, career counseling, etc.]

3. Career Services:
   - Location: [Where]
   - Services: [Job placement, internships, etc.]

DINING:
Cafeterias/Restaurants:
[List campus eateries and their locations]

BANKING:
Banks on Campus:
[List banks with branches on campus]
ATM Locations:
[List ATM locations]

BOOKSHOPS:
[List bookshops and their locations]

RELIGIOUS CENTERS:
Chapels/Mosques:
[List religious centers on campus]

TRANSPORTATION:
Campus Shuttle Service:
[If available, describe routes and schedule]

Parking:
[Parking locations and policies]

SECURITY:
Campus Security Office:
- Location: [Where]
- Emergency Number: [Phone]
- Security Posts: [Locations of security posts]
```

### 5. **academic-procedures.txt**

Step-by-step guides for common academic processes.

```
ACADEMIC PROCEDURES AND GUIDELINES

ADMISSION PROCESS:

Undergraduate Admission:
1. UTME Requirements:
   - Minimum JAMB score: [Score]
   - O'Level requirements: [Requirements]
   - Subject combinations: [By program]

2. Application Process:
   Step 1: [First step]
   Step 2: [Second step]
   [Continue with all steps]

3. Post-UTME Screening:
   - When: [Timeline]
   - Format: [CBT, Written, etc.]
   - How to register: [Process]

Postgraduate Admission:
[Similar breakdown for Masters and PhD programs]

Direct Entry:
[Requirements and process]

---

COURSE REGISTRATION:

First Year/New Students:
Step 1: [Detailed step]
Step 2: [Detailed step]
[Continue]

Returning Students:
Step 1: [Detailed step]
Step 2: [Detailed step]
[Continue]

Registration Portals:
- Portal URL: [URL]
- Help Desk: [Contact]
- Registration Period: [When it typically opens]

Course Units:
- Minimum units per semester: [Number]
- Maximum units per semester: [Number]

Late Registration:
- Penalty: [Late fee amount]
- Deadline: [When late reg closes]

---

SCHOOL FEES PAYMENT:

Fee Structure:
[List fees by faculty/program]

Payment Methods:
1. Online Payment:
   - Portal: [URL]
   - Accepted Cards: [Visa, Mastercard, etc.]
   - Steps: [Payment process]

2. Bank Payment:
   - Designated Banks: [List banks]
   - Account Details: [Account info]

3. Other Methods: [If any]

Payment Deadlines:
- First Semester: [Deadline]
- Second Semester: [Deadline]

Late Payment Penalty:
[Penalty structure]

---

EXAMINATIONS:

Exam Eligibility:
- Attendance requirement: [e.g., 75% minimum]
- Course registration: [Must be fully registered]
- Fees: [Must have paid fees]

Exam Periods:
- First Semester: [Typical months]
- Second Semester: [Typical months]

Exam Regulations:
[List key exam rules and conduct]

---

RESULTS:

Checking Results:
- Portal: [URL]
- When results are released: [Timeline]
- Login credentials: [What's needed]

Result Computation:
- Grading System: [A=5.0, B=4.0, etc.]
- CGPA Calculation: [How it's calculated]

Grade Appeal:
[Process for appealing grades]

Transcripts:
How to request official transcripts:
[Step-by-step process]

---

GRADUATION REQUIREMENTS:

Minimum CGPA:
- Pass: [e.g., 1.50]
- Third Class: [e.g., 2.00-2.39]
- Second Class Lower: [e.g., 2.40-2.99]
- Second Class Upper: [e.g., 3.00-3.99]
- First Class: [e.g., 4.00-5.00]

Clearance Process:
[Steps for graduation clearance]

Convocation:
- When: [Typical time of year]
- Gown Collection: [Process]
```

### 6. **school-fees.txt**

Detailed breakdown of fees.

```
SCHOOL FEES STRUCTURE

UNDERGRADUATE FEES (by Faculty):

Faculty of [Name]:
New Students (Year 1):
- Acceptance Fee: ₦[Amount]
- Tuition: ₦[Amount]
- Laboratory/Practical: ₦[Amount]
- Library: ₦[Amount]
- ICT: ₦[Amount]
- Medical: ₦[Amount]
- Sports: ₦[Amount]
- Student Union: ₦[Amount]
- Development Levy: ₦[Amount]
- ID Card: ₦[Amount]
- Matriculation Gown: ₦[Amount]
- Total: ₦[Total Amount]

Returning Students (Years 2-5):
[Similar breakdown]

[Repeat for all faculties]

POSTGRADUATE FEES:
[Fee structure for Masters, PhD programs]

PROFESSIONAL PROGRAMS:
[Medicine, Law, etc. if applicable]

ADDITIONAL FEES:
- Hostel Accommodation: ₦[Amount] per session
- Late Registration: ₦[Amount]
- Change of Course: ₦[Amount]
- Loss of ID Card: ₦[Amount]
- Loss of Matriculation Gown: ₦[Amount]

PAYMENT INFORMATION:
- Fees are per academic session
- Payment deadlines: [Dates]
- Refund policy: [If applicable]
```

### 7. **admission-requirements.txt**

Detailed admission requirements.

```
ADMISSION REQUIREMENTS

UTME REQUIREMENTS (by Program):

[Program Name]:
- JAMB Subject Combination: [Subjects]
- Minimum JAMB Score: [Score]
- O'Level Requirements:
  - Minimum of 5 credits including [subjects]
  - At most 2 sittings
- Special Requirements: [If any]

[Repeat for all major programs]

DIRECT ENTRY:
[Requirements by program]

POSTGRADUATE:
[Requirements by program level]

INTERNATIONAL STUDENTS:
[Special requirements for international applicants]

CUT-OFF MARKS:
[Recent cut-off marks by program]
```

### 8. **faq.txt**

Common questions and answers.

```
FREQUENTLY ASKED QUESTIONS

GENERAL:
Q: What is the academic calendar?
A: [Answer]

Q: How do I contact the university?
A: [Answer with contact details]

ADMISSION:
Q: When does admission open?
A: [Answer]

Q: What is the minimum JAMB score?
A: [Answer]

[Add 20-30 more common questions]
```

### 9. **contacts.json**

Important contact information.

```json
{
  "general": {
    "main_phone": "+234...",
    "email": "info@university.edu",
    "website": "https://university.edu"
  },
  "admissions": {
    "phone": "+234...",
    "email": "admissions@university.edu",
    "portal": "https://admissions.university.edu"
  },
  "registry": {
    "phone": "+234...",
    "email": "registry@university.edu"
  },
  "bursary": {
    "phone": "+234...",
    "email": "bursary@university.edu"
  },
  "student_affairs": {
    "phone": "+234...",
    "email": "studentaffairs@university.edu"
  },
  "emergencies": {
    "security": "+234...",
    "health_center": "+234...",
    "ambulance": "+234..."
  },
  "portals": {
    "student_portal": "https://portal.university.edu",
    "elearning": "https://elearning.university.edu",
    "library": "https://library.university.edu"
  }
}
```

---

## Summary Checklist

For each university, provide:
- [ ] general-info.txt
- [ ] leadership.txt
- [ ] faculties-and-departments.json
- [ ] campus-facilities.txt
- [ ] academic-procedures.txt
- [ ] school-fees.txt
- [ ] admission-requirements.txt
- [ ] faq.txt
- [ ] contacts.json
- [ ] University logo (PNG format, transparent background preferred)

## Notes:
- All information should be current (2024/2025 academic session)
- Include sources/references where possible
- Mark any placeholder data clearly with [TO BE UPDATED]
- International universities may have different structures - adapt as needed
