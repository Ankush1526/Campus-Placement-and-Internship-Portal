// Quick test script to verify MongoDB connection
// Run with: node test-connection.js

require('dotenv').config();
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;

console.log('🔍 Testing MongoDB Connection...\n');

if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI not found in .env file');
    console.error('   Please create a .env file and add your MONGODB_URI');
    process.exit(1);
}

// Mask password for display
const maskedUri = MONGODB_URI.replace(/:([^:@]+)@/, ':****@');
console.log('Connection String:', maskedUri);
console.log('');

// Validate format
if (!MONGODB_URI.includes('mongodb+srv://')) {
    console.error('❌ Connection string must start with mongodb+srv:// for Atlas');
    process.exit(1);
}

if (!MONGODB_URI.includes('@') || !MONGODB_URI.includes('.mongodb.net')) {
    console.error('❌ Invalid connection string format');
    console.error('   Expected: mongodb+srv://username:password@cluster.mongodb.net/database?options');
    process.exit(1);
}

// Extract components
const uriMatch = MONGODB_URI.match(/mongodb\+srv:\/\/([^:]+):([^@]+)@([^/]+)\/([^?]+)/);
if (uriMatch) {
    console.log('Connection Details:');
    console.log('  Username:', uriMatch[1]);
    console.log('  Password:', '****');
    console.log('  Cluster:', uriMatch[3]);
    console.log('  Database:', uriMatch[4]);
    console.log('');
}

// Try to connect
console.log('Attempting connection...');
mongoose
    .connect(MONGODB_URI)
    .then(() => {
        console.log('✅ Connection successful!');
        console.log('   Connected to MongoDB Atlas');
        process.exit(0);
    })
    .catch((err) => {
        console.error('❌ Connection failed!');
        console.error('   Error:', err.message);
        console.error('');

        if (err.message.includes('ENOTFOUND') || err.message.includes('querySrv')) {
            console.error('💡 This usually means:');
            console.error('   1. Cluster name is incorrect - check your cluster name in Atlas');
            console.error('   2. Connection string format is wrong');
            console.error('   3. Network/DNS issue');
            console.error('');
            console.error('   Fix: Get the connection string from Atlas:');
            console.error('   - Go to Clusters → Connect → Connect your application');
            console.error('   - Copy the exact string and update .env file');
        } else if (err.message.includes('authentication')) {
            console.error('💡 Authentication failed:');
            console.error('   1. Check username and password');
            console.error('   2. URL-encode special characters in password');
            console.error('   3. Verify database user exists in Atlas');
        } else if (err.message.includes('IP')) {
            console.error('💡 IP not whitelisted:');
            console.error('   - Go to Network Access in Atlas');
            console.error('   - Add your IP or allow from anywhere (0.0.0.0/0)');
        }

        process.exit(1);
    });

