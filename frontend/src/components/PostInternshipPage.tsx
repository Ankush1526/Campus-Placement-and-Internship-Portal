import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Send, 
  Building2, 
  MapPin, 
  Clock, 
  IndianRupee, 
  FileText, 
  ListChecks, 
  Calendar, 
  ArrowLeft,
  Briefcase
} from 'lucide-react';

const PostInternshipPage: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    const parsedUser = userData ? JSON.parse(userData) : null;
    
    // Security: Only recruiters can access this page
    if (!parsedUser || parsedUser.userType !== 'recruiter') {
      navigate('/login');
    }
    setUser(parsedUser);
  }, [navigate]);

  const [formData, setFormData] = useState({
    position: '',
    company: '',
    location: '',
    duration: '',
    stipend: '',
    category: 'tech',
    type: 'Full Time',
    deadline: '',
    description: '',
    requirements: '',
    benefits: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // 1. Prepare the new internship object
    const newInternship = {
      ...formData,
      id: Date.now(), // Unique ID for routing
      postedBy: user._id, // Link to the current Recruiter
      requirements: formData.requirements.split(',').map(item => item.trim()),
      benefits: formData.benefits.split(',').map(item => item.trim()),
      createdAt: new Date().toISOString()
    };

    // 2. Get existing custom internships, add the new one, and save back to Storage
    const existingPosts = JSON.parse(localStorage.getItem('custom_internships') || '[]');
    const updatedPosts = [newInternship, ...existingPosts];
    localStorage.setItem('custom_internships', JSON.stringify(updatedPosts));

    // 3. Simulate API delay and redirect
    setTimeout(() => {
      setLoading(false);
      navigate('/internships');
    }, 1000);
  };

  const inputClass = "w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all";
  const labelClass = "block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-28 pb-12">
      <div className="max-w-3xl mx-auto px-4">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-500 hover:text-blue-600 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
        </button>

        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-8 py-10 text-white">
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Briefcase className="w-8 h-8" /> Post an Internship
            </h1>
            <p className="mt-2 opacity-80 font-medium">Create a new opportunity and reach thousands of students.</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className={labelClass}><Building2 className="w-4 h-4 text-blue-500" /> Internship Position</label>
                <input required type="text" placeholder="e.g. Full Stack Web Intern" 
                  className={inputClass} value={formData.position}
                  onChange={(e) => setFormData({...formData, position: e.target.value})} />
              </div>
              <div>
                <label className={labelClass}>Company Name</label>
                <input required type="text" placeholder="Enter your company" 
                  className={inputClass} value={formData.company}
                  onChange={(e) => setFormData({...formData, company: e.target.value})} />
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <label className={labelClass}><MapPin className="w-4 h-4 text-red-500" /> Location</label>
                <input required type="text" placeholder="Remote / City" 
                  className={inputClass} value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})} />
              </div>
              <div>
                <label className={labelClass}><Clock className="w-4 h-4 text-green-500" /> Duration</label>
                <input required type="text" placeholder="e.g. 3 Months" 
                  className={inputClass} value={formData.duration}
                  onChange={(e) => setFormData({...formData, duration: e.target.value})} />
              </div>
              <div>
                <label className={labelClass}><Calendar className="w-4 h-4 text-purple-500" /> Apply Deadline</label>
                <input required type="date" className={inputClass} value={formData.deadline}
                  onChange={(e) => setFormData({...formData, deadline: e.target.value})} />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className={labelClass}><IndianRupee className="w-4 h-4 text-emerald-500" /> Stipend</label>
                  <input required type="text" placeholder="e.g. ₹15,000 / month" 
                    className={inputClass} value={formData.stipend}
                    onChange={(e) => setFormData({...formData, stipend: e.target.value})} />
                </div>
                <div>
                  <label className={labelClass}>Category</label>
                  <select 
                    className={inputClass} 
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                  >
                    <option value="tech">Technology</option>
                    <option value="marketing">Marketing</option>
                    <option value="design">Design</option>
                    <option value="finance">Finance</option>
                  </select>
                </div>
            </div>

            <div>
              <label className={labelClass}><FileText className="w-4 h-4 text-blue-500" /> About the Internship</label>
              <textarea required rows={4} placeholder="What will the intern work on? What are the expectations?" 
                className={inputClass} value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})} />
            </div>

            <div>
              <label className={labelClass}><ListChecks className="w-4 h-4 text-orange-500" /> Skills Required (Comma separated)</label>
              <input required type="text" placeholder="React, Python, Communication..." 
                className={inputClass} value={formData.requirements}
                onChange={(e) => setFormData({...formData, requirements: e.target.value})} />
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-4 rounded-2xl font-bold text-lg text-white shadow-lg transition-all flex items-center justify-center gap-2 ${
                  loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 hover:shadow-blue-200 shadow-blue-100'
                }`}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Publishing...
                  </span>
                ) : (
                  <>
                    <Send className="w-5 h-5" /> 
                    Post Internship Opportunity
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PostInternshipPage;