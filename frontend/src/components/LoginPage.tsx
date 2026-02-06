import React, { useState, useMemo, useEffect } from 'react';
import { User, Mail, Lock, Eye, EyeOff, Upload, CheckCircle, ArrowRight, GraduationCap, Building2, Loader2, ShieldCheck, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const safeParseJson = async (res: Response): Promise<any> => {
    try {
      const text = await res.text();
      if (!text) return {};
      return JSON.parse(text);
    } catch {
      return {};
    }
  };
  const [isLogin, setIsLogin] = useState(true);
  const [userType, setUserType] = useState('student');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [formErrors, setFormErrors] = useState<{ email?: string; password?: string; confirmPassword?: string }>({});
  const emptyForm = {
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    college: '',
    course: '',
    graduationYear: '',
    companyName: '',
    designation: ''
  };
  const [formData, setFormData] = useState({ ...emptyForm });

  const resetForm = () => {
    setFormData({ ...emptyForm });
    setFormErrors({});
    setAgreeTerms(false);
    setShowPassword(false);
  };

  const navigate = useNavigate();

  useEffect(() => {
    // Prefill from "remember me"
    const saved = localStorage.getItem('rememberLogin');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setFormData((p) => ({ ...p, email: parsed.email || '' }));
        setUserType(parsed.userType || 'student');
        setRememberMe(true);
      } catch { }
    }
  }, []);

  const validateEmail = (value: string) => /^(?!\d)[\w.+-]+@([\w-]+\.)+[\w-]{2,}$/i.test(value);

  const passwordScore = useMemo(() => {
    const pwd = formData.password || '';
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[a-z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    return Math.min(score, 4); // 0-4
  }, [formData.password]);

  const passwordLabel = ['Weak', 'Fair', 'Good', 'Strong', 'Strong'][passwordScore];
  const passwordBarClass = ['bg-red-500', 'bg-yellow-500', 'bg-amber-500', 'bg-green-500', 'bg-green-500'][passwordScore];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateForm = (): boolean => {
    const errors: typeof formErrors = {};
    if (!validateEmail(formData.email)) errors.email = 'Email must not start with a digit and must contain @';
    if (!formData.password) errors.password = 'Password is required';
    if (!isLogin) {
      if (formData.password !== formData.confirmPassword) errors.confirmPassword = 'Passwords do not match';
      if (!agreeTerms) errors.confirmPassword = errors.confirmPassword || 'You must agree to the Terms to continue';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    const endpoint = isLogin ? 'login' : 'signup';
    const url = `/api/${endpoint}`;
    let payload: any = {
      email: formData.email,
      password: formData.password,
      userType,
    };
    if (!isLogin) {
      payload = {
        ...payload,
        fullName: formData.fullName,
        confirmPassword: formData.confirmPassword,
        college: userType === 'student' ? formData.college : undefined,
        course: userType === 'student' ? formData.course : undefined,
        graduationYear: userType === 'student' ? formData.graduationYear : undefined,
        companyName: userType === 'recruiter' ? formData.companyName : undefined,
        designation: userType === 'recruiter' ? formData.designation : undefined,
      };
    }
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await safeParseJson(res);
      if (!res.ok) {
        const serverMsg = data && data.message ? data.message : '';
        throw new Error(serverMsg || `Request failed: ${res.status} ${res.statusText}`);
      }
      if (rememberMe) {
        localStorage.setItem('rememberLogin', JSON.stringify({ email: formData.email, userType }));
      } else {
        localStorage.removeItem('rememberLogin');
      }
      if (isLogin) {
        if (data.token) localStorage.setItem('token', data.token);
        if (data.user) localStorage.setItem('user', JSON.stringify(data.user));
        // Prefetch full profile for persistence
        try {
          const profRes = await fetch(`/api/profile?email=${encodeURIComponent(data.user.email)}&userType=${encodeURIComponent(data.user.userType)}`);
          const prof = await safeParseJson(profRes);
          if (profRes.ok && prof.user) {
            const { avatarData, avatarMime, resumeData, resumeName, ...light } = prof.user;
            localStorage.setItem('profile', JSON.stringify(light));
          }
        } catch { }
        // Clear inputs after successful login
        resetForm();
        // Redirect admin to admin dashboard
        if (data.user && data.user.userType === 'admin') {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      } else {
        if (data.user) {
          localStorage.setItem('user', JSON.stringify(data.user));
          if (data.token) localStorage.setItem('token', data.token);
          try {
            const profRes = await fetch(`/api/profile?email=${encodeURIComponent(data.user.email)}&userType=${encodeURIComponent(data.user.userType)}`);
            const prof = await safeParseJson(profRes);
            if (profRes.ok && prof.user) {
              const { avatarData, avatarMime, resumeData, resumeName, ...light } = prof.user;
              localStorage.setItem('profile', JSON.stringify(light));
            }
          } catch { }
          // Clear inputs after successful signup
          resetForm();
          // Redirect admin to admin dashboard
          if (data.user.userType === 'admin') {
            navigate('/admin');
          } else {
            navigate('/dashboard');
          }
        } else {
          setIsLogin(true);
        }
      }
    } catch (err: any) {
      const msg = err?.message || (err?.name === 'TypeError' ? 'Network error: could not reach server' : 'Unexpected error');
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  const benefits = [
    {
      icon: <User className="w-8 h-8" />,
      title: "Personalized Dashboard",
      description: "Track your applications, view recommendations, and manage your profile",
      color: "border-blue-500",
      iconColor: "text-blue-500"
    },
    {
      icon: <CheckCircle className="w-8 h-8" />,
      title: "Application Tracking",
      description: "Monitor the status of all your job and internship applications in real-time",
      color: "border-green-500",
      iconColor: "text-green-500"
    },
    {
      icon: <Upload className="w-8 h-8" />,
      title: "Resume Builder",
      description: "Create professional resumes with our AI-powered builder and templates",
      color: "border-purple-500",
      iconColor: "text-purple-500"
    }
  ];

  const courses = [
    "Computer Science Engineering",
    "Information Technology",
    "Electronics & Communication",
    "Mechanical Engineering",
    "Civil Engineering",
    "Business Administration",
    "Commerce",
    "Arts",
    "Science",
    "Other"
  ];

  const graduationYears = ["2024", "2025", "2026", "2027", "2028"];

  return (
    <div className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            {isLogin ? 'Welcome Back' : 'Join PlacementHub'}
          </h2>
          <p className="text-xl text-gray-600">
            {isLogin
              ? 'Sign in to access your dashboard and continue your career journey'
              : 'Create your account and unlock thousands of opportunities'}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Benefits Section */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Why Join PlacementHub?</h3>
              <div className="space-y-6">
                {benefits.map((benefit, index) => (
                  <div key={index} className={`bg-white p-6 rounded-xl border-l-4 ${benefit.color} shadow-lg`}>
                    <div className="flex items-center mb-3">
                      <div className={`${benefit.iconColor} mr-4`}>{benefit.icon}</div>
                      <h4 className={`text-lg font-semibold ${benefit.iconColor}`}>{benefit.title}</h4>
                    </div>
                    <p className="text-gray-600">{benefit.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-xl text-white">
              <h4 className="text-lg font-semibold mb-4">Join Our Community</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">50K+</div>
                  <div className="text-sm opacity-90">Students</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">2.5K+</div>
                  <div className="text-sm opacity-90">Companies</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">15K+</div>
                  <div className="text-sm opacity-90">Placements</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">85%</div>
                  <div className="text-sm opacity-90">Success Rate</div>
                </div>
              </div>
            </div>
          </div>

          {/* Form Section */}
          <div className="bg-white p-8 rounded-2xl shadow-xl">
            {/* User Type Selection */}
            <div className="grid grid-cols-3 gap-1 mb-6 bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setUserType('student')}
                className={`flex items-center justify-center py-2 px-2 rounded-md font-medium transition-colors text-sm ${userType === 'student' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
              >
                <GraduationCap className="w-4 h-4 mr-1" />
                Student
              </button>
              <button
                onClick={() => setUserType('recruiter')}
                className={`flex items-center justify-center py-2 px-2 rounded-md font-medium transition-colors text-sm ${userType === 'recruiter' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
              >
                <Building2 className="w-4 h-4 mr-1" />
                Recruiter
              </button>
              <button
                onClick={() => setUserType('admin')}
                className={`flex items-center justify-center py-2 px-2 rounded-md font-medium transition-colors text-sm ${userType === 'admin' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
              >
                <Shield className="w-4 h-4 mr-1" />
                Admin
              </button>
            </div>

            {/* Login/Signup Toggle */}
            <div className="flex mb-6">
              <button
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-2 px-4 font-medium transition-colors ${isLogin ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
              >
                Sign In
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-2 px-4 font-medium transition-colors ${!isLogin ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
              >
                Sign Up
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    onBlur={() => setFormErrors((e) => ({ ...e, email: validateEmail(formData.email) ? undefined : 'Enter a valid email address' }))}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${formErrors.email ? 'border-red-400' : 'border-gray-300'}`}
                    placeholder="Enter your email"
                    required
                  />
                </div>
                {formErrors.email && <div className="text-red-600 text-sm mt-1">{formErrors.email}</div>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${formErrors.password ? 'border-red-400' : 'border-gray-300'}`}
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {/* Strength meter */}
                {!isLogin && (
                  <div className="mt-2">
                    <div className="flex gap-1">
                      {[0, 1, 2, 3].map((i) => (
                        <div key={i} className={`h-1.5 flex-1 rounded ${i < passwordScore ? passwordBarClass : 'bg-gray-200'}`} />
                      ))}
                    </div>
                    <div className="text-xs text-gray-600 mt-1 flex items-center">
                      <ShieldCheck className="w-3.5 h-3.5 mr-1 text-gray-500" /> {passwordLabel}
                    </div>
                  </div>
                )}
                {formErrors.password && <div className="text-red-600 text-sm mt-1">{formErrors.password}</div>}
              </div>

              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${formErrors.confirmPassword ? 'border-red-400' : 'border-gray-300'}`}
                      placeholder="Confirm your password"
                      required
                    />
                  </div>
                  {formErrors.confirmPassword && <div className="text-red-600 text-sm mt-1">{formErrors.confirmPassword}</div>}
                </div>
              )}

              {!isLogin && userType === 'student' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">College/University</label>
                    <input
                      type="text"
                      name="college"
                      value={formData.college}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your college name"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Course</label>
                      <select
                        name="course"
                        value={formData.course}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      >
                        <option value="">Select Course</option>
                        {courses.map((course) => (
                          <option key={course} value={course}>{course}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Graduation Year</label>
                      <select
                        name="graduationYear"
                        value={formData.graduationYear}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      >
                        <option value="">Select Year</option>
                        {graduationYears.map((year) => (
                          <option key={year} value={year}>{year}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </>
              )}

              {!isLogin && userType === 'recruiter' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                    <input
                      type="text"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your company name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Designation</label>
                    <input
                      type="text"
                      name="designation"
                      value={formData.designation}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your designation"
                      required
                    />
                  </div>
                </>
              )}

              {!isLogin && userType === 'admin' && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-yellow-800">
                    <strong>Note:</strong> Admin accounts have full access to manage the platform, including users, applications, and content.
                  </p>
                </div>
              )}

              {/* Options */}
              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
                  Remember me
                </label>
                {isLogin && (
                  <a href="#" className="text-blue-600 hover:text-blue-700 text-sm">Forgot your password?</a>
                )}
              </div>

              {!isLogin && (
                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input type="checkbox" checked={agreeTerms} onChange={(e) => setAgreeTerms(e.target.checked)} />
                  I agree to the Terms and Privacy Policy
                </label>
              )}

              <button
                type="submit"
                disabled={loading || (!isLogin && !agreeTerms)}
                className={`w-full ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center`}
              >
                {loading ? (<><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Processing...</>) : (<>{isLogin ? 'Sign In' : 'Create Account'} <ArrowRight className="w-5 h-5 ml-2" /></>)}
              </button>
            </form>

            {/* Social/Alternative */}
            <div className="mt-6">
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-white px-3 text-gray-500">or continue with</span>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                <button onClick={() => alert('Google sign-in placeholder')} className="border border-gray-300 rounded-lg py-2 font-medium hover:bg-gray-50">Google</button>
                <button onClick={() => alert('Email magic link placeholder')} className="border border-gray-300 rounded-lg py-2 font-medium hover:bg-gray-50">Magic Link</button>
              </div>
            </div>

            <div className="mt-6 text-center text-sm text-gray-600">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button onClick={() => setIsLogin(!isLogin)} className="text-blue-600 hover:text-blue-700 font-medium">
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;