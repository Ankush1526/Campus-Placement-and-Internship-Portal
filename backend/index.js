const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const nodemailer = require('nodemailer');
require('dotenv').config();
const USE_LOCAL_DB = (process.env.USE_LOCAL_DB || 'true') !== 'false';
let Student;
let Recruiter;
let Admin;
let Application;
let ContactMessage;
let newApplication;

if (USE_LOCAL_DB) {
  const local = require('./localdb/collections');
  Student = local.Student;
  Recruiter = local.Recruiter;
  Admin = local.Admin;
  Application = local.Application;
  ContactMessage = local.ContactMessage;
  newApplication = local.newApplication;
} else {
  const User = require('./models/User');
  Student = require('./models/Student');
  Recruiter = require('./models/Recruiter');
  Admin = require('./models/Admin');
  Application = require('./models/Application');
  ContactMessage = require('./models/ContactMessage');
}

const app = express();
const PORT = process.env.PORT || 5050;
const HOST = process.env.HOST || '127.0.0.1';
const JWT_SECRET = process.env.JWT_SECRET || 'change_me_in_env';
const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/placementhub';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'ankushdubey111111@gmail.com';
const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = Number(process.env.SMTP_PORT || 587);
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const SMTP_SECURE = (process.env.SMTP_SECURE || 'false') === 'true';
const SMTP_FROM = process.env.SMTP_FROM || SMTP_USER || `no-reply@${HOST}`;

let mailTransporter = null;

function initMailer() {
  // Allow either explicit SMTP settings or Gmail (when SMTP_HOST missing but SMTP_USER provided)
  if (!SMTP_HOST && !SMTP_USER) {
    console.log('SMTP not configured; contact emails will be skipped.');
    return;
  }

  const useGmailService = !SMTP_HOST && SMTP_USER;

  const transportConfig = useGmailService
    ? {
      // Gmail requires an App Password (not your normal password) when 2FA is on
      service: 'gmail',
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    }
    : {
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_SECURE,
      auth: SMTP_USER ? { user: SMTP_USER, pass: SMTP_PASS } : undefined,
    };

  mailTransporter = nodemailer.createTransport(transportConfig);

  mailTransporter.verify().then(() => {
    console.log('SMTP transporter ready for sending emails.');
  }).catch((err) => {
    console.error('SMTP verification failed:', err.message);
    logError('smtp_verify', err);
  });
}

async function sendContactEmail({ name, email, subject, message, userType }) {
  if (!mailTransporter || !ADMIN_EMAIL) return;
  const textBody = [
    `New contact message received.`,
    `Name: ${name}`,
    `Email: ${email}`,
    `User type: ${userType || 'student'}`,
    `Subject: ${subject}`,
    '',
    message,
  ].join('\n');

  await mailTransporter.sendMail({
    from: SMTP_FROM,
    to: ADMIN_EMAIL,
    subject: `[Contact] ${subject}`,
    text: textBody,
  });
}

initMailer();

function logError(scope, err) {
  try {
    const line = `[${new Date().toISOString()}] ${scope}: ${err && err.stack ? err.stack : (err && err.message ? err.message : String(err))}\n`;
    const logPath = path.join(__dirname, 'data', 'server.log');
    fs.mkdirSync(path.dirname(logPath), { recursive: true });
    fs.appendFileSync(logPath, line, 'utf8');
  } catch { }
}

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Do not set a global Content-Type header; let each route respond appropriately

// Health route
app.get('/api/health', (req, res) => {
  res.json({ ok: true, env: process.env.NODE_ENV || 'development' });
});

