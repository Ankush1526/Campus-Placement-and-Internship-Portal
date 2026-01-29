import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import Navigation from './components/Navigation';
import HomePage from './components/HomePage';
import AboutPage from './components/AboutPage';
import InternshipsPage from './components/InternshipsPage';
import JobsPage from './components/JobsPage';
import LoginPage from './components/LoginPage';
import ContactPage from './components/ContactPage';
import DashboardPage from './components/DashboardPage';
import UploadResumePage from './components/UploadResumePage';
import CreateJobAlertPage from './components/CreateJobAlertPage';
import NotificationsPage from './components/NotificationsPage';
import ApplyJobPage from './components/ApplyJobPage';
import ApplyInternshipPage from './components/ApplyInternshipPage';
import JobDetailsPage from './components/JobDetailsPage';
import InternshipDetailsPage from './components/InternshipDetailsPage';
import ProfilePage from './components/ProfilePage';
import AdminDashboardPage from './components/AdminDashboardPage';
import StickmanCanvas from './components/StickmanCanvas';
import PostInternshipPage from './components/PostInternshipPage';
import RecruiterApplicants from './components/RecruiterApplicants';

import './App.css';

function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-inter text-gray-900 dark:text-gray-100 transition-colors duration-300">
        <Router>
          <StickmanCanvas />
          <Navigation />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/internships" element={<InternshipsPage />} />
            <Route path="/jobs" element={<JobsPage />} />
            <Route path="/jobs/:jobId" element={<JobDetailsPage />} />
            <Route path="/internships/:internshipId" element={<InternshipDetailsPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/upload-resume" element={<UploadResumePage />} />
            <Route path="/create-job-alert" element={<CreateJobAlertPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/apply/:jobId" element={<ApplyJobPage />} />
            <Route path="/apply-internship/:internshipId" element={<ApplyInternshipPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/admin" element={<AdminDashboardPage />} />
            <Route path="/post-internship" element={<PostInternshipPage />} />
           
<Route path="/applicants/:internshipId" element={<RecruiterApplicants />} />
          </Routes>
        </Router>
      </div>
    </ThemeProvider>
  );
}

export default App;