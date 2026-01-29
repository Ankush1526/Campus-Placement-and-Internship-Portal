import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { jobs as staticJobs } from '../data/jobs';
import { ArrowLeft } from 'lucide-react';

const ApplyJobPage: React.FC = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [form, setForm] = useState({
    name: '',
    contact: '',
    email: '',
    resume: null as File | null,
  });
  const [profileResume, setProfileResume] = useState<{ name: string; data: string } | null>(null);
  const [availability, setAvailability] = useState<'immediate' | 'custom'>('immediate');
  const [availabilityNote, setAvailabilityNote] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email || '');
  const isValidContact = /^\d{10}$/.test(form.contact || '');

  useEffect(() => {
    const userData = localStorage.getItem('user');
    const parsedUser = userData ? JSON.parse(userData) : null;
    setUser(parsedUser);

    // Load saved resume from profile
    const cachedProfile = localStorage.getItem('profile');
    if (cachedProfile) {
      try {
        const p = JSON.parse(cachedProfile);
        if (p.resumeData && p.resumeName) {
          setProfileResume({ name: p.resumeName, data: p.resumeData });
        }
      } catch (error) {
        console.error('Error parsing profile data:', error);
      }
    }

    // Get all jobs (static + recruiter-created)
    const recruiterJobs = JSON.parse(localStorage.getItem('jobAlerts') || '[]');
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

    const found = allJobs.find((j: any) => String(j.id) === String(jobId));
    setJob(found || null);
  }, [jobId]);

  if (!user || user.userType !== 'student') {
    return <div className="flex flex-col items-center justify-center min-h-screen"><h2 className="text-2xl">Only students can apply for jobs.</h2></div>;
  }
  if (!job) {
    return <div className="flex flex-col items-center justify-center min-h-screen"><h2 className="text-2xl">Job not found.</h2></div>;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Basic validation
    if (!form.name || !form.contact || !form.email) {
      setError('Please fill in all required fields');
      setIsLoading(false);
      return;
    }

    if (!profileResume && !form.resume) {
      setError('Please attach a resume file');
      setIsLoading(false);
      return;
    }

    if (!isValidContact) {
      setError('Mobile number must be exactly 10 digits');
      setIsLoading(false);
      return;
    }

    if (!isValidEmail) {
      setError('Please enter a valid email address');
      setIsLoading(false);
      return;
    }

    try {
      const toBase64 = (file: File) => new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
      });

      let resumeData: string;
      let resumeName: string;

      if (form.resume) {
        resumeData = await toBase64(form.resume);
        resumeName = form.resume.name;
      } else if (profileResume) {
        resumeData = profileResume.data;
        resumeName = profileResume.name;
      } else {
        throw new Error('Resume not found');
      }

      const applicationData = {
        applicantEmail: form.email,
        applicantName: form.name,
        applicantContact: form.contact,
        applicationType: 'job',
        targetId: String(job.id),
        targetTitle: job.position,
        targetCompany: job.company,
        resumeData,
        resumeName,
        availability,
        availabilityNote: availability === 'custom' ? availabilityNote : 'Available immediately',
      };

      console.log('Submitting application:', applicationData);

      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(applicationData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit application');
      }

      setSuccess(true);
      setTimeout(() => navigate('/jobs'), 2000);
    } catch (error: any) {
      console.error('Submission error:', error);
      setError(error.message || 'Error submitting application. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-8">
      <div className="max-w-5xl mx-auto px-4">
        <div className="mb-2">
          <button onClick={() => navigate('/jobs')} className="text-blue-600 hover:text-blue-700 inline-flex items-center">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Jobs
          </button>
        </div>
        <h1 className="text-3xl font-bold text-center mb-4">Apply for {job.position}</h1>
        <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-xl mx-auto">
          <div className="mb-4">
            <div className="font-semibold text-lg text-blue-700">{job.company}</div>
            <div className="text-gray-700">{job.type} | Deadline: {job.deadline}</div>
          </div>

          {error && <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">{error}</div>}
          {success && <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">Application submitted successfully! Redirecting...</div>}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Name"
              className="border p-2 rounded"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              required
              disabled={isLoading}
            />

            <input
              type="text"
              placeholder="Contact Number"
              className={`border p-2 rounded ${form.contact && !isValidContact ? 'border-red-400' : 'border-gray-300'}`}
              value={form.contact}
              onChange={e => setForm({ ...form, contact: e.target.value.replace(/\D/g, '').slice(0, 10) })}
              required
              disabled={isLoading}
              inputMode="numeric"
              maxLength={10}
            />
            {form.contact && !isValidContact && (
              <div className="text-xs text-red-600 -mt-2">Mobile number must be exactly 10 digits.</div>
            )}

            <input
              type="email"
              placeholder="Email"
              className={`border p-2 rounded ${form.email && !isValidEmail ? 'border-red-400' : 'border-gray-300'}`}
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              required
              disabled={isLoading}
            />
            {form.email && !isValidEmail && (
              <div className="text-xs text-red-600 -mt-2">Please enter a valid email address.</div>
            )}

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="mb-3">
                <div className="flex items-center gap-2 text-gray-900 font-semibold">
                  <span>Your resume</span>
                  {profileResume && <span className="text-xs font-medium text-gray-600">• Updated recently</span>}
                </div>
                <div className="text-sm text-gray-700 mt-1">
                  {profileResume ? (
                    <>
                      Your current resume will be submitted along with this application.{' '}
                      <button type="button" className="text-blue-600 underline" onClick={() => navigate('/profile')}>Edit resume</button>
                      <div className="text-gray-600 mt-1">Selected: <span className="font-medium">{profileResume.name}</span></div>
                    </>
                  ) : (
                    <>
                      No resume found in your profile. Please <button type="button" className="text-blue-600 underline" onClick={() => navigate('/profile')}>upload your resume</button> to auto-attach.
                    </>
                  )}
                </div>
              </div>

              <div className="mt-4">
                <div className="font-semibold text-gray-900 mb-2">Confirm your availability</div>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-gray-800">
                    <input
                      type="radio"
                      className="accent-blue-600"
                      checked={availability === 'immediate'}
                      onChange={() => setAvailability('immediate')}
                    />
                    <span>Yes, I am available to join immediately</span>
                  </label>
                  <label className="flex items-center gap-2 text-gray-800">
                    <input
                      type="radio"
                      className="accent-blue-600"
                      checked={availability === 'custom'}
                      onChange={() => setAvailability('custom')}
                    />
                    <span>No (Please specify your availability)</span>
                  </label>
                  {availability === 'custom' && (
                    <input
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      placeholder="e.g., Available after 2 weeks"
                      value={availabilityNote}
                      onChange={(e) => setAvailabilityNote(e.target.value)}
                    />
                  )}
                </div>
              </div>

              <div className="mt-6">
                <div className="font-semibold text-gray-900">Custom resume <span className="text-gray-500 font-normal">(Optional)</span></div>
                <div className="text-sm text-gray-600 mb-2">Employer can download and view this resume</div>

                {profileResume && !form.resume ? (
                  <div className="text-sm text-gray-700 mt-1">
                    Using profile resume:
                    <a href={profileResume.data} download={profileResume.name} className="text-blue-600 underline ml-1">{profileResume.name}</a>
                    <button
                      type="button"
                      className="ml-3 text-blue-600 underline"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Use a different file
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.doc,.docx"
                      className="hidden"
                      onChange={e => setForm({ ...form, resume: e.target.files?.[0] || null })}
                      disabled={isLoading}
                    />
                  </div>
                ) : (
                  <>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      className="border p-2 rounded w-full"
                      onChange={e => setForm({ ...form, resume: e.target.files?.[0] || null })}
                      disabled={isLoading}
                    />
                    {form.resume && (
                      <div className="text-xs text-gray-700 mt-1">
                        Selected: {form.resume.name}
                        <button
                          type="button"
                          className="ml-2 text-red-600"
                          onClick={() => setForm({ ...form, resume: null })}
                        >
                          ×
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            <button
              type="submit"
              className={`px-4 py-2 rounded-lg font-semibold transition-colors mt-2 ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
                } text-white`}
              disabled={isLoading || !isValidEmail || !isValidContact}
            >
              {isLoading ? 'Submitting...' : 'Submit Application'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ApplyJobPage;