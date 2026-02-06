const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema(
  {
    // Keys
    email: { type: String, required: true, unique: true, index: true, match: [/^(?!\d)[\w.+-]+@([\w-]+\.)+[\w-]{2,}$/i, 'Invalid email: must not start with a digit and must contain @'] },
    userType: { type: String, default: 'admin' },

    // Auth
    password: { type: String, required: true },

    // Basic
    fullName: { type: String, required: true },

    // Admin specific
    role: { type: String, default: 'super_admin' }, // super_admin, admin, moderator
    permissions: {
      manageUsers: { type: Boolean, default: true },
      manageApplications: { type: Boolean, default: true },
      manageContent: { type: Boolean, default: true },
      viewAnalytics: { type: Boolean, default: true },
    },
  },
  { timestamps: true }
);

// Explicitly bind to the 'admins' collection
module.exports = mongoose.model('Admin', adminSchema, 'admins');

