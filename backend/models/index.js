const mongoose = require('mongoose');
const Application = require('./Application');

// Reuse the same schema for type-specific collections
const { applicationSchema } = require('./Application');

const JobApplication =
  mongoose.models.JobApplication ||
  mongoose.model('JobApplication', applicationSchema, 'jobapplications');

const InternshipApplication =
  mongoose.models.InternshipApplication ||
  mongoose.model('InternshipApplication', applicationSchema, 'internshipapplications');

module.exports = {
  Application,
  JobApplication,
  InternshipApplication,
};
