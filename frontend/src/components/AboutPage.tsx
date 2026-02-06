import React from 'react';
import { Target, Users, Award, Zap, CheckCircle, ArrowRight, Building2, GraduationCap, TrendingUp, Star } from 'lucide-react';
import AnimatedCounter from './AnimatedCounter';
import FloatingParticles from './FloatingParticles';

const AboutPage: React.FC = () => {
  const getAvatarInitials = (fullName: string): string => {
    if (!fullName) return '';
    const parts = fullName.trim().split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
      const first = parts[0];
      const last = parts[parts.length - 1];
      const firstChar = first.charAt(0) || '';
      const secondChar = last.charAt(0) || '';
      return (firstChar + secondChar).toUpperCase();
    }
    const only = parts[0];
    return (only.charAt(0) + (only.charAt(1) || '')).toUpperCase();
  };
  const values = [
    {
      icon: <Target className="w-8 h-8" />,
      title: "Mission-Driven",
      description: "Bridging the gap between talented students and leading companies through innovative technology and personalized matching.",
      color: "border-blue-500",
      iconColor: "text-blue-500"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Student-Centric",
      description: "Every feature is designed with students in mind, ensuring a seamless experience from profile creation to job placement.",
      color: "border-green-500",
      iconColor: "text-green-500"
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Excellence Focused",
      description: "We partner only with reputable companies and maintain high standards for all opportunities on our platform.",
      color: "border-purple-500",
      iconColor: "text-purple-500"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Innovation First",
      description: "Leveraging cutting-edge technology to provide smart recommendations and streamlined application processes.",
      color: "border-orange-500",
      iconColor: "text-orange-500"
    }
  ];

  const achievements = [
    "India's largest college placement platform",
    "Partnerships with 2,500+ companies across industries",
    "85% placement success rate for registered students",
    "AI-powered job matching for better fit",
    "24/7 support for students and recruiters",
    "Comprehensive skill assessment tools"
  ];

  const impactStats = [
    { 
      number: 500, 
      label: "Partner Colleges", 
      icon: <GraduationCap className="w-6 h-6" />,
      suffix: "+",
      color: "from-blue-500 to-blue-600",
      description: "Universities and colleges"
    },
    { 
      number: 2500, 
      label: "Companies", 
      icon: <Building2 className="w-6 h-6" />,
      suffix: "+",
      color: "from-green-500 to-green-600",
      description: "Partner organizations"
    },
    { 
      number: 50000, 
      label: "Students", 
      icon: <Users className="w-6 h-6" />,
      suffix: "+",
      color: "from-purple-500 to-purple-600",
      description: "Active users"
    },
    { 
      number: 15000, 
      label: "Placements", 
      icon: <TrendingUp className="w-6 h-6" />,
      suffix: "+",
      color: "from-orange-500 to-red-500",
      description: "Successful placements"
    }
  ];

  const team = [
    {
      name: "Ankush Kumar Dubey",
      role: "Full Stack Developer",
      description: "Final Year College Student,Passionate about coding and problem solving",
      image: "RK"
    },
    {
      name: "Gaurav Singh",
      role: "Backend Developer",
      description: "Expert in backend development and solving issues if any",
      image: "PS"
    },
    {
      name: "Sonu Kumar",
      role: "Full Satck Developer",
      description: "Passionate developer with curiosity to learn new things",
      image: "AP"
    }
  ];

  return (
    <div className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              About PlacementHub
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Empowering students to achieve their career aspirations through innovative placement solutions
            and meaningful connections with industry leaders.
          </p>
        </div>

        {/* Story Section */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          <div className="slide-in-left">
            <h3 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h3>
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              Founded in 2025 by a team of educators and technologists, PlacementHub was born from
              the vision to revolutionize how students connect with career opportunities. We recognized
              the challenges students face in navigating the complex placement process and set out to
              create a platform that simplifies and enhances this journey.
            </p>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Today, we're proud to be India's leading college placement platform, having facilitated
              over 15,000 successful placements and continuing to grow our network of partner institutions
              and companies.
            </p>
            <a
              href="#contact"
              className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-700 transition-colors"
            >
              Learn More About Our Journey <ArrowRight className="w-4 h-4 ml-2" />
            </a>
          </div>

          <div className="slide-in-right">
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 p-8 rounded-2xl relative overflow-hidden">
              {/* Background decoration */}
              <div className="absolute inset-0 bg-grid-pattern opacity-5 dark:opacity-10"></div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-200 dark:bg-blue-800 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-200 dark:bg-purple-800 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
              
                              <div className="relative z-10">
                  <h4 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Our Impact</h4>
                <div className="grid grid-cols-2 gap-6">
                  {impactStats.map((stat, index) => (
                    <div key={index} className="text-center group hover:scale-105 transition-transform duration-300">
                      <div className="flex justify-center mb-3">
                        <div className={`p-2 rounded-lg bg-gradient-to-r ${stat.color} text-white shadow-md group-hover:shadow-lg transition-shadow duration-300`}>
                          {stat.icon}
                        </div>
                      </div>
                      <div className="mb-2">
                        <AnimatedCounter
                          end={stat.number}
                          suffix={stat.suffix}
                          duration={2000}
                          delay={index * 150}
                          className="text-2xl font-bold"
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
        </div>

        {/* Values Section */}
        <div className="mb-20 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 opacity-30"></div>
          <div className="absolute top-0 left-0 w-72 h-72 bg-blue-200 dark:bg-blue-800 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob"></div>
          <div className="absolute bottom-0 right-0 w-72 h-72 bg-purple-200 dark:bg-purple-800 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-2000"></div>
          
          <div className="relative z-10">
            <div className="text-center mb-12">
              <h3 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                <span className="bg-gradient-to-r from-green-600 to-blue-600 dark:from-green-400 dark:to-blue-400 bg-clip-text text-transparent">
                  Our Values
                </span>
              </h3>
              <p className="text-lg text-gray-600 dark:text-gray-300">The principles that guide everything we do</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className={`bg-white dark:bg-gray-800 p-8 rounded-2xl border-l-4 ${value.color} shadow-lg card-hover`}
              >
                <div className="flex items-center mb-4">
                  <div className={`${value.iconColor} mr-4`}>
                    {value.icon}
                  </div>
                  <h4 className={`text-xl font-bold ${value.iconColor}`}>
                    {value.title}
                  </h4>
                </div>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{value.description}</p>
              </div>
            ))}
            </div>
          </div>
        </div>

        {/* Achievements Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">Why Choose PlacementHub?</h3>
            <p className="text-lg text-gray-600 dark:text-gray-300">What sets us apart in the placement industry</p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-2xl">
            <div className="grid md:grid-cols-2 gap-6">
              {achievements.map((achievement, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300 text-lg">{achievement}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">Leadership Team</h3>
            <p className="text-lg text-gray-600 dark:text-gray-300">Meet the visionaries behind PlacementHub</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div key={index} className="text-center card-hover">
                <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {getAvatarInitials(member.name)}
                </div>
                <h4 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">{member.name}</h4>
                <p className="text-blue-600 dark:text-blue-400 font-semibold mb-3">{member.role}</p>
                <p className="text-gray-600 dark:text-gray-300">{member.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-blue-600 to-purple-600 p-12 rounded-2xl text-white">
          <h3 className="text-3xl font-bold mb-4">Ready to Transform Your Career?</h3>
          <p className="text-xl mb-8 opacity-90">
            Join the PlacementHub community and take the first step towards your dream job
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="login"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center justify-center"
            >
              Get Started <ArrowRight className="w-5 h-5 ml-2" />
            </a>
            <a
              href="contact"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors inline-flex items-center justify-center"
            >
              Contact Us <ArrowRight className="w-5 h-5 ml-2" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;