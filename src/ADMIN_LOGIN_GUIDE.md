# 🔑 Admin Login Setup Guide - Pip Nation Academy

## 📋 Quick Summary

**You don't have an admin account yet!** Choose one of the 3 options below to create your admin login.

---

## ✅ OPTION 1: Use the Admin Setup Page (Easiest!)

### Steps:
1. **Open your app** in the browser
2. **Add `/admin-setup.html` to the URL**
   - Example: `https://your-app-url.com/admin-setup.html`
   - Or locally: `http://localhost:5173/admin-setup.html`

3. **Fill in the form:**
   - Email: Your admin email (e.g., `admin@pipnation.com`)
   - Password: At least 6 characters
   - First Name: Your name
   - Country: Your country code (default: US)

4. **Click "Create Admin Account"**

5. **Go back to the main app and login** with your new credentials!

---

## ✅ OPTION 2: Upgrade an Existing Account

If you already signed up with a regular account and want to make it an admin:

### Steps:
1. **Go to** `/admin-setup.html`
2. **Click the "Upgrade Existing" tab**
3. **Enter your email**
4. **Enter the secret key:** `pip-nation-admin-2024`
5. **Click "Upgrade to Admin"**
6. **Log out and log back in** - you're now an admin!

---

## ✅ OPTION 3: API Call (For Developers)

### Create New Admin via API:

```bash
curl -X POST https://your-project-id.supabase.co/functions/v1/make-server-0991178c/bootstrap-admin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@pipnation.com",
    "password": "your-secure-password",
    "firstName": "Admin",
    "country": "US"
  }'
```

### Upgrade Existing User via API:

```bash
curl -X POST https://your-project-id.supabase.co/functions/v1/make-server-0991178c/upgrade-to-admin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "your-existing-email@example.com",
    "secretKey": "pip-nation-admin-2024"
  }'
```

---

## 🎯 After Creating Admin Account

Once your admin account is created:

1. **Go to the main app homepage**
2. **Click "Login"**
3. **Enter your admin email and password**
4. **You'll be automatically redirected to the Admin Dashboard!**

---

## 🚀 Admin Dashboard Features

Once logged in as admin, you can:

✅ **Upload Course Materials**
- Upload videos and PDFs for Beginners Academy
- Upload videos and PDFs for Strategy & Mentorship
- Manage lesson order and descriptions

✅ **View Student Database**
- See all registered users
- Export student data
- View payment history

✅ **Manage User Roles**
- Change user roles (lead, student, pro-trader, funded-trader, admin)
- View user progress
- Track course enrollments

✅ **Verify FTMO Submissions**
- Review student FTMO challenge submissions
- Approve/reject applications
- Promote students to Pro Trader status

---

## 🔐 Security Notes

1. **Secret Key:** The upgrade secret key is `pip-nation-admin-2024`
   - Change this in the server code if you want more security
   - Find it in `/supabase/functions/server/index.tsx` line ~733

2. **Bootstrap Endpoint:** 
   - The `/bootstrap-admin` endpoint is available for initial setup
   - Consider removing it after creating your admin account
   - Or add additional security checks

3. **Admin Role:**
   - Admin users bypass all course enrollment checks
   - Admin users can access all features
   - Be careful who you give admin access to!

---

## ❓ Troubleshooting

### "User already exists" error
- Use **Option 2** (Upgrade Existing) instead
- Or use a different email address

### Can't access admin-setup.html
- Make sure you're using the correct URL
- The file should be in your public directory
- Try refreshing your browser

### Still seeing student dashboard after login
- Clear your browser cache
- Log out completely
- Log back in
- Check that your role was actually set to 'admin'

---

## 📞 Need Help?

If you run into issues:
1. Check the browser console for errors
2. Check the server logs
3. Verify your Supabase credentials are set correctly
4. Make sure the backend server is running

---

## 🎉 You're All Set!

Once you have your admin account:
- Login with your admin email/password
- You'll see the Admin Dashboard
- Start uploading courses and managing students!

**Happy trading! 📈**
