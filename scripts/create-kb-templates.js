#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

const universities = {
  'lautech': {
    name: 'Ladoke Akintola University of Technology',
    shortName: 'LAUTECH',
    location: 'Ogbomoso, Oyo State, Nigeria',
    website: 'https://lautech.edu.ng',
    type: 'State University',
    founded: '1990'
  },
  'stanford': {
    name: 'Stanford University',
    shortName: 'Stanford',
    location: 'Stanford, California, United States',
    website: 'https://stanford.edu',
    type: 'Private Research University',
    founded: '1885'
  },
  'cambridge': {
    name: 'University of Cambridge',
    shortName: 'Cambridge',
    location: 'Cambridge, England, United Kingdom',
    website: 'https://cam.ac.uk',
    type: 'Public Research University',
    founded: '1209'
  },
  'futo': {
    name: 'Federal University of Technology, Owerri',
    shortName: 'FUTO',
    location: 'Owerri, Imo State, Nigeria',
    website: 'https://futo.edu.ng',
    type: 'Federal University',
    founded: '1980'
  },
  'berkeley': {
    name: 'University of California, Berkeley',
    shortName: 'UC Berkeley',
    location: 'Berkeley, California, United States',
    website: 'https://berkeley.edu',
    type: 'Public Research University',
    founded: '1868'
  },
  'imperial': {
    name: 'Imperial College London',
    shortName: 'Imperial',
    location: 'London, United Kingdom',
    website: 'https://imperial.ac.uk',
    type: 'Public Research University',
    founded: '1907'
  },
  'yale': {
    name: 'Yale University',
    shortName: 'Yale',
    location: 'New Haven, Connecticut, United States',
    website: 'https://yale.edu',
    type: 'Private Research University',
    founded: '1701'
  },
  'unimaid': {
    name: 'University of Maiduguri',
    shortName: 'UNIMAID',
    location: 'Maiduguri, Borno State, Nigeria',
    website: 'https://unimaid.edu.ng',
    type: 'Federal University',
    founded: '1975'
  }
};

const repoRoot = process.cwd();
const kbRoot = path.join(repoRoot, 'knowledge-base');

