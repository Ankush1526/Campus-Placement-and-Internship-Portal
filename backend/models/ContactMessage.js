const mongoose = require('mongoose');

const contactMessageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      match: [/^(?!\d)[\w.+-]+@([\w-]+\.)+[\w-]{2,}$/i, 'Invalid email: must not start with a digit and must contain @'],
      index: true,
    },
    userType: { type: String, enum: ['student', 'recruiter', 'college', 'other'], default: 'student' },
    subject: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true, maxlength: 5000 },
    status: { type: String, enum: ['new', 'read', 'resolved'], default: 'new', index: true },
    createdAt: { type: Date, default: Date.now, index: true },
  },
  { timestamps: true }
);

contactMessageSchema.index({ email: 1, createdAt: -1 });

module.exports = mongoose.model('ContactMessage', contactMessageSchema);


