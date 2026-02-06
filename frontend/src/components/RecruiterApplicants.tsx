import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Download, 
  Check, 
  X, 
  FileText, 
  ArrowLeft, 
  User, 
  Clock,
  Mail,
  Phone
} from 'lucide-react';

const RecruiterApplicants: React.FC = () => {
  const { internshipId } = useParams();
  const navigate = useNavigate();
  
  const [apps, setApps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [internshipName, setInternshipName] = useState("");

  useEffect(() => {
    const fetchApplicants = () => {
      try {
        setLoading(true);
        // 1. Get all applications from storage
        const allAppsRaw = localStorage.getItem('applications');
        const allApps = allAppsRaw ? JSON.parse(allAppsRaw) : [];

        console.log("System Check - All Apps:", allApps);
        console.log("System Check - Looking for ID:", internshipId);

        // 2. Smart Filter: Checks all possible ID keys to find the match
        const filteredApps = allApps.filter((app: any) => {
          const idToMatch = String(internshipId);
          return (
            String(app.targetId) === idToMatch || 
            String(app.internshipId) === idToMatch || 
            String(app.jobId) === idToMatch
          );
        });

        if (filteredApps.length > 0) {
          setInternshipName(filteredApps[0].targetTitle || filteredApps[0].jobTitle || "Internship");
        }

        setApps(filteredApps);
      } catch (error) {
        console.error("Error loading applicants:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplicants();
  }, [internshipId]);

  const updateStatus = (appId: any, newStatus: string) => {
    // Update local UI state
    const updatedLocal = apps.map(app => 
      app.id === appId ? { ...app, status: newStatus } : app
    );
    setApps(updatedLocal);

    // Update the master list in localStorage
    const allAppsRaw = localStorage.getItem('applications');
    const allApps = allAppsRaw ? JSON.parse(allAppsRaw) : [];
    const updatedGlobal = allApps.map((app: any) => 
      app.id === appId ? { ...app, status: newStatus } : app
    );
    localStorage.setItem('applications', JSON.stringify(updatedGlobal));
  };

  const handleDownload = (base64: string, name: string) => {
    if (!base64) return alert("No resume file found.");
    const link = document.createElement('a');
    link.href = base64;
    link.download = name || 'resume.pdf';
    link.click();
  };

  if (loading) {
    return (
      <div className="pt-32 flex justify-center items-center min-h-screen bg-[#0f172a]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="pt-24 min-h-screen bg-[#0f172a] text-white p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        
        {/* Navigation & Header */}
        <div className="mb-10">
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center text-blue-400 hover:text-blue-300 mb-6 transition-colors group"
          >
            <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" /> 
            Back to Dashboard
          </button>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight">Applicant Management</h1>
              <p className="text-slate-400 mt-2 text-lg">
                {apps.length > 0 
                  ? `Reviewing ${apps.length} candidates for ${internshipName}` 
                  : "No candidates have applied to this position yet."}
              </p>
            </div>
          </div>
        </div>

        {/* Content Area */}
        {apps.length > 0 ? (
          <div className="grid gap-6">
            {apps.map((app) => (
              <div 
                key={app.id || Math.random()} 
                className="bg-slate-800/40 border border-slate-700/50 backdrop-blur-sm rounded-2xl p-6 hover:border-blue-500/40 transition-all shadow-2xl"
              >
                <div className="flex flex-col lg:flex-row justify-between gap-8">
                  
                  {/* Left Side: Candidate Basics */}
                  <div className="flex gap-5">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center text-2xl font-bold shadow-lg flex-shrink-0">
                      {app.applicantName?.[0]?.toUpperCase() || 'A'}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">{app.applicantName}</h2>
                      <div className="flex flex-col gap-1 mt-1">
                        <span className="flex items-center text-slate-400 text-sm">
                          <Mail size={14} className="mr-2" /> {app.applicantEmail}
                        </span>
                        <span className="flex items-center text-slate-400 text-sm">
                          <Phone size={14} className="mr-2" /> {app.applicantContact}
                        </span>
                      </div>
                      
                      <div className="flex flex-wrap gap-3 mt-4">
                        <span className="flex items-center text-[10px] bg-slate-900/80 px-3 py-1 rounded-full text-slate-400 border border-slate-700 font-medium uppercase tracking-wider">
                          <Clock size={12} className="mr-1.5" /> Applied {new Date(app.appliedAt).toLocaleDateString()}
                        </span>
                        <span className={`text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-wider border ${
                          app.status === 'Accepted' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                          app.status === 'Rejected' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                          'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                        }`}>
                          {app.status || 'Pending'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right Side: Actions & Status */}
                  <div className="flex flex-col sm:flex-row items-center gap-4 self-center lg:self-start">
                    {app.resumeData && (
                      <button 
                        onClick={() => handleDownload(app.resumeData, app.resumeName)}
                        className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white px-5 py-2.5 rounded-xl transition-all font-semibold text-sm border border-slate-600"
                      >
                        <FileText size={18} /> View Resume
                      </button>
                    )}
                    
                    <div className="flex gap-2">
                      <button 
                        onClick={() => updateStatus(app.id, 'Accepted')}
                        className="p-3 bg-green-600/10 text-green-500 border border-green-500/20 rounded-xl hover:bg-green-600 hover:text-white transition-all shadow-sm"
                        title="Accept Application"
                      >
                        <Check size={22} />
                      </button>
                      
                      <button 
                        onClick={() => updateStatus(app.id, 'Rejected')}
                        className="p-3 bg-red-600/10 text-red-500 border border-red-500/20 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm"
                        title="Reject Application"
                      >
                        <X size={22} />
                      </button>
                    </div>
                  </div>

                </div>
                
                {/* Availability Section */}
                {app.availabilityNote && (
                  <div className="mt-6 pt-6 border-t border-slate-700/50">
                    <h4 className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-2">Candidate Note / Availability</h4>
                    <p className="text-slate-300 text-sm leading-relaxed italic bg-slate-900/30 p-3 rounded-lg border border-slate-800">
                      "{app.availabilityNote}"
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-32 bg-slate-800/20 rounded-[2rem] border-2 border-dashed border-slate-700/50">
            <div className="bg-slate-800 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
              <User className="text-slate-500" size={40} />
            </div>
            <h3 className="text-2xl font-bold text-white">No Applicants Found</h3>
            <p className="text-slate-500 mt-2 max-w-sm mx-auto">
              We couldn't find any applications matching ID: <span className="text-blue-400 font-mono">{internshipId}</span>. 
              Try applying again as a student to this specific posting.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecruiterApplicants;