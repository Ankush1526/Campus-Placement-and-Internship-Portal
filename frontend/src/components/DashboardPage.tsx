import React, { useEffect, useState } from 'react';
import { jobs } from '../data/jobs';
import { internships } from '../data/internships';
import { Bell, X } from 'lucide-react';
import { notificationService, ApplicationNotification } from '../utils/notificationService';

const DashboardPage: React.FC = () => {
    const [user, setUser] = useState<any>(null);
    const [savedJobs, setSavedJobs] = useState<number[]>([]);
    const [savedInternships, setSavedInternships] = useState<number[]>([]);
    const [notifications, setNotifications] = useState<ApplicationNotification[]>([]);
    const [showNotifications, setShowNotifications] = useState(false);

    useEffect(() => {
        const userData = localStorage.getItem('user');
        setUser(userData ? JSON.parse(userData) : null);
        try {
            const sj = JSON.parse(localStorage.getItem('savedJobs') || '[]');
            const si = JSON.parse(localStorage.getItem('savedInternships') || '[]');
            setSavedJobs(Array.isArray(sj) ? sj : []);
            setSavedInternships(Array.isArray(si) ? si : []);

            // Load application status notifications
            setNotifications(notificationService.getNotifications());

            // Request notification permission
            notificationService.requestNotificationPermission();

            // Start demo notifications (for testing)
            notificationService.simulateStatusUpdates();
        } catch { }
    }, []);

    // Get saved jobs data
    const savedJobsData = savedJobs.map(id => {
        const job = jobs.find(j => j.id === id);
        return job ? { ...job, srNo: savedJobs.indexOf(id) + 1 } : null;
    }).filter((job): job is NonNullable<typeof job> => job !== null);

    // Get saved internships data
    const savedInternshipsData = savedInternships.map(id => {
        const internship = internships.find(i => i.id === id);
        return internship ? { ...internship, srNo: savedInternships.indexOf(id) + 1 } : null;
    }).filter((internship): internship is NonNullable<typeof internship> => internship !== null);

    // Notification functions
    const markNotificationAsRead = (notificationId: number) => {
        notificationService.markAsRead(notificationId);
        setNotifications(notificationService.getNotifications());
    };

    const deleteNotification = (notificationId: number) => {
        notificationService.deleteNotification(notificationId);
        setNotifications(notificationService.getNotifications());
    };

    const getUnreadCount = () => notificationService.getUnreadCount();

    if (!user) {
        return <div className="flex flex-col items-center justify-center min-h-screen"><h2 className="text-2xl">Please log in to view your dashboard.</h2></div>;
    }

    // Redirect admin users to admin dashboard
    if (user.userType === 'admin') {
        window.location.href = '/admin';
        return null;
    }

    return (
        <div className="py-20">
            <div className="max-w-6xl mx-auto px-4">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold">Welcome, {user.fullName || user.email}!</h1>

                    {/* Notification Bell */}
                    <div className="relative">
                        <button
                            onClick={() => setShowNotifications(!showNotifications)}
                            className="relative p-2 text-gray-600 hover:text-gray-800 transition-colors"
                        >
                            <Bell className="w-6 h-6" />
                            {getUnreadCount() > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                    {getUnreadCount()}
                                </span>
                            )}
                        </button>

                        {/* Notification Panel */}
                        {showNotifications && (
                            <div className="absolute right-0 top-12 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
                                <div className="p-4 border-b border-gray-200">
                                    <h3 className="text-lg font-semibold text-gray-900">Application Updates</h3>
                                </div>
                                <div className="p-2">
                                    {notifications.length === 0 ? (
                                        <div className="text-gray-500 text-center py-4">No notifications yet</div>
                                    ) : (
                                        notifications.map((notification) => (
                                            <div
                                                key={notification.id}
                                                className={`p-3 border-b border-gray-100 last:border-b-0 ${!notification.read ? 'bg-blue-50' : ''
                                                    }`}
                                            >
                                                <div className="flex justify-between items-start">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${notification.status === 'shortlisted' ? 'bg-green-100 text-green-800' :
                                                                    notification.status === 'under_review' ? 'bg-blue-100 text-blue-800' :
                                                                        notification.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                                            'bg-gray-100 text-gray-800'
                                                                }`}>
                                                                {notification.status.replace('_', ' ').toUpperCase()}
                                                            </span>
                                                            {!notification.read && (
                                                                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                                            )}
                                                        </div>
                                                        <p className="text-sm font-medium text-gray-900 mb-1">
                                                            {notification.companyName}
                                                        </p>
                                                        <p className="text-xs text-gray-600 mb-2">
                                                            {notification.position}
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            {new Date(notification.timestamp).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                    <button
                                                        onClick={() => deleteNotification(notification.id)}
                                                        className="text-gray-400 hover:text-red-500 transition-colors"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </div>
                                                {!notification.read && (
                                                    <button
                                                        onClick={() => markNotificationAsRead(notification.id)}
                                                        className="text-xs text-blue-600 hover:text-blue-800 mt-2"
                                                    >
                                                        Mark as read
                                                    </button>
                                                )}
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow p-6 mb-6">
                    <p className="text-lg text-gray-700 mb-2">Email: {user.email}</p>
                    {user.college && <p className="text-lg text-gray-700 mb-2">College: {user.college}</p>}
                    {user.course && <p className="text-lg text-gray-700 mb-2">Course: {user.course}</p>}
                    {user.graduationYear && <p className="text-lg text-gray-700 mb-2">Graduation Year: {user.graduationYear}</p>}
                    {user.companyName && <p className="text-lg text-gray-700 mb-2">Company: {user.companyName}</p>}
                    {user.designation && <p className="text-lg text-gray-700 mb-2">Designation: {user.designation}</p>}
                </div>

                {user.userType === 'student' && (
                    <>
                        <div className="grid md:grid-cols-2 gap-6 mb-6">
                            <div className="bg-white rounded-xl shadow p-6">
                                <h2 className="text-xl font-semibold mb-4">Saved Jobs</h2>
                                {savedJobsData.length === 0 ? (
                                    <div className="text-gray-600">No saved jobs yet.</div>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                                        Sr. No
                                                    </th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                                        Technology
                                                    </th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                                        Company Name
                                                    </th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                                        Last Date
                                                    </th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                                        Action
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200">
                                                {savedJobsData.map((job) => (
                                                    <tr key={job.id} className="hover:bg-gray-50">
                                                        <td className="px-4 py-3 text-sm text-gray-900 border-b">
                                                            {job.srNo}
                                                        </td>
                                                        <td className="px-4 py-3 text-sm text-gray-900 border-b">
                                                            {job.position}
                                                        </td>
                                                        <td className="px-4 py-3 text-sm text-gray-900 border-b">
                                                            {job.company}
                                                        </td>
                                                        <td className="px-4 py-3 text-sm text-gray-900 border-b">
                                                            {job.deadline}
                                                        </td>
                                                        <td className="px-4 py-3 text-sm border-b">
                                                            <a
                                                                href={`/jobs/${job.id}`}
                                                                className="text-blue-600 hover:text-blue-800 font-medium"
                                                            >
                                                                View Details
                                                            </a>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>

                            <div className="bg-white rounded-xl shadow p-6">
                                <h2 className="text-xl font-semibold mb-4">Saved Internships</h2>
                                {savedInternshipsData.length === 0 ? (
                                    <div className="text-gray-600">No saved internships yet.</div>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                                        Sr. No
                                                    </th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                                        Technology
                                                    </th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                                        Company Name
                                                    </th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                                        Last Date
                                                    </th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                                        Action
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200">
                                                {savedInternshipsData.map((internship) => (
                                                    <tr key={internship.id} className="hover:bg-gray-50">
                                                        <td className="px-4 py-3 text-sm text-gray-900 border-b">
                                                            {internship.srNo}
                                                        </td>
                                                        <td className="px-4 py-3 text-sm text-gray-900 border-b">
                                                            {internship.position}
                                                        </td>
                                                        <td className="px-4 py-3 text-sm text-gray-900 border-b">
                                                            {internship.company}
                                                        </td>
                                                        <td className="px-4 py-3 text-sm text-gray-900 border-b">
                                                            {internship.deadline}
                                                        </td>
                                                        <td className="px-4 py-3 text-sm border-b">
                                                            <a
                                                                href={`/internships/${internship.id}`}
                                                                className="text-blue-600 hover:text-blue-800 font-medium"
                                                            >
                                                                View Details
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

                        {/* Applied Companies Table */}
                        <div className="bg-white rounded-xl shadow p-6">
                            <h2 className="text-xl font-semibold mb-4">Applied Companies</h2>
                            <div className="overflow-x-auto">
                                <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                                Sr. No
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                                Company Name
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                                Position
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                                Application Type
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                                Applied Date
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                                Status
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {/* This will be populated with actual application data */}
                                        <tr className="hover:bg-gray-50">
                                            <td className="px-4 py-3 text-sm text-gray-900 border-b">
                                                1
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-900 border-b">
                                                TechGlobal Inc.
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-900 border-b">
                                                Full Stack Developer
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-900 border-b">
                                                Job
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-900 border-b">
                                                Dec 10, 2024
                                            </td>
                                            <td className="px-4 py-3 text-sm border-b">
                                                <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                                                    Pending
                                                </span>
                                            </td>
                                        </tr>
                                        <tr className="hover:bg-gray-50">
                                            <td className="px-4 py-3 text-sm text-gray-900 border-b">
                                                2
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-900 border-b">
                                                FinanceCore
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-900 border-b">
                                                Financial Analyst
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-900 border-b">
                                                Job
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-900 border-b">
                                                Dec 8, 2024
                                            </td>
                                            <td className="px-4 py-3 text-sm border-b">
                                                <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                                                    Shortlisted
                                                </span>
                                            </td>
                                        </tr>
                                        <tr className="hover:bg-gray-50">
                                            <td className="px-4 py-3 text-sm text-gray-900 border-b">
                                                3
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-900 border-b">
                                                TechCorp Solutions
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-900 border-b">
                                                Software Development Intern
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-900 border-b">
                                                Internship
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-900 border-b">
                                                Dec 5, 2024
                                            </td>
                                            <td className="px-4 py-3 text-sm border-b">
                                                <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                                                    Under Review
                                                </span>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Notification Settings */}
                        <div className="bg-white rounded-xl shadow p-6 mt-6">
                            <h2 className="text-xl font-semibold mb-4">Notification Settings</h2>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="font-medium text-gray-900">Application Status Updates</h3>
                                        <p className="text-sm text-gray-600">Get notified when your application status changes</p>
                                    </div>
                                    <button
                                        onClick={() => notificationService.requestNotificationPermission()}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        Enable Notifications
                                    </button>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="font-medium text-gray-900">Demo Mode</h3>
                                        <p className="text-sm text-gray-600">Simulate status updates for testing (every 30 seconds)</p>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <span className="text-sm text-green-600">Active</span>
                                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default DashboardPage; 