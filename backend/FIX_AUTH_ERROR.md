# 🔧 Fix Authentication Error

## Current Error:
```
❌ MongoDB connection error: bad auth : Authentication failed.
```

## Problem:
Your connection string still has placeholders:
- `<admin>` needs to be replaced with your **actual MongoDB Atlas username**
- Missing database name `/placementhub`
- Password might be incorrect

## ✅ Solution:

### Step 1: Get Your Database Username and Password

1. **Go to MongoDB Atlas**: https://cloud.mongodb.com/
2. **Click "Database Access"** in the left sidebar (under SECURITY)
3. **Find your database user** - you should see a user listed
4. **If no user exists**, click **"Add New Database User"**:
   - Choose "Password" authentication
   - Enter a username (e.g., `admin` or `myuser`)
   - Enter a password (save it securely!)
   - Set privileges to "Atlas Admin" or "Read and write to any database"
   - Click "Add User"

### Step 2: Update Your .env File

**Current connection string:**
```
mongodb+srv://<admin>:****@cluster0.qo9hvbf.mongodb.net/?appName=Cluster0
```

**What you need to change:**

1. **Replace `<admin>`** with your actual username (no `<` or `>`)
2. **Replace the password** with your actual password
3. **Add `/placementhub`** before the `?`

**Example of correct format:**
```env
MONGODB_URI=mongodb+srv://myusername:mypassword@cluster0.qo9hvbf.mongodb.net/placementhub?retryWrites=true&w=majority
```

### Step 3: Handle Special Characters in Password

If your password has special characters, URL-encode them:

| Character | Encoded |
|-----------|---------|
| `@` | `%40` |
| `#` | `%23` |
| `$` | `%24` |
| `%` | `%25` |
| `&` | `%26` |
| `+` | `%2B` |
| `=` | `%3D` |
| `/` | `%2F` |
| `?` | `%3F` |

**Example:**
- Password: `My@Pass#123`
- Encoded: `My%40Pass%23123`
- Connection string: `mongodb+srv://admin:My%40Pass%23123@cluster0.qo9hvbf.mongodb.net/placementhub?retryWrites=true&w=majority`

### Step 4: Complete .env File Example

```env
USE_LOCAL_DB=false
MONGODB_URI=mongodb+srv://admin:MyPassword123@cluster0.qo9hvbf.mongodb.net/placementhub?retryWrites=true&w=majority
```

**Important:**
- Remove all `<` and `>` characters
- No quotes around the connection string
- No extra spaces
- Include `/placementhub` before the `?`

### Step 5: Test Your Connection

After updating `.env`, test it:

```bash
node test-connection.js
```

Or start your server:
```bash
npm start
```

## 🎯 Quick Checklist

- [ ] Got username from Database Access in Atlas
- [ ] Got password (or created new database user)
- [ ] Replaced `<admin>` with actual username (no `<` or `>`)
- [ ] Replaced password with actual password
- [ ] URL-encoded special characters in password (if any)
- [ ] Added `/placementhub` before the `?`
- [ ] Removed `?appName=Cluster0` and replaced with `?retryWrites=true&w=majority`
- [ ] Saved `.env` file
- [ ] Tested connection

## 💡 Pro Tip

If you're having trouble, create a **new database user** with a simple password (letters and numbers only, no special characters) to test the connection first.

## 🆘 Still Getting Authentication Error?

1. **Double-check username** - it's case-sensitive
2. **Verify password** - make sure it's correct
3. **Check user exists** in Database Access
4. **Verify user permissions** - should have "Atlas Admin" or "Read and write"
5. **Try creating a new user** with a simple password

