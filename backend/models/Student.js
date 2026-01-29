const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema(
  {
    // Keys
    email: { type: String, required: true, unique: true, index: true, match: [/^(?!\d)[\w.+-]+@([\w-]+\.)+[\w-]{2,}$/i, 'Invalid email: must not start with a digit and must contain @'] },
    userType: { type: String, default: 'student' },

    // Auth
    password: { type: String, required: true },

    // Basic
    fullName: { type: String, required: true },

    // Personal
    dob: String,
    gender: String,
    phone: { type: String, match: [/^\d{10}$/, 'Mobile number must be exactly 10 digits'] },
    addressLine1: String,
    addressLine2: String,
    city: String,
    state: String,
    pincode: String,

    // Academic
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

    // Skills & certifications
    technicalSkills: String,
    softSkills: String,
    certifications: String,

    // Internship / projects
    internshipTitle: String,
    internshipCompany: String,
    internshipDuration: String,
    internshipDescription: String,
    projectDetails: String,

    // Preferences
    preferredRole: String,
    preferredLocation: String,
    expectedSalary: String,
    relocation: String,

    // Media
    avatarData: String,
    avatarMime: String,
    resumeData: String,
    resumeName: String,
  },
  { timestamps: true }
);

// Explicitly bind to the 'students' collection
module.exports = mongoose.model('Student', studentSchema, 'students');


