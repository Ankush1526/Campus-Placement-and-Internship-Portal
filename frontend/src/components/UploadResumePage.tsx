import React, { useState, useEffect } from 'react';

const UploadResumePage: React.FC = () => {
    const [user, setUser] = useState<any>(null);
    const [resume, setResume] = useState<File | null>(null);
    const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [allResumes, setAllResumes] = useState<{ email: string, fileName: string, fileData?: string }[]>([]);

    useEffect(() => {
        const userData = localStorage.getItem('user');
        setUser(userData ? JSON.parse(userData) : null);
        // For students, show their uploaded file
        if (userData) {
            const user = JSON.parse(userData);
            const resumes = JSON.parse(localStorage.getItem('allResumes') || '[]');
            if (user.userType === 'student') {
                const found = resumes.find((r: any) => r.email === user.email);
                setUploadedFileName(found ? found.fileName : null);
            } else if (user.userType === 'recruiter') {
                setAllResumes(resumes);
            }
        }
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setResume(e.target.files[0]);
        }
    };

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (resume && user) {
            // Check file size (limit to 1MB to be safe with localStorage)
            const maxSize = 1 * 1024 * 1024; // 1MB
            if (resume.size > maxSize) {
                alert('File size too large. Please select a file smaller than 1MB. Consider compressing your PDF or using a smaller version.');
                return;
            }

            try {
                // Convert file to base64
                const toBase64 = (file: File) => new Promise<string>((resolve, reject) => {
                    const reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = () => resolve(reader.result as string);
                    reader.onerror = error => reject(error);
                });
                const fileData = await toBase64(resume);
                
                // Store all resumes as an array in localStorage
                try {
                    const resumes = JSON.parse(localStorage.getItem('allResumes') || '[]');
                    const newResumes = resumes.filter((r: any) => r.email !== user.email);
                    newResumes.push({ email: user.email, fileName: resume.name, fileData, updatedAt: Date.now() });
                    localStorage.setItem('allResumes', JSON.stringify(newResumes));
                } catch (storageError) {
                    console.error('Could not save to allResumes:', storageError);
                    alert('Resume uploaded but could not be cached locally due to storage limits.');
                }

                // Also sync a light profile cache so Apply pages can auto-attach
                try {
                    const cachedProfile = localStorage.getItem('profile');
                    const p = cachedProfile ? JSON.parse(cachedProfile) : {};
                    const light = { ...p, resumeName: resume.name, resumeData: fileData, resumeUpdatedAt: Date.now() };
                    localStorage.setItem('profile', JSON.stringify(light));
                } catch (profileError) {
                    console.error('Could not update profile cache:', profileError);
                }
                
                setUploadedFileName(resume.name);
                setSuccess(true);
            } catch (error) {
                console.error('Error processing resume:', error);
                alert('Error processing resume file. Please try again with a smaller file.');
            }
        }
    };

    if (!user) {
        return <div className="flex flex-col items-center justify-center min-h-screen"><h2 className="text-2xl">Please log in to upload or view resumes.</h2></div>;
    }

    if (user.userType === 'recruiter') {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
                <h1 className="text-3xl font-bold mb-6">Uploaded Student Resumes</h1>
                {allResumes.length === 0 ? (
                    <div className="text-gray-700">No resumes uploaded yet.</div>
                ) : (
                    <table className="min-w-[300px] bg-white rounded-xl shadow-md">
                        <thead>
                            <tr>
                                <th className="px-4 py-2 text-left">Student Email</th>
                                <th className="px-4 py-2 text-left">Resume File</th>
                            </tr>
                        </thead>
                        <tbody>
                            {allResumes.map((r, idx) => (
                                <tr key={idx} className="border-t">
                                    <td className="px-4 py-2">{r.email}</td>
                                    <td className="px-4 py-2">
                                        {r.fileData ? (
                                            <a
                                                href={r.fileData}
                                                download={r.fileName}
                                                className="text-blue-600 hover:underline"
                                            >
                                                {r.fileName}
                                            </a>
                                        ) : (
                                            r.fileName
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        );
    }

    // Student view
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
            <h1 className="text-3xl font-bold mb-6">Upload Your Resume</h1>
            <form onSubmit={handleUpload} className="bg-white p-8 rounded-xl shadow-md flex flex-col items-center">
                <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    className="mb-4"
                />
                <button
                    type="submit"
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                    disabled={!resume}
                >
                    Upload Resume
                </button>
            </form>
            {success && (
                <div className="mt-4 text-green-600 font-medium">Resume uploaded successfully!</div>
            )}
            {uploadedFileName && (
                <div className="mt-2 p-3 bg-gray-50 rounded-lg flex items-center justify-between">
                    <div className="text-gray-700">Uploaded File: <span className="font-semibold">{uploadedFileName}</span></div>
                    <button 
                        onClick={() => {
                            setUploadedFileName(null);
                            // Remove from localStorage
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
                            } catch {}
                        }}
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                        Remove
                    </button>
                </div>
            )}
        </div>
    );
};

export default UploadResumePage; 