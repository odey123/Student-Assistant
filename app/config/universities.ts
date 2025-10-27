// Configuration for all supported universities

export interface University {
  id: string;
  name: string;
  shortName: string;
  country: string;
  state?: string;
  logo: string;
  website: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  assistantId?: string; // Will be populated after running setup script
  vectorStoreId?: string;
  enabled: boolean; // Set to false until knowledge base is ready
}

export const universities: University[] = [
  // NIGERIAN UNIVERSITIES
  {
    id: 'unilag',
    name: 'University of Lagos',
    shortName: 'UNILAG',
    country: 'Nigeria',
    state: 'Lagos',
    logo: 'https://res.cloudinary.com/ddjnrebkn/image/upload/v1752887117/all%20folder/png-transparent-university-of-lagos-university-of-ibadan-federal-university-of-technology-owerri-university-of-ilorin-student-text-people-logo_bfxgwb.png',
    website: 'https://unilag.edu.ng',
    colors: {
      primary: '#003366',      // Navy Blue (UNILAG's distinctive blue)
      secondary: '#FFD700',    // Gold
      accent: '#FFFFFF'        // White
    },
    assistantId: process.env.UNILAG_ASSISTANT_ID,
    enabled: true
  },
  {
    id: 'ui',
    name: 'University of Ibadan',
    shortName: 'UI',
    country: 'Nigeria',
    state: 'Oyo',
    logo: '/logos/ui.jpg',
    website: 'https://ui.edu.ng',
    colors: {
      primary: '#800020',      // Burgundy/Wine (UI's distinctive maroon)
      secondary: '#FFFFFF',    // White
      accent: '#DAA520'        // Goldenrod
    },
    assistantId: process.env.UI_ASSISTANT_ID,
    enabled: true
  },
  {
    id: 'unn',
    name: 'University of Nigeria, Nsukka',
    shortName: 'UNN',
    country: 'Nigeria',
    state: 'Enugu',
    logo: '/logos/unn.png',
    website: 'https://unn.edu.ng',
    colors: {
      primary: '#0A5C0A',      // Deep Green (UNN's distinctive green, different from FUTA #228B22)
      secondary: '#FFFFFF',    // White
      accent: '#FFD700'        // Gold
    },
    assistantId: process.env.UNN_ASSISTANT_ID,
    enabled: true
  },
  {
    id: 'abu',
    name: 'Ahmadu Bello University',
    shortName: 'ABU',
    country: 'Nigeria',
    state: 'Kaduna',
    logo: '/logos/abu.png',
    website: 'https://abu.edu.ng',
    colors: {
      primary: '#00563F',
      secondary: '#FFFFFF',
      accent: '#FFD700'
    },
    enabled: false
  },
  {
    id: 'oau',
    name: 'Obafemi Awolowo University',
    shortName: 'OAU',
    country: 'Nigeria',
    state: 'Osun',
    logo: '/logos/oau.jpg',
    website: 'https://oauife.edu.ng',
    colors: {
      primary: '#1434A4',      // Royal Blue (OAU's distinctive blue)
      secondary: '#FFFFFF',    // White
      accent: '#FFD700'        // Gold
    },
    assistantId: process.env.OAU_ASSISTANT_ID,
    enabled: true
  },
  {
    id: 'uniben',
    name: 'University of Benin',
    shortName: 'UNIBEN',
    country: 'Nigeria',
    state: 'Edo',
    logo: '/logos/uniben.png',
    website: 'https://uniben.edu',
    colors: {
      primary: '#DC143C',      // Crimson Red (UNIBEN's distinctive red)
      secondary: '#FFFFFF',    // White
      accent: '#000080'        // Navy Blue
    },
    assistantId: process.env.UNIBEN_ASSISTANT_ID,
    enabled: true
  },
  {
    id: 'uniport',
    name: 'University of Port Harcourt',
    shortName: 'UNIPORT',
    country: 'Nigeria',
    state: 'Rivers',
    logo: '/logos/uniport.png',
    website: 'https://uniport.edu.ng',
    colors: {
      primary: '#003366',
      secondary: '#FFFFFF',
      accent: '#006400'
    },
    enabled: false
  },
  {
    id: 'unilorin',
    name: 'University of Ilorin',
    shortName: 'UNILORIN',
    country: 'Nigeria',
    state: 'Kwara',
    logo: '/logos/unilorin.jpg',
    website: 'https://unilorin.edu.ng',
    colors: {
      primary: '#4B0082',      // Purple from logo
      secondary: '#FFD700',     // Gold from logo
      accent: '#228B22'         // Green from logo
    },
    assistantId: process.env.UNILORIN_ASSISTANT_ID,
    enabled: true
  },
  {
    id: 'futa',
    name: 'Federal University of Technology, Akure',
    shortName: 'FUTA',
    country: 'Nigeria',
    state: 'Ondo',
    logo: '/logos/futa.jpg',
    website: 'https://futa.edu.ng',
    colors: {
      primary: '#228B22',      // Forest Green (FUTA's distinctive green)
      secondary: '#FFD700',    // Gold
      accent: '#FFFFFF'        // White
    },
    assistantId: process.env.FUTA_ASSISTANT_ID,
    enabled: true
  },
  {
    id: 'lautech',
    name: 'Ladoke Akintola University of Technology',
    shortName: 'LAUTECH',
    country: 'Nigeria',
    state: 'Oyo',
    logo: '/logos/lautech.png',
    website: 'https://lautech.edu.ng',
    colors: {
      primary: '#8B0000',
      secondary: '#FFD700',
      accent: '#000000'
    },
    enabled: false
  },
  {
    id: 'uniabuja',
    name: 'University of Abuja',
    shortName: 'UNIABUJA',
    country: 'Nigeria',
    state: 'FCT',
    logo: '/logos/uniabuja.png',
    website: 'https://uniabuja.edu.ng',
    colors: {
      primary: '#006400',
      secondary: '#FFFFFF',
      accent: '#FFD700'
    },
    enabled: false
  },
  {
    id: 'unijos',
    name: 'University of Jos',
    shortName: 'UNIJOS',
    country: 'Nigeria',
    state: 'Plateau',
    logo: '/logos/unijos.png',
    website: 'https://unijos.edu.ng',
    colors: {
      primary: '#00008B',
      secondary: '#FFFFFF',
      accent: '#FFD700'
    },
    enabled: false
  },
  {
    id: 'uniuyo',
    name: 'University of Uyo',
    shortName: 'UNIUYO',
    country: 'Nigeria',
    state: 'Akwa Ibom',
    logo: '/logos/uniuyo.png',
    website: 'https://uniuyo.edu.ng',
    colors: {
      primary: '#8B0000',
      secondary: '#FFFFFF',
      accent: '#006400'
    },
    enabled: false
  },
  {
    id: 'unical',
    name: 'University of Calabar',
    shortName: 'UNICAL',
    country: 'Nigeria',
    state: 'Cross River',
    logo: '/logos/unical.png',
    website: 'https://unical.edu.ng',
    colors: {
      primary: '#00563F',
      secondary: '#FFFFFF',
      accent: '#FFD700'
    },
    enabled: false
  },
  {
    id: 'covenant',
    name: 'Covenant University',
    shortName: 'CU',
    country: 'Nigeria',
    state: 'Ogun',
    logo: '/logos/covenant.png',
    website: 'https://covenantuniversity.edu.ng',
    colors: {
      primary: '#6A1B9A',      // Deep Purple (Covenant's distinctive purple, different from UNILORIN)
      secondary: '#FFD700',    // Gold
      accent: '#FFFFFF'        // White
    },
    assistantId: process.env.COVENANT_ASSISTANT_ID,
    enabled: true
  },

  // INTERNATIONAL UNIVERSITIES
  {
    id: 'oxford',
    name: 'University of Oxford',
    shortName: 'Oxford',
    country: 'United Kingdom',
    logo: '/logos/oxford.png',
    website: 'https://ox.ac.uk',
    colors: {
      primary: '#002147',      // Oxford Blue (distinctive dark blue)
      secondary: '#FFFFFF',    // White
      accent: '#C5004A'        // Oxford Magenta
    },
    assistantId: process.env.OXFORD_ASSISTANT_ID,
    enabled: true
  },
  {
    id: 'cambridge',
    name: 'University of Cambridge',
    shortName: 'Cambridge',
    country: 'United Kingdom',
    logo: '/logos/cambridge.png',
    website: 'https://cam.ac.uk',
    colors: {
      primary: '#A3C1AD',
      secondary: '#000000',
      accent: '#FFFFFF'
    },
    enabled: false
  },
  {
    id: 'harvard',
    name: 'Harvard University',
    shortName: 'Harvard',
    country: 'United States',
    logo: '/logos/harvard.png',
    website: 'https://harvard.edu',
    colors: {
      primary: '#A51C30',      // Harvard Crimson (distinctive, different from other reds)
      secondary: '#FFFFFF',    // White
      accent: '#000000'        // Black
    },
    assistantId: process.env.HARVARD_ASSISTANT_ID,
    enabled: true
  },
  {
    id: 'mit',
    name: 'Massachusetts Institute of Technology',
    shortName: 'MIT',
    country: 'United States',
    logo: '/logos/mit.png',
    website: 'https://mit.edu',
    colors: {
      primary: '#A31F34',      // MIT Cardinal Red (distinctive from Harvard #A51C30)
      secondary: '#8A8B8C',    // MIT Gray
      accent: '#000000'        // Black
    },
    assistantId: process.env.MIT_ASSISTANT_ID,
    enabled: true
  },
  {
    id: 'stanford',
    name: 'Stanford University',
    shortName: 'Stanford',
    country: 'United States',
    logo: '/logos/stanford.png',
    website: 'https://stanford.edu',
    colors: {
      primary: '#8C1515',
      secondary: '#FFFFFF',
      accent: '#000000'
    },
    enabled: false
  },
  {
    id: 'toronto',
    name: 'University of Toronto',
    shortName: 'U of T',
    country: 'Canada',
    logo: '/logos/toronto.png',
    website: 'https://utoronto.ca',
    colors: {
      primary: '#00204E',
      secondary: '#002A5C',
      accent: '#FFFFFF'
    },
    enabled: false
  }
];

// Helper functions
export const getUniversityById = (id: string): University | undefined => {
  return universities.find(u => u.id === id);
};

export const getEnabledUniversities = (): University[] => {
  return universities.filter(u => u.enabled);
};

export const getUniversitiesByCountry = (country: string): University[] => {
  return universities.filter(u => u.country === country);
};
