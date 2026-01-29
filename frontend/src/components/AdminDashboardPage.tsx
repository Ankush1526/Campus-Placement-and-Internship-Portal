import React, { useEffect, useState } from 'react';
import { Users, Briefcase, Mail, BarChart3, Trash2, Eye, RefreshCw, Shield, UserCheck, Building2, GraduationCap, FileText, MessageSquare } from 'lucide-react';

interface User {
    _id: string;
    email: string;
    fullName: string;
    userType: 'student' | 'recruiter' | 'admin';
    college?: string;
    companyName?: string;
    createdAt?: string;
}

interface Application {
    _id: string;
    applicantEmail: string;
    applicantName: string;
    applicationType: 'job' | 'internship';
    targetTitle: string;
    targetCompany: string;
    status: string;
    appliedAt?: string;
    createdAt?: string;
}

interface ContactMessage {
    _id: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    userType?: string;
    createdAt?: string;
}

interface Stats {
    totalStudents: number;
    totalRecruiters: number;
    totalApplications: number;
    totalContactMessages: number;
    applicationsByStatus: {
        pending: number;
        reviewed: number;
        shortlisted: number;
        rejected: number;
        accepted: number;
    };
    applicationsByType: {
        job: number;
        internship: number;
    };
}

const AdminDashboardPage: React.FC = () => {
    const [user, setUser] = useState<any>(null);
    const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'applications' | 'messages'>('overview');
    const [stats, setStats] = useState<Stats | null>(null);
    const [users, setUsers] = useState<User[]>([]);
    const [applications, setApplications] = useState<Application[]>([]);
    const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);
    const [loading, setLoading] = useState(false);
    const [userFilter, setUserFilter] = useState<'all' | 'student' | 'recruiter'>('all');

    useEffect(() => {
        const userData = localStorage.getItem('user');
        const parsedUser = userData ? JSON.parse(userData) : null;
        
        // Fetch full profile data if user exists
        if (parsedUser && parsedUser.email && parsedUser.userType) {
            // Try to get from cached profile first
            const cachedProfile = localStorage.getItem('profile');
            if (cachedProfile) {
                try {
                    const profile = JSON.parse(cachedProfile);
                    if (profile.fullName) {
                        setUser({ ...parsedUser, fullName: profile.fullName });
                    } else {
                        setUser(parsedUser);
                    }
                } catch {
                    setUser(parsedUser);
                }
            } else {
                setUser(parsedUser);
            }
            
            // Fetch fresh profile data
            fetch(`/api/profile?email=${encodeURIComponent(parsedUser.email)}&userType=${encodeURIComponent(parsedUser.userType)}`)
                .then(res => res.json())
                .then(data => {
                    if (data.user) {
                        const updatedUser = { ...parsedUser, fullName: data.user.fullName || parsedUser.fullName };
                        setUser(updatedUser);
                        // Update cached profile
                        const { avatarData, avatarMime, resumeData, resumeName, ...light } = data.user;
                        localStorage.setItem('profile', JSON.stringify(light));
                    }
                })
                .catch(err => console.error('Error fetching profile:', err));
        } else {
            setUser(parsedUser);
        }

        if (parsedUser && parsedUser.userType === 'admin') {
            loadData();
        }
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            // Load stats
            const statsRes = await fetch('/api/admin/stats');
            if (statsRes.ok) {
                const statsData = await statsRes.json();
                setStats(statsData.stats);
            }

            // Load users
            const usersRes = await fetch('/api/admin/users');
            if (usersRes.ok) {
                const usersData = await usersRes.json();
                console.log('Users loaded from API:', usersData.users?.length || 0);
                
                // Backend now returns properly formatted data, but ensure structure
                const formattedUsers = (usersData.users || []).map((u: any) => ({
                    _id: u._id || null,
                    email: u.email || 'N/A',
                    fullName: u.fullName || 'N/A',
                    userType: u.userType || 'student',
                    college: u.college || '',
                    companyName: u.companyName || '',
                    createdAt: u.createdAt || null
                }));
                
                console.log('Formatted users count:', formattedUsers.length);
                if (formattedUsers.length > 0) {
                    console.log('First user:', formattedUsers[0]);
                }
                
                setUsers(formattedUsers);
            } else {
                const errorData = await usersRes.json().catch(() => ({}));
                console.error('Failed to load users:', errorData);
                alert('Failed to load users: ' + (errorData.message || 'Unknown error'));
            }

            // Load applications
            const appsRes = await fetch('/api/admin/applications');
            if (appsRes.ok) {
                const appsData = await appsRes.json();
                setApplications(appsData.applications || []);
            }

            // Load contact messages
            const messagesRes = await fetch('/api/admin/contact-messages');
            if (messagesRes.ok) {
                const messagesData = await messagesRes.json();
                setContactMessages(messagesData.messages || []);
            }
        } catch (err) {
            console.error('Error loading admin data:', err);
            alert('Failed to load admin data');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = async (email: string, userType: string) => {
        if (!confirm(`Are you sure you want to delete ${userType} ${email}? This action cannot be undone.`)) {
            return;
        }

        try {
            const res = await fetch(`/api/admin/users/${userType}/${encodeURIComponent(email)}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                alert('User deleted successfully');
                loadData();
            } else {
                const data = await res.json();
                alert(data.message || 'Failed to delete user');
            }
        } catch (err) {
            console.error('Error deleting user:', err);
            alert('Failed to delete user');
        }
    };

    const handleDeleteApplication = async (id: string) => {
        if (!confirm('Are you sure you want to delete this application? This action cannot be undone.')) {
            return;
        }

        try {
            const res = await fetch(`/api/admin/applications/${id}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                alert('Application deleted successfully');
                loadData();
            } else {
                const data = await res.json();
                alert(data.message || 'Failed to delete application');
            }
        } catch (err) {
            console.error('Error deleting application:', err);
            alert('Failed to delete application');
        }
    };

    const handleDeleteMessage = async (id: string) => {
        if (!confirm('Are you sure you want to delete this message? This action cannot be undone.')) {
            return;
        }

        try {
            const res = await fetch(`/api/admin/contact-messages/${id}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                alert('Message deleted successfully');
                loadData();
            } else {
                const data = await res.json();
                alert(data.message || 'Failed to delete message');
            }
        } catch (err) {
            console.error('Error deleting message:', err);
            alert('Failed to delete message');
        }
    };

    if (!user || user.userType !== 'admin') {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <Shield className="w-16 h-16 text-red-500 mb-4" />
                <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
                <p className="text-gray-600">You must be an admin to access this page.</p>
            </div>
        );
    }

    const filteredUsers = userFilter === 'all'
        ? users
        : users.filter(u => u.userType === userFilter);

    return (
        <div className="py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">
                            Admin Dashboard
                        </h1>
                        <p className="text-gray-600">Welcome back, {user.fullName || user.email}</p>
                    </div>
                    <button
                        onClick={loadData}
                        disabled={loading}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                        <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                        Refresh
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-6 border-b border-gray-200">
                    {[
                        { id: 'overview', label: 'Overview', icon: BarChart3 },
                        { id: 'users', label: 'Users', icon: Users },
                        { id: 'applications', label: 'Applications', icon: Briefcase },
                        { id: 'messages', label: 'Messages', icon: Mail },
                    ].map((tab) => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors border-b-2 ${activeTab === tab.id
                                    ? 'border-blue-600 text-blue-600'
                                    : 'border-transparent text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                <Icon className="w-5 h-5" />
                                {tab.label}
                            </button>
                        );
                    })}
                </div>

                {/* Overview Tab */}
                {activeTab === 'overview' && stats && (
                    <div className="space-y-6">
                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="bg-white rounded-xl shadow p-6 border-l-4 border-blue-500">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-gray-600 text-sm mb-1">Total Students</p>
                                        <p className="text-3xl font-bold text-gray-900">{stats.totalStudents}</p>
                                    </div>
                                    <GraduationCap className="w-12 h-12 text-blue-500" />
                                </div>
                            </div>

                            <div className="bg-white rounded-xl shadow p-6 border-l-4 border-green-500">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-gray-600 text-sm mb-1">Total Recruiters</p>
                                        <p className="text-3xl font-bold text-gray-900">{stats.totalRecruiters}</p>
                                    </div>
                                    <Building2 className="w-12 h-12 text-green-500" />
                                </div>
                            </div>

                            <div className="bg-white rounded-xl shadow p-6 border-l-4 border-purple-500">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-gray-600 text-sm mb-1">Total Applications</p>
                                        <p className="text-3xl font-bold text-gray-900">{stats.totalApplications}</p>
                                    </div>
                                    <Briefcase className="w-12 h-12 text-purple-500" />
                                </div>
                            </div>

                            <div className="bg-white rounded-xl shadow p-6 border-l-4 border-yellow-500">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-gray-600 text-sm mb-1">Contact Messages</p>
                                        <p className="text-3xl font-bold text-gray-900">{stats.totalContactMessages}</p>
                                    </div>
                                    <Mail className="w-12 h-12 text-yellow-500" />
                                </div>
                            </div>
                        </div>

                        {/* Application Status Breakdown */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="bg-white rounded-xl shadow p-6">
                                <h3 className="text-xl font-semibold mb-4">Applications by Status</h3>
                                <div className="space-y-3">
                                    {Object.entries(stats.applicationsByStatus).map(([status, count]) => (
                                        <div key={status} className="flex items-center justify-between">
                                            <span className="text-gray-700 capitalize">{status}</span>
                                            <div className="flex items-center gap-3">
                                                <div className="w-32 bg-gray-200 rounded-full h-2">
                                                    <div
                                                        className={`h-2 rounded-full ${status === 'accepted' ? 'bg-green-500' :
                                                            status === 'shortlisted' ? 'bg-blue-500' :
                                                                status === 'rejected' ? 'bg-red-500' :
                                                                    status === 'reviewed' ? 'bg-yellow-500' :
                                                                        'bg-gray-500'
                                                            }`}
                                                        style={{ width: `${(count / stats.totalApplications) * 100}%` }}
                                                    />
                                                </div>
                                                <span className="text-gray-900 font-semibold w-12 text-right">{count}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-white rounded-xl shadow p-6">
                                <h3 className="text-xl font-semibold mb-4">Applications by Type</h3>
                                <div className="space-y-3">
                                    {Object.entries(stats.applicationsByType).map(([type, count]) => (
                                        <div key={type} className="flex items-center justify-between">
                                            <span className="text-gray-700 capitalize">{type}</span>
                                            <div className="flex items-center gap-3">
                                                <div className="w-32 bg-gray-200 rounded-full h-2">
                                                    <div
                                                        className="h-2 rounded-full bg-indigo-500"
                                                        style={{ width: `${(count / stats.totalApplications) * 100}%` }}
                                                    />
                                                </div>
                                                <span className="text-gray-900 font-semibold w-12 text-right">{count}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Users Tab */}
                {activeTab === 'users' && (
                    <div className="bg-white rounded-xl shadow">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex justify-between items-center">
                                <h3 className="text-xl font-semibold">User Management</h3>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setUserFilter('all')}
                                        className={`px-4 py-2 rounded-lg transition-colors ${userFilter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
                                            }`}
                                    >
                                        All
                                    </button>
                                    <button
                                        onClick={() => setUserFilter('student')}
                                        className={`px-4 py-2 rounded-lg transition-colors ${userFilter === 'student' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
                                            }`}
                                    >
                                        Students
                                    </button>
                                    <button
                                        onClick={() => setUserFilter('recruiter')}
                                        className={`px-4 py-2 rounded-lg transition-colors ${userFilter === 'recruiter' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
                                            }`}
                                    >
                                        Recruiters
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredUsers.map((u, index) => {
                                        // Ensure unique key - always include index to prevent duplicates
                                        const uniqueKey = u._id ? `${u._id}-${index}` : (u.email ? `${u.email}-${index}` : `user-${index}`);
                                        return (
                                        <tr key={uniqueKey} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {u.fullName || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {u.email || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${u.userType === 'student' ? 'bg-blue-100 text-blue-800' :
                                                    u.userType === 'recruiter' ? 'bg-green-100 text-green-800' :
                                                        'bg-purple-100 text-purple-800'
                                                    }`}>
                                                    {u.userType}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {u.userType === 'student' ? u.college || 'N/A' : u.companyName || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <button
                                                    onClick={() => handleDeleteUser(u.email, u.userType)}
                                                    className="text-red-600 hover:text-red-800 flex items-center gap-1"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                            {filteredUsers.length === 0 && (
                                <div className="text-center py-12 text-gray-500">No users found</div>
                            )}
                        </div>
                    </div>
                )}

                {/* Applications Tab */}
                {activeTab === 'applications' && (
                    <div className="bg-white rounded-xl shadow">
                        <div className="p-6 border-b border-gray-200">
                            <h3 className="text-xl font-semibold">Application Management</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applicant</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applied</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {applications.map((app) => (
                                        <tr key={app._id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">{app.applicantName}</div>
                                                <div className="text-sm text-gray-500">{app.applicantEmail}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{app.targetTitle}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{app.targetCompany}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${app.applicationType === 'job' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                                                    }`}>
                                                    {app.applicationType}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${app.status === 'accepted' ? 'bg-green-100 text-green-800' :
                                                    app.status === 'shortlisted' ? 'bg-blue-100 text-blue-800' :
                                                        app.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                                            app.status === 'reviewed' ? 'bg-yellow-100 text-yellow-800' :
                                                                'bg-gray-100 text-gray-800'
                                                    }`}>
                                                    {app.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {app.appliedAt ? new Date(app.appliedAt).toLocaleDateString() : 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <button
                                                    onClick={() => handleDeleteApplication(app._id)}
                                                    className="text-red-600 hover:text-red-800 flex items-center gap-1"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {applications.length === 0 && (
                                <div className="text-center py-12 text-gray-500">No applications found</div>
                            )}
                        </div>
                    </div>
                )}

                {/* Messages Tab */}
                {activeTab === 'messages' && (
                    <div className="bg-white rounded-xl shadow">
                        <div className="p-6 border-b border-gray-200">
                            <h3 className="text-xl font-semibold">Contact Messages</h3>
                        </div>
                        <div className="divide-y divide-gray-200">
                            {contactMessages.map((msg) => (
                                <div key={msg._id} className="p-6 hover:bg-gray-50">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <h4 className="text-lg font-semibold text-gray-900">{msg.name}</h4>
                                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${msg.userType === 'recruiter' ? 'bg-green-100 text-green-800' :
                                                    msg.userType === 'admin' ? 'bg-purple-100 text-purple-800' :
                                                        'bg-blue-100 text-blue-800'
                                                    }`}>
                                                    {msg.userType || 'student'}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-500">{msg.email}</p>
                                        </div>
                                        <button
                                            onClick={() => handleDeleteMessage(msg._id)}
                                            className="text-red-600 hover:text-red-800"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                    <h5 className="font-medium text-gray-900 mb-2">{msg.subject}</h5>
                                    <p className="text-gray-700 mb-2">{msg.message}</p>
                                    <p className="text-xs text-gray-500">
                                        {msg.createdAt ? new Date(msg.createdAt).toLocaleString() : 'N/A'}
                                    </p>
                                </div>
                            ))}
                            {contactMessages.length === 0 && (
                                <div className="text-center py-12 text-gray-500">No messages found</div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboardPage;