// Connect to MongoDB only if not using local JSON store
if (!USE_LOCAL_DB) {
  // Check if .env file exists
  const envPath = path.join(__dirname, '.env');
  if (!fs.existsSync(envPath)) {
    console.error('❌ .env file not found in backend directory!');
    console.error('   Please create a .env file by copying env.example:');
    console.error('   Windows: copy env.example .env');
    console.error('   Linux/Mac: cp env.example .env');
    console.error('   Then edit .env and add your MONGODB_URI');
    process.exit(1);
  }

  if (!MONGODB_URI || MONGODB_URI === 'mongodb://localhost:27017/placementhub') {
    console.error('❌ MONGODB_URI not configured. Please set MONGODB_URI in your .env file.');
    console.error('   For MongoDB Atlas, use: mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority');
    process.exit(1);
  }

  // Show connection string (with password hidden) for debugging
  const maskedUri = MONGODB_URI.replace(/:([^:@]+)@/, ':****@');
  console.log('🔍 Attempting to connect to MongoDB...');
  console.log('   Connection string: ' + maskedUri);

  // Validate connection string format
  if (MONGODB_URI.includes('mongodb+srv://')) {
    if (!MONGODB_URI.includes('@') || !MONGODB_URI.includes('.mongodb.net')) {
      console.error('❌ Invalid MongoDB Atlas connection string format.');
      console.error('   Expected format: mongodb+srv://username:password@cluster.mongodb.net/database?options');
      console.error('   Your current string: ' + maskedUri);
      process.exit(1);
    }

    // Extract cluster name for better error messages
    const clusterMatch = MONGODB_URI.match(/@([^.]+)\.mongodb\.net/);
    if (clusterMatch) {
      console.log('   Cluster: ' + clusterMatch[1]);
    }
  }
  mongoose
    .connect(MONGODB_URI)
    .then(() => {
      console.log('✅ MongoDB connected successfully');
      if (MONGODB_URI.includes('mongodb+srv://')) {
        console.log('   Connected to MongoDB Atlas');
      } else {
        console.log('   Connected to local MongoDB');
      }
    })
    .catch((err) => {
      console.error('❌ MongoDB connection error:', err.message);
      console.error('   Please check your MONGODB_URI in .env file');
      if (err.message.includes('ENOTFOUND') || err.message.includes('querySrv')) {
        console.error('   Common issues:');
        console.error('   - Cluster name in connection string might be incorrect');
        console.error('   - Check your cluster name in MongoDB Atlas dashboard');
        console.error('   - Ensure your IP address is whitelisted in Network Access');
        console.error('   - Verify username and password are correct');
      }
      if (err.message.includes('authentication')) {
        console.error('   Authentication failed:');
        console.error('   - Check username and password');
        console.error('   - Ensure special characters in password are URL-encoded');
        console.error('   - Verify database user has proper permissions');
      }
      logError('mongodb_connection', err);
      process.exit(1);
    });
} else {
  console.log('Using local JSON datastore (no MongoDB connection).');
  console.log('   To use MongoDB Atlas, set USE_LOCAL_DB=false in .env');
}

// Signup endpoint
app.post('/api/signup', async (req, res) => {
  try {
    const { email, password, fullName, userType, college, course, graduationYear, companyName, designation } = req.body;
    if (!email || !password || !fullName || !userType) {
      return res.status(400).json({ message: 'Missing required fields.' });
    }
    if (!/^(?!\d)[\w.+-]+@([\w-]+\.)+[\w-]{2,}$/i.test(email)) {
      return res.status(400).json({ message: 'Invalid email: must not start with a digit and must contain @' });
    }
    if (!['student', 'recruiter', 'admin'].includes(userType)) {
      return res.status(400).json({ message: 'Invalid userType. Must be student, recruiter, or admin.' });
    }
    const existingStudent = userType === 'student' ? await Student.findOne({ email }) : null;
    const existingRecruiter = userType === 'recruiter' ? await Recruiter.findOne({ email }) : null;
    const existingAdmin = userType === 'admin' ? await Admin.findOne({ email }) : null;
    const existingUser = existingStudent || existingRecruiter || existingAdmin;
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists.' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    if (userType === 'student') {
      await Student.create({
        email,
        password: hashedPassword,
        fullName,
        userType: 'student',
        college,
        course,
        graduationYear,
      });
    } else if (userType === 'recruiter') {
      if (!companyName) return res.status(400).json({ message: 'Company name is required for recruiters' });
      await Recruiter.create({
        email,
        password: hashedPassword,
        fullName,
        userType: 'recruiter',
        companyName,
        designation,
      });
    } else if (userType === 'admin') {
      await Admin.create({
        email,
        password: hashedPassword,
        fullName,
        userType: 'admin',
        role: 'super_admin',
        permissions: {
          manageUsers: true,
          manageApplications: true,
          manageContent: true,
          viewAnalytics: true,
        },
      });
    }

    const sanitized = { email, fullName, userType };
    res.status(201).json({ message: 'User registered successfully.', user: sanitized });
  } catch (err) {
    console.error('Signup error:', err);
    logError('signup', err);
    if (err && err.code === 11000) {
      return res.status(409).json({ message: 'User already exists (duplicate key).' });
    }
    if (err && err.name === 'ValidationError') {
      const firstKey = Object.keys(err.errors || {})[0];
      const firstMsg = firstKey ? (err.errors[firstKey]?.message || 'Validation error') : 'Validation error';
      return res.status(400).json({ message: firstMsg });
    }
    const expose = process.env.NODE_ENV !== 'production' && err && err.message ? err.message : 'Internal server error.';
    res.status(500).json({ message: expose });
  }
});

