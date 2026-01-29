// Helper script to fix MongoDB connection string
// This will guide you to create the correct connection string

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function fixConnectionString() {
  console.log('🔧 MongoDB Connection String Fixer\n');
  console.log('This will help you create the correct connection string.\n');

  // Read current .env
  const envPath = path.join(__dirname, '.env');
  if (!fs.existsSync(envPath)) {
    console.error('❌ .env file not found!');
    console.error('   Run: copy env.example .env');
    process.exit(1);
  }

  const envContent = fs.readFileSync(envPath, 'utf8');
  const currentUri = envContent.match(/MONGODB_URI=(.+)/)?.[1] || '';

  console.log('Current connection string:');
  console.log('  ' + currentUri.replace(/:([^:@]+)@/, ':****@') + '\n');

  // Get user input
  console.log('📝 Please provide the following information:\n');
  
  const username = await question('Enter your MongoDB Atlas username: ');
  if (!username || username.includes('<') || username.includes('>')) {
    console.error('❌ Invalid username. Username cannot contain < or >');
    rl.close();
    process.exit(1);
  }

  const password = await question('Enter your MongoDB Atlas password: ');
  if (!password) {
    console.error('❌ Password is required');
    rl.close();
    process.exit(1);
  }

  // URL encode password if needed
  let encodedPassword = password;
  const specialChars = {
    '@': '%40',
    '#': '%23',
    '$': '%24',
    '%': '%25',
    '&': '%26',
    '+': '%2B',
    '=': '%3D',
    '/': '%2F',
    '?': '%3F',
    ' ': '%20'
  };

  let needsEncoding = false;
  for (const [char, encoded] of Object.entries(specialChars)) {
    if (password.includes(char)) {
      encodedPassword = encodedPassword.replace(new RegExp(char.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), encoded);
      needsEncoding = true;
    }
  }

  if (needsEncoding) {
    console.log('\n⚠️  Password contains special characters - they will be URL-encoded');
  }

  // Build connection string
  const clusterAddress = 'cluster0.qo9hvbf.mongodb.net';
  const databaseName = 'placementhub';
  const connectionString = `mongodb+srv://${username}:${encodedPassword}@${clusterAddress}/${databaseName}?retryWrites=true&w=majority`;

  console.log('\n✅ New connection string:');
  console.log('  ' + connectionString.replace(/:([^:@]+)@/, ':****@') + '\n');

  const confirm = await question('Do you want to update your .env file with this connection string? (y/n): ');
  
  if (confirm.toLowerCase() !== 'y' && confirm.toLowerCase() !== 'yes') {
    console.log('\n❌ Cancelled. Connection string not updated.');
    console.log('You can manually update your .env file with:');
    console.log(`MONGODB_URI=${connectionString}`);
    rl.close();
    process.exit(0);
  }

  // Update .env file
  let newEnvContent = envContent;
  
  // Replace MONGODB_URI line
  if (newEnvContent.includes('MONGODB_URI=')) {
    newEnvContent = newEnvContent.replace(/MONGODB_URI=.*/g, `MONGODB_URI=${connectionString}`);
  } else {
    newEnvContent += `\nMONGODB_URI=${connectionString}\n`;
  }

  // Ensure USE_LOCAL_DB is false
  if (newEnvContent.includes('USE_LOCAL_DB=')) {
    newEnvContent = newEnvContent.replace(/USE_LOCAL_DB=.*/g, 'USE_LOCAL_DB=false');
  } else {
    newEnvContent = `USE_LOCAL_DB=false\n${newEnvContent}`;
  }

  fs.writeFileSync(envPath, newEnvContent, 'utf8');

  console.log('\n✅ .env file updated successfully!');
  console.log('\n🧪 Testing connection...\n');
  
  rl.close();

  // Test connection
  require('dotenv').config({ path: envPath });
  const mongoose = require('mongoose');
  
  mongoose
    .connect(connectionString)
    .then(() => {
      console.log('✅ Connection successful!');
      console.log('   Your MongoDB Atlas connection is working correctly.');
      process.exit(0);
    })
    .catch((err) => {
      console.error('❌ Connection failed!');
      console.error('   Error:', err.message);
      console.error('\n💡 Common issues:');
      console.error('   1. Check username and password are correct');
      console.error('   2. Verify database user exists in Atlas Database Access');
      console.error('   3. Check IP whitelist in Network Access');
      console.error('   4. Verify user has proper permissions');
      process.exit(1);
    });
}

fixConnectionString().catch(err => {
  console.error('Error:', err);
  rl.close();
  process.exit(1);
});

