import React, { useState, useEffect } from 'react';
import { Search, MapPin, Briefcase, Building2, Calendar, Users, ArrowRight, Star, Bookmark, Check, Eye, TrendingUp, Zap, Target } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { jobs as staticJobs } from '../data/jobs';
import AnimatedCounter from './AnimatedCounter';
import FloatingParticles from './FloatingParticles';

const JobsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [experienceFilter, setExperienceFilter] = useState('all');
  const [user, setUser] = useState<any>(null);
  const [savedIds, setSavedIds] = useState<number[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    setUser(userData ? JSON.parse(userData) : null);
    const saved = JSON.parse(localStorage.getItem('savedJobs') || '[]');
    setSavedIds(Array.isArray(saved) ? saved : []);
  }, []);

  const categoryFilters = [
    { id: 'all', label: 'All Jobs' },
    { id: 'tech', label: 'Technology' },
    { id: 'marketing', label: 'Marketing' },
    { id: 'finance', label: 'Finance' },
    { id: 'design', label: 'Design' },
    { id: 'sales', label: 'Sales' }
  ];

  const experienceFilters = [
    { id: 'all', label: 'All Levels' },
    { id: 'fresher', label: 'Fresher (0-1 years)' },
    { id: 'junior', label: 'Junior (1-3 years)' },
    { id: 'mid', label: 'Mid-level (3-5 years)' }
  ];

  // Get recruiter-created jobs from localStorage
  const recruiterJobs = JSON.parse(localStorage.getItem('jobAlerts') || '[]');

  // Merge static jobs and recruiter jobs
  const allJobs = [
    ...staticJobs,
    ...recruiterJobs.map((job: any) => ({
      ...job,
      id: job.id || Date.now() + Math.random(),
      featured: false,
      skills: Array.isArray(job.skills) ? job.skills : [],
      requirements: Array.isArray(job.requirements) ? job.requirements : [],
      benefits: Array.isArray(job.benefits) ? job.benefits : [],
      category: job.category || 'other',
      experience: job.experience || 'all',
      postedBy: 'recruiter',
    })),
  ];

  const filteredJobs = allJobs.filter(job => {
    const matchesSearch = job.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedFilter === 'all' || job.category === selectedFilter;
    const matchesExperience = experienceFilter === 'all' || job.experience === experienceFilter;
    
    return matchesSearch && matchesCategory && matchesExperience;
  });

  const stats = [
    { 
      number: 2500, 
      label: 'Active Jobs', 
      icon: <Briefcase className="w-5 h-5" />,
      suffix: '+',
      color: "from-blue-500 to-blue-600",
      description: "Available positions"
    },
    { 
      number: 1200, 
      label: 'Hiring Companies', 
      icon: <Building2 className="w-5 h-5" />,
      suffix: '+',
      color: "from-green-500 to-green-600",
      description: "Partner organizations"
    },
    { 
      number: 8.5, 
      label: 'Average Package', 
      icon: <TrendingUp className="w-5 h-5" />,
      suffix: 'L',
      prefix: '₹',
      color: "from-purple-500 to-purple-600",
      description: "Annual compensation"
    },
    { 
      number: 78, 
      label: 'Placement Rate', 
      icon: <Target className="w-5 h-5" />,
      suffix: '%',
      color: "from-orange-500 to-red-500",
      description: "Success rate"
    },
  ];

  const toggleSave = (id: number) => {
    setSavedIds(prev => {
      const exists = prev.includes(id);
      const next = exists ? prev.filter(sid => sid !== id) : [...prev, id];
      localStorage.setItem('savedJobs', JSON.stringify(next));
      return next;
    });
  };

  const isSaved = (id: number) => savedIds.includes(id);

  return (
    <div className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Job Opportunities
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Discover your dream job from thousands of opportunities with leading companies.
            Start your career journey with positions that match your skills and aspirations.
          </p>
        </div>

        {/* Stats */}
        <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 rounded-3xl mb-12 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-grid-pattern opacity-5 dark:opacity-10"></div>
          <div className="absolute top-0 left-0 w-72 h-72 bg-blue-200 dark:bg-blue-800 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
          <div className="absolute bottom-0 right-0 w-72 h-72 bg-purple-200 dark:bg-purple-800 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
          
          {/* Floating Particles */}
          <FloatingParticles />
          
          <div className="relative z-10 max-w-6xl mx-auto px-6">
            <div className="text-center mb-8">
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                <span className="bg-gradient-to-r from-green-600 to-blue-600 dark:from-green-400 dark:to-blue-400 bg-clip-text text-transparent">
                  Job Market Statistics
                </span>
              </h3>
              <p className="text-lg text-gray-600 dark:text-gray-300">Explore the latest trends in job opportunities</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg text-center card-hover group hover:scale-105 transition-transform duration-300">
                  <div className="flex justify-center mb-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color} text-white shadow-md group-hover:shadow-lg transition-shadow duration-300`}>
                      {stat.icon}
                    </div>
                  </div>
                  <div className="mb-2">
                    <AnimatedCounter
                      end={stat.number}
                      suffix={stat.suffix}
                      prefix={stat.prefix || ''}
                      duration={2000}
                      delay={index * 200}
                      className="text-2xl md:text-3xl font-bold"
                    />
                  </div>
                  <div className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">{stat.label}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">{stat.description}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg mb-8">
          <div className="flex flex-col gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search jobs by position or company..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
              />
            </div>

            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category</label>
                <div className="flex gap-2 flex-wrap">
                  {categoryFilters.map((filter) => (
                    <button
                      key={filter.id}
                      onClick={() => setSelectedFilter(filter.id)}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        selectedFilter === filter.id ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Experience Level</label>
                <div className="flex gap-2 flex-wrap">
                  {experienceFilters.map((filter) => (
                    <button
                      key={filter.id}
                      onClick={() => setExperienceFilter(filter.id)}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        experienceFilter === filter.id ? 'bg-green-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        {user && user.userType === 'recruiter' && (
          <div className="flex justify-end mb-8">
            <button
              className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors"
              onClick={() => navigate('/create-job-alert')}
            >
              Create Job Alert
            </button>
          </div>
        )}

        {/* Filter Status */}
        <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
          Showing {filteredJobs.length} of {allJobs.length} jobs
          {experienceFilter !== 'all' && (
            <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded">
              Experience: {experienceFilters.find(f => f.id === experienceFilter)?.label}
            </span>
          )}
          {selectedFilter !== 'all' && (
            <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 rounded">
              Category: {categoryFilters.find(f => f.id === selectedFilter)?.label}
            </span>
          )}
        </div>

        {/* Jobs Grid */}
        <div className="grid gap-6">
          {filteredJobs.map((job) => (
            <div key={job.id} className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 card-hover ${job.featured ? 'ring-2 ring-yellow-400' : ''}`}>
              {job.featured && (
                <div className="flex items-center mb-4">
                  <Star className="w-4 h-4 text-yellow-500 mr-1" />
                  <span className="text-sm font-medium text-yellow-600">Featured Job</span>
                </div>
              )}

              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center mb-2">
                        <div className="company-logo mr-4 w-12 h-12 text-sm">
                          {job.company.split(' ').map((word: string) => word[0]).join('')}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">{job.position}</h3>
                          <p className="text-gray-600">{job.company}</p>
                        </div>
                      </div>
                    </div>
                    <span className="status-badge status-active">{job.type}</span>
                  </div>

                  <p className="text-gray-600 mb-4">{job.description}</p>

                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div className="flex items-center text-gray-600"><MapPin className="w-4 h-4 mr-2" />{job.location}</div>
                    <div className="flex items-center text-gray-600"><Briefcase className="w-4 h-4 mr-2" />{(() => {
                      const expFilter = experienceFilters.find(f => f.id === job.experience);
                      if (expFilter) {
                        return expFilter.label.includes('(') ? expFilter.label.split('(')[0].trim() : expFilter.label;
                      }
                      return job.experience;
                    })()}</div>
                    <div className="flex items-center text-gray-600">{job.salary}</div>
                    <div className="flex items-center text-gray-600"><Calendar className="w-4 h-4 mr-2" />Apply by {job.deadline}</div>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Required Skills:</h4>
                    <div className="flex flex-wrap gap-2">
                      {job.skills.map((skill: string, index: number) => (
                        <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">{skill}</span>
                      ))}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Requirements:</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {job.requirements.slice(0, 3).map((req: string, index: number) => (
                          <li key={index} className="flex items-start"><span className="text-blue-600 mr-2">•</span>{req}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Benefits:</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {job.benefits.slice(0, 3).map((benefit: string, index: number) => (
                          <li key={index} className="flex items-start"><span className="text-green-600 mr-2">•</span>{benefit}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="lg:ml-6 lg:flex-shrink-0">
                  <div className="flex flex-col gap-3">
                    {user && user.userType === 'student' ? (
                      <button
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center"
                        onClick={() => navigate(`/apply/${job.id}`)}
                      >
                        Apply Now <ArrowRight className="w-4 h-4 ml-2" />
                      </button>
                    ) : (
                      <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold flex items-center justify-center opacity-50 cursor-not-allowed" disabled>
                        Apply Now <ArrowRight className="w-4 h-4 ml-2" />
                      </button>
                    )}
                    {user && user.userType === 'student' ? (
                      <button
                        onClick={() => toggleSave(job.id)}
                        className={`${isSaved(job.id) ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'border border-gray-300 text-gray-700 hover:bg-gray-50'} px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center`}
                        aria-pressed={isSaved(job.id)}
                      >
                        {isSaved(job.id) ? (<><Check className="w-4 h-4 mr-2" /> Saved</>) : (<><Bookmark className="w-4 h-4 mr-2" /> Save Job</>)}
                      </button>
                    ) : (
                      <button className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold flex items-center justify-center opacity-50 cursor-not-allowed" disabled>
                        <Bookmark className="w-4 h-4 mr-2" /> Save Job
                      </button>
                    )}
                    <button
                      onClick={() => navigate(`/jobs/${job.id}`)}
                      className="text-blue-600 font-semibold hover:text-blue-700 transition-colors flex items-center justify-center"
                    >
                      <Eye className="w-4 h-4 mr-2" /> View Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredJobs.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No jobs found</h3>
            <p className="text-gray-600">Try adjusting your search criteria or filters</p>
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-16 bg-gradient-to-r from-green-600 to-blue-600 p-8 rounded-2xl text-white text-center">
          <h3 className="text-2xl font-bold mb-4">Ready to Take the Next Step?</h3>
          <p className="text-lg mb-6 opacity-90">Stay updated with the latest openings. Save jobs and apply when you're ready.</p>
          {user && user.userType === 'recruiter' && (
            <div className="flex justify-center">
              <button
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition-colors"
                onClick={() => navigate('/create-job-alert')}
              >
                Create Job Alert
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobsPage;