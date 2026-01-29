import React, { useEffect, useState } from 'react';
import { Plus, Trash2, Bell, Check, CheckCheck, Eye } from 'lucide-react';

const NotificationsPage: React.FC = () => {
    const [notifications, setNotifications] = useState<any[]>([]);
    const [user, setUser] = useState<any>(null);
    const [showApply, setShowApply] = useState<number | null>(null);
    const [applyForm, setApplyForm] = useState({
        name: '',
        contact: '',
        email: '',
        resume: null as File | null,
    });
    const [success, setSuccess] = useState(false);
    const [applications, setApplications] = useState<any[]>([]);
    const [systemNotifications, setSystemNotifications] = useState<any[]>([]);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [newNotification, setNewNotification] = useState({
        title: '',
        message: '',
    });
    // Backend applications (for recruiters)
    const [companyApplications, setCompanyApplications] = useState<any[]>([]);
    const [loadingCompanyApps, setLoadingCompanyApps] = useState(false);
    const [companyAppsError, setCompanyAppsError] = useState('');

    useEffect(() => {
        const jobs = JSON.parse(localStorage.getItem('jobAlerts') || '[]');
        const systemNots = JSON.parse(localStorage.getItem('systemNotifications') || '[]');
        setNotifications(jobs);
        setSystemNotifications(systemNots);
        const userData = localStorage.getItem('user');
        setUser(userData ? JSON.parse(userData) : null);
        const apps = JSON.parse(localStorage.getItem('applications') || '[]');
        setApplications(apps);
    }, []);

    // Fetch applications from backend for recruiters
    useEffect(() => {
        try {
            const uRaw = localStorage.getItem('user');
            const pRaw = localStorage.getItem('profile');
            const u = uRaw ? JSON.parse(uRaw) : null;
            const p = pRaw ? JSON.parse(pRaw) : null;
            const company = p?.companyName || u?.companyName;
            if (!u || u.userType !== 'recruiter' || !company) return;
            setLoadingCompanyApps(true);
            setCompanyAppsError('');
            fetch(`/api/applications/company?company=${encodeURIComponent(user.companyName || '')}&applicationType=job`)
                .then(r => r.json()).then(data => {
                    setCompanyApplications(Array.isArray(data.applications) ? data.applications : [])
                }).catch(err => setCompanyAppsError(err.message || 'Failed to load applications'))
                .finally(() => setLoadingCompanyApps(false));
        } catch { }
    }, []);

    const handleCreateNotification = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newNotification.title.trim() || !newNotification.message.trim()) return;

        const notification = {
            id: Date.now(),
            title: newNotification.title,
            message: newNotification.message,
            type: 'system',
            createdBy: user?.email,
            createdAt: new Date().toISOString(),
            read: false,
        };

        const updatedSystemNotifications = [...systemNotifications, notification];
        setSystemNotifications(updatedSystemNotifications);
        localStorage.setItem('systemNotifications', JSON.stringify(updatedSystemNotifications));

        setNewNotification({ title: '', message: '' });
        setShowCreateForm(false);
    };

    const handleDeleteNotification = (id: number) => {
        const updatedSystemNotifications = systemNotifications.filter(n => n.id !== id);
        setSystemNotifications(updatedSystemNotifications);
        localStorage.setItem('systemNotifications', JSON.stringify(updatedSystemNotifications));
    };

    const markNotificationAsRead = (notificationId: number, type: string = 'system') => {
        if (type === 'system') {
            const updatedSystemNotifications = systemNotifications.map(n =>
                n.id === notificationId ? { ...n, read: true } : n
            );
            setSystemNotifications(updatedSystemNotifications);
            localStorage.setItem('systemNotifications', JSON.stringify(updatedSystemNotifications));
        } else {
            const updatedNotifications = notifications.map(n =>
                n.id === notificationId ? { ...n, read: true } : n
            );
            setNotifications(updatedNotifications);
            localStorage.setItem('jobAlerts', JSON.stringify(updatedNotifications));
        }
    };

    const markAllAsRead = () => {
        const updatedSystemNotifications = systemNotifications.map(n => ({ ...n, read: true }));
        const updatedJobNotifications = notifications.map(n => ({ ...n, read: true }));

        setSystemNotifications(updatedSystemNotifications);
        setNotifications(updatedJobNotifications);

        localStorage.setItem('systemNotifications', JSON.stringify(updatedSystemNotifications));
        localStorage.setItem('jobAlerts', JSON.stringify(updatedJobNotifications));
    };

    // For recruiters: show applications for their jobs and notification management
    if (user && user.userType === 'recruiter') {
        const myJobIds = notifications.filter(j => j.postedBy === user.email).map(j => j.id);
        const myApplications = applications.filter(app => myJobIds.includes(app.jobId));
        const myNotifications = systemNotifications.filter(n => n.createdBy === user.email);

        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-20">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">Recruiter Dashboard</h1>
                        <p className="text-gray-600 dark:text-gray-400">Manage notifications and view applications</p>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-8">
                        {/* Notification Management */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center">
                                    <Bell className="w-5 h-5 mr-2 text-blue-600" />
                                    Notification Management
                                </h2>
                                <button
                                    onClick={() => setShowCreateForm(true)}
                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center text-sm"
                                >
                                    <Plus className="w-4 h-4 mr-1" />
                                    Create
                                </button>
                            </div>

                            {showCreateForm && (
                                <form onSubmit={handleCreateNotification} className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                Title
                                            </label>
                                            <input
                                                type="text"
                                                value={newNotification.title}
                                                onChange={(e) => setNewNotification({ ...newNotification, title: e.target.value })}
                                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-gray-100"
                                                placeholder="Notification title"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                Message
                                            </label>
                                            <textarea
                                                value={newNotification.message}
                                                onChange={(e) => setNewNotification({ ...newNotification, message: e.target.value })}
                                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-gray-100"
                                                placeholder="Notification message"
                                                rows={3}
                                                required
                                            />
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                type="submit"
                                                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors text-sm"
                                            >
                                                Send Notification
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setShowCreateForm(false)}
                                                className="bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-md hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors text-sm"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            )}

                            <div className="space-y-3">
                                {myNotifications.length === 0 ? (
                                    <div className="text-center text-gray-500 dark:text-gray-400 py-4">
                                        No notifications created yet
                                    </div>
                                ) : (
                                    myNotifications.map((notification) => (
                                        <div key={notification.id} className="border dark:border-gray-600 rounded-lg p-4">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <h3 className="font-medium text-gray-900 dark:text-gray-100">{notification.title}</h3>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{notification.message}</p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                                                        Created: {new Date(notification.createdAt).toLocaleDateString()}
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={() => handleDeleteNotification(notification.id)}
                                                    className="text-red-600 hover:text-red-800 dark:hover:text-red-400 p-1"
                                                    title="Delete notification"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Applications (Local Legacy) */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">Applications (Legacy Local)</h2>
                            {myApplications.length === 0 ? (
                                <div className="text-center text-gray-500 dark:text-gray-400 py-4">
                                    No students have applied yet
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {myApplications.map((app, idx) => (
                                        <div key={idx} className="border dark:border-gray-600 rounded-lg p-4">
                                            <div className="font-semibold text-lg text-blue-700 dark:text-blue-400">{app.name}</div>
                                            <div className="text-gray-700 dark:text-gray-300">{app.email}</div>
                                            <div className="text-gray-700 dark:text-gray-300">Contact: {app.contact}</div>
                                            <div className="text-gray-700 dark:text-gray-300">Applied for: {app.jobTitle}</div>
                                            {app.resumeData && (
                                                <a href={app.resumeData} download={app.resumeName} className="text-blue-600 dark:text-blue-400 hover:underline text-sm">
                                                    Download Resume
                                                </a>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        {/* Applications (Database) */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">Applications (Database)</h2>
                            {loadingCompanyApps ? (
                                <div className="text-gray-600 dark:text-gray-300">Loading...</div>
                            ) : companyAppsError ? (
                                <div className="text-red-600">{companyAppsError}</div>
                            ) : companyApplications.length === 0 ? (
                                <div className="text-center text-gray-500 dark:text-gray-400 py-4">No applications yet</div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full text-sm">
                                        <thead>
                                            <tr className="text-left text-gray-600 dark:text-gray-300">
                                                <th className="py-2 pr-4">Applicant</th>
                                                <th className="py-2 pr-4">Email</th>
                                                <th className="py-2 pr-4">Contact</th>
                                                <th className="py-2 pr-4">Title</th>
                                                <th className="py-2 pr-4">Type</th>
                                                <th className="py-2 pr-4">Applied</th>
                                                <th className="py-2 pr-4">Resume</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {companyApplications.map((app: any) => (
                                                <tr key={app._id} className="border-t dark:border-gray-700">
                                                    <td className="py-2 pr-4 font-medium">{app.applicantName}</td>
                                                    <td className="py-2 pr-4">{app.applicantEmail}</td>
                                                    <td className="py-2 pr-4">{app.applicantContact}</td>
                                                    <td className="py-2 pr-4">{app.targetTitle}</td>
                                                    <td className="py-2 pr-4 capitalize">{app.applicationType}</td>
                                                    <td className="py-2 pr-4">{app.appliedAt ? new Date(app.appliedAt).toLocaleDateString() : ''}</td>
                                                    <td className="py-2 pr-4">
                                                        <a
                                                            href={`/api/applications/${app._id}/resume`}
                                                            className="text-blue-600 dark:text-blue-400 hover:underline"
                                                            target="_blank" rel="noreferrer"
                                                            onClick={(e) => {
                                                                // append token via header is not possible for anchor; use fetch programmatically
                                                                e.preventDefault();
                                                                const token = localStorage.getItem('token') || '';
                                                                fetch(`/api/applications/${app._id}/resume`, {
                                                                    headers: { 'Authorization': `Bearer ${token}` }
                                                                }).then(async r => {
                                                                    if (!r.ok) throw new Error((await r.json()).message || 'Failed');
                                                                    return r.blob();
                                                                }).then(blob => {
                                                                    const url = URL.createObjectURL(blob);
                                                                    const a = document.createElement('a');
                                                                    a.href = url;
                                                                    a.download = app.resumeName || 'resume';
                                                                    document.body.appendChild(a);
                                                                    a.click();
                                                                    a.remove();
                                                                    URL.revokeObjectURL(url);
                                                                }).catch(err => alert(err.message || 'Failed to download'));
                                                            }}
                                                        >
                                                            {app.resumeName || 'Download'}
                                                        </a>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // For students: show job notifications with Apply button
    const handleApply = async (job: any) => {
        if (!applyForm.name || !applyForm.contact || !applyForm.email || !applyForm.resume) return;
        // Convert resume to base64
        const toBase64 = (file: File) => new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = error => reject(error);
        });
        const resumeData = await toBase64(applyForm.resume);
        const newApp = {
            ...applyForm,
            resumeData,
            resumeName: applyForm.resume.name,
            jobId: job.id,
            jobTitle: job.position,
            recruiter: job.postedBy,
        };
        const apps = JSON.parse(localStorage.getItem('applications') || '[]');
        apps.push(newApp);
        localStorage.setItem('applications', JSON.stringify(apps));
        setSuccess(true);
        setShowApply(null);
        setApplyForm({ name: '', contact: '', email: '', resume: null });
    };

    const allNotifications = [...systemNotifications, ...notifications];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-20">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">Notifications</h1>
                    <div className="flex items-center justify-center gap-4">
                        <p className="text-gray-600 dark:text-gray-400">Stay updated with the latest opportunities and announcements</p>
                        {(systemNotifications.some(n => !n.read) || notifications.some(n => !n.read)) && (
                            <button
                                onClick={markAllAsRead}
                                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm flex items-center gap-2"
                            >
                                <CheckCheck className="w-4 h-4" />
                                Mark All Read
                            </button>
                        )}
                    </div>
                </div>

                {allNotifications.length === 0 ? (
                    <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                        No notifications available
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* System Notifications */}
                        {systemNotifications.length > 0 && (
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                                    <Bell className="w-5 h-5 mr-2 text-blue-600" />
                                    System Announcements
                                </h2>
                                <div className="space-y-4">
                                    {systemNotifications.map((notification) => (
                                        <div
                                            key={notification.id}
                                            className={`border-l-4 p-4 rounded-r-lg cursor-pointer transition-all ${!notification.read
                                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-md'
                                                : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/50'
                                                }`}
                                            onClick={() => {
                                                if (!notification.read) {
                                                    markNotificationAsRead(notification.id, 'system');
                                                }
                                            }}
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <h3 className={`font-semibold ${!notification.read
                                                            ? 'text-blue-900 dark:text-blue-100'
                                                            : 'text-gray-700 dark:text-gray-300'
                                                            }`}>
                                                            {notification.title}
                                                        </h3>
                                                        {notification.read && (
                                                            <Check className="w-4 h-4 text-green-500" />
                                                        )}
                                                        {!notification.read && (
                                                            <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">NEW</span>
                                                        )}
                                                    </div>
                                                    <p className={`mt-1 ${!notification.read
                                                        ? 'text-blue-800 dark:text-blue-200'
                                                        : 'text-gray-600 dark:text-gray-400'
                                                        }`}>
                                                        {notification.message}
                                                    </p>
                                                    <p className={`text-xs mt-2 ${!notification.read
                                                        ? 'text-blue-600 dark:text-blue-400'
                                                        : 'text-gray-500 dark:text-gray-500'
                                                        }`}>
                                                        {new Date(notification.createdAt).toLocaleDateString()}
                                                    </p>
                                                </div>
                                                <div className="flex flex-col items-center gap-2">
                                                    {!notification.read && (
                                                        <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                                                    )}
                                                    {!notification.read && (
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                markNotificationAsRead(notification.id, 'system');
                                                            }}
                                                            className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1"
                                                            title="Mark as read"
                                                        >
                                                            <Eye className="w-3 h-3" />
                                                            Read
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Job Notifications */}
                        {notifications.length > 0 && (
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Job Opportunities</h2>
                                <div className="space-y-4">
                                    {notifications.map((job, idx) => (
                                        <div
                                            key={idx}
                                            className={`border rounded-lg p-4 cursor-pointer transition-all ${!job.read
                                                ? 'border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20 shadow-md'
                                                : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800'
                                                }`}
                                            onClick={() => {
                                                if (!job.read) {
                                                    markNotificationAsRead(job.id, 'job');
                                                }
                                            }}
                                        >
                                            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <div className={`font-semibold text-lg ${!job.read
                                                            ? 'text-blue-700 dark:text-blue-300'
                                                            : 'text-gray-700 dark:text-gray-400'
                                                            }`}>
                                                            {job.position}
                                                        </div>
                                                        {job.read && (
                                                            <Check className="w-4 h-4 text-green-500" />
                                                        )}
                                                        {!job.read && (
                                                            <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">NEW JOB</span>
                                                        )}
                                                    </div>
                                                    <div className={`${!job.read
                                                        ? 'text-gray-800 dark:text-gray-200'
                                                        : 'text-gray-600 dark:text-gray-400'
                                                        }`}>
                                                        {job.company}
                                                    </div>
                                                    <div className={`text-sm ${!job.read
                                                        ? 'text-gray-600 dark:text-gray-300'
                                                        : 'text-gray-500 dark:text-gray-400'
                                                        }`}>
                                                        {job.type} | Deadline: {job.deadline}
                                                    </div>
                                                </div>
                                                {user && user.userType === 'student' && (
                                                    <div className="mt-4 md:mt-0 flex flex-col gap-2">
                                                        {!job.read && (
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    markNotificationAsRead(job.id, 'job');
                                                                }}
                                                                className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1 self-end"
                                                                title="Mark as read"
                                                            >
                                                                <Eye className="w-3 h-3" />
                                                                Mark as read
                                                            </button>
                                                        )}
                                                        <button
                                                            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setShowApply(job.id);
                                                            }}
                                                        >
                                                            Apply
                                                        </button>
                                                        {showApply === job.id && (
                                                            <form
                                                                className="mt-4 bg-gray-50 dark:bg-gray-700 p-4 rounded shadow flex flex-col gap-2"
                                                                onSubmit={e => { e.preventDefault(); handleApply(job); }}
                                                            >
                                                                <input
                                                                    type="text"
                                                                    placeholder="Name"
                                                                    className="border dark:border-gray-600 p-2 rounded dark:bg-gray-600 dark:text-gray-100"
                                                                    value={applyForm.name}
                                                                    onChange={e => setApplyForm({ ...applyForm, name: e.target.value })}
                                                                    required
                                                                />
                                                                <input
                                                                    type="text"
                                                                    placeholder="Contact Number"
                                                                    className="border dark:border-gray-600 p-2 rounded dark:bg-gray-600 dark:text-gray-100"
                                                                    value={applyForm.contact}
                                                                    onChange={e => setApplyForm({ ...applyForm, contact: e.target.value })}
                                                                    required
                                                                />
                                                                <input
                                                                    type="email"
                                                                    placeholder="Email"
                                                                    className="border dark:border-gray-600 p-2 rounded dark:bg-gray-600 dark:text-gray-100"
                                                                    value={applyForm.email}
                                                                    onChange={e => setApplyForm({ ...applyForm, email: e.target.value })}
                                                                    required
                                                                />
                                                                <input
                                                                    type="file"
                                                                    accept=".pdf,.doc,.docx"
                                                                    className="border dark:border-gray-600 p-2 rounded dark:bg-gray-600 dark:text-gray-100"
                                                                    onChange={e => setApplyForm({ ...applyForm, resume: e.target.files ? e.target.files[0] : null })}
                                                                    required
                                                                />
                                                                <button
                                                                    type="submit"
                                                                    className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors mt-2"
                                                                >
                                                                    Submit Application
                                                                </button>
                                                            </form>
                                                        )}
                                                        {success && <div className="mt-2 text-green-600 font-medium">Application submitted!</div>}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default NotificationsPage; 