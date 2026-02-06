# MongoDB Atlas Setup Guide

## Step-by-Step Instructions to Connect to MongoDB Atlas

### 1. Create a MongoDB Atlas Account

1. Go to [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Click "Try Free" or "Sign Up"
3. Create your account (you can use Google, GitHub, or email)

### 2. Create a New Cluster

1. After logging in, you'll be prompted to create a cluster
2. Choose the **FREE** tier (M0 Sandbox)
3. Select a cloud provider and region (choose one closest to you)
4. Click "Create Cluster" (this may take 3-5 minutes)

### 3. Create a Database User

1. Go to **Database Access** in the left sidebar
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Enter a username (e.g., `admin`)
5. Enter a strong password (save this securely!)
6. Set user privileges to "Atlas Admin" or "Read and write to any database"
7. Click "Add User"

### 4. Whitelist Your IP Address

1. Go to **Network Access** in the left sidebar
2. Click "Add IP Address"
3. For development, click "Allow Access from Anywhere" (adds `0.0.0.0/0`)
   - **Note**: For production, add only specific IPs
4. Click "Confirm"

### 5. Get Your Connection String

1. Go to **Clusters** in the left sidebar
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Select "Node.js" as the driver
5. Copy the connection string (it looks like):
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

### 6. Configure Your Application

1. In your project, copy `env.example` to `.env`:
   ```bash
   cd project/backend
   cp env.example .env
   ```

2. Edit the `.env` file and update:
   ```env
   USE_LOCAL_DB=false
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/placementhub?retryWrites=true&w=majority
   ```
   
   **Important**: 
   - Replace `<username>` with your database username
   - Replace `<password>` with your database password
   - Replace `cluster0.xxxxx` with your actual cluster name
   - Add `/placementhub` before the `?` to specify the database name

3. Save the `.env` file

### 7. Test the Connection

1. Start your backend server:
   ```bash
   cd project/backend
   npm start
   ```

2. You should see:
   ```
   ✅ MongoDB connected successfully
      Connected to MongoDB Atlas
   ```

3. If you see an error, check:
   - Your connection string is correct
   - Your password doesn't contain special characters (if it does, URL encode them)
   - Your IP address is whitelisted
   - Your database user has proper permissions

## Troubleshooting

### Connection Timeout
- Check your internet connection
- Verify your IP is whitelisted in Network Access
- Try using a different network

### Authentication Failed
- Double-check your username and password
- Ensure special characters in password are URL-encoded
- Verify the database user exists and has permissions

### Connection String Format
Make sure your connection string includes:
- `mongodb+srv://` protocol
- Username and password
- Cluster address
- Database name (e.g., `/placementhub`)
- Query parameters (`?retryWrites=true&w=majority`)

### Example Connection String
```
mongodb+srv://admin:MyP@ssw0rd123@cluster0.abc123.mongodb.net/placementhub?retryWrites=true&w=majority
```

## Security Best Practices

1. **Never commit `.env` file** to version control
2. Use strong passwords for database users
3. For production, whitelist only specific IP addresses
4. Use environment variables for all sensitive data
5. Regularly rotate database passwords
6. Use MongoDB Atlas built-in security features (encryption, auditing)

## Switching Between Local and Atlas

To switch back to local JSON storage:
```env
USE_LOCAL_DB=true
```

To use MongoDB Atlas:
```env
USE_LOCAL_DB=false
MONGODB_URI=your_atlas_connection_string
```

## Need Help?

- MongoDB Atlas Documentation: [https://docs.atlas.mongodb.com/](https://docs.atlas.mongodb.com/)
- MongoDB Connection String Guide: [https://docs.mongodb.com/manual/reference/connection-string/](https://docs.mongodb.com/manual/reference/connection-string/)

