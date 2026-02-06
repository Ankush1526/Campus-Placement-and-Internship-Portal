export interface Internship {
  id: number;
  company: string;
  position: string;
  location: string;
  duration: string;
  stipend: string;
  type: string;
  category: string;
  deadline: string;
  description: string;
  requirements: string[];
  benefits: string[];
  postedBy: string;
}

export const internships: Internship[] = [
  {
    id: 1,
    company: "TechCorp Solutions",
    position: "Software Development Intern",
    postedBy:"Techcorp",
    location: "Bangalore",
    duration: "3 months",
    stipend: "₹25,000/month",
    type: "Full-time",
    category: "tech",
    deadline: "Dec 15, 2024",
    description: "Work on cutting-edge web applications using React, Node.js, and cloud technologies.",
    requirements: [
      "Computer Science/IT background",
      "Knowledge of JavaScript",
      "Problem-solving skills"
    ],
    benefits: [
      "Mentorship program",
      "Certificate",
      "Pre-placement offer opportunity"
    ]
    
  },
  {
    id: 2,
    company: "Digital Marketing Pro",
    position: "Digital Marketing Intern",
    postedBy:"Techcorp",

    location: "Mumbai",
    duration: "4 months",
    stipend: "₹20,000/month",
    type: "Hybrid",
    category: "marketing",
    deadline: "Dec 20, 2024",
    description: "Learn and execute digital marketing strategies across social media, SEO, and content marketing.",
    requirements: [
      "Marketing/Business background",
      "Creative thinking",
      "Social media knowledge"
    ],
    benefits: [
      "Industry certification",
      "Portfolio development",
      "Networking opportunities"
    ]
  },
  {
    id: 3,
    company: "FinanceHub",
    position: "Financial Analyst Intern",
    postedBy:"Techcorp",

    location: "Delhi",
    duration: "6 months",
    stipend: "₹30,000/month",
    type: "Full-time",
    category: "finance",
    deadline: "Dec 18, 2024",
    description: "Assist in financial modeling, data analysis, and investment research projects.",
    requirements: [
      "Finance/Economics background",
      "Excel proficiency",
      "Analytical mindset"
    ],
    benefits: [
      "CFA preparation support",
      "Real project experience",
      "Full-time opportunity"
    ]
  },
  {
    id: 4,
    company: "Creative Studios",
    position: "UI/UX Design Intern",
    postedBy:"Techcorp",

    location: "Pune",
    duration: "3 months",
    stipend: "₹22,000/month",
    type: "Remote",
    category: "design",
    deadline: "Dec 25, 2024",
    description: "Design user interfaces and experiences for mobile and web applications.",
    requirements: [
      "Design background",
      "Figma/Adobe XD skills",
      "Portfolio required"
    ],
    benefits: [
      "Design mentorship",
      "Portfolio enhancement",
      "Industry exposure"
    ]
  },
  {
    id: 5,
    company: "DataTech Analytics",
    position: "Data Science Intern",
    location: "Hyderabad",
    postedBy:"Techcorp",

    duration: "4 months",
    stipend: "₹28,000/month",
    type: "Full-time",
    category: "tech",
    deadline: "Dec 22, 2024",
    description: "Work on machine learning projects and data analysis using Python and R.",
    requirements: [
      "Statistics/CS background",
      "Python/R knowledge",
      "ML fundamentals"
    ],
    benefits: [
      "ML certification",
      "Research publication opportunity",
      "Industry projects"
    ]
  },
  {
    id: 6,
    company: "StartupLab",
    position: "Business Development Intern",
    postedBy:"Techcorp",

    location: "Chennai",
    duration: "3 months",
    stipend: "₹18,000/month",
    type: "Hybrid",
    category: "marketing",
    deadline: "Dec 30, 2024",
    description: "Support business development activities and client relationship management.",
    requirements: [
      "Business/MBA background",
      "Communication skills",
      "Sales aptitude"
    ],
    benefits: [
      "Startup experience",
      "Equity opportunity",
      "Leadership development"
    ]
  }
];