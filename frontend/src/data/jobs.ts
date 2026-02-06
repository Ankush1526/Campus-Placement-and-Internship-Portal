export interface Job {
  id: number;
  company: string;
  position: string;
  location: string;
  experience: 'fresher' | 'junior' | 'mid' | 'all' | string;
  salary: string;
  type: string;
  category: string;
  deadline: string;
  featured: boolean;
  postedBy: string;
  description: string;
  requirements: string[];
  benefits: string[];
  skills: string[];
}

export const jobs: Job[] = [
  {
    id: 1,
    company: "TechGlobal Inc.",
    position: "Full Stack Developer",
    location: "Bangalore",
    experience: "fresher",
    salary: "₹6-10 LPA",
    type: "Full-time",
    category: "tech",
    deadline: "Jan 15, 2025",
    featured: true,
    postedBy: "system",
    description: "Join our dynamic team to build scalable web applications using modern technologies.",
    requirements: ["Bachelor's in Computer Science", "Proficiency in React, Node.js", "Understanding of databases", "Problem-solving skills"],
    benefits: ["Health insurance", "Flexible working hours", "Learning & development budget", "Stock options"],
    skills: ["React", "Node.js", "MongoDB", "JavaScript", "Git"]
  },
  {
    id: 2,
    company: "MarketPro Solutions",
    position: "Digital Marketing Specialist",
    location: "Mumbai",
    experience: "junior",
    salary: "₹4-7 LPA",
    type: "Full-time",
    category: "marketing",
    deadline: "Jan 20, 2025",
    featured: false,
    postedBy: "system",
    description: "Drive digital marketing campaigns and grow our online presence across multiple channels.",
    requirements: ["Marketing degree preferred", "2+ years digital marketing experience", "Google Ads certification", "Analytics expertise"],
    benefits: ["Performance bonuses", "Remote work options", "Professional certifications", "Career growth"],
    skills: ["Google Ads", "SEO", "Social Media", "Analytics", "Content Marketing"]
  },
  {
    id: 3,
    company: "FinanceCore",
    position: "Financial Analyst",
    location: "Delhi",
    experience: "fresher",
    salary: "₹5-8 LPA",
    type: "Full-time",
    category: "finance",
    deadline: "Jan 18, 2025",
    featured: true,
    postedBy: "system",
    description: "Analyze financial data and support strategic decision-making processes.",
    requirements: ["Finance/Economics degree", "Excel proficiency", "Financial modeling knowledge", "Analytical thinking"],
    benefits: ["CFA sponsorship", "Mentorship program", "Performance incentives", "Health benefits"],
    skills: ["Excel", "Financial Modeling", "SQL", "PowerBI", "Risk Analysis"]
  },
  {
    id: 4,
    company: "DesignStudio Pro",
    position: "Senior UI/UX Designer",
    location: "Pune",
    experience: "mid",
    salary: "₹8-12 LPA",
    type: "Full-time",
    category: "design",
    deadline: "Jan 25, 2025",
    featured: false,
    postedBy: "system",
    description: "Lead design initiatives and create exceptional user experiences for our products.",
    requirements: ["Design degree", "4+ years UI/UX experience", "Portfolio required", "Leadership skills"],
    benefits: ["Creative freedom", "Latest design tools", "Conference attendance", "Flexible schedule"],
    skills: ["Figma", "Adobe Creative Suite", "Prototyping", "User Research", "Design Systems"]
  },
  {
    id: 5,
    company: "DataTech Solutions",
    position: "Data Scientist",
    location: "Hyderabad",
    experience: "junior",
    salary: "₹7-12 LPA",
    type: "Full-time",
    category: "tech",
    deadline: "Jan 22, 2025",
    featured: true,
    postedBy: "system",
    description: "Build machine learning models and extract insights from large datasets.",
    requirements: ["Statistics/CS background", "Python/R expertise", "ML experience", "PhD preferred"],
    benefits: ["Research opportunities", "Conference presentations", "Cutting-edge projects", "Stock options"],
    skills: ["Python", "Machine Learning", "TensorFlow", "SQL", "Statistics"]
  },
  {
    id: 6,
    company: "SalesForce Pro",
    position: "Sales Executive",
    location: "Chennai",
    experience: "fresher",
    salary: "₹3-6 LPA",
    type: "Full-time",
    category: "sales",
    deadline: "Jan 30, 2025",
    featured: false,
    postedBy: "system",
    description: "Drive sales growth and build relationships with potential clients.",
    requirements: ["Any degree", "Communication skills", "Sales aptitude", "Target-oriented mindset"],
    benefits: ["High commission structure", "Travel opportunities", "Sales training", "Career progression"],
    skills: ["Communication", "Negotiation", "CRM", "Lead Generation", "Presentation"]
  }
];