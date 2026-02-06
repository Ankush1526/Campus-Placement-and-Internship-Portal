// Script to check .env configuration
// Run with: node check-env.js

require('dotenv').config();
const fs = require('fs');
const path = require('path');

console.log('🔍 Checking .env configuration...\n');

const envPath = path.join(__dirname, '.env');

// Check if .env exists
if (!fs.existsSync(envPath)) {
    console.error('❌ .env file not found!');
    console.error('   Run: copy env.example .env');
    process.exit(1);
}

console.log('✅ .env file exists\n');

// Check USE_LOCAL_DB
const useLocalDb = process.env.USE_LOCAL_DB;
console.log('USE_LOCAL_DB:', useLocalDb || 'not set (defaults to true)');

if (useLocalDb === 'false') {
    console.log('   ✅ Using MongoDB Atlas\n');
} else {
    console.log('   ⚠️  Using local JSON storage (not MongoDB Atlas)');
    console.log('   💡 Set USE_LOCAL_DB=false to use Atlas\n');
}

// Check MONGODB_URI
const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;

if (!mongoUri) {
    console.error('❌ MONGODB_URI not set in .env file');
    console.error('   Add: MONGODB_URI=your_connection_string');
    process.exit(1);
}

console.log('MONGODB_URI:', mongoUri.replace(/:([^:@]+)@/, ':****@'));
console.log('');

// Validate format
if (mongoUri.includes('mongodb+srv://')) {
    console.log('✅ Connection string uses mongodb+srv:// (correct for Atlas)');

    // Check for required components
    const hasAt = mongoUri.includes('@');
    const hasMongoNet = mongoUri.includes('.mongodb.net');
    const hasDatabase = mongoUri.match(/\.mongodb\.net\/([^?]+)/);

    console.log('   Has @ symbol:', hasAt ? '✅' : '❌');
    console.log('   Has .mongodb.net:', hasMongoNet ? '✅' : '❌');
    console.log('   Has database name:', hasDatabase ? '✅ (' + hasDatabase[1] + ')' : '❌');

    if (!hasAt || !hasMongoNet) {
        console.error('\n❌ Invalid connection string format!');
        console.error('   Expected: mongodb+srv://username:password@cluster.mongodb.net/database?options');
        process.exit(1);
    }

    // Extract cluster name
    const clusterMatch = mongoUri.match(/@([^.]+)\.mongodb\.net/);
    if (clusterMatch) {
        const clusterName = clusterMatch[1];
        console.log('   Cluster name:', clusterName);

        // Check if it's a placeholder
        if (clusterName.toLowerCase().includes('cluster') && clusterName.length < 15) {
            console.log('   ⚠️  Warning: Cluster name looks like a placeholder');
            console.log('   💡 Make sure you replaced "Cluster0" with your actual cluster name from Atlas');
        }
    }

    // Check for database name
    if (!hasDatabase || hasDatabase[1] === '') {
        console.log('   ⚠️  Warning: No database name specified');
        console.log('   💡 Add /placementhub before the ? in your connection string');
    }

} else if (mongoUri.includes('mongodb://')) {
    console.log('⚠️  Connection string uses mongodb:// (for local MongoDB)');
    console.log('   For Atlas, use mongodb+srv:// instead');
} else {
    console.error('❌ Invalid connection string format');
    console.error('   Must start with mongodb:// or mongodb+srv://');
    process.exit(1);
}

console.log('\n💡 To test connection, run: node test-connection.js');

