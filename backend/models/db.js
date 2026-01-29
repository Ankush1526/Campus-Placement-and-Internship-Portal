// This file is deprecated - MongoDB connection is now handled in index.js
// Connection is configured via MONGODB_URI environment variable
// See env.example for MongoDB Atlas setup instructions

const mongoose = require('mongoose');

// This file is kept for backward compatibility but connection should be done in index.js
// If you need to use this file, uncomment and update the connection string:
/*
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/placementhub';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB connected'))
.catch((err) => console.error('❌ MongoDB connection error:', err));
*/

module.exports = mongoose;