// Login endpoint
app.post('/api/login', async (req, res) => {
  try {
    const { email, password, userType } = req.body;
    if (!/^(?!\d)[\w.+-]+@([\w-]+\.)+[\w-]{2,}$/i.test(email)) {
      return res.status(400).json({ message: 'Invalid email: must not start with a digit and must contain @' });
    }
    let userDoc = null;
    if (userType === 'student') {
      userDoc = await Student.findOne({ email });
    } else if (userType === 'recruiter') {
      userDoc = await Recruiter.findOne({ email });
    } else if (userType === 'admin') {
      userDoc = await Admin.findOne({ email });
    }
    if (!userDoc) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }
    const isMatch = await bcrypt.compare(password, userDoc.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }
    const token = jwt.sign({ email: userDoc.email, userType }, JWT_SECRET, { expiresIn: '1h' });
    const sanitized = { email: userDoc.email, fullName: userDoc.fullName, userType };
    res.json({ token, user: sanitized });
  } catch (err) {
    console.error('Login error:', err);
    logError('login', err);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// Profile routes (basic auth by email+userType from client)
app.get('/api/profile', async (req, res) => {
  try {
    const { email, userType } = req.query;
    if (!email || !userType) return res.status(400).json({ message: 'Missing email or userType' });
    let user = null;
    if (userType === 'student') {
      user = await Student.findOne({ email });
    } else if (userType === 'recruiter') {
      user = await Recruiter.findOne({ email });
    } else if (userType === 'admin') {
      user = await Admin.findOne({ email });
    }
    if (!user) return res.status(404).json({ message: 'User not found' });
    delete user.password;
    res.json({ user });
  } catch (e) {
    console.error('Get profile error:', e);
    logError('get_profile', e);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

app.put('/api/profile', async (req, res) => {
  try {
    const { email, userType } = req.body;
    if (!email || !userType) return res.status(400).json({ message: 'Missing email or userType' });

    const updatable = {
      // basic
      fullName: req.body.fullName,
      username: req.body.username,
      // personal
      dob: req.body.dob,
      gender: req.body.gender,
      phone: req.body.phone,
      addressLine1: req.body.addressLine1,
      addressLine2: req.body.addressLine2,
      city: req.body.city,
      state: req.body.state,
      pincode: req.body.pincode,
      // academic
      college: req.body.college,
      course: req.body.course,
      department: req.body.department,
      enrollmentNumber: req.body.enrollmentNumber,
      semester: req.body.semester,
      graduationYear: req.body.graduationYear,
      cgpa: req.body.cgpa,
      tenthMarks: req.body.tenthMarks,
      twelfthMarks: req.body.twelfthMarks,
      backlogsCount: req.body.backlogsCount,
      // recruiter
      companyName: req.body.companyName,
      designation: req.body.designation,
      // skills & certs
      technicalSkills: req.body.technicalSkills,
      softSkills: req.body.softSkills,
      certifications: req.body.certifications,
      // internship / projects
      internshipTitle: req.body.internshipTitle,
      internshipCompany: req.body.internshipCompany,
      internshipDuration: req.body.internshipDuration,
      internshipDescription: req.body.internshipDescription,
      projectDetails: req.body.projectDetails,
      // placement prefs
      preferredRole: req.body.preferredRole,
      preferredLocation: req.body.preferredLocation,
      expectedSalary: req.body.expectedSalary,
      relocation: req.body.relocation,
      // media
      avatarData: req.body.avatarData,
      avatarMime: req.body.avatarMime,
      resumeData: req.body.resumeData,
      resumeName: req.body.resumeName,
    };

    Object.keys(updatable).forEach((k) => updatable[k] === undefined && delete updatable[k]);

    let updated = null;
    if (userType === 'student') {
      updated = await Student.findOneAndUpdate({ email }, { $set: updatable }, { new: true, runValidators: true });
    } else if (userType === 'recruiter') {
      updated = await Recruiter.findOneAndUpdate({ email }, { $set: updatable }, { new: true, runValidators: true });
    } else if (userType === 'admin') {
      updated = await Admin.findOneAndUpdate({ email }, { $set: updatable }, { new: true, runValidators: true });
    }
    if (!updated) return res.status(404).json({ message: 'User not found' });
    delete updated.password;
    res.json({ user: updated, message: 'Profile updated' });
  } catch (e) {
    console.error('Update profile error:', e);
    logError('update_profile', e);
    if (e.code === 11000 && e.keyPattern && e.keyPattern.username) {
      return res.status(409).json({ message: 'Username already taken' });
    }
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// Application endpoints
app.post('/api/applications', async (req, res) => {
  try {
    const {
      applicantEmail,
      applicantName,
      applicantContact,
      applicationType,
      targetId,
      targetTitle,
      targetCompany,
      resumeData,
      resumeName
    } = req.body;

    // Validate required fields
    if (!applicantEmail || !applicantName || !applicantContact || !applicationType ||
      !targetId || !targetTitle || !targetCompany || !resumeData || !resumeName) {
      return res.status(400).json({ message: 'Missing required fields.' });
    }

    // Check if user already applied for this position
    const existingApplication = await Application.findOne({
      applicantEmail,
      targetId,
      applicationType
    });

    if (existingApplication) {
      return res.status(409).json({ message: 'You have already applied for this position.' });
    }

    // Create new application
    const application = USE_LOCAL_DB ? newApplication({
      applicantEmail,
      applicantName,
      applicantContact,
      applicationType,
      targetId,
      targetTitle,
      targetCompany,
      resumeData,
      resumeName
    }) : new Application({
      applicantEmail,
      applicantName,
      applicantContact,
      applicationType,
      targetId,
      targetTitle,
      targetCompany,
      resumeData,
      resumeName
    });

    await application.save();

    res.status(201).json({
      message: 'Application submitted successfully!',
      application: {
        id: application._id,
        status: application.status,
        appliedAt: application.appliedAt
      }
    });

  } catch (err) {
    console.error('Application submission error:', err);
    logError('post_application', err);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// Contact message endpoint
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, subject, message, userType } = req.body;
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: 'All fields are required.' });
    }
    const doc = await ContactMessage.create({ name, email, subject, message, userType: userType || 'student' });
    sendContactEmail({ name, email, subject, message, userType }).catch((err) => logError('contact_email', err));
    res.status(201).json({ message: 'Message received. We will get back to you soon.', id: doc._id });
  } catch (err) {
    console.error('Contact message error:', err);
    logError('contact', err);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// Get applications for a user
app.get('/api/applications', async (req, res) => {
  try {
    const { email, applicationType } = req.query;

    if (!email) {
      return res.status(400).json({ message: 'Email is required.' });
    }

    const filter = { applicantEmail: email };
    if (applicationType) {
      filter.applicationType = applicationType;
    }

    let applications = await Application.find(filter);
    applications.sort((a, b) => new Date(b.appliedAt || b.createdAt || 0) - new Date(a.appliedAt || a.createdAt || 0));
    applications = applications.map((a) => {
      const c = { ...a };
      delete c.resumeData;
      return c;
    });

    res.json({ applications });

  } catch (err) {
    console.error('Get applications error:', err);
    logError('get_applications', err);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// Get applications for recruiters (by target company)
app.get('/api/applications/company', async (req, res) => {
  try {
    const { company, applicationType } = req.query;

    if (!company) {
      return res.status(400).json({ message: 'Company is required.' });
    }

    const filter = { targetCompany: { $regex: company, $options: 'i' } };
    if (applicationType) {
      filter.applicationType = applicationType;
    }

    let applications = await Application.find(filter);
    applications.sort((a, b) => new Date(b.appliedAt || b.createdAt || 0) - new Date(a.appliedAt || a.createdAt || 0));
    applications = applications.map((a) => {
      const c = { ...a };
      delete c.resumeData;
      return c;
    });

    res.json({ applications });

  } catch (err) {
    console.error('Get company applications error:', err);
    logError('get_company_applications', err);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// Update application status (for recruiters)
app.put('/api/applications/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    if (!status || !['pending', 'reviewed', 'shortlisted', 'rejected', 'accepted'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status.' });
    }

    const updateData = { status };
    if (status !== 'pending') {
      updateData.reviewedAt = new Date();
    }
    if (notes) {
      updateData.notes = notes;
    }

    let application = await Application.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );
    if (application) {
      const c = { ...application };
      delete c.resumeData;
      application = c;
    }

    if (!application) {
      return res.status(404).json({ message: 'Application not found.' });
    }

    res.json({
      message: 'Application status updated successfully.',
      application
    });

  } catch (err) {
    console.error('Update application status error:', err);
    logError('update_application_status', err);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// Resume download endpoint
app.get('/api/applications/:id/resume', async (req, res) => {
  try {
    const { id } = req.params;
    const application = await Application.findById(id);
    if (!application) {
      return res.status(404).json({ message: 'Application not found.' });
    }
    if (!application.resumeData || !application.resumeName) {
      return res.status(404).json({ message: 'Resume not found for this application.' });
    }
    const fileBuffer = Buffer.from(application.resumeData, 'base64');
    const fileName = application.resumeName;
    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    return res.send(fileBuffer);
  } catch (err) {
    console.error('Get resume error:', err);
    logError('get_resume', err);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// Admin endpoints
// Get all users (students and recruiters)
app.get('/api/admin/users', async (req, res) => {
  try {
    const { userType } = req.query;
    let users = [];

    if (!userType || userType === 'student') {
      const students = await Student.find({});
      console.log('Students found:', students.length);
      users = users.concat(students.map(s => {
        // Convert to plain object if needed
        let userObj;
        if (s && typeof s.toObject === 'function') {
          userObj = s.toObject();
        } else if (s && typeof s.toJSON === 'function') {
          userObj = s.toJSON();
        } else {
          // Already a plain object (local storage)
          userObj = s;
        }

        // Remove password and ensure userType
        const { password, ...safe } = userObj;
        return {
          _id: safe._id || safe.id || null,
          email: safe.email || '',
          fullName: safe.fullName || safe.name || '',
          userType: 'student',
          college: safe.college || '',
          companyName: '',
          designation: '',
          createdAt: safe.createdAt || safe.created_at || null
        };
      }));
    }

    if (!userType || userType === 'recruiter') {
      const recruiters = await Recruiter.find({});
      console.log('Recruiters found:', recruiters.length);
      users = users.concat(recruiters.map(r => {
        // Convert to plain object if needed
        let userObj;
        if (r && typeof r.toObject === 'function') {
          userObj = r.toObject();
        } else if (r && typeof r.toJSON === 'function') {
          userObj = r.toJSON();
        } else {
          // Already a plain object (local storage)
          userObj = r;
        }

        // Remove password and ensure userType
        const { password, ...safe } = userObj;
        return {
          _id: safe._id || safe.id || null,
          email: safe.email || '',
          fullName: safe.fullName || safe.name || '',
          userType: 'recruiter',
          college: '',
          companyName: safe.companyName || '',
          designation: safe.designation || '',
          createdAt: safe.createdAt || safe.created_at || null
        };
      }));
    }

    console.log('Total users:', users.length);
    if (users.length > 0) {
      console.log('First user sample:', {
        _id: users[0]._id,
        email: users[0].email,
        fullName: users[0].fullName,
        userType: users[0].userType
      });
    }

    res.json({ users });
  } catch (err) {
    console.error('Get all users error:', err);
    logError('admin_get_users', err);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// Get all applications
app.get('/api/admin/applications', async (req, res) => {
  try {
    let applications = await Application.find({});
    applications.sort((a, b) => new Date(b.appliedAt || b.createdAt || 0) - new Date(a.appliedAt || a.createdAt || 0));
    applications = applications.map((a) => {
      const c = { ...a };
      delete c.resumeData; // Don't send resume data in list view
      return c;
    });
    res.json({ applications });
  } catch (err) {
    console.error('Get all applications error:', err);
    logError('admin_get_applications', err);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// Get all contact messages
app.get('/api/admin/contact-messages', async (req, res) => {
  try {
    const messages = await ContactMessage.find({});
    messages.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    res.json({ messages });
  } catch (err) {
    console.error('Get contact messages error:', err);
    logError('admin_get_contact_messages', err);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// Get statistics
app.get('/api/admin/stats', async (req, res) => {
  try {
    const students = await Student.find({});
    const recruiters = await Recruiter.find({});
    const applications = await Application.find({});
    const contactMessages = await ContactMessage.find({});

    const stats = {
      totalStudents: students.length,
      totalRecruiters: recruiters.length,
      totalApplications: applications.length,
      totalContactMessages: contactMessages.length,
      applicationsByStatus: {
        pending: applications.filter(a => a.status === 'pending').length,
        reviewed: applications.filter(a => a.status === 'reviewed').length,
        shortlisted: applications.filter(a => a.status === 'shortlisted').length,
        rejected: applications.filter(a => a.status === 'rejected').length,
        accepted: applications.filter(a => a.status === 'accepted').length,
      },
      applicationsByType: {
        job: applications.filter(a => a.applicationType === 'job').length,
        internship: applications.filter(a => a.applicationType === 'internship').length,
      },
    };

    res.json({ stats });
  } catch (err) {
    console.error('Get stats error:', err);
    logError('admin_get_stats', err);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// Delete user
app.delete('/api/admin/users/:userType/:email', async (req, res) => {
  try {
    const { userType, email } = req.params;
    let deleted = null;

    if (userType === 'student') {
      deleted = await Student.findOneAndDelete({ email });
    } else if (userType === 'recruiter') {
      deleted = await Recruiter.findOneAndDelete({ email });
    } else if (userType === 'admin') {
      deleted = await Admin.findOneAndDelete({ email });
    }

    if (!deleted) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.json({ message: 'User deleted successfully.' });
  } catch (err) {
    console.error('Delete user error:', err);
    logError('admin_delete_user', err);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// Delete application
app.delete('/api/admin/applications/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Application.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: 'Application not found.' });
    }

    res.json({ message: 'Application deleted successfully.' });
  } catch (err) {
    console.error('Delete application error:', err);
    logError('admin_delete_application', err);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// Delete contact message
app.delete('/api/admin/contact-messages/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await ContactMessage.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: 'Contact message not found.' });
    }

    res.json({ message: 'Contact message deleted successfully.' });
  } catch (err) {
    console.error('Delete contact message error:', err);
    logError('admin_delete_contact_message', err);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// Fallback JSON 404 for unknown /api routes (avoid HTML responses)
app.use('/api', (req, res) => {
  res.status(404).json({ message: 'Not found' });
});

// Serve static files from the React app (adjust path as needed)
const frontendDistPath = path.join(__dirname, '../frontend/dist');
const frontendIndexPath = path.join(frontendDistPath, 'index.html');

// Only serve static files if the dist folder exists (for production)
if (fs.existsSync(frontendDistPath)) {
  app.use(express.static(frontendDistPath));

  // Catch-all route to serve React's index.html for non-API routes
  app.get(/^((?!\/api\/).)*$/, (req, res) => {
    if (fs.existsSync(frontendIndexPath)) {
      res.sendFile(frontendIndexPath);
    } else {
      res.status(404).json({
        message: 'Frontend not built. Please run "npm run build" in the frontend directory.',
        path: frontendIndexPath
      });
    }
  });
} else {
  // In development, provide helpful message
  app.get(/^((?!\/api\/).)*$/, (req, res) => {
    res.status(404).json({
      message: 'Frontend dist folder not found. Please build the frontend first by running "npm run build" in the frontend directory.',
      expectedPath: frontendDistPath,
      tip: 'For development, run the frontend separately with "npm run dev" on port 3000'
    });
  });
}

app.listen(PORT, HOST, () => {
  console.log(`Server running at http://${HOST}:${PORT}`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n❌ Error: Port ${PORT} is already in use.`);
    console.error(`\nTo fix this, you can:`);
    console.error(`1. Kill the process using port ${PORT}:`);
    console.error(`   Windows: netstat -ano | findstr :${PORT}`);
    console.error(`   Then: taskkill /PID <PID> /F`);
    console.error(`\n2. Or change the PORT in your .env file or environment variables.\n`);
    process.exit(1);
  } else {
    console.error('Server error:', err);
    process.exit(1);
  }
}); 