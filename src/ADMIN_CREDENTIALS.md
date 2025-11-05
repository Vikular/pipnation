# 👑 Admin Login Credentials - Pip Nation Academy

## ✅ Your Admin Account is Auto-Configured!

Your admin account is automatically created when the backend server starts.

---

## 🔑 Admin Login Details

**Email:** `support@pipnationacademy.com`  
**Password:** `Pipnation12@`

---

## 🚀 How to Login as Admin

### **Step 1: Make Sure Server is Running**
The admin account is created automatically when the backend starts, so just ensure your development server is running.

### **Step 2: Login Normally**
1. Go to your app homepage
2. Click the **"Login"** button (top-right corner)
3. Enter:
   ```
   Email: support@pipnationacademy.com
   Password: Pipnation12@
   ```
4. Click "Sign In"

### **Step 3: See Admin Dashboard**
You'll be automatically redirected to the **Admin Dashboard** 👑

---

## 🎯 What Happens Behind the Scenes

When your backend server starts:

1. ✅ Checks if admin account exists
2. ✅ If not, creates it automatically with your credentials
3. ✅ Sets role to 'admin'
4. ✅ Grants access to all courses
5. ✅ Logs confirmation in server console

You'll see this in your server logs:
```
🔍 Checking if admin account exists...
🔐 Creating admin account: support@pipnationacademy.com
✅ Admin user created in Supabase Auth
✅ Admin profile created in KV store
🎉 Admin account ready! Email: support@pipnationacademy.com
```

---

## 📋 What You Can Do as Admin

Once logged in, you'll have access to:

✅ **Upload Course Materials**
- Add videos and PDFs for Beginners Academy
- Add videos and PDFs for Strategy & Mentorship
- Manage lesson order and content

✅ **Student Database**
- View all registered students
- Export student data
- See payment history and enrollments

✅ **User Management**
- Change user roles (lead, student, pro-trader, funded-trader, admin)
- View user progress
- Track course completions

✅ **FTMO Verifications**
- Review student FTMO challenge submissions
- Approve/reject applications
- Promote students to Pro Trader status

---

## 🔐 Security Notes

- This admin account is auto-created on server startup
- The credentials are hardcoded in the backend
- To change the password, edit `/supabase/functions/server/index.tsx` line ~820
- The account has full access to all platform features
- Keep these credentials secure!

---

## 🎉 You're All Set!

**Just login with:**
- Email: `support@pipnationacademy.com`
- Password: `Pipnation12@`

**And you'll see the Admin Dashboard automatically!** 👑

No setup required - it's ready to go! 🚀