for (const [uniId, info] of Object.entries(universities)) {
  const uniDir = path.join(kbRoot, uniId);

  // Create directory if it doesn't exist
  if (!fs.existsSync(uniDir)) {
    fs.mkdirSync(uniDir, { recursive: true });
  }

  // General Info
  const generalInfo = `${info.name} (${info.shortName})

${info.name} is located in ${info.location}. The university was established in ${info.founded} and has grown to become a leading institution of higher learning.

Location: ${info.location}
Type: ${info.type}
Founded: ${info.founded}
Website: ${info.website}

Vision:
To be a world-class institution of higher learning, research, and innovation.

Mission:
To provide quality education, conduct cutting-edge research, and produce graduates who are leaders and innovators in their fields.

Note: This is a template file. Please update with accurate, current information about ${info.shortName}.
`;

  // FAQ
  const faq = `Frequently Asked Questions - ${info.name}

Q: What programs does ${info.shortName} offer?
A: ${info.shortName} offers a wide range of undergraduate and postgraduate programs across various disciplines. Please visit the official website for a complete list of programs.

Q: How do I apply for admission?
A: Application procedures vary by program level and country. Please check the university's official website or contact the admissions office for detailed information.

Q: Where is ${info.shortName} located?
A: ${info.shortName} is located in ${info.location}.

Q: Does ${info.shortName} offer scholarships?
A: Yes, ${info.shortName} offers various scholarship opportunities for qualified students. Please check the university website for eligibility criteria and application procedures.

Q: Is accommodation available on campus?
A: Campus accommodation availability varies. Please contact the university's housing or student services office for current information.

Note: This is a template file. Please update with accurate, current FAQ information for ${info.shortName}.
`;

  // Academic Procedures
  const academicProcedures = `Academic Procedures - ${info.name}

Registration:
Students are required to register for courses at the beginning of each semester/term. Registration is done through the university's online portal or in-person at designated registration centers.

Course Add/Drop:
Students may add or drop courses within the first two weeks of the semester. Changes must be approved by academic advisors.

Examinations:
Examinations are held at the end of each semester. Students must maintain the required attendance to be eligible to write examinations.

Grading System:
The university uses a standard grading system. Please refer to the student handbook for detailed grading criteria.

Academic Calendar:
The academic year is divided into semesters/terms. Check the university website for the current academic calendar.

Note: This is a template file. Please update with accurate, current academic procedures for ${info.shortName}.
`;

  // Admission Requirements
  const admissionReqs = `Admission Requirements - ${info.name}

Undergraduate Programs:
- Meet minimum entry requirements for your country/region
- Satisfactory performance on standardized tests (where applicable)
- Completed application form
- Official transcripts from previous institutions
- Letters of recommendation (where required)
- Personal statement/essay (where required)

Postgraduate Programs:
- Bachelor's degree from a recognized institution
- Minimum GPA requirements (varies by program)
- Standardized test scores (GRE, GMAT, where applicable)
- Letters of recommendation
- Statement of purpose
- Research proposal (for research-based programs)

International Students:
- English language proficiency test (TOEFL, IELTS, where required)
- Valid passport
- Financial documentation
- Visa requirements

Application Process:
1. Complete online application form
2. Submit required documents
3. Pay application fee
4. Await admission decision

Note: This is a template file. Please update with accurate, current admission requirements for ${info.shortName}.
`;

  // School Fees
  const schoolFees = `School Fees - ${info.name}

Tuition fees at ${info.shortName} vary by program, level of study, and student status (domestic/international).

General Fee Structure:
- Tuition fees vary by program
- Additional fees may include: registration, library, laboratory, student activities, health services
- Payment plans may be available

Payment Methods:
- Online payment portal
- Bank transfer
- Other accepted payment methods (check university website)

Payment Deadlines:
- Fees must be paid before the start of each semester/term
- Late payment may incur additional charges

Financial Aid:
- Scholarships and grants available for qualified students
- Work-study programs (where applicable)
- Student loans (where applicable)

For current and detailed fee information, please visit the university's official website or contact the bursary/finance office.

Note: This is a template file. Please update with accurate, current fee information for ${info.shortName}.
`;

  // Leadership
  const leadership = `Leadership - ${info.name}

University Administration:

Vice-Chancellor / President:
[Name and title to be updated]

Deputy Vice-Chancellor / Provost:
[Name and title to be updated]

Registrar:
[Name and title to be updated]

Bursar:
[Name and title to be updated]

Librarian:
[Name and title to be updated]

Faculty Deans:
[List of deans to be updated]

Note: This is a template file. Please update with accurate, current leadership information for ${info.shortName}.
`;

  // Campus Facilities
  const campusFacilities = `Campus Facilities - ${info.name}

${info.shortName} provides modern facilities to support academic excellence and student life.

Academic Facilities:
- Lecture halls and classrooms equipped with modern teaching aids
- Specialized laboratories for sciences and engineering
- Computer labs with internet access
- Research centers and institutes

Library:
- Extensive collection of books, journals, and digital resources
- Study spaces and reading rooms
- Online database access

Student Facilities:
- Student housing/hostels
- Cafeterias and dining halls
- Student union building
- Health center/clinic
- Sports and recreation facilities
- Bookshop

Other Amenities:
- Banking services
- Postal services
- Transportation services
- Security services

Note: This is a template file. Please update with accurate, current facility information for ${info.shortName}.
`;

  // Write files
  const files = {
    'general-info.txt': generalInfo,
    'faq.txt': faq,
    'academic-procedures.txt': academicProcedures,
    'admission-requirements.txt': admissionReqs,
    'school-fees.txt': schoolFees,
    'leadership.txt': leadership,
    'campus-facilities.txt': campusFacilities
  };

  for (const [filename, content] of Object.entries(files)) {
    const filePath = path.join(uniDir, filename);
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, content, 'utf-8');
      console.log(`✓ Created ${uniId}/${filename}`);
    } else {
      console.log(`- Skipped ${uniId}/${filename} (already exists)`);
    }
  }
}

console.log('\n✅ Template knowledge base files created successfully!');
console.log('📝 Please update these files with accurate, current information for each university.');
