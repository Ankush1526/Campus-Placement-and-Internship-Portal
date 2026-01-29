const mongoose = require('mongoose');

const recruiterSchema = new mongoose.Schema(
  {
    // Keys
    email: { type: String, required: true, unique: true, index: true, match: [/^(?!\d)[\w.+-]+@([\w-]+\.)+[\w-]{2,}$/i, 'Invalid email: must not start with a digit and must contain @'] },
    userType: { type: String, default: 'recruiter' },

    // Auth
    password: { type: String, required: true },

    // Company
    companyName: { type: String, required: true, index: true },
    designation: String,

    // Contact person
    fullName: { type: String, required: true },
    phone: { type: String, match: [/^\d{10}$/, 'Mobile number must be exactly 10 digits'] },

    // Media (optional)
    avatarData: String,
    avatarMime: String,
  },
  { timestamps: true }
);

// Explicitly bind to the 'recruiters' collection
module.exports = mongoose.model('Recruiter', recruiterSchema, 'recruiters');


