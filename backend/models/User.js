const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  // Auth
  email: { type: String, required: true, unique: true },
  username: { type: String, unique: true, sparse: true },
  password: { type: String, required: true },
  userType: { type: String, required: true },

  // Basic
  fullName: { type: String, required: true },

  // Personal Details
  dob: String,
  gender: String,
  phone: String,
  addressLine1: String,
  addressLine2: String,
  city: String,
  state: String,
  pincode: String,

  // Academic Details (for students)
  college: String,
  course: String,
  department: String,
  enrollmentNumber: String,
  semester: String,
  graduationYear: String,
  cgpa: String,
  tenthMarks: String,
  twelfthMarks: String,
  backlogsCount: String,

  // Recruiter details
  companyName: String,
  designation: String,

  // Skills & Certifications
  technicalSkills: String,
  softSkills: String,
  certifications: String,

  // Internship / Projects
  internshipTitle: String,
  internshipCompany: String,
  internshipDuration: String,
  internshipDescription: String,
  projectDetails: String,

  // Placement Preferences
  preferredRole: String,
  preferredLocation: String,
  expectedSalary: String,
  relocation: String,

  // Profile media
  avatarData: { type: String }, // base64 data URL
  avatarMime: { type: String },
  resumeData: { type: String }, // base64 data URL
  resumeName: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema); 