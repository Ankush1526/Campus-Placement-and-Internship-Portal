import React from 'react';
import { Users, Code, Lightbulb, Award, ArrowRight, Star } from 'lucide-react';

const TeamsPage: React.FC = () => {
  const teamHighlights = [
    {
      icon: <Code className="w-8 h-8" />,
      title: "Development Team",
      color: "border-green-500",
      iconColor: "text-green-400",
      items: [
        "Frontend Developers: UI/UX specialists",
        "Backend Developers: System architects", 
        "Full Stack: Bridging both worlds",
        "Quality Assurance: Ensuring flawless experience"
      ]
    },
    {
      icon: <Lightbulb className="w-8 h-8" />,
      title: "Mentorship Team",
      color: "border-blue-500",
      iconColor: "text-blue-400",
      items: [
        "Project Guide: Technical direction and planning",
        "Reviewers: Quality evaluation and feedback",
        "Domain Experts: Specialized knowledge sharing"
      ]
    }
  ];

  const projectFeatures = [
    "Combined expertise in frontend and backend development",
    "Passionate team working with full dedication", 
    "Seamless collaboration between designers and developers",
    "With our guide's mentorship, we created an exceptional learning platform"
  ];

  return (
    <div className="max-w-6xl mx-auto px-8 py-16 text-white relative z-10">
      {/* Door Component */}
      <div className="door" id="door"></div>
      
      {/* Header */}
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold text-yellow-400 mb-6">
          Our Awesome Team
        </h2>
        <p className="text-xl text-gray-300 mb-8">
          Meet the passionate individuals behind this innovative learning platform
        </p>
        <a 
          href="/teams" 
          className="inline-flex items-center bg-yellow-400 text-gray-900 px-8 py-3 rounded-full font-bold hover:bg-yellow-300 transition-colors shadow-lg"
        >
          Meet Our Full Team <ArrowRight className="w-5 h-5 ml-2" />
        </a> 
      </div>

      {/* Project Description */}
      <div className="bg-gray-700 bg-opacity-90 p-8 rounded-2xl border-l-4 border-yellow-400 mb-12 shadow-xl">
        <h3 className="text-2xl font-bold text-yellow-400 mb-6 flex items-center">
          <Star className="w-6 h-6 mr-3" />
          Project Highlights
        </h3>
        <ul className="space-y-4">
          {projectFeatures.map((feature, index) => (
            <li key={index} className="flex items-start space-x-3">
              <ArrowRight className="w-5 h-5 text-yellow-400 mt-1 flex-shrink-0" />
              <span className="text-gray-300 text-lg">{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Team Sections */}
      <div className="grid md:grid-cols-2 gap-8 mb-16">
        {teamHighlights.map((team, index) => (
          <div 
            key={index}
            className={`bg-gray-700 bg-opacity-90 p-8 rounded-2xl border-l-4 ${team.color} shadow-xl transition-all duration-300 hover:shadow-2xl hover:bg-opacity-100`}
          >
            <div className="flex items-center mb-6">
              <div className={`${team.iconColor} mr-4`}>
                {team.icon}
              </div>
              <h3 className={`text-2xl font-bold ${team.iconColor}`}>
                {team.title}
              </h3>
            </div>
            
            <ul className="space-y-3">
              {team.items.map((item, itemIndex) => (
                <li key={itemIndex} className="flex items-start space-x-3">
                  <Users className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300 text-lg">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Success Story */}
      <div className="bg-gray-700 bg-opacity-90 p-10 rounded-2xl text-center max-w-4xl mx-auto shadow-xl">
        <div className="flex justify-center mb-6">
          <Award className="w-12 h-12 text-yellow-400" />
        </div>
        <h3 className="text-2xl font-bold text-yellow-400 mb-6">Our Journey</h3>
        <p className="text-xl text-gray-300 leading-relaxed mb-8">
          Through collaborative effort and our guide's expert direction, we transformed an ambitious vision 
          into this successful educational platform, combining cutting-edge technology with effective pedagogy.
        </p>
        <a 
          href="/teams" 
          className="inline-flex items-center bg-yellow-400 text-gray-900 px-8 py-3 rounded-full font-bold hover:bg-yellow-300 transition-colors"
        >
          Learn More About Our Team <ArrowRight className="w-5 h-5 ml-2" />
        </a>
      </div>

      {/* Team Stats */}
      <div className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="text-center p-6 bg-gradient-to-b from-blue-500 to-purple-600 rounded-xl text-white">
          <div className="text-3xl font-bold mb-2">8+</div>
          <div>Team Members</div>
        </div>
        <div className="text-center p-6 bg-gradient-to-b from-green-500 to-teal-600 rounded-xl text-white">
          <div className="text-3xl font-bold mb-2">6+</div>
          <div>Months Development</div>
        </div>
        <div className="text-center p-6 bg-gradient-to-b from-orange-500 to-red-600 rounded-xl text-white">
          <div className="text-3xl font-bold mb-2">100+</div>
          <div>Hours Collaborated</div>
        </div>
        <div className="text-center p-6 bg-gradient-to-b from-purple-500 to-pink-600 rounded-xl text-white">
          <div className="text-3xl font-bold mb-2">1</div>
          <div>Shared Vision</div>
        </div>
      </div>
    </div>
  );
};

export default TeamsPage;