import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { internships as staticInternships } from '../data/internships'; // Ensure this path is correct
import { ArrowLeft } from 'lucide-react';

const ApplyInternshipPage: React.FC = () => {
  const { internshipId } = useParams();
  const navigate = useNavigate();
  
  // State
  const [internship, setInternship] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true); // Initial loading state
  
  // Form State
  const [form, setForm] = useState({
    name: '',
    contact: '',
    email: '',
    resume: null as File | null,
  });
  
  const [profileResume, setProfileResume] = useState<{ name: string; data: string } | null>(null);
  const [availability, setAvailability] = useState<'immediate' | 'custom'>('immediate');
  const [availabilityNote, setAvailabilityNote] = useState('');
  
  // UI State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Validation Helpers
  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email || '');
  const isValidContact = /^\d{10}$/.test(form.contact || '');

  // --- 1. Load Data (User + Internship + Profile) ---
  useEffect(() => {
    // A. Get User
    const userData = localStorage.getItem('user');
    const parsedUser = userData ? JSON.parse(userData) : null;
    setUser(parsedUser);

    // B. Find Internship (Static + Custom)
    const customInternships = JSON.parse(localStorage.getItem('custom_internships') || '[]');
    const allInternships = [...staticInternships, ...customInternships];
    
    // Compare as strings to handle both number IDs (static) and timestamp IDs (custom)
    const found = allInternships.find(i => String(i.id) === String(internshipId));
    setInternship(found || null);

    // C. Load saved resume from profile
    const cachedProfile = localStorage.getItem('profile');
    if (cachedProfile) {
      try {
        const p = JSON.parse(cachedProfile);
        if (p.resumeData && p.resumeName) {
          setProfileResume({ name: p.resumeName, data: p.resumeData });
        }
      } catch (err) {
        console.error('Error parsing profile data:', err);
      }
    }
    
    // Stop loading
    setLoading(false);
  }, [internshipId]);

  // --- Early Returns ---
  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (!user || user.userType !== 'student') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Student Access Only</h2>
        <p>You must be logged in as a student to apply.</p>
        <button onClick={() => navigate('/login')} className="text-blue-600 hover:underline">Go to Login</button>
      </div>
    );
  }

  if (!internship) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Internship Not Found</h2>
        <button onClick={() => navigate('/internships')} className="text-blue-600 hover:underline">Back to Internships</button>
      </div>
    );
  }

  // --- 2. Handle Submission ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    // Basic validation
    if (!form.name || !form.contact || !form.email) {
      setError('Please fill in all required fields');
      setIsSubmitting(false);
      return;
    }

    if (!profileResume && !form.resume) {
      setError('Please attach a resume file');
      setIsSubmitting(false);
      return;
    }

    if (!isValidContact) {
      setError('Mobile number must be exactly 10 digits');
      setIsSubmitting(false);
      return;
    }

    if (!isValidEmail) {
      setError('Please enter a valid email address');
      setIsSubmitting(false);
      return;
    }

    try {
      // Helper to convert File to Base64
      const toBase64 = (file: File) => new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
      });

      let resumeData: string;
      let resumeName: string;

      // Determine which resume to use
      if (form.resume) {
        resumeData = await toBase64(form.resume);
        resumeName = form.resume.name;
      } else if (profileResume) {
        resumeData = profileResume.data;
        resumeName = profileResume.name;
      } else {
        throw new Error('Resume not found');
      }

      // Create Application Object
      const applicationData = {
        id: Date.now(), // Unique ID for the application
        studentId: user._id || user.id, // ID of the logged-in student
        applicantEmail: form.email,
        applicantName: form.name,
        applicantContact: form.contact,
        applicationType: 'internship',
        targetId: String(internship.id),
        targetTitle: internship.position,
        targetCompany: internship.company,
        status: 'Pending', // Default status for Recruiter to see
        appliedAt: new Date().toISOString(),
        resumeData,
        resumeName,
        availability,
        availabilityNote: availability === 'custom' ? availabilityNote : 'Available immediately',
      };

      console.log('Submitting application to LocalStorage:', applicationData);

      // --- SAVE TO LOCAL STORAGE (Simulating Backend) ---
      const existingApps = JSON.parse(localStorage.getItem('applications') || '[]');
      const updatedApps = [...existingApps, applicationData];
      localStorage.setItem('applications', JSON.stringify(updatedApps));

      setSuccess(true);
      setTimeout(() => navigate('/internships'), 2000);

    } catch (err: any) {
      console.error('Submission error:', err);
      setError(err.message || 'Error submitting application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-8">
      <div className="max-w-5xl mx-auto px-4">
        <div className="mb-2">
          <button onClick={() => navigate('/internships')} className="text-blue-600 hover:text-blue-700 inline-flex items-center">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Internships
          </button>
        </div>
        <h1 className="text-3xl font-bold text-center mb-4">Apply for {internship.position}</h1>
        
        <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-xl mx-auto">
          <div className="mb-4 text-center border-b pb-4">
            <div className="font-semibold text-lg text-blue-700">{internship.company}</div>
            <div className="text-gray-700">{internship.category || 'Internship'} | Duration: {internship.duration}</div>
          </div>

          {error && <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">{error}</div>}
          {success && <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">Application submitted successfully! Redirecting...</div>}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                placeholder="Enter your full name"
                className="border border-gray-300 p-2 rounded w-full focus:ring-2 focus:ring-blue-500 outline-none"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                required
                disabled={isSubmitting}
              />
            </div>

            {/* Contact */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
              <input
                type="text"
                placeholder="10-digit mobile number"
                className={`border p-2 rounded w-full outline-none focus:ring-2 ${form.contact && !isValidContact ? 'border-red-400 focus:ring-red-400' : 'border-gray-300 focus:ring-blue-500'}`}
                value={form.contact}
                onChange={e => setForm({ ...form, contact: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                required
                disabled={isSubmitting}
                inputMode="numeric"
                maxLength={10}
              />
              {form.contact && !isValidContact && (
                <div className="text-xs text-red-600 mt-1">Mobile number must be exactly 10 digits.</div>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                placeholder="you@example.com"
                className={`border p-2 rounded w-full outline-none focus:ring-2 ${form.email && !isValidEmail ? 'border-red-400 focus:ring-red-400' : 'border-gray-300 focus:ring-blue-500'}`}
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                required
                disabled={isSubmitting}
              />
              {form.email && !isValidEmail && (
                <div className="text-xs text-red-600 mt-1">Please enter a valid email address.</div>
              )}
            </div>

            {/* Resume Section */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mt-2">
              <div className="mb-3">
                <div className="flex items-center gap-2 text-gray-900 font-semibold">
                  <span>Your resume</span>
                  {profileResume && <span className="text-xs font-medium text-gray-600">• Saved in Profile</span>}
                </div>
                <div className="text-sm text-gray-700 mt-1">
                  {profileResume ? (
                    <>
                      We found a resume in your profile.
                      <div className="flex items-center gap-2 mt-1">
                         <span className="font-medium bg-white px-2 py-1 rounded border border-gray-200">{profileResume.name}</span>
                      </div>
                    </>
                  ) : (
                    <>
                      No resume found in your profile. Please upload one below.
                    </>
                  )}
                </div>
              </div>

              <div className="mt-4 border-t border-blue-200 pt-4">
                <div className="font-semibold text-gray-900 mb-2">
                  {profileResume ? 'Use a different resume?' : 'Upload Resume'}
                </div>
                
                {profileResume && !form.resume && (
                    <div className="text-sm text-gray-600 mb-2">
                        Currently using profile resume. <button type="button" onClick={() => fileInputRef.current?.click()} className="text-blue-600 font-semibold hover:underline">Click here to upload a new one</button> for this application.
                    </div>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className={`block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-100 file:text-blue-700
                    hover:file:bg-blue-200
                    ${(profileResume && !form.resume) ? 'hidden' : ''}
                  `}
                  onChange={e => setForm({ ...form, resume: e.target.files?.[0] || null })}
                  disabled={isSubmitting}
                />
                
                {form.resume && (
                  <div className="text-sm text-green-700 mt-2 flex items-center gap-2 bg-green-50 p-2 rounded">
                    <span>Selected: <strong>{form.resume.name}</strong></span>
                    <button
                      type="button"
                      className="text-red-500 font-bold px-2 hover:bg-red-100 rounded"
                      onClick={() => {
                        setForm({ ...form, resume: null });
                        if(fileInputRef.current) fileInputRef.current.value = "";
                      }}
                    >
                      ×
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Availability */}
            <div className="mt-2">
              <div className="font-semibold text-gray-900 mb-2">Confirm your availability</div>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-gray-800 cursor-pointer">
                  <input
                    type="radio"
                    className="accent-blue-600 w-4 h-4"
                    checked={availability === 'immediate'}
                    onChange={() => setAvailability('immediate')}
                  />
                  <span>Yes, I am available to join immediately</span>
                </label>
                <label className="flex items-center gap-2 text-gray-800 cursor-pointer">
                  <input
                    type="radio"
                    className="accent-blue-600 w-4 h-4"
                    checked={availability === 'custom'}
                    onChange={() => setAvailability('custom')}
                  />
                  <span>No (Please specify)</span>
                </label>
                {availability === 'custom' && (
                  <input
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="e.g., Available after exams (March 1st)"
                    value={availabilityNote}
                    onChange={(e) => setAvailabilityNote(e.target.value)}
                  />
                )}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className={`w-full py-3 rounded-lg font-bold text-lg transition-all shadow-md mt-4 ${
                isSubmitting || !isValidEmail || !isValidContact 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg text-white'
              }`}
              disabled={isSubmitting || !isValidEmail || !isValidContact}
            >
              {isSubmitting ? 'Submitting Application...' : 'Submit Application'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ApplyInternshipPage;