const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  // Applicant details
  applicantEmail: {
    type: String,
    required: true,
    index: true,
    match: [/^(?!\d)[\w.+-]+@([\w-]+\.)+[\w-]{2,}$/i, 'Invalid email: must not start with a digit and must contain @']
  },
  applicantName: {
    type: String,
    required: true
  },
  applicantContact: {
    type: String,
    required: true,
    match: [/^\d{10}$/, 'Mobile number must be exactly 10 digits']
  },
  
  // Application type and target
  applicationType: {
    type: String,
    enum: ['internship', 'job'],
    required: true
  },
  targetId: {
    type: String,
    required: true
  },
  targetTitle: {
    type: String,
    required: true
  },
  targetCompany: {
    type: String,
    required: true
  },
  
  // Resume details
  resumeData: {
    type: String, // base64 encoded
    required: true
  },
  resumeName: {
    type: String,
    required: true
  },

  // Availability
  availability: {
    type: String,
    enum: ['immediate', 'custom'],
    default: 'immediate'
  },
  availabilityNote: {
    type: String
  },
  
  // Application status
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'shortlisted', 'rejected', 'accepted'],
    default: 'pending'
  },
  
  // Timestamps
  appliedAt: {
    type: Date,
    default: Date.now
  },
  reviewedAt: {
    type: Date
  },
  
  // Additional notes
  notes: {
    type: String
  }
}, {
  timestamps: true
});

// Index for efficient queries
applicationSchema.index({ applicantEmail: 1, applicationType: 1 });
applicationSchema.index({ targetId: 1, applicationType: 1 });
applicationSchema.index({ status: 1 });
applicationSchema.index({ appliedAt: -1 });

const Application = mongoose.model('Application', applicationSchema);
module.exports = Application;
// Also export the schema for reuse (e.g., Job/Internship aliases)
module.exports.applicationSchema = applicationSchema;
