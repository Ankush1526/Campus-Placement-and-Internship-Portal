import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Briefcase, Calendar, MapPin, ArrowLeft, ArrowRight, Bookmark, Check, Download, Lock, Edit3 } from 'lucide-react';
import { internships as staticInternships } from '../data/internships';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const InternshipDetailsPage: React.FC = () => {
  const { internshipId } = useParams();
  const navigate = useNavigate();
  const [internship, setInternship] = useState<any>(null);
  const [savedIds, setSavedIds] = useState<number[]>([]);
  const [user, setUser] = useState<any>(null);
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 1. Get User Data
    const userData = localStorage.getItem('user');
    const parsedUser = userData ? JSON.parse(userData) : null;
    setUser(parsedUser);

    // 2. Get Saved Internships
    const saved = JSON.parse(localStorage.getItem('savedInternships') || '[]');
    setSavedIds(Array.isArray(saved) ? saved : []);

    // 3. Find Internship and apply Security Logic
    const found = staticInternships.find((i: any) => String(i.id) === String(internshipId));
    
    if (parsedUser?.userType === 'recruiter') {
      // If recruiter, only allow viewing if they own the post
      if (found && found.postedBy === parsedUser._id) {
        setInternship(found);
      } else if (found) {
        setInternship('unauthorized');
      } else {
        setInternship(null);
      }
    } else {
      // Students and Guests can view all
      setInternship(found || null);
    }
  }, [internshipId]);

  const toggleSave = (id: number) => {
    setSavedIds((prev) => {
      const exists = prev.includes(id);
      const next = exists ? prev.filter((sid) => sid !== id) : [...prev, id];
      localStorage.setItem('savedInternships', JSON.stringify(next));
      return next;
    });
  };

  const campusDetails = useMemo(() => {
    if (!internship || internship === 'unauthorized') return null as any;
    const isLiveU = String(internship.company).toLowerCase().includes('live u');

    const formatDeadline = (d: string | undefined) => {
      if (!d) return 'Will Be Declared Soon';
      const date = new Date(d);
      if (isNaN(date.getTime())) return d as string;
      const day = String(date.getDate()).padStart(2, '0');
      const month = date.toLocaleString('en-US', { month: 'short' });
      const year = date.getFullYear();
      const weekday = date.toLocaleString('en-US', { weekday: 'long' });
      return `${day} ${month}, ${year} - ${weekday}`;
    };

    const baseDetails = {
      companyName: internship.company,
      companyType: isLiveU ? 'MNC' : 'Company',
      campusDateTime: 'Will Be Declared Soon',
      lastRegistrationDate: formatDeadline(isLiveU ? '2025-08-01' : internship.deadline),
      venue: 'Will be declared soon',
      profiles: [internship.position],
      ctc: internship.stipend || 'As per company standards',
      workLocation: internship.location,
      descriptionTitle: internship.position,
      responsibilities: internship.requirements || [],
      skillsSoft: [],
      selectionProcess: ['CV Screening', 'Interview(s)'],
      eligibilityEducation: 'As per company criteria',
      eligibilityCriteria: 'No active backlogs preferred',
      registrationProcess: 'Online',
      registrationLink: `/apply-internship/${internship.id}`,
      aboutCompany: internship.description,
    };

    return {
      ...baseDetails,
      bannerTitle: isLiveU ? `Campus by ${internship.company} 25-26 Batch` : `${internship.company} Campus Drive`,
    };
  }, [internship]);

  const handleDownloadPDF = async () => {
    try {
      const element = printRef.current;
      if (!element) return;

      const hiddenNodes: Array<{ node: HTMLElement; prevDisplay: string | null }> = [];
      element.querySelectorAll('.no-pdf').forEach((node) => {
        const el = node as HTMLElement;
        hiddenNodes.push({ node: el, prevDisplay: el.style.display || null });
        el.style.display = 'none';
      });

      const canvas = await html2canvas(element, {
        useCORS: true,
        scrollY: -window.scrollY,
        backgroundColor: '#ffffff',
        scale: 2,
      } as any);

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      const imgWidthPx = canvas.width;
      const imgHeightPx = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidthPx, pdfHeight / imgHeightPx);
      const imgWidth = imgWidthPx * ratio;
      const imgHeight = imgHeightPx * ratio;

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', (pdfWidth - imgWidth) / 2, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', (pdfWidth - imgWidth) / 2, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;
      }

      const fileBase = (internship?.company || 'Internship')
        .replace(/[^a-z0-9]+/gi, '_')
        .replace(/^_+|_+$/g, '');
      pdf.save(`${fileBase}_Campus_Drive.pdf`);

      hiddenNodes.forEach(({ node, prevDisplay }) => {
        node.style.display = prevDisplay ?? '';
      });
    } catch (err) {
      alert('Failed to generate PDF. Please try again.');
    }
  };

  // Error States
  if (internship === 'unauthorized') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-20">
        <div className="text-center bg-white p-10 rounded-2xl shadow-xl max-w-md">
          <Lock className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Restricted</h2>
          <p className="text-gray-600 mb-6">Recruiters can only view details of their own internship postings.</p>
          <button onClick={() => navigate('/internships')} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold">Go Back</button>
        </div>
      </div>
    );
  }

  if (!internship) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-32 text-center">
        <button onClick={() => navigate(-1)} className="text-blue-600 hover:text-blue-700 mb-6 flex items-center justify-center">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </button>
        <div className="text-xl text-gray-600">Internship details not found.</div>
      </div>
    );
  }

  const isSaved = savedIds.includes(internship.id);
  const isRecruiter = user?.userType === 'recruiter';

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-8">
      <div className="max-w-5xl mx-auto px-4">
        <button onClick={() => navigate(-1)} className="text-blue-600 hover:text-blue-700 mb-6 flex items-center no-pdf">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Internships
        </button>

        <div ref={printRef}>
          {/* Main Header Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border-l-4 border-blue-600">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{internship.position}</h1>
                <p className="text-xl text-blue-600 font-medium mb-4">{internship.company}</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                  <div className="flex items-center"><MapPin className="w-4 h-4 mr-2 text-gray-400" />{internship.location}</div>
                  <div className="flex items-center"><Briefcase className="w-4 h-4 mr-2 text-gray-400" />{internship.duration}</div>
                  <div className="flex items-center font-semibold text-green-600">{internship.stipend}</div>
                  <div className="flex items-center"><Calendar className="w-4 h-4 mr-2 text-gray-400" />Apply by {internship.deadline}</div>
                </div>
              </div>

              <div className="flex flex-col gap-3 no-pdf min-w-[200px]">
                {isRecruiter ? (
                  <button 
                    className="bg-purple-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-purple-700 flex items-center justify-center"
                    onClick={() => navigate(`/edit-internship/${internship.id}`)}
                  >
                    <Edit3 className="w-4 h-4 mr-2" /> Edit Posting
                  </button>
                ) : (
                  <>
                    <button
                      className={`${user?.userType === 'student' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'} text-white px-6 py-3 rounded-lg font-semibold flex items-center justify-center`}
                      onClick={() => user?.userType === 'student' && navigate(`/apply-internship/${internship.id}`)}
                      disabled={user?.userType !== 'student'}
                    >
                      Apply Now <ArrowRight className="w-4 h-4 ml-2" />
                    </button>
                    <button
                      onClick={() => user?.userType === 'student' && toggleSave(internship.id)}
                      disabled={user?.userType !== 'student'}
                      className={`${isSaved ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'border-gray-300 hover:bg-gray-50'} px-6 py-3 rounded-lg font-semibold border flex items-center justify-center`}
                    >
                      {isSaved ? <><Check className="w-4 h-4 mr-2" /> Saved</> : <><Bookmark className="w-4 h-4 mr-2" /> Save</>}
                    </button>
                  </>
                )}
                <button onClick={handleDownloadPDF} className="text-sm text-gray-500 hover:text-blue-600 flex items-center justify-center gap-1">
                  <Download className="w-4 h-4" /> Download PDF Brochure
                </button>
              </div>
            </div>
          </div>

          {/* Campus Details Section */}
          {campusDetails && (
            <div className="bg-white rounded-xl shadow-lg p-8 mb-6 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Building2 className="w-24 h-24" />
               </div>
              <div className="mb-6">
                <span className="px-4 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-bold">
                  {campusDetails.bannerTitle}
                </span>
              </div>

              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <div className="w-2 h-6 bg-blue-600 rounded-full mr-3"></div>
                Campus Drive Details
              </h2>

              <div className="grid md:grid-cols-2 gap-6 bg-gray-50 rounded-2xl p-6 mb-8">
                {[
                  { label: "Company Name", value: campusDetails.companyName },
                  { label: "Company Type", value: campusDetails.companyType },
                  { label: "Campus Date", value: campusDetails.campusDateTime },
                  { label: "Last Date to Register", value: campusDetails.lastRegistrationDate },
                  { label: "Venue", value: campusDetails.venue, full: true }
                ].map((item, idx) => (
                  <div key={idx} className={item.full ? "md:col-span-2" : ""}>
                    <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">{item.label}</div>
                    <div className="text-gray-900 font-medium">{item.value}</div>
                  </div>
                ))}
              </div>

              <h3 className="text-lg font-bold text-gray-900 mb-4">Job Role & Eligibility</h3>
              <div className="grid md:grid-cols-2 gap-6 bg-blue-50/50 rounded-2xl p-6">
                 <div>
                    <div className="text-xs font-bold text-blue-400 uppercase">Internship Profile</div>
                    <div className="text-gray-900 font-medium">{campusDetails.profiles.join(', ')}</div>
                 </div>
                 <div>
                    <div className="text-xs font-bold text-blue-400 uppercase">Work Location</div>
                    <div className="text-gray-900 font-medium">{campusDetails.workLocation}</div>
                 </div>
                 <div className="md:col-span-2">
                    <div className="text-xs font-bold text-blue-400 uppercase">Education Qualification</div>
                    <div className="text-gray-900 font-medium">{campusDetails.eligibilityEducation}</div>
                 </div>
              </div>
              
              <div className="mt-8">
                <h3 className="font-bold text-gray-900 mb-3">Key Responsibilities</h3>
                <ul className="grid md:grid-cols-2 gap-3">
                  {campusDetails.responsibilities.map((r: string, idx: number) => (
                    <li key={idx} className="flex items-start text-sm text-gray-700">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 mr-3 shrink-0" />
                      {r}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Simple Description for PDF */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-6 no-pdf">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Detailed Description</h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">{internship.description}</p>
          </div>
        </div>

        {/* Benefits & Requirements Grid */}
        <div className="grid md:grid-cols-2 gap-6 no-pdf">
          <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-orange-400">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center">
              <ListChecks className="w-5 h-5 mr-2 text-orange-500" /> Technical Requirements
            </h3>
            <div className="flex flex-wrap gap-2">
              {(internship.requirements || []).map((req: string, i: number) => (
                <span key={i} className="px-3 py-1 bg-orange-50 text-orange-700 text-xs font-medium rounded-full border border-orange-100">
                  {req}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-green-400">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center">
              <Check className="w-5 h-5 mr-2 text-green-500" /> Perks & Benefits
            </h3>
            <ul className="space-y-2">
              {(internship.benefits || []).map((b: string, i: number) => (
                <li key={i} className="text-sm text-gray-600 flex items-center">
                   <div className="w-1 h-1 bg-green-400 rounded-full mr-2" /> {b}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

// Internal icon component for cleaner code
const Building2 = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-7h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

const ListChecks = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
  </svg>
);

export default InternshipDetailsPage;