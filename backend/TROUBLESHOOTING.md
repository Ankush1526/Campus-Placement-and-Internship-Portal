# MongoDB Connection Troubleshooting

## Common Errors and Solutions

### Error: `querySrv ENOTFOUND _mongodb._tcp.Cluster0.mongodb.net`

This error means the connection string cannot find your MongoDB cluster. Here's how to fix it:

#### Solution 1: Verify Your Cluster Name
1. Go to [MongoDB Atlas Dashboard](https://cloud.mongodb.com/)
2. Click on **Clusters** in the left sidebar
3. Look at your cluster name (it might NOT be "Cluster0")
4. Common names: `cluster0`, `myCluster`, `production`, etc.

#### Solution 2: Get the Correct Connection String
1. In MongoDB Atlas, click **Connect** on your cluster
2. Choose **"Connect your application"**
3. Select **"Node.js"** as the driver
4. **Copy the ENTIRE connection string** - don't modify it manually
5. It should look like:
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

#### Solution 3: Add Database Name
After copying the connection string, add your database name before the `?`:
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/placementhub?retryWrites=true&w=majority
                                                                    ^^^^^^^^^^^^^^
                                                                    Add this
```

#### Solution 4: Check Your .env File
Make sure your `.env` file in `project/backend/` has:
```env
USE_LOCAL_DB=false
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/placementhub?retryWrites=true&w=majority
```

**Important Notes:**
- Replace `username` with your actual database username
- Replace `password` with your actual password
- Replace `cluster0.xxxxx` with your actual cluster address
- If your password has special characters, URL-encode them:
  - `@` becomes `%40`
  - `#` becomes `%23`
  - `$` becomes `%24`
  - `%` becomes `%25`
  - `&` becomes `%26`
  - `+` becomes `%2B`
  - `=` becomes `%3D`

### Error: Authentication Failed

**Solutions:**
1. Double-check username and password
2. URL-encode special characters in password
3. Verify the database user exists in Atlas
4. Check user permissions in Database Access

### Error: IP Not Whitelisted

**Solution:**
1. Go to **Network Access** in MongoDB Atlas
2. Click **"Add IP Address"**
3. For development: Click **"Allow Access from Anywhere"** (adds `0.0.0.0/0`)
4. For production: Add only specific IP addresses

### Error: Connection Timeout

**Solutions:**
1. Check your internet connection
2. Verify firewall isn't blocking MongoDB
3. Try from a different network
4. Check if MongoDB Atlas is experiencing issues

## Quick Fix Checklist

- [ ] `.env` file exists in `project/backend/` directory
- [ ] `USE_LOCAL_DB=false` is set
- [ ] `MONGODB_URI` is set and not empty
- [ ] Connection string starts with `mongodb+srv://`
- [ ] Database name is included (e.g., `/placementhub`)
- [ ] Username and password are correct
- [ ] Special characters in password are URL-encoded
- [ ] IP address is whitelisted in MongoDB Atlas
- [ ] Database user has proper permissions

## Testing Your Connection String

You can test your connection string format:

**Correct Format:**
```
mongodb+srv://username:password@cluster0.abc123.mongodb.net/placementhub?retryWrites=true&w=majority
```

**Common Mistakes:**
- ❌ Missing `mongodb+srv://` prefix
- ❌ Missing database name (`/placementhub`)
- ❌ Wrong cluster name
- ❌ Special characters in password not encoded
- ❌ Extra spaces or quotes in connection string

## Still Having Issues?

1. **Verify in MongoDB Atlas:**
   - Cluster is running (not paused)
   - Database user exists
   - IP is whitelisted
   - Connection string is copied correctly

2. **Check Server Logs:**
   - Look for specific error messages
   - Check network connectivity
   - Verify environment variables are loaded

3. **Try Local Database First:**
   If you want to test without Atlas:
   ```env
   USE_LOCAL_DB=true
   ```
   This uses local JSON files instead of MongoDB.

## Example .env File

```env
# Server
PORT=5050
HOST=127.0.0.1
NODE_ENV=development

# Auth
JWT_SECRET=your_secret_key_here

# Database
USE_LOCAL_DB=false
MONGODB_URI=mongodb+srv://myuser:mypassword@cluster0.abc123.mongodb.net/placementhub?retryWrites=true&w=majority

# Email (optional)
ADMIN_EMAIL=your-email@example.com
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
SMTP_SECURE=false
SMTP_FROM="PlacementHub <no-reply@example.com>"
```

