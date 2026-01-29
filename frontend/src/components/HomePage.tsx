import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, Users, Building2, TrendingUp, Award, Search, Upload, Bell, Briefcase, Rocket, Star, GraduationCap, Zap, Target, Globe, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AnimatedCounter from './AnimatedCounter';
import FloatingParticles from './FloatingParticles';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const finalSectionRef = useRef<HTMLDivElement>(null);
  const [showDoor, setShowDoor] = useState(false);
  const features = [
    {
      icon: <Search className="w-8 h-8" />,
      title: "Find Opportunities",
      description: "Browse thousands of internships and job openings from top companies",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: <Upload className="w-8 h-8" />,
      title: "Upload Resume",
      description: "Create your profile and upload your resume to get noticed by recruiters",
      color: "from-green-500 to-green-600"
    },
    {
      icon: <Bell className="w-8 h-8" />,
      title: "Get Notifications",
      description: "Receive instant alerts for new opportunities matching your profile",
      color: "from-purple-500 to-purple-600"
    }
  ];

  const stats = [
    {
      number: 50000,
      label: "Students Registered",
      icon: <Users className="w-6 h-6" />,
      suffix: "+",
      color: "from-blue-500 to-blue-600",
      description: "Active students seeking opportunities"
    },
    {
      number: 2500,
      label: "Partner Companies",
      icon: <Building2 className="w-6 h-6" />,
      suffix: "+",
      color: "from-green-500 to-green-600",
      description: "Top companies hiring through us"
    },
    {
      number: 85,
      label: "Placement Rate",
      icon: <TrendingUp className="w-6 h-6" />,
      suffix: "%",
      color: "from-purple-500 to-purple-600",
      description: "Success rate in placements"
    },
    {
      number: 15000,
      label: "Success Stories",
      icon: <Award className="w-6 h-6" />,
      suffix: "+",
      color: "from-orange-500 to-red-500",
      description: "Students placed successfully"
    }
  ];

  const additionalStats = [
    {
      number: 95,
      label: "Satisfaction Rate",
      icon: <Heart className="w-6 h-6" />,
      suffix: "%",
      color: "from-pink-500 to-rose-500",
      description: "Student satisfaction score"
    },
    {
      number: 200,
      label: "Cities Covered",
      icon: <Globe className="w-6 h-6" />,
      suffix: "+",
      color: "from-cyan-500 to-blue-500",
      description: "Opportunities across India"
    },
    {
      number: 500,
      label: "Daily Applications",
      icon: <Zap className="w-6 h-6" />,
      suffix: "+",
      color: "from-yellow-500 to-orange-500",
      description: "Applications processed daily"
    },
    {
      number: 98,
      label: "Response Rate",
      icon: <Target className="w-6 h-6" />,
      suffix: "%",
      color: "from-indigo-500 to-purple-500",
      description: "Companies respond within 48h"
    }
  ];

  const recentOpportunities = [
    {
      company: "TechCorp",
      position: "Software Engineering Intern",
      type: "Internship",
      location: "Bangalore",
      salary: "₹25,000/month",
      deadline: "Dec 15, 2024"
    },
    {
      company: "DataSys",
      position: "Full Stack Developer",
      type: "Full-time",
      location: "Mumbai",
      salary: "₹8-12 LPA",
      deadline: "Dec 20, 2024"
    },
    {
      company: "InnovateLab",
      position: "UI/UX Design Intern",
      type: "Internship",
      location: "Delhi",
      salary: "₹20,000/month",
      deadline: "Dec 18, 2024"
    }
  ];

  const categories = [
    { title: 'Internships', desc: 'For students and freshers', color: 'from-blue-500 to-indigo-500', icon: <GraduationCap className="w-5 h-5" />, onClick: () => navigate('/internships') },
    { title: 'Fresher Jobs', desc: 'Start your first role', color: 'from-emerald-500 to-green-600', icon: <Rocket className="w-5 h-5" />, onClick: () => navigate('/jobs') },
    { title: 'Technology', desc: 'Software, Data, AI/ML', color: 'from-cyan-500 to-blue-600', icon: <Briefcase className="w-5 h-5" />, onClick: () => navigate('/jobs') },
    { title: 'Marketing', desc: 'Digital, Content, SEO', color: 'from-pink-500 to-rose-600', icon: <Briefcase className="w-5 h-5" />, onClick: () => navigate('/jobs') },
    { title: 'Finance', desc: 'Analyst, Banking, FinTech', color: 'from-amber-500 to-yellow-600', icon: <Briefcase className="w-5 h-5" />, onClick: () => navigate('/jobs') },
    { title: 'Design', desc: 'UI/UX, Product, Visual', color: 'from-violet-500 to-purple-600', icon: <Briefcase className="w-5 h-5" />, onClick: () => navigate('/jobs') },
  ];

  const testimonials = [
    {
      name: 'Aditi Sharma',
      role: 'Placed at TechGlobal as SDE-1',
      quote: 'PlacementHub made it simple to find roles that matched my skills. The alerts were super helpful!',
    },
    {
      name: 'Rahul Verma',
      role: 'Data Analyst at DataTech',
      quote: 'The platform is clean and fast. I discovered opportunities I would have otherwise missed.',
    },
    {
      name: 'Sneha Patel',
      role: 'UI/UX Intern at Creative Studios',
      quote: 'Loved the internship listings and the quick apply flow. Highly recommended!',
    },
  ];

  const partners = ['TechGlobal', 'MarketPro', 'FinanceCore', 'DesignStudio', 'DataTech', 'SalesForce'];

  useEffect(() => {
    const section = finalSectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => setShowDoor(entry.isIntersecting));
      },
      { threshold: 0.3 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative">
      {/* Hero Section */}
      <div className="gradient-bg hero-pattern pt-16 relative">
        <div className="absolute inset-0 bg-black/10 md:bg-black/20" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div className="text-center lg:text-left">
              <h1 className="hero-title text-4xl md:text-6xl font-bold text-white mb-6 fade-in-up">
                Your Gateway to
                <span className="block text-yellow-300">Dream Career</span>
              </h1>
              <p className="text-xl text-white opacity-90 mb-8 max-w-2xl fade-in-up">
                Connect with top companies, discover internships, and launch your career with PlacementHub.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start fade-in-up">
                <button
                  onClick={() => navigate('/internships')}
                  className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center justify-center"
                >
                  Explore Internships <ArrowRight className="w-5 h-5 ml-2" />
                </button>
                <button
                  onClick={() => navigate('/jobs')}
                  className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors inline-flex items-center justify-center"
                >
                  Browse Jobs <ArrowRight className="w-5 h-5 ml-2" />
                </button>
              </div>
              {/* Quick Search */}
              <div className="mt-8 bg-white/30 backdrop-blur rounded-xl p-2 flex items-center max-w-xl mx-auto lg:mx-0">
                <Search className="w-5 h-5 text-white mx-3" />
                <input
                  placeholder="Search roles, companies or skills..."
                  className="flex-1 bg-transparent placeholder-white/80 text-white focus:outline-none py-2"
                />
                <button onClick={() => navigate('/jobs')} className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold">Search</button>
              </div>
            </div>
            {/* Decorative/Illustration */}
            <div className="hidden lg:block">
              <div className="bg-white/20 rounded-2xl p-8 border border-white/30">
                <div className="grid grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="bg-white/30 rounded-xl h-28 flex items-center justify-center text-white/90">
                      <Star className="w-6 h-6 mr-2" /> Opportunity {i}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-20 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5 dark:opacity-10"></div>
        <div className="absolute top-0 left-0 w-72 h-72 bg-blue-200 dark:bg-blue-800 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 right-0 w-72 h-72 bg-purple-200 dark:bg-purple-800 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-pink-200 dark:bg-pink-800 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>

        {/* Floating Particles */}
        <FloatingParticles />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                Trusted by Thousands
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Join the growing community of students and companies achieving their goals together
            </p>
          </div>

          {/* Main Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group hover:scale-105 transition-transform duration-300">
                <div className="flex justify-center mb-6">
                  <div className={`p-4 rounded-2xl bg-gradient-to-r ${stat.color} text-white shadow-lg group-hover:shadow-xl transition-shadow duration-300`}>
                    {stat.icon}
                  </div>
                </div>
                <div className="mb-3">
                  <AnimatedCounter
                    end={stat.number}
                    suffix={stat.suffix}
                    duration={2500}
                    delay={index * 200}
                    className="text-4xl md:text-5xl font-bold"
                  />
                </div>
                <div className="text-lg font-semibold text-gray-900 mb-2">{stat.label}</div>
                <div className="text-sm text-gray-600">{stat.description}</div>
              </div>
            ))}
          </div>

          {/* Additional Stats */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20 dark:border-gray-700/20">
            <h3 className="text-2xl font-bold text-center text-gray-900 dark:text-gray-100 mb-8">
              <span className="bg-gradient-to-r from-green-600 to-blue-600 dark:from-green-400 dark:to-blue-400 bg-clip-text text-transparent">
                Platform Performance
              </span>
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {additionalStats.map((stat, index) => (
                <div key={index} className="text-center group">
                  <div className="flex justify-center mb-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color} text-white shadow-md group-hover:shadow-lg transition-shadow duration-300`}>
                      {stat.icon}
                    </div>
                  </div>
                  <div className="mb-2">
                    <AnimatedCounter
                      end={stat.number}
                      suffix={stat.suffix}
                      duration={2000}
                      delay={1000 + index * 150}
                      className="text-2xl md:text-3xl font-bold"
                    />
                  </div>
                  <div className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">{stat.label}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">{stat.description}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Explore Categories</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat) => (
              <button
                key={cat.title}
                onClick={cat.onClick}
                className="text-left bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition card-hover"
              >
                <div className={`inline-flex items-center justify-center rounded-lg p-3 text-white bg-gradient-to-r ${cat.color} mb-4`}>
                  {cat.icon}
                </div>
                <div className="text-lg font-semibold text-gray-900">{cat.title}</div>
                <div className="text-gray-600 text-sm mt-1">{cat.desc}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How PlacementHub Works</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Simple steps to connect students with their dream opportunities</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 feature-grid">
            {features.map((feature, index) => (
              feature.title === 'Find Opportunities' ? (
                <div key={index} className="text-center card-hover cursor-pointer" onClick={() => navigate('/jobs')}>
                  <div className={`feature-icon bg-gradient-to-r ${feature.color}`}>{feature.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              ) : feature.title === 'Upload Resume' ? (
                <div key={index} className="text-center card-hover cursor-pointer" onClick={() => navigate('/upload-resume')}>
                  <div className={`feature-icon bg-gradient-to-r ${feature.color}`}>{feature.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              ) : feature.title === 'Get Notifications' ? (
                <div key={index} className="text-center card-hover cursor-pointer" onClick={() => navigate('/notifications')}>
                  <div className={`feature-icon bg-gradient-to-r ${feature.color}`}>{feature.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              ) : (
                <div key={index} className="text-center card-hover">
                  <div className={`feature-icon bg-gradient-to-r ${feature.color}`}>{feature.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              )
            ))}
          </div>
        </div>
      </div>

      {/* Partners Strip */}
      <div className="bg-gray-50 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-6 items-center">
            {partners.map((name) => (
              <div key={name} className="bg-white rounded-lg p-4 text-center shadow-sm text-gray-600 font-medium">
                {name}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Latest Opportunities */}
      <div className="bg-white dark:bg-gray-900 py-20" id="opportunities">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Latest Opportunities
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Fresh openings from top companies
            </p>
          </div>

          {/* Same layout as Explore Categories */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentOpportunities.map((opportunity, index) => (
              <button
                key={index}
                onClick={() =>
                  navigate(opportunity.type === "Internship" ? "/internships" : "/jobs")
                }
                className="text-left bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm hover:shadow-md transition card-hover"
              >
                {/* Gradient icon like Categories */}
                <div
                  className={`inline-flex items-center justify-center rounded-lg p-3 text-white 
              bg-gradient-to-r ${opportunity.type === "Internship"
                      ? "from-green-500 to-green-600"
                      : "from-blue-500 to-indigo-600"
                    } mb-4`}
                >
                  {opportunity.company.charAt(0)}
                </div>

                {/* Position as Title */}
                <div className="text-lg font-semibold text-gray-900 dark:text-white">
                  {opportunity.position}
                </div>

                {/* Extra details like description */}
                <div className="text-gray-600 dark:text-gray-400 text-sm mt-1 space-y-1">
                  <div>{opportunity.company}</div>
                  <div>📍 {opportunity.location}</div>
                  <div>{opportunity.salary}</div>
                  <div>⏰ Apply by {opportunity.deadline}</div>
                </div>
              </button>
            ))}
          </div>

          <div className="text-center mt-12">
            <button
              onClick={() => navigate("/internships")}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-flex items-center"
            >
              View All Opportunities <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          </div>
        </div>
      </div>
      {/* Latest Opportunities */}
      <div className="bg-white dark:bg-gray-900 py-20" id="opportunities">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Title */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Latest Opportunities
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Fresh openings from top companies
            </p>
          </div>

          {/* Same layout as Explore Categories */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentOpportunities.map((opportunity, index) => (
              <button
                key={index}
                onClick={() =>
                  navigate(
                    opportunity.type === "Internship" ? "/internships" : "/jobs"
                  )
                }
                className="text-left bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm hover:shadow-md transition card-hover"
              >
                {/* Gradient icon like Categories */}
                <div
                  className={`inline-flex items-center justify-center rounded-full p-3 text-white 
                    bg-gradient-to-r ${opportunity.type === "Internship"
                      ? "from-green-500 to-green-600"
                      : "from-blue-500 to-indigo-600"
                    } mb-4`}
                >
                  {opportunity.company.charAt(0)}
                </div>

                {/* Position as Title */}
                <div className="text-lg font-semibold text-gray-900 dark:text-white">
                  {opportunity.position}
                </div>

                {/* Extra details like description */}
                <div className="text-gray-600 dark:text-gray-400 text-sm mt-1 space-y-1">
                  <div className="font-medium text-gray-800 dark:text-gray-200">
                    {opportunity.company}
                  </div>
                  <div>📍 {opportunity.location}</div>
                  <div>{opportunity.salary}</div>
                  <div>⏰ Apply by {opportunity.deadline}</div>
                </div>
              </button>
            ))}
          </div>

          {/* View All Button */}
          <div className="text-center mt-12">
            <button
              onClick={() => navigate("/internships")}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-flex items-center"
            >
              View All Opportunities <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Student Success Stories</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold mr-3">
                    {t.name.split(' ').map(w => w[0]).join('')}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{t.name}</div>
                    <div className="text-sm text-gray-600">{t.role}</div>
                  </div>
                </div>
                <p className="text-gray-700">“{t.quote}”</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Newsletter CTA */}
      <div className="gradient-bg py-16">
        <div className="max-w-3xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Get Job Alerts in Your Inbox</h2>
          <p className="text-white/90 mb-6">Subscribe to get the latest opportunities tailored to your interests.</p>
          <div className="bg-white rounded-xl p-2 flex items-center">
            <input placeholder="Enter your email" className="flex-1 px-4 py-3 rounded-l-xl focus:outline-none" />
            <button className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors">Subscribe</button>
          </div>
          <div className="text-white/80 text-sm mt-2">No spam. Unsubscribe anytime.</div>
        </div>
      </div>

      {/* Final CTA Section */}
      <div className="bg-white py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Ready to Start Your Career Journey?</h2>
          <p className="text-xl text-gray-600 mb-8">Join thousands of students who have found their dream jobs through PlacementHub</p>
          <button onClick={() => navigate('/jobs')} className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-flex items-center text-lg">
            Get Started Today <ArrowRight className="w-5 h-5 ml-2" />
          </button>
        </div>
      </div>
      <div ref={finalSectionRef} />
      <div
        id="door"
        className={`door ${showDoor ? 'door-visible' : 'door-hidden'}`}
        aria-hidden
      />
    </div>
  );
};

export default HomePage;