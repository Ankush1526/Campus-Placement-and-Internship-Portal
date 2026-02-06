import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, MessageCircle, Users, Building2, ArrowRight } from 'lucide-react';

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    userType: 'student'
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const isValidEmail = /^(?!\d)[\w.+-]+@([\w-]+\.)+[\w-]{2,}$/i.test(formData.email || '');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccess(null);
    setError(null);
    try {
      // Client-side validation
      if (!/^(?!\d)[\w.+-]+@([\w-]+\.)+[\w-]{2,}$/i.test(formData.email)) {
        throw new Error('Email must not start with a digit and must contain @');
      }
      // Optional: if message includes a phone number field in future, validate 10 digits similarly

      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to send message');
      setSuccess(data.message || 'Message sent successfully.');
      setFormData({ name: '', email: '', subject: '', message: '', userType: 'student' });
    } catch (err: any) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email Us",
      details: ["ankushdubey111111@gmail.com", "Ujjwalkumar123@gmail.com", "Anupam1234@gmail.com"],
      color: "text-blue-600"
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: "Call Us",
      details: ["+91 9534183348", "+91 7903424456", "+91 7763007316"],
      color: "text-green-600"
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Visit Us",
      details: ["Marwadi University", "Rajkot, Gujarat 360003"],
      color: "text-purple-600"
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Office Hours",
      details: ["Monday - Friday: 9:00 AM - 6:00 PM", "Saturday: 10:00 AM - 4:00 PM"],
      color: "text-orange-600"
    }
  ];

  const supportCategories = [
    {
      icon: <Users className="w-8 h-8" />,
      title: "Student Support",
      description: "Get help with applications, profile setup, and career guidance",
      color: "border-blue-500",
      iconColor: "text-blue-500"
    },
    {
      icon: <Building2 className="w-8 h-8" />,
      title: "Recruiter Support",
      description: "Assistance with job postings, candidate screening, and platform features",
      color: "border-green-500",
      iconColor: "text-green-500"
    },
    {
      icon: <MessageCircle className="w-8 h-8" />,
      title: "Technical Support",
      description: "Help with technical issues, account problems, and platform navigation",
      color: "border-purple-500",
      iconColor: "text-purple-500"
    }
  ];

  const faqs = [
    {
      question: "How do I create an account?",
      answer: "Click on the 'Login' button and select 'Sign Up'. Choose your user type (Student/Recruiter) and fill in the required information."
    },
    {
      question: "Is PlacementHub free for students?",
      answer: "Yes, PlacementHub is completely free for students. You can create profiles, apply for jobs, and access all features at no cost."
    },
    {
      question: "How can companies post job openings?",
      answer: "Companies can register as recruiters and post job openings through their dashboard. We offer various packages for different hiring needs."
    },
    {
      question: "How do I track my applications?",
      answer: "Once logged in, go to your dashboard where you can see all your applications, their status, and any updates from employers."
    }
  ];

  return (
    <div className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Get in Touch
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Have questions or need assistance? We're here to help you succeed in your career journey.
            Reach out to our dedicated support team.
          </p>
        </div>

        {/* Contact Info Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {contactInfo.map((info, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-lg text-center card-hover">
              <div className={`${info.color} mb-4 flex justify-center`}>
                {info.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">{info.title}</h3>
              <div className="space-y-1">
                {info.details.map((detail, idx) => (
                  <p key={idx} className="text-gray-600 text-sm">{detail}</p>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Support Categories */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">How Can We Help?</h3>
            <p className="text-lg text-gray-600">Choose the support category that best matches your needs</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {supportCategories.map((category, index) => (
              <div
                key={index}
                className={`bg-white p-8 rounded-2xl border-l-4 ${category.color} shadow-lg card-hover`}
              >
                <div className="flex items-center mb-4">
                  <div className={`${category.iconColor} mr-4`}>
                    {category.icon}
                  </div>
                  <h4 className={`text-xl font-bold ${category.iconColor}`}>
                    {category.title}
                  </h4>
                </div>
                <p className="text-gray-600 leading-relaxed">{category.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Form and FAQ */}
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white p-8 rounded-2xl shadow-xl">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-3 rounded border border-red-300 bg-red-50 text-red-700 text-sm">{error}</div>
              )}
              {success && (
                <div className="p-3 rounded border border-green-300 bg-green-50 text-green-700 text-sm">{success}</div>
              )}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${formData.email && !isValidEmail ? 'border-red-400' : 'border-gray-300'}`}
                    placeholder="Enter your email"
                    required
                    pattern="^(?!\\d)[\\w.+-]+@([\\w-]+\\.)+[\\w-]{2,}$"
                    title="Email must not start with a digit and must contain @"
                  />
                  {formData.email && !isValidEmail && (
                    <div className="text-xs text-red-600 mt-1">Email must not start with a digit and must contain @.</div>
                  )}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    I am a
                  </label>
                  <select
                    name="userType"
                    value={formData.userType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="student">Student</option>
                    <option value="recruiter">Recruiter</option>
                    <option value="college">College Administrator</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter subject"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Tell us how we can help you..."
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={submitting || !isValidEmail}
                className={`w-full text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center ${(submitting || !isValidEmail) ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
              >
                {submitting ? 'Sending...' : 'Send Message'} <Send className="w-5 h-5 ml-2" />
              </button>
            </form>
          </div>

          {/* FAQ Section */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h3>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-white p-6 rounded-xl shadow-lg">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">{faq.question}</h4>
                  <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-xl text-white">
              <h4 className="text-lg font-semibold mb-3">Need More Help?</h4>
              <p className="mb-4 opacity-90">
                Can't find what you're looking for? Our comprehensive help center has detailed guides and tutorials.
              </p>
              <a
                href="#"
                className="inline-flex items-center text-white font-semibold hover:text-yellow-200 transition-colors"
              >
                Visit Help Center <ArrowRight className="w-4 h-4 ml-2" />
              </a>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center bg-gray-50 p-12 rounded-2xl">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">Ready to Get Started?</h3>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of students and companies already using PlacementHub
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#login"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-flex items-center justify-center"
            >
              Create Account <ArrowRight className="w-5 h-5 ml-2" />
            </a>
            <a
              href="#about"
              className="border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-600 hover:text-white transition-colors inline-flex items-center justify-center"
            >
              Learn More <ArrowRight className="w-5 h-5 ml-2" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;