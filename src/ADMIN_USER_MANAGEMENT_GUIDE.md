# 🎯 Admin User Management & Course Access Control

## ✅ NEW Features Implemented

You can now **completely manage users and course access from the admin dashboard** after confirming payments!

---

## 🚀 **What You Can Do Now**

### **1. Upgrade User Levels** 👑
Manually change any user's role and badge status.

**Available Levels:**
- **Lead** → Free trial users (no payment)
- **Student** → Paid users with course access
- **Pro Trader** → FTMO verified traders
- **Funded Trader** → Advanced traders
- **Admin** → Full admin access

**Available Badges:**
- `free-trial` → New users
- `beginner` → Just started learning
- `intermediate` → Making progress
- `advanced` → Advanced learners
- `pro-trader` → FTMO verified
- `admin` → Admin status

---

### **2. Grant Course Access** 📚
Give users access to paid courses after confirming payment.

**Available Courses:**
- **Beginners Academy** ($50) - `beginners`
- **Strategy & Mentorship** ($70) - `strategy`

**What happens when you grant access:**
✅ User gets immediate access to all course materials  
✅ If user is a 'lead', they're automatically upgraded to 'student'  
✅ Action is logged in their course access history  
✅ User can start learning immediately  

---

### **3. Revoke Course Access** ❌
Remove course access from users if needed.

**Use cases:**
- Payment refund
- Subscription cancellation
- Policy violation
- Manual correction

---

## 📋 **Step-by-Step Workflows**

### **Workflow 1: User Pays via Bank Transfer**

**Scenario:** Student sends $50 via bank transfer for Beginners Academy

**Steps:**
1. **Login to Admin Dashboard**
   - Email: `support@pipnationacademy.com`
   - Password: `Pipnation12@`

2. **Go to "Users" Tab**
   - Find the user who paid (search by email or name)

3. **Grant Course Access**
   - Click the **Book icon** (📖) next to the user
   - Select course: "Beginners Academy ($50)"
   - Click "Grant Course Access"
   
4. **Done!** ✅
   - User can now access the course
   - User is upgraded to 'student' role automatically
   - Payment is logged in their history

---

### **Workflow 2: Upgrade User After FTMO Verification**

**Scenario:** Student passes FTMO challenge and sends proof

**Steps:**
1. **Find the user** in the Users tab

2. **Click the Award icon** (🏆) next to their name

3. **Upgrade Level:**
   - Level: `Pro Trader`
   - Badge: `pro-trader`
   - Click "Upgrade User Level"

4. **Done!** ✅
   - User gets Pro Trader status
   - Badge updated
   - Access to Pro Trader features unlocked

---

### **Workflow 3: Manual Payment Verification + Course Grant**

**Scenario:** User pays $70 via PayPal for Strategy course

**Steps:**
1. **Confirm payment received** (check PayPal, bank, etc.)

2. **In Admin Dashboard → Users tab:**
   - Search for user's email
   
3. **Grant Course Access:**
   - Click Book icon (📖)
   - Select: "Strategy & Mentorship ($70)"
   - Click "Grant Course Access"

4. **Optional - Upgrade Level if needed:**
   - Click Award icon (🏆)
   - Change level from 'lead' to 'student'
   - Update badge to 'beginner' or higher

5. **Done!** ✅
   - User enrolled in Strategy course
   - User upgraded to student (if was a lead)
   - Can access all Strategy materials immediately

---

## 🎮 **Admin Dashboard User Table Actions**

Each user in the table has action buttons:

| Icon | Action | What It Does |
|------|--------|-------------|
| 👁️ **Eye** | View Details | See complete user profile, payment history, sessions |
| 🏆 **Award** | Upgrade Level | Change user's role and badge |
| 📖 **Book** | Grant Course | Give access to paid courses |
| 🔒/🔓 **Lock** | Suspend/Activate | Disable or enable user account |

---

## 📊 **User Details Dialog Features**

When you click the **Eye icon** (👁️), you see:

### **Basic Information**
- Email address
- Full name
- Country
- Current role
- Current badge

### **Enrolled Courses**
- List of all courses user has access to
- **"Grant Access" button** to add more courses
- **X button** next to each course to revoke access

### **Payment History**
- All payments made by the user
- Amount and course purchased
- Date and verification status

### **Recent Activity**
- Login/logout timestamps
- Session duration
- Active/ended status

---

## 🔧 **Backend Endpoints Added**

Three new admin-only endpoints:

### **1. Upgrade User Level**
```
POST /admin/user/:userId/upgrade-level
Body: { level: "student", badge: "beginner" }
```

