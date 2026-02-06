# How to Create and Configure .env File

## Step 1: Create .env File

### On Windows (PowerShell):
```powershell
cd project\backend
copy env.example .env
```

### On Windows (Command Prompt):
```cmd
cd project\backend
copy env.example .env
```

### On Linux/Mac:
```bash
cd project/backend
cp env.example .env
```

## Step 2: Edit .env File

Open the `.env` file in a text editor and update it with your MongoDB Atlas connection string.

### Minimum Required Configuration:

```env
USE_LOCAL_DB=false
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/placementhub?retryWrites=true&w=majority
```

### Complete Example:

```env
# Server
PORT=5050
HOST=127.0.0.1
NODE_ENV=development

# Auth
JWT_SECRET=your_secret_key_here

# Database Configuration
USE_LOCAL_DB=false

# MongoDB Atlas Connection String
# Get this from: https://cloud.mongodb.com/
# Clusters → Connect → Connect your application → Node.js
MONGODB_URI=mongodb+srv://admin:MyPassword123@cluster0.abc123.mongodb.net/placementhub?retryWrites=true&w=majority

# Email (optional)
ADMIN_EMAIL=your-email@example.com
```

## Step 3: Get Your MongoDB Atlas Connection String

1. **Go to MongoDB Atlas**: https://cloud.mongodb.com/
2. **Login** to your account
3. **Click "Clusters"** in the left sidebar
4. **Click "Connect"** on your cluster
5. **Select "Connect your application"**
6. **Choose "Node.js"** and version **4.1 or later**
7. **Copy the connection string**

The connection string will look like:
```
mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

## Step 4: Update the Connection String

**IMPORTANT:** You need to:
1. Replace `<username>` with your database username
2. Replace `<password>` with your database password
2. **Add `/placementhub` before the `?`** to specify the database name

**Example:**
If Atlas gives you:
```
mongodb+srv://admin:MyPass123@cluster0.abc123.mongodb.net/?retryWrites=true&w=majority
```

Change it to:
```
mongodb+srv://admin:MyPass123@cluster0.abc123.mongodb.net/placementhub?retryWrites=true&w=majority
                                                                      ^^^^^^^^^^^^^^
                                                                      Add this
```

## Step 5: Handle Special Characters in Password

If your password contains special characters, URL-encode them:

| Character | Encoded |
|-----------|---------|
| `@` | `%40` |
| `#` | `%23` |
| `$` | `%24` |
| `%` | `%25` |
| `&` | `%26` |
| `+` | `%2B` |
| `=` | `%3D` |

**Example:**
Password: `My@Pass#123`
Encoded: `My%40Pass%23123`

Connection string:
```
mongodb+srv://admin:My%40Pass%23123@cluster0.abc123.mongodb.net/placementhub?retryWrites=true&w=majority
```

## Step 6: Test Your Connection

After creating and configuring your `.env` file, test it:

```bash
node test-connection.js
```

Or start your server:
```bash
npm start
```

## Troubleshooting

### Error: ".env file not found"
- Make sure you created the `.env` file in `project/backend/` directory
- Check the file name is exactly `.env` (not `env.txt` or `.env.txt`)

### Error: "MONGODB_URI not configured"
- Make sure `MONGODB_URI=` line is in your `.env` file
- Make sure there are no quotes around the connection string
- Make sure there are no extra spaces

### Error: "querySrv ENOTFOUND"
- Check your cluster name is correct
- Verify the connection string format
- Make sure you added `/placementhub` before the `?`

### Still having issues?
Run the test script:
```bash
node test-connection.js
```

This will show you exactly what's wrong with your connection string.

