# Quick Fix for Connection Error

## Your Current Error:
```
❌ MongoDB connection error: querySrv ENOTFOUND _mongodb._tcp.Cluster0.mongodb.net
```

This means your connection string has the wrong cluster name or format.

## Step-by-Step Fix:

### Step 1: Get the Correct Connection String from MongoDB Atlas

1. **Go to MongoDB Atlas**: https://cloud.mongodb.com/
2. **Login** to your account
3. **Click "Clusters"** in the left sidebar
4. **Click "Connect"** button on your cluster
5. **Select "Connect your application"**
6. **Choose "Node.js"** and version **4.1 or later**
7. **Copy the connection string** - it will look like:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

### Step 2: Update Your Connection String

**IMPORTANT:** You need to:
1. Replace `<username>` with your actual database username
2. Replace `<password>` with your actual password
3. **Add your database name** before the `?`

**Example:**
If Atlas gives you:
```
mongodb+srv://admin:MyPass123@cluster0.abc123.mongodb.net/?retryWrites=true&w=majority
```

Change it to (add `/placementhub` before the `?`):
```
mongodb+srv://admin:MyPass123@cluster0.abc123.mongodb.net/placementhub?retryWrites=true&w=majority
                                                                      ^^^^^^^^^^^^^^
                                                                      Add this
```

### Step 3: Handle Special Characters in Password

If your password has special characters, you MUST URL-encode them:

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
| ` ` (space) | `%20` |

**Example:**
If your password is `My@Pass#123`, it becomes `My%40Pass%23123`

### Step 4: Update Your .env File

1. Open `project/backend/.env` file
2. Make sure it has:
   ```env
   USE_LOCAL_DB=false
   MONGODB_URI=mongodb+srv://yourusername:yourpassword@yourcluster.mongodb.net/placementhub?retryWrites=true&w=majority
   ```
3. **Save the file**

### Step 5: Verify IP Whitelist

1. In MongoDB Atlas, go to **"Network Access"**
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (for development)
4. Click **"Confirm"**

### Step 6: Restart Your Server

```bash
# Stop the server (Ctrl+C)
# Then start again:
npm start
```

## Common Mistakes to Avoid:

❌ **Wrong:** Using `Cluster0` when your cluster is named differently
✅ **Right:** Use the exact cluster name from Atlas

❌ **Wrong:** Missing database name in connection string
✅ **Right:** Include `/placementhub` before the `?`

❌ **Wrong:** Not encoding special characters in password
✅ **Right:** URL-encode special characters

❌ **Wrong:** Using quotes around the connection string in .env
✅ **Right:** No quotes needed: `MONGODB_URI=mongodb+srv://...`

## Still Not Working?

1. **Double-check your cluster name** - it might not be "Cluster0"
2. **Verify username and password** are correct
3. **Check IP whitelist** in Network Access
4. **Try creating a new database user** with a simple password (no special chars)
5. **Check if cluster is paused** - unpause it in Atlas

## Test with Simple Password First

To rule out password encoding issues:
1. Create a new database user in Atlas with a simple password (letters and numbers only)
2. Use that user in your connection string
3. Once it works, you can switch back to your original user

## Need More Help?

See `TROUBLESHOOTING.md` for detailed solutions to other common errors.

