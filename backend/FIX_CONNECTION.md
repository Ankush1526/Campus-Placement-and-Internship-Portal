# 🔧 Fix Your MongoDB Connection String

## ❌ Current Problem

Your `.env` file has **placeholders** that need to be replaced with real values:

```
MONGODB_URI=mongodb+srv://<admin>:****@Cluster0.mongodb.net/placementhub?retryWrites=true&w=majority
```

The placeholders are:
- `<admin>` - needs to be your actual username
- `Cluster0` - might not be your actual cluster name
- Password is hidden but also needs to be your actual password

## ✅ How to Fix

### Step 1: Get Your Real Connection String from MongoDB Atlas

1. **Go to MongoDB Atlas**: https://cloud.mongodb.com/
2. **Login** to your account
3. **Click "Clusters"** in the left sidebar
4. **Click "Connect"** button on your cluster
5. **Select "Connect your application"**
6. **Choose "Node.js"** and version **4.1 or later**
7. **Copy the ENTIRE connection string**

It will look like:
```
mongodb+srv://myusername:mypassword@cluster0.abc123.mongodb.net/?retryWrites=true&w=majority
```

### Step 2: Update Your Connection String

**IMPORTANT:** You need to add `/placementhub` before the `?`:

**If Atlas gives you:**
```
mongodb+srv://myusername:mypassword@cluster0.abc123.mongodb.net/?retryWrites=true&w=majority
```

**Change it to (add `/placementhub`):**
```
mongodb+srv://myusername:mypassword@cluster0.abc123.mongodb.net/placementhub?retryWrites=true&w=majority
                                                                      ^^^^^^^^^^^^^^
                                                                      Add this
```

### Step 3: Update Your .env File

1. Open `project/backend/.env` in a text editor
2. Find the line: `MONGODB_URI=...`
3. Replace it with your actual connection string (with `/placementhub` added)
4. **Remove the `<` and `>` characters** - they are placeholders!
5. Save the file

**Example of correct format:**
```env
USE_LOCAL_DB=false
MONGODB_URI=mongodb+srv://admin:MyPassword123@cluster0.abc123.mongodb.net/placementhub?retryWrites=true&w=majority
```

### Step 4: Handle Special Characters in Password

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

**Example:**
- Password: `My@Pass#123`
- Encoded: `My%40Pass%23123`
- Connection string: `mongodb+srv://admin:My%40Pass%23123@cluster0.abc123.mongodb.net/placementhub?retryWrites=true&w=majority`

### Step 5: Verify Your Cluster Name

**Important:** Your cluster name might NOT be "Cluster0"!

1. In MongoDB Atlas, look at your cluster name
2. It might be: `cluster0`, `myCluster`, `production`, or something else
3. Use the EXACT cluster name from Atlas in your connection string

### Step 6: Test Your Connection

After updating `.env`, test it:

```bash
node test-connection.js
```

Or start your server:
```bash
npm start
```

## 🎯 Quick Checklist

- [ ] Got connection string from MongoDB Atlas
- [ ] Replaced `<admin>` with actual username
- [ ] Replaced password placeholder with actual password
- [ ] Added `/placementhub` before the `?`
- [ ] Verified cluster name matches Atlas
- [ ] URL-encoded special characters in password (if any)
- [ ] Removed all `<` and `>` placeholder characters
- [ ] Saved `.env` file
- [ ] Tested connection with `node test-connection.js`

## 🆘 Still Not Working?

1. **Check your cluster name** - it might not be "Cluster0"
2. **Verify username and password** are correct
3. **Check IP whitelist** in Atlas Network Access
4. **Run diagnostic**: `node check-env.js` to see what's wrong
5. **Try creating a new database user** with a simple password (no special chars)

## 💡 Pro Tip

If you're having trouble with special characters, create a new database user in Atlas with a simple password (letters and numbers only) to test the connection first.

