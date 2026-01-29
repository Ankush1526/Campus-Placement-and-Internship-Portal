import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Clock, Building2, Calendar, Users, ArrowRight, Bookmark, Check, Eye, TrendingUp, Star, Zap, Plus, UserCheck } from 'lucide-react';
import { internships as staticInternships } from '../data/internships';
import AnimatedCounter from './AnimatedCounter';
import FloatingParticles from './FloatingParticles';

const InternshipsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [savedIds, setSavedIds] = useState<number[]>([]);
  const [user, setUser] = useState<any>(null);
  const [displayInternships, setDisplayInternships] = useState<any[]>([]);

  useEffect(() => {
    // 1. Get User
    const userData = localStorage.getItem('user');
    const parsedUser = userData ? JSON.parse(userData) : null;
    setUser(parsedUser);

    // 2. Get Saved IDs (for students)
    const saved = JSON.parse(localStorage.getItem('savedInternships') || '[]');
    setSavedIds(Array.isArray(saved) ? saved : []);

    // 3. Combine Static Data with newly Posted Data from LocalStorage
    const customInternships = JSON.parse(localStorage.getItem('custom_internships') || '[]');
    const combined = [...staticInternships, ...customInternships];

    // 4. Filter based on User Type
    if (parsedUser?.userType === 'recruiter') {
      // Recruiters only see what THEY posted
      const myPosts = combined.filter((i: any) => String(i.postedBy) === String(parsedUser._id));
      setDisplayInternships(myPosts);
    } else {
      // Students see everything
      setDisplayInternships(combined);
    }
  }, []);

  const toggleSave = (id: number) => {
    setSavedIds(prev => {
      const exists = prev.includes(id);
      const next = exists ? prev.filter(sid => sid !== id) : [...prev, id];
      localStorage.setItem('savedInternships', JSON.stringify(next));
      return next;
    });
  };

  const isSaved = (id: number) => savedIds.includes(id);

  // Filter Logic for Search and Category
  const filteredList = useMemo(() => {
    return displayInternships.filter(internship => {
      const matchesSearch = 
        internship.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
        internship.company.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = selectedFilter === 'all' || internship.category === selectedFilter;
      return matchesSearch && matchesFilter;
    });
  }, [displayInternships, searchTerm, selectedFilter]);

  const isRecruiter = user?.userType === 'recruiter';

  // Helper to count applicants from the Application Interface
  const getApplicantCount = (internshipId: any) => {
    const allApps = JSON.parse(localStorage.getItem('applications') || '[]');
    // Filter apps where targetTitle matches position or targetId matches internship.id
    return allApps.filter((app: any) => String(app.targetId) === String(internshipId)).length;
  };

  const stats = [
    { number: 1200, label: "Active Roles", icon: <Building2 className="w-5 h-5" />, suffix: "+", color: "from-blue-500 to-blue-600" },
    { number: 800, label: "Companies", icon: <Users className="w-5 h-5" />, suffix: "+", color: "from-green-500 to-green-600" },
    { number: 25, label: "Avg Stipend", icon: <TrendingUp className="w-5 h-5" />, suffix: "K", prefix: "₹", color: "from-purple-500 to-purple-600" },
    { number: 92, label: "Success Rate", icon: <Star className="w-5 h-5" />, suffix: "%", color: "from-orange-500 to-red-500" }
  ];

  return (
    <div className="py-20 min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {isRecruiter ? 'Your Dashboard' : 'Explore Internships'}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8">
            {isRecruiter 
              ? 'Manage your active postings and track student applications in real-time.' 
              : 'Discover your dream internship and kickstart your professional journey.'}
          </p>
          {isRecruiter && (
            <button 
              onClick={() => navigate('/post-internship')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-bold flex items-center mx-auto transition-transform hover:scale-105 shadow-lg shadow-blue-200"
            >
              <Plus className="w-5 h-5 mr-2" /> Post New Internship
            </button>
          )}
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 text-center">
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${stat.color} text-white flex items-center justify-center mx-auto mb-3`}>
                {stat.icon}
              </div>
              <div className="text-2xl font-bold dark:text-white">{stat.prefix}{stat.number}{stat.suffix}</div>
              <div className="text-sm text-gray-500">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search by role or company..."
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
            {['all', 'tech', 'marketing', 'design', 'finance'].map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedFilter(cat)}
                className={`px-6 py-2 rounded-full font-medium capitalize whitespace-nowrap transition-colors ${
                  selectedFilter === cat ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* List of Internships */}
        <div className="space-y-6">
          {filteredList.map((internship) => (
            <div key={internship.id} className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
              <div className="flex flex-col lg:flex-row justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 rounded-xl flex items-center justify-center text-blue-600 font-bold text-xl">
                      {internship.company.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold dark:text-white">{internship.position}</h3>
                      <p className="text-blue-600 font-medium">{internship.company}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center"><MapPin className="w-4 h-4 mr-2" />{internship.location}</div>
                    <div className="flex items-center"><Clock className="w-4 h-4 mr-2" />{internship.duration}</div>
                    <div className="flex items-center"><Zap className="w-4 h-4 mr-2 text-orange-500" />{internship.stipend}</div>
                    <div className="flex items-center"><Calendar className="w-4 h-4 mr-2" />{internship.deadline}</div>
                  </div>

                  {/* Recruiter Specific Info: Applicant Count */}
                  {isRecruiter && (
                    <div className="mt-4 inline-flex items-center px-4 py-2 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-lg text-sm font-bold">
                      <UserCheck className="w-4 h-4 mr-2" />
                      {getApplicantCount(internship.id)} Students Applied
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row lg:flex-col gap-3 justify-center min-w-[180px]">
                  {isRecruiter ? (
                    <button 
                      onClick={() => navigate(`/applicants/${internship.id}`)}
                      className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 flex items-center justify-center"
                    >
                      View Applicants <ArrowRight className="w-4 h-4 ml-2" />
                    </button>
                  ) : (
                    <button 
                      onClick={() => user?.userType === 'student' ? navigate(`/apply-internship/${internship.id}`) : navigate('/login')}
                      className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 flex items-center justify-center"
                    >
                      Apply Now <ArrowRight className="w-4 h-4 ml-2" />
                    </button>
                  )}
                  
                  <div className="flex gap-2">
                    {!isRecruiter && (
                      <button 
                        onClick={() => toggleSave(internship.id)}
                        className={`flex-1 p-3 rounded-xl border flex items-center justify-center ${isSaved(internship.id) ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'border-gray-200 dark:border-gray-700 dark:text-gray-400'}`}
                      >
                        {isSaved(internship.id) ? <Check className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
                      </button>
                    )}
                    <button 
                      onClick={() => navigate(`/internships/${internship.id}`)}
                      className="flex-1 p-3 rounded-xl border border-gray-200 dark:border-gray-700 dark:text-gray-400 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {filteredList.length === 0 && (
            <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-700">
              <Search className="w-12 h-12 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">No internships found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InternshipsPage;