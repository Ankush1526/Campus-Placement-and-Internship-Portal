# ⚡ QUICK FIX - Do This Now!

## Your Current Problem:
Your `.env` file has this line:
```env
MONGODB_URI=mongodb+srv://<admin>:yourpassword@cluster0.qo9hvbf.mongodb.net/?appName=Cluster0
```

## What You Need to Do:

### Option 1: Use the Helper Script (Easiest)
```bash
node fix-connection-string.js
```
This will ask you for your username and password and fix it automatically!

### Option 2: Manual Fix

1. **Open** `project/backend/.env` in a text editor

2. **Find this line:**
   ```
   MONGODB_URI=mongodb+srv://<admin>:password@cluster0.qo9hvbf.mongodb.net/?appName=Cluster0
   ```

3. **Replace it with** (use YOUR actual username and password):
   ```
   MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster0.qo9hvbf.mongodb.net/placementhub?retryWrites=true&w=majority
   ```

4. **Important Changes:**
   - ❌ Remove `<admin>` → ✅ Use your actual username (no `<` or `>`)
   - ❌ Remove placeholder password → ✅ Use your actual password
   - ❌ Remove `?appName=Cluster0` → ✅ Add `/placementhub?retryWrites=true&w=majority`

## Example:
If your username is `admin` and password is `MyPass123`, it should be:
```env
MONGODB_URI=mongodb+srv://admin:MyPass123@cluster0.qo9hvbf.mongodb.net/placementhub?retryWrites=true&w=majority
```

## Where to Get Your Username/Password:
1. Go to https://cloud.mongodb.com/
2. Click **"Database Access"** (left sidebar, under SECURITY)
3. See your username there
4. If you forgot password, click "Edit" and reset it

## After Fixing:
```bash
node test-connection.js
```

If it works, you'll see: ✅ Connection successful!

