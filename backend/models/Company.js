const mongoose = require('mongoose');

const companySchema = new mongoose.Schema(
  {
    // Keys
    email: { type: String, required: true, unique: true, index: true },
    userType: { type: String, default: 'recruiter' },

    // Auth
    password: { type: String, required: true },

    // Company
    companyName: { type: String, required: true, index: true },
    designation: String,

    // Contact person
    fullName: { type: String, required: true },
    phone: String,

    // Media (optional for company contact)
    avatarData: String,
    avatarMime: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Company', companySchema);