**Response:**
```json
{
  "success": true,
  "message": "User level upgraded to student badge set to beginner",
  "userId": "...",
  "newLevel": "student",
  "newBadge": "beginner"
}
```

---

### **2. Grant Course Access**
```
POST /admin/user/:userId/grant-course
Body: { courseId: "beginners", reason: "Payment confirmed" }
```

**Response:**
```json
{
  "success": true,
  "message": "Access granted to beginners course",
  "userId": "...",
  "courseId": "beginners",
  "enrolledCourses": ["beginners"]
}
```

**Auto-upgrades:** If user is a 'lead', they're automatically upgraded to 'student'

---

### **3. Revoke Course Access**
```
POST /admin/user/:userId/revoke-course
Body: { courseId: "beginners", reason: "Refund issued" }
```

**Response:**
```json
{
  "success": true,
  "message": "Access revoked for beginners course",
  "userId": "...",
  "courseId": "beginners",
  "enrolledCourses": []
}
```

---

## 🎯 **Common Use Cases**

### **Use Case 1: User Pays via Bank Transfer**
✅ **Solution:** Use "Grant Course Access" button  
- Select the course they paid for
- System automatically upgrades them to student
- Instant access granted

---

### **Use Case 2: Student Completes FTMO Challenge**
✅ **Solution:** Use "Upgrade Level" button  
- Set level to: `pro-trader`
- Set badge to: `pro-trader`
- Unlocks Pro Trader features

---

### **Use Case 3: Refund Requested**
✅ **Solution:** Click X next to enrolled course  
- Removes course access
- Logged in revocation history
- Can be re-granted if needed

---

### **Use Case 4: Free Trial to Paid User**
✅ **Solution:** Use "Grant Course Access"  
- Grant access to any paid course
- System automatically upgrades lead → student
- User unlocked from free trial restrictions

---

### **Use Case 5: Admin Wants to Give Free Access**
✅ **Solution:** Use "Grant Course Access"  
- Select any course
- Reason: "Free promotional access"
- No payment required
- Full course access granted

---

## 🔐 **Security & Logging**

All admin actions are tracked:

```javascript
{
  // User profile includes:
  courseAccessGrants: [
    {
      courseId: "beginners",
      grantedBy: "admin-user-id",
      grantedAt: "2025-01-01T10:30:00Z",
      reason: "Payment confirmed via bank transfer"
    }
  ],
  
  courseAccessRevocations: [
    {
      courseId: "strategy",
      revokedBy: "admin-user-id",
      revokedAt: "2025-01-02T15:45:00Z",
      reason: "Refund issued"
    }
  ],
  
  levelUpgradedBy: "admin-user-id",
  levelUpgradedAt: "2025-01-01T10:31:00Z"
}
```

---

## 💡 **Pro Tips**

### **Tip 1: Always Confirm Payment First**
⚠️ Never grant course access without confirming payment received  
✅ Check your bank/PayPal/payment gateway before granting access

---

### **Tip 2: Use Appropriate Reasons**
When granting/revoking access, the reason is logged for audit trails.

**Good reasons:**
- "Bank transfer confirmed - $50 received"
- "PayPal payment ID: TX123456"
- "FTMO challenge passed - proof verified"
- "Free promotional access - Q1 2025 campaign"

---

### **Tip 3: Level vs Badge**
- **Level (role):** Controls access permissions
  - `lead` = Free trial only
  - `student` = Paid courses
  - `pro-trader` = FTMO verified
  
- **Badge:** Visual indicator of progress
  - `beginner`, `intermediate`, `advanced`
  - Doesn't affect access, just shows progression

---

### **Tip 4: Bulk Operations**
- Check multiple users using checkboxes
- Grants access to all selected users at once
- Useful for group promotions or mass upgrades

---

## 📱 **Mobile-Friendly**

All admin features work perfectly on:
- ✅ Desktop browsers
- ✅ Tablets
- ✅ Mobile phones
- ✅ Responsive design throughout

---

## 🎉 **Summary**

You now have **complete control** over:
1. ✅ User levels and badges
2. ✅ Course access (grant/revoke)
3. ✅ Payment verification
4. ✅ User upgrades after FTMO
5. ✅ Account suspension/activation
6. ✅ Detailed user profiles
7. ✅ Full audit trails

**Everything you need to manage payments, enrollments, and user progression from one dashboard!** 🚀

---

## 🔗 **Quick Access**

**Admin Login:**
```
URL: Your app homepage → Click "Login"
Email: support@pipnationacademy.com
Password: Pipnation12@
```

**Then navigate to:**
- **Users Tab** → Manage all users
- **Overview Tab** → See statistics
- **Analytics Tab** → View metrics

---

**You're all set!** Start managing your users and course enrollments! 🎊
