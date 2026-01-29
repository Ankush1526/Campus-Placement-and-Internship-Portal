import React from 'react';
import { MessageCircle, Users, Award, Search, ArrowRight, CheckCircle } from 'lucide-react';

const DiscussionPage: React.FC = () => {
  const features = [
    {
      icon: <Users className="w-8 h-8" />,
      title: "Collaborative Learning",
      color: "border-green-500",
      iconColor: "text-green-400",
      items: [
        "Participate in weekly coding challenges",
        "Share projects for feedback", 
        "Get help with coding problems"
      ]
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Expert Support",
      color: "border-blue-500",
      iconColor: "text-blue-400",
      items: [
        "Direct access to experienced mentors",
        "Regular AMA sessions",
        "Professional code reviews"
      ]
    },
    {
      icon: <MessageCircle className="w-8 h-8" />,
      title: "Interactive Features", 
      color: "border-orange-500",
      iconColor: "text-orange-400",
      items: [
        "Real-time code collaboration",
        "Content voting system",
        "Markdown formatting support"
      ]
    },
    {
      icon: <Search className="w-8 h-8" />,
      title: "Knowledge Base",
      color: "border-purple-500", 
      iconColor: "text-purple-400",
      items: [
        "Curated problem solutions",
        "Searchable discussion archive",
        "Weekly top content digest"
      ]
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-8 py-16 text-white">
      {/* Header */}
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold text-yellow-400 mb-6">
          Join Our Programming Community
        </h2>
        <p className="text-xl text-gray-300 mb-8">
          Connect with fellow developers, share knowledge, and grow together
        </p>
        <a 
          href="/discussion" 
          className="inline-flex items-center bg-yellow-400 text-gray-900 px-8 py-3 rounded-full font-semibold hover:bg-yellow-300 transition-colors"
        >
          Visit Discussion Forum <ArrowRight className="w-5 h-5 ml-2" />
        </a>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-2 gap-8">
        {features.map((feature, index) => (
          <div 
            key={index}
            className={`bg-gray-700 bg-opacity-90 p-8 rounded-2xl border-l-4 ${feature.color} shadow-xl transition-all duration-300 hover:shadow-2xl hover:bg-opacity-100`}
          >
            <div className="flex items-center mb-6">
              <div className={`${feature.iconColor} mr-4`}>
                {feature.icon}
              </div>
              <h3 className={`text-2xl font-bold ${feature.iconColor.replace('text-', 'text-')}`}>
                {feature.title}
              </h3>
            </div>
            
            <ul className="space-y-3">
              {feature.items.map((item, itemIndex) => (
                <li key={itemIndex} className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300 text-lg">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Community Stats */}
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="text-center p-6 bg-gray-700 bg-opacity-50 rounded-xl">
          <div className="text-3xl font-bold text-yellow-400 mb-2">500+</div>
          <div className="text-gray-300">Active Members</div>
        </div>
        <div className="text-center p-6 bg-gray-700 bg-opacity-50 rounded-xl">
          <div className="text-3xl font-bold text-green-400 mb-2">1,200+</div>
          <div className="text-gray-300">Questions Answered</div>
        </div>
        <div className="text-center p-6 bg-gray-700 bg-opacity-50 rounded-xl">
          <div className="text-3xl font-bold text-blue-400 mb-2">50+</div>
          <div className="text-gray-300">Weekly Challenges</div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="mt-16 text-center">
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-8 rounded-2xl shadow-xl">
          <h3 className="text-2xl font-bold text-white mb-4">Ready to Join the Community?</h3>
          <p className="text-gray-200 mb-6">Start participating in discussions and accelerate your learning</p>
          <button className="bg-white text-purple-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors">
            Join Discussion Forum
          </button>
        </div>
      </div>
    </div>
  );
};

export default DiscussionPage;