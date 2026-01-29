import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateJobAlertPage: React.FC = () => {
    const [user, setUser] = useState<any>(null);
    const [form, setForm] = useState({
        position: '',
        company: '',
        location: '',
        salary: '',
        type: 'Full-time',
        deadline: '',
        description: '',
        skills: '',
        requirements: '',
        benefits: '',
    });
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const userData = localStorage.getItem('user');
        setUser(userData ? JSON.parse(userData) : null);
    }, []);

    if (!user || user.userType !== 'recruiter') {
        return <div className="flex flex-col items-center justify-center min-h-screen"><h2 className="text-2xl">Only recruiters can create job alerts.</h2></div>;
    }

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const job = {
            ...form,
            skills: form.skills.split(',').map(s => s.trim()),
            requirements: form.requirements.split(',').map(s => s.trim()),
            benefits: form.benefits.split(',').map(s => s.trim()),
            postedBy: user.email,
            id: Date.now(),
        };
        const jobs = JSON.parse(localStorage.getItem('jobAlerts') || '[]');
        jobs.push(job);
        localStorage.setItem('jobAlerts', JSON.stringify(jobs));
        setSuccess(true);
        setForm({
            position: '',
            company: '',
            location: '',
            salary: '',
            type: 'Full-time',
            deadline: '',
            description: '',
            skills: '',
            requirements: '',
            benefits: '',
        });
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
            <h1 className="text-3xl font-bold mb-6">Create Job Alert</h1>
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-md flex flex-col gap-4 w-full max-w-xl">
                <input name="position" value={form.position} onChange={handleChange} placeholder="Job Title" className="border p-2 rounded" required />
                <input name="company" value={form.company} onChange={handleChange} placeholder="Company Name" className="border p-2 rounded" required />
                <input name="location" value={form.location} onChange={handleChange} placeholder="Location" className="border p-2 rounded" required />
                <input name="salary" value={form.salary} onChange={handleChange} placeholder="Salary (e.g. ₹3-6 LPA)" className="border p-2 rounded" required />
                <select name="type" value={form.type} onChange={handleChange} className="border p-2 rounded">
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Internship">Internship</option>
                </select>
                <input name="deadline" value={form.deadline} onChange={handleChange} placeholder="Deadline (e.g. Jan 30, 2025)" className="border p-2 rounded" required />
                <textarea name="description" value={form.description} onChange={handleChange} placeholder="Job Description" className="border p-2 rounded" required />
                <input name="skills" value={form.skills} onChange={handleChange} placeholder="Required Skills (comma separated)" className="border p-2 rounded" required />
                <input name="requirements" value={form.requirements} onChange={handleChange} placeholder="Requirements (comma separated)" className="border p-2 rounded" required />
                <input name="benefits" value={form.benefits} onChange={handleChange} placeholder="Benefits (comma separated)" className="border p-2 rounded" required />
                <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors">Submit</button>
            </form>
            {success && <div className="mt-4 text-green-600 font-medium">Job alert created successfully!</div>}
        </div>
    );
};

export default CreateJobAlertPage; 