import React, { useEffect, useState, useMemo } from 'react';
import { Camera, Save, Mail, GraduationCap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const toBase64 = (file: File): Promise<string> => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = () => resolve(reader.result as string);
  reader.onerror = reject;
  reader.readAsDataURL(file);
});

const COMMON_SKILLS = [
  'HTML', 'CSS', 'JavaScript', 'TypeScript', 'React', 'Next.js', 'Angular', 'Vue',
  'Node.js', 'Express', 'Java', 'Spring Boot', 'Hibernate', 'Python', 'Django', 'Flask',
  'C', 'C++', 'C#', 'Kotlin', 'Swift', 'React Native', 'Flutter',
  'MongoDB', 'MySQL', 'PostgreSQL', 'SQL', 'NoSQL',
  'Tailwind CSS', 'Redux', 'GraphQL', 'REST API',
  'Git', 'Docker', 'Kubernetes', 'Linux', 'Bash', 'CI/CD',
  'AWS', 'Azure', 'GCP', 'Firebase',
  'Jest', 'Testing Library', 'Cypress', 'Selenium',
  'Machine Learning', 'Data Structures', 'Algorithms'
];

const DESIGNATION_OPTIONS = [
  'HR',
  'Hiring Manager',
  'Recruiter',
  'Talent Acquisition Specialist',
  'Director of Recruitment',
  'Other',
];

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [form, setForm] = useState<any>({});
  const [saving, setSaving] = useState(false);
  const [designationChoice, setDesignationChoice] = useState<string>('');
  const [designationOther, setDesignationOther] = useState<string>('');

  // Technical skills tags + input
  const [techInput, setTechInput] = useState('');
  const [techSkills, setTechSkills] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    const u = localStorage.getItem('user');
    const parsed = u ? JSON.parse(u) : null;
    if (!parsed) { navigate('/login'); return; }
    setUser(parsed);

    // Use cached profile immediately
    const cached = localStorage.getItem('profile');
    if (cached) {
      try {
        const cachedObj = JSON.parse(cached);
        setForm(cachedObj);
        if (cachedObj.technicalSkills) {
          const arr = String(cachedObj.technicalSkills).split(',').map((s: string) => s.trim()).filter(Boolean);
          setTechSkills(Array.from(new Set(arr)));
        }
      } catch { }
    }

    // Fetch fresh profile
    fetch(`/api/profile?email=${encodeURIComponent(parsed.email)}&userType=${encodeURIComponent(parsed.userType)}`)
      .then(r => r.json()).then(data => {
        if (data.user) {
          setForm(data.user);
          const { avatarData, avatarMime, ...light } = data.user;
          const profileLight = { ...light, resumeName: data.user.resumeName, resumeData: data.user.resumeData, resumeUpdatedAt: Date.now() };
          localStorage.setItem('profile', JSON.stringify(profileLight));
          // Keep uploads store in sync for auto-attach on apply pages
          if (data.user.resumeData && data.user.resumeName) {
            try {
              const resumes = JSON.parse(localStorage.getItem('allResumes') || '[]');
              const filtered = resumes.filter((r: any) => r.email !== data.user.email);
              filtered.push({ email: data.user.email, fileName: data.user.resumeName, fileData: data.user.resumeData, updatedAt: Date.now() });
              localStorage.setItem('allResumes', JSON.stringify(filtered));
            } catch { }
          }
          if (data.user.technicalSkills) {
            const arr = String(data.user.technicalSkills).split(',').map((s: string) => s.trim()).filter(Boolean);
            setTechSkills(Array.from(new Set(arr)));
          }
        }
      }).catch(() => { });
  }, [navigate]);

  // Keep designation dropdown and custom input in sync with form.designation
  useEffect(() => {
    const d = String(form.designation || '').trim();
    const match = DESIGNATION_OPTIONS.find((opt) => opt !== 'Other' && opt.toLowerCase() === d.toLowerCase());
    if (match) {
      setDesignationChoice(match);
      setDesignationOther('');
    } else if (d) {
      setDesignationChoice('Other');
      setDesignationOther(d);
    } else {
      setDesignationChoice('');
      setDesignationOther('');
    }
  }, [form.designation]);

  const handleChange = (field: string, value: string) => setForm((prev: any) => ({ ...prev, [field]: value }));

  const handleAvatar = async (file: File | null) => {
    if (!file) return;
    const data = await toBase64(file);
    setForm((p: any) => ({ ...p, avatarData: data, avatarMime: file.type }));
  };

  const handleResume = async (file: File | null) => {
    if (!file) return;

    // Check file size (limit to 1MB to be safe with localStorage)
    const maxSize = 1 * 1024 * 1024; // 1MB
    if (file.size > maxSize) {
      alert('File size too large. Please select a file smaller than 1MB. Consider compressing your PDF or using a smaller version.');
      return;
    }

    try {
      const data = await toBase64(file);
      setForm((p: any) => ({ ...p, resumeData: data, resumeName: file.name }));
    } catch (error) {
      console.error('Error processing resume:', error);
      alert('Error processing resume file. Please try again with a smaller file.');
    }
  };

  const normalizedInput = techInput.trim();
  const filteredSuggestions = useMemo(() => {
    if (normalizedInput.length < 2) return [] as string[];
    const lower = normalizedInput.toLowerCase();
    return COMMON_SKILLS.filter(s => s.toLowerCase().includes(lower) && !techSkills.includes(s)).slice(0, 8);
  }, [normalizedInput, techSkills]);

  const addSkill = (skill: string) => {
    const clean = skill.trim();
    if (!clean) return;
    if (techSkills.some(s => s.toLowerCase() === clean.toLowerCase())) return;
    setTechSkills(prev => [...prev, clean]);
    setTechInput('');
  };

  const removeSkill = (skill: string) => setTechSkills(prev => prev.filter(s => s !== skill));

  const onTechKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addSkill(normalizedInput);
    } else if (e.key === 'Backspace' && !normalizedInput && techSkills.length) {
      setTechSkills(prev => prev.slice(0, -1));
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = { ...form, technicalSkills: techSkills.join(', ') };
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to update');
      if (data.user) {
        try {
          localStorage.setItem('user', JSON.stringify({ email: data.user.email, fullName: data.user.fullName, userType: data.user.userType }));
          const { avatarData, avatarMime, ...light } = data.user;

          // Only cache resume data if it's not too large
          let profileLight;
          if (data.user.resumeData && data.user.resumeData.length > 500000) { // ~500KB limit
            // Don't cache large resume data locally
            profileLight = { ...light, resumeName: data.user.resumeName, resumeUpdatedAt: Date.now() };
            console.log('Resume data too large for local caching, storing on server only');
          } else {
            profileLight = { ...light, resumeName: data.user.resumeName, resumeData: data.user.resumeData, resumeUpdatedAt: Date.now() };
          }

          localStorage.setItem('profile', JSON.stringify(profileLight));
        } catch (storageError) {
          console.error('localStorage quota exceeded:', storageError);
          // If localStorage is full, try to save without resume data
          try {
            const { avatarData, avatarMime, resumeData, ...light } = data.user;
            const profileLight = { ...light, resumeName: data.user.resumeName, resumeUpdatedAt: Date.now() };
            localStorage.setItem('profile', JSON.stringify(profileLight));
            alert('Profile saved, but resume data could not be cached locally due to storage limits.');
          } catch (finalError) {
            alert('Profile saved to server, but could not cache locally. Please clear some browser data and try again.');
          }
        }

        // Sync uploads store
        if (data.user.resumeData && data.user.resumeName) {
          try {
            const resumes = JSON.parse(localStorage.getItem('allResumes') || '[]');
            const filtered = resumes.filter((r: any) => r.email !== data.user.email);
            filtered.push({ email: data.user.email, fileName: data.user.resumeName, fileData: data.user.resumeData, updatedAt: Date.now() });
            localStorage.setItem('allResumes', JSON.stringify(filtered));
          } catch (uploadError) {
            console.error('Could not update uploads store:', uploadError);
          }
        }
        setUser({ email: data.user.email, fullName: data.user.fullName, userType: data.user.userType });
        setForm(data.user);
      }
      alert('Profile updated');
    } catch (e: any) {
      alert(e.message);
    } finally { setSaving(false); }
  };

  if (!user) return null;

  const isStudent = form.userType === 'student';

  return (
    <div className="py-20">
      <div className="max-w-5xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">My Profile</h1>

        {/* Header Card */}
        <div className="bg-white rounded-2xl shadow p-6 mb-8">
          <div className="flex items-center gap-6">
            <div className="relative w-24 h-24">
              {form.avatarData ? (
                <img src={form.avatarData} alt="avatar" className="w-24 h-24 rounded-full object-cover" />
              ) : (
                <div className="w-24 h-24 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-2xl font-bold">
                  {(form.fullName || form.email || 'U').charAt(0)}
                </div>
              )}
              <label className="absolute -bottom-2 -right-2 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full cursor-pointer">
                <Camera className="w-4 h-4" />
                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleAvatar(e.target.files ? e.target.files[0] : null)} />
              </label>
            </div>
            <div>
              <div className="text-xl font-semibold text-gray-900">{form.fullName || 'Your Name'}</div>
              <div className="text-gray-600 flex items-center"><Mail className="w-4 h-4 mr-2" /> {form.email}</div>
            </div>
          </div>
        </div>

        {/* Personal Details */}
        <div className="bg-white rounded-2xl shadow p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Personal Details</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input value={form.fullName || ''} onChange={(e) => handleChange('fullName', e.target.value)} className="w-full px-4 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
              <input type="date" value={form.dob || ''} onChange={(e) => handleChange('dob', e.target.value)} className="w-full px-4 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
              <select value={form.gender || ''} onChange={(e) => handleChange('gender', e.target.value)} className="w-full px-4 py-2 border rounded-lg">
                <option value="">Select</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
              <input value={form.phone || ''} onChange={(e) => handleChange('phone', e.target.value.replace(/[^0-9]/g, '').slice(0, 10))} className="w-full px-4 py-2 border rounded-lg" />
            </div>
          </div>
        </div>

        {/* Academic Details (Student) */}
        {isStudent && (
          <div className="bg-white rounded-2xl shadow p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center"><GraduationCap className="w-4 h-4 mr-2" /> Academic Details</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <input placeholder="Department" value={form.department || ''} onChange={(e) => handleChange('department', e.target.value)} className="px-4 py-2 border rounded-lg" />
              <input placeholder="CGPA" value={form.cgpa || ''} onChange={(e) => handleChange('cgpa', e.target.value)} className="px-4 py-2 border rounded-lg" />
              <input placeholder="10th Marks (%)" value={form.tenthMarks || ''} onChange={(e) => handleChange('tenthMarks', e.target.value)} className="px-4 py-2 border rounded-lg" />
              <input placeholder="12th/Diploma Marks (%)" value={form.twelfthMarks || ''} onChange={(e) => handleChange('twelfthMarks', e.target.value)} className="px-4 py-2 border rounded-lg" />
            </div>
          </div>
        )}

        {/* Recruiter Details */}
        {!isStudent && (
          <div className="bg-white rounded-2xl shadow p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Recruiter Details</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                <input
                  placeholder="Company Name"
                  value={form.companyName || ''}
                  onChange={(e) => handleChange('companyName', e.target.value)}
                  className="px-4 py-2 border rounded-lg w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Designation</label>
                <select
                  value={designationChoice}
                  onChange={(e) => {
                    const val = e.target.value;
                    setDesignationChoice(val);
                    if (val === 'Other') {
                      // keep current custom value in form.designation
                      handleChange('designation', designationOther);
                    } else {
                      handleChange('designation', val);
                    }
                  }}
                  className="px-4 py-2 border rounded-lg w-full"
                >
                  <option value="">Select a designation</option>
                  {DESIGNATION_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
                {designationChoice === 'Other' && (
                  <input
                    className="mt-2 px-4 py-2 border rounded-lg w-full"
                    placeholder="Other: enter your designation"
                    value={designationOther}
                    onChange={(e) => {
                      setDesignationOther(e.target.value);
                      handleChange('designation', e.target.value);
                    }}
                  />
                )}
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-2">This company name controls which student applications you can view and download.</p>
          </div>
        )}

        {/* Skills & Certifications with tags and suggestions (Students only) */}
        {isStudent && (
          <div className="bg-white rounded-2xl shadow p-6 mb-8 relative">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Skills & Certifications</h2>
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">Technical Skills</label>
              <div className="border border-gray-300 rounded-lg px-3 py-2">
                <div className="flex flex-wrap gap-2 mb-2">
                  {techSkills.map((skill) => (
                    <span key={skill} className="inline-flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                      {skill}
                      <button onClick={() => removeSkill(skill)} className="ml-2 text-blue-700 hover:text-blue-900">×</button>
                    </span>
                  ))}
                </div>
                <input
                  value={techInput}
                  onChange={(e) => { setTechInput(e.target.value); setShowSuggestions(true); }}
                  onKeyDown={onTechKeyDown}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                  placeholder="Type to add (e.g., html, css, javascript, java)"
                  className="w-full outline-none"
                />
              </div>
              {showSuggestions && filteredSuggestions.length > 0 && (
                <div className="absolute z-10 mt-1 w-full max-w-xl bg-white border border-gray-200 rounded-md shadow">
                  {filteredSuggestions.map(s => (
                    <button key={s} onMouseDown={() => addSkill(s)} className="block w-full text-left px-3 py-2 hover:bg-gray-50">
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <textarea placeholder="Soft Skills" value={form.softSkills || ''} onChange={(e) => handleChange('softSkills', e.target.value)} className="w-full px-4 py-2 border rounded-lg" rows={2} />
              <textarea placeholder="Certifications" value={form.certifications || ''} onChange={(e) => handleChange('certifications', e.target.value)} className="w-full px-4 py-2 border rounded-lg" rows={2} />
            </div>
          </div>
        )}

        {/* Internship / Projects (Students only) */}
        {isStudent && (
          <div className="bg-white rounded-2xl shadow p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Internship / Projects</h2>
            <div className="grid md:grid-cols-2 gap-4 mb-3">
              <input placeholder="Internship Title" value={form.internshipTitle || ''} onChange={(e) => handleChange('internshipTitle', e.target.value)} className="px-4 py-2 border rounded-lg" />
              <input placeholder="Company" value={form.internshipCompany || ''} onChange={(e) => handleChange('internshipCompany', e.target.value)} className="px-4 py-2 border rounded-lg" />
              <input placeholder="Duration" value={form.internshipDuration || ''} onChange={(e) => handleChange('internshipDuration', e.target.value)} className="px-4 py-2 border rounded-lg" />
            </div>
            <textarea placeholder="Internship Description" value={form.internshipDescription || ''} onChange={(e) => handleChange('internshipDescription', e.target.value)} className="w-full px-4 py-2 border rounded-lg mb-3" rows={3} />
            <textarea placeholder="Project Details" value={form.projectDetails || ''} onChange={(e) => handleChange('projectDetails', e.target.value)} className="w-full px-4 py-2 border rounded-lg" rows={3} />
          </div>
        )}

        {/* Placement Preferences (Students only) */}
        {isStudent && (
          <div className="bg-white rounded-2xl shadow p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Placement Preferences</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <input placeholder="Preferred Role" value={form.preferredRole || ''} onChange={(e) => handleChange('preferredRole', e.target.value)} className="px-4 py-2 border rounded-lg" />
              <input placeholder="Preferred Location" value={form.preferredLocation || ''} onChange={(e) => handleChange('preferredLocation', e.target.value)} className="px-4 py-2 border rounded-lg" />
              <input placeholder="Expected Salary" value={form.expectedSalary || ''} onChange={(e) => handleChange('expectedSalary', e.target.value)} className="px-4 py-2 border rounded-lg" />
              <select value={form.relocation || ''} onChange={(e) => handleChange('relocation', e.target.value)} className="px-4 py-2 border rounded-lg">
                <option value="">Willing to Relocate?</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
                <option value="maybe">Maybe</option>
              </select>
            </div>
          </div>
        )}

        {/* Resume (Students only) */}
        {isStudent && (
          <div className="bg-white rounded-2xl shadow p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Resume</h2>
            <input type="file" accept=".pdf,.doc,.docx" onChange={(e) => handleResume(e.target.files ? e.target.files[0] : null)} />
            {form.resumeName && (
              <div className="flex items-center justify-between mt-2 p-3 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-700">{form.resumeName}</div>
                <button
                  onClick={() => {
                    setForm((prev: any) => ({ ...prev, resumeName: null, resumeData: null }));
                    // Also remove from localStorage
                    try {
                      const resumes = JSON.parse(localStorage.getItem('allResumes') || '[]');
                      const filtered = resumes.filter((r: any) => r.email !== user.email);
                      localStorage.setItem('allResumes', JSON.stringify(filtered));

                      // Update profile cache
                      const cachedProfile = localStorage.getItem('profile');
                      if (cachedProfile) {
                        const p = JSON.parse(cachedProfile);
                        const light = { ...p, resumeName: null, resumeData: null, resumeUpdatedAt: Date.now() };
                        localStorage.setItem('profile', JSON.stringify(light));
                      }
                    } catch { }
                  }}
                  className="text-red-600 hover:text-red-800 text-sm font-medium"
                >
                  Remove
                </button>
              </div>
            )}
            <div className="text-sm text-gray-600 mt-2">
              Once you upload your resume here, it will be automatically attached when you apply for internships or jobs.
              <button type="button" className="text-blue-600 underline" onClick={() => navigate('/profile')}>Update it in your profile</button> if you want to change it.
            </div>
          </div>
        )}

        <div className="flex justify-between items-center">
          <button
            onClick={() => {
              if (confirm('This will clear all cached data including resumes. Are you sure?')) {
                localStorage.removeItem('profile');
                localStorage.removeItem('allResumes');
                alert('Cache cleared. Please refresh the page.');
              }
            }}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 underline"
          >
            Clear Cache (if storage issues)
          </button>
          <button onClick={handleSave} disabled={saving} className={`px-6 py-3 rounded-lg font-semibold text-white ${saving ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'} flex items-center`}>
            {saving ? 'Saving...' : 'Save Changes'}
            <Save className="w-4 h-4 ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
