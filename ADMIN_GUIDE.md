# Admin Panel Guide

## Overview
The Admin Panel provides full control over the PlacementHub platform. As an admin, you can manage users, applications, contact messages, and view comprehensive analytics.

## How to Access Admin Panel

1. **Sign Up as Admin** (if you don't have an account):
   - Go to the Login page
   - Click on the "Admin" tab
   - Switch to "Sign Up" mode
   - Fill in your details:
     - Full Name
     - Email Address
     - Password
   - Agree to Terms and click "Create Account"

2. **Login as Admin**:
   - Go to the Login page
   - Select "Admin" tab
   - Enter your email and password
   - Click "Sign In"
   - You will be automatically redirected to the Admin Dashboard

## Admin Capabilities

### 1. **Overview Dashboard**
View comprehensive statistics about your platform:
- **Total Students**: Number of registered students
- **Total Recruiters**: Number of registered recruiters
- **Total Applications**: All job and internship applications
- **Contact Messages**: Messages received through the contact form

**Analytics Breakdown:**
- Applications by Status: See how many applications are pending, reviewed, shortlisted, rejected, or accepted
- Applications by Type: View distribution between jobs and internships

### 2. **User Management**
Manage all users on the platform:

**Features:**
- View all users (Students, Recruiters, and Admins)
- Filter users by type (All, Students, Recruiters)
- View user details:
  - Full Name
  - Email Address
  - User Type
  - College (for students) or Company Name (for recruiters)
  - Registration Date
- **Delete Users**: Remove users from the system (use with caution)

**Actions Available:**
- Delete any user account
- View user registration information

### 3. **Application Management**
Monitor and manage all applications:

**Features:**
- View all applications (both jobs and internships)
- See application details:
  - Applicant Name and Email
  - Position/Title applied for
  - Company Name
  - Application Type (Job or Internship)
  - Current Status (Pending, Reviewed, Shortlisted, Rejected, Accepted)
  - Application Date
- **Delete Applications**: Remove applications from the system

**Use Cases:**
- Monitor application trends
- Track application statuses
- Clean up duplicate or invalid applications
- Review application activity

### 4. **Contact Messages Management**
Manage messages received through the contact form:

**Features:**
- View all contact messages
- See message details:
  - Sender Name and Email
  - User Type (Student, Recruiter, or Admin)
  - Subject Line
  - Full Message Content
  - Timestamp
- **Delete Messages**: Remove messages after they've been addressed

**Use Cases:**
- Respond to user inquiries
- Track common questions or issues
- Maintain communication records

## Admin Permissions

Admins have the following permissions by default:
- ✅ **Manage Users**: Create, view, and delete user accounts
- ✅ **Manage Applications**: View and delete applications
- ✅ **Manage Content**: Full access to platform content
- ✅ **View Analytics**: Access to all statistics and reports

## Best Practices

1. **Regular Monitoring**: Check the Overview dashboard regularly to stay informed about platform activity
2. **User Management**: Review user accounts periodically and remove inactive or suspicious accounts
3. **Application Review**: Monitor applications to ensure they're legitimate and properly processed
4. **Message Response**: Respond to contact messages promptly and delete them after addressing
5. **Data Backup**: Consider exporting important data regularly (feature can be added if needed)

## Security Notes

- Admin accounts have full access to the platform
- Only create admin accounts for trusted personnel
- Keep admin credentials secure
- Regularly review admin user list
- Use strong passwords for admin accounts

## Troubleshooting

**Can't access admin panel?**
- Ensure you're logged in with an admin account
- Check that your userType is set to 'admin' in localStorage
- Try logging out and logging back in

**Data not loading?**
- Click the "Refresh" button in the top right
- Check your internet connection
- Verify the backend server is running

**Connection issues?**
- Ensure MongoDB Atlas connection is properly configured
- Check your MONGODB_URI in the .env file
- Verify network access to MongoDB Atlas

## Future Enhancements (Potential Additions)

- Export data to CSV/Excel
- Bulk user operations
- Advanced filtering and search
- User activity logs
- Email notifications for admin actions
- Role-based permissions (super_admin, admin, moderator)
- Content management (jobs/internships)
- System settings configuration

