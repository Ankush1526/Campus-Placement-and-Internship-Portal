import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Briefcase, Calendar, MapPin, ArrowLeft, ArrowRight, Bookmark, Check, Download } from 'lucide-react';
import { jobs as staticJobs } from '../data/jobs';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const JobDetailsPage: React.FC = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState<any>(null);
  const [savedIds, setSavedIds] = useState<number[]>([]);
  const [user, setUser] = useState<any>(null);
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    setUser(userData ? JSON.parse(userData) : null);

    const saved = JSON.parse(localStorage.getItem('savedJobs') || '[]');
    setSavedIds(Array.isArray(saved) ? saved : []);

    const recruiterJobs = JSON.parse(localStorage.getItem('jobAlerts') || '[]');
    const allJobs = [
      ...staticJobs,
      ...recruiterJobs,
    ];

    const found = allJobs.find((j: any) => String(j.id) === String(jobId));
    setJob(found || null);
  }, [jobId]);

  const toggleSave = (id: number) => {
    setSavedIds(prev => {
      const exists = prev.includes(id);
      const next = exists ? prev.filter(sid => sid !== id) : [...prev, id];
      localStorage.setItem('savedJobs', JSON.stringify(next));
      return next;
    });
  };

  // Build enhanced campus drive details if available/required
  const campusDetails = useMemo(() => {
    if (!job) return null as any;
    const isLiveU = String(job.company).toLowerCase().includes('live u');

    // Helper to format deadline like: 01 Aug, 2025 - Friday
    const formatDeadline = (d: string | undefined) => {
      if (!d) return 'Will Be Declared Soon';
      const date = new Date(d);
      if (isNaN(date.getTime())) return d;
      const day = String(date.getDate()).padStart(2, '0');
      const month = date.toLocaleString('en-US', { month: 'short' });
      const year = date.getFullYear();
      const weekday = date.toLocaleString('en-US', { weekday: 'long' });
      return `${day} ${month}, ${year} - ${weekday}`;
    };

    if (isLiveU) {
      return {
        bannerTitle: `Campus by ${job.company} 25-26 Batch`,
        companyName: 'Live U Ltd',
        companyType: 'MNC',
        campusDateTime: 'Will Be Declared Soon',
        lastRegistrationDate: formatDeadline('2025-08-01'),
        venue: 'Will be declare Soon',
        profiles: ['QA Engineer Intern'],
        ctc: '4 LPA',
        workLocation: 'Ahmedabad',
        descriptionTitle: 'QA Testing Engineer Intern',
        responsibilities: [
          'Writing and executing test cases',
          'Reporting bugs and assisting the development team',
          'Performing regression and exploratory testing',
          'Good to have QA tools like JIRA, Selenium, etc.',
          'Troubleshoot and isolate issues, submit bugs and work with developers',
          'Identify areas of improvement from QA perspective and follow-up with solutions',
        ],
        skillsSoft: ['Good English communication', 'Highly motivated & team player'],
        skillsRequiredNote: 'As Mentioned In Job Description',
        selectionProcess: ['CV Screening', 'Technical Interview', 'HR Round'],
        eligibilityEducation:
          'COMPUTER ENGINEERING, INFORMATION TECHNOLOGY, INFORMATION AND COMMUNICATION TECHNOLOGY, COMPUTER ENGG. ARTIFICIAL INTELLINGENCE',
        eligibilityCriteria: '6.50 CPI & Above • No Active Backlog',
        registrationProcess: 'Online',
        registrationLink: `/apply/${job.id}`,
        placementContact: { name: 'AJITBHAI MORI', mobile: '6359701911' },
        otherInfo: [
          'Eligible Branch: B.E.(CE/IT/ICT/AI), MCA, M.Tech(CE), M.Sc.(Data Science), M.Sc.(Cyber Security) 2026 Batch',
          'Training Period: 06 Months',
          'Training Stipend: Rs. 15,000 per month',
          'Bond: No any bond',
          'Joining: Immediate after selection',
        ],
        aboutCompany:
          'LiveU is the pioneer of video-over-bonded-IP and the inventor of LRT™ (LiveU Reliable Transport), the standard for wire-free IP-video protocols. Our mission is to help our customers create more value from video, working across Broadcast, Sport, Media, Entertainment, Pro-AV, Public Safety, Defence, Government, Enterprise, Education and Health verticals. Headquartered in Hackensack, New Jersey, we have over 400 employees, 18 regional points of presence across EMEA, APAC, AMR, and more than 120 partners around the world, giving us global scale combined with local knowledge.',
        website: 'https://www.liveu.tv/',
      };
    }

    // Generic mapping if not Live U
    return {
      bannerTitle: `${job.company} Campus Drive`,
      companyName: job.company,
      companyType: 'Company',
      campusDateTime: 'Will Be Declared Soon',
      lastRegistrationDate: formatDeadline(job.deadline),
      venue: 'Will be declared soon',
      profiles: [job.position],
      ctc: job.salary || 'As per company standards',
      workLocation: job.location,
      descriptionTitle: job.position,
      responsibilities: job.requirements || [],
      skillsSoft: [],
      skillsRequiredNote: undefined,
      selectionProcess: ['CV Screening', 'Interview(s)'],
      eligibilityEducation: 'As per company criteria',
      eligibilityCriteria: 'No active backlogs preferred',
      registrationProcess: 'Online',
      registrationLink: `/apply/${job.id}`,
      placementContact: undefined,
      otherInfo: [],
      aboutCompany: job.description,
      website: undefined,
    };
  }, [job]);

  // Removed TXT download handler

  const handleDownloadPDF = async () => {
    try {
      const element = printRef.current;
      if (!element) return;

      // Hide all elements marked as no-pdf within the capture region
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
        // Types may not include 'scale'; cast to any
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

      // First page
      pdf.addImage(imgData, 'PNG', (pdfWidth - imgWidth) / 2, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;

      // Additional pages
      while (heightLeft > 0) {
        position = heightLeft - imgHeight; // negative value to shift up
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', (pdfWidth - imgWidth) / 2, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;
      }

      const fileBase = (job?.company || 'Job')
        .replace(/[^a-z0-9]+/gi, '_')
        .replace(/^_+|_+$/g, '');
      pdf.save(`${fileBase}_Campus_Drive.pdf`);

      // Restore hidden elements
      hiddenNodes.forEach(({ node, prevDisplay }) => {
        node.style.display = prevDisplay ?? '';
      });
    } catch (err) {
      // Fallback: alert
      alert('Failed to generate PDF. Please try again.');
    }
  };

  if (!job) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12">
        <button onClick={() => navigate(-1)} className="text-blue-600 hover:text-blue-700 mb-6 flex items-center">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </button>
        <div className="text-gray-600">Job not found.</div>
      </div>
    );
  }

  const isSaved = savedIds.includes(job.id);

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-8">
      <div className="max-w-5xl mx-auto px-4">
        <button onClick={() => navigate(-1)} className="text-blue-600 hover:text-blue-700 mb-6 flex items-center">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Jobs
        </button>

        {/* Export region start */}
        <div ref={printRef}>
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{job.position}</h1>
              <div className="text-gray-600">{job.company}</div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-sm text-gray-600">
                <div className="flex items-center"><MapPin className="w-4 h-4 mr-2" />{job.location}</div>
                <div className="flex items-center"><Briefcase className="w-4 h-4 mr-2" />{job.experience}</div>
                <div className="flex items-center">{job.salary}</div>
                <div className="flex items-center"><Calendar className="w-4 h-4 mr-2" />Apply by {job.deadline}</div>
              </div>
            </div>
             <div className="flex flex-col gap-3 no-pdf">
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
              <button
                onClick={() => toggleSave(job.id)}
                className={`${isSaved ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'border border-gray-300 text-gray-700 hover:bg-gray-50'} px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center`}
              >
                {isSaved ? (<><Check className="w-4 h-4 mr-2" /> Saved</>) : (<><Bookmark className="w-4 h-4 mr-2" /> Save Job</>)}
              </button>
              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  onClick={handleDownloadPDF}
                  className="border border-blue-300 text-blue-700 hover:bg-blue-50 px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center"
                >
                  <Download className="w-4 h-4 mr-2" /> Download PDF
                </button>
              </div>
            </div>
          </div>
          </div>

        {/* Campus Drive Details */}
        {campusDetails && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="mb-6">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold">
                {campusDetails.bannerTitle}
              </div>
            </div>

            <h2 className="text-xl font-semibold mb-4">Company Campus Drive Details</h2>
            <div className="grid md:grid-cols-2 gap-4 text-sm bg-blue-50 rounded-lg p-4">
              <div>
                <div className="text-gray-500">Company Name</div>
                <div className="font-medium text-gray-900">{campusDetails.companyName}</div>
              </div>
              <div>
                <div className="text-gray-500">Type of Company</div>
                <div className="font-medium text-gray-900">{campusDetails.companyType}</div>
              </div>
              <div>
                <div className="text-gray-500">Campus Date & Time</div>
                <div className="font-medium text-gray-900">{campusDetails.campusDateTime}</div>
              </div>
              <div>
                <div className="text-gray-500">Last Registration Date</div>
                <div className="font-medium text-gray-900">{campusDetails.lastRegistrationDate}</div>
              </div>
              <div className="md:col-span-2">
                <div className="text-gray-500">Venue</div>
                <div className="font-medium text-gray-900">{campusDetails.venue}</div>
              </div>
            </div>

            <div className="my-6 h-px bg-gray-200" />

            <h3 className="text-lg font-semibold mb-3">Job Description</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm bg-amber-50 rounded-lg p-4">
              <div>
                <div className="text-gray-500">Job Profile</div>
                <div className="font-medium text-gray-900">{campusDetails.profiles.join(', ')}</div>
              </div>
              <div>
                <div className="text-gray-500">Package (CTC)</div>
                <div className="font-medium text-gray-900">{campusDetails.ctc}</div>
              </div>
              <div>
                <div className="text-gray-500">Work Location</div>
                <div className="font-medium text-gray-900">{campusDetails.workLocation}</div>
              </div>
              <div className="md:col-span-2">
                <div className="text-gray-500">Job Description</div>
                <div className="font-medium text-gray-900">{campusDetails.descriptionTitle}</div>
              </div>
            </div>

            {(campusDetails.responsibilities?.length > 0) && (
              <div className="mt-4">
                <div className="text-gray-500 mb-1">Key Responsibilities</div>
                <ul className="list-disc ml-5 text-gray-800 space-y-1">
                  {campusDetails.responsibilities.map((r: string, idx: number) => (
                    <li key={idx}>{r}</li>
                  ))}
                </ul>
              </div>
            )}

            {(campusDetails.skillsSoft?.length > 0 || campusDetails.skillsRequiredNote) && (
              <div className="mt-4">
                <div className="text-gray-500 mb-1">Skills</div>
                <div className="text-gray-800">
                  {campusDetails.skillsSoft?.length > 0 && (
                    <ul className="list-disc ml-5 space-y-1 mb-2">
                      {campusDetails.skillsSoft.map((s: string, idx: number) => (
                        <li key={idx}>{s}</li>
                      ))}
                    </ul>
                  )}
                  {campusDetails.skillsRequiredNote && (
                    <div className="text-sm">Skills Required: {campusDetails.skillsRequiredNote}</div>
                  )}
                </div>
              </div>
            )}

            {(campusDetails.selectionProcess?.length > 0) && (
              <div className="mt-4">
                <div className="text-gray-500 mb-1">Selection Process</div>
                <ol className="list-decimal ml-5 text-gray-800 space-y-1">
                  {campusDetails.selectionProcess.map((s: string, idx: number) => (
                    <li key={idx}>{s}</li>
                  ))}
                </ol>
              </div>
            )}

            <div className="my-6 h-px bg-gray-200" />

            <h3 className="text-lg font-semibold mb-3">Eligibility Parameters</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm bg-purple-50 rounded-lg p-4">
              <div>
                <div className="text-gray-500">Education Qualification</div>
                <div className="font-medium text-gray-900">{campusDetails.eligibilityEducation}</div>
              </div>
              <div>
                <div className="text-gray-500">Eligibility Criteria</div>
                <div className="font-medium text-gray-900">{campusDetails.eligibilityCriteria}</div>
              </div>
            </div>

            <div className="my-6 h-px bg-gray-200" />

            <h3 className="text-lg font-semibold mb-3">To Participate</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm bg-green-50 rounded-lg p-4">
              <div>
                <div className="text-gray-500">Registration Process</div>
                <div className="font-medium text-gray-900">{campusDetails.registrationProcess}</div>
              </div>
              <div>
                <div className="text-gray-500">Registration</div>
                <a href={campusDetails.registrationLink} className="text-blue-600 hover:underline font-medium">Click here for Registration</a>
              </div>
              {campusDetails.placementContact && (
                <div className="md:col-span-2">
                  <div className="text-gray-500">Placement Cell Contact Person</div>
                  <div className="font-medium text-gray-900">
                    {campusDetails.placementContact.name} — Mob.: {campusDetails.placementContact.mobile}
                  </div>
                </div>
              )}
            </div>

            {campusDetails.otherInfo?.length > 0 && (
              <div className="mt-6 text-sm bg-orange-50 rounded-lg p-4">
                <div className="text-gray-500 mb-1">Other Information</div>
                <ul className="list-disc ml-5 text-gray-800 space-y-1">
                  {campusDetails.otherInfo.map((info: string, idx: number) => (
                    <li key={idx}>{info}</li>
                  ))}
                </ul>
              </div>
            )}

            {campusDetails.aboutCompany && (
              <div className="mt-6 bg-sky-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-2">About Company</h3>
                <p className="text-gray-700 leading-relaxed text-sm">{campusDetails.aboutCompany}</p>
                {campusDetails.website && (
                  <div className="mt-2 text-sm">
                    For More Information Visit: <a href={campusDetails.website} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">{campusDetails.website}</a>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 no-pdf">
          <h2 className="text-xl font-semibold mb-3">Job Description</h2>
          <p className="text-gray-700 leading-relaxed">{job.description}</p>
        </div>
        </div>
        {/* Export region end */}

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="font-semibold text-gray-900 mb-2">Requirements</h3>
            <ul className="text-sm text-gray-700 space-y-2">
              {(job.requirements || []).map((req: string, i: number) => (
                <li key={i} className="flex items-start"><span className="text-blue-600 mr-2">•</span>{req}</li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="font-semibold text-gray-900 mb-2">Benefits</h3>
            <ul className="text-sm text-gray-700 space-y-2">
              {(job.benefits || []).map((b: string, i: number) => (
                <li key={i} className="flex items-start"><span className="text-green-600 mr-2">•</span>{b}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetailsPage;