# ⚡ QUICK FIX: Signup/Login Not Working

## 🎯 Most Likely Issue: Server Not Deployed or Environment Variables Missing

---

## ✅ SOLUTION 1: Deploy the Edge Function (Most Common Fix)

### **Step 1: Install Supabase CLI** (if not already installed)

```bash
# macOS/Linux
brew install supabase/tap/supabase

# Windows (use npm)
npm install -g supabase

# Or use npx (no install needed)
npx supabase
```

### **Step 2: Login to Supabase**

```bash
supabase login
```

This will open your browser. Login with your Supabase account.

### **Step 3: Link Your Project**

```bash
supabase link --project-ref mkblwhxlrdcoflliwnyr
```

### **Step 4: Deploy the Edge Function**

```bash
cd supabase/functions
supabase functions deploy make-server-0991178c
```

### **Step 5: Set Environment Variables**

Go to Supabase Dashboard:
1. **Project → Edge Functions → make-server-0991178c**
2. **Click "Settings" or "Environment Variables"**
3. **Add these:**
   ```
   SUPABASE_URL = https://mkblwhxlrdcoflliwnyr.supabase.co
   SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1rYmx3aHhscmRjb2ZsbGl3bnlyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAzNzEyNDksImV4cCI6MjA3NTk0NzI0OX0.CaK3tqR_p_sUcnlPohGq1ppZJI1HgrwLbNvrEgyrTvY
   SUPABASE_SERVICE_ROLE_KEY = [Get from Project Settings → API → service_role key]
   ```

### **Step 6: Test Server**

Open in browser:
```
https://mkblwhxlrdcoflliwnyr.supabase.co/functions/v1/make-server-0991178c/health
```

**Should see:** `{"status":"ok"}`

---

## ✅ SOLUTION 2: Test Signup Directly in Browser Console

### **Open Browser Console** (F12) and paste this:

```javascript
// Test Signup
fetch('https://mkblwhxlrdcoflliwnyr.supabase.co/functions/v1/make-server-0991178c/signup', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'testuser@example.com',
    password: 'Test123456!',
    firstName: 'Test User',
    country: 'US'
  })
})
.then(r => r.json())
.then(data => {
  console.log('✅ Signup Response:', data);
  if (data.userId) {
    console.log('✅✅ SUCCESS! User created with ID:', data.userId);
  } else {
    console.log('❌ Error:', data.error || data);
  }
})
.catch(err => console.error('❌ Network Error:', err));
```

### **Expected Output:**
```
✅ Signup Response: {message: "User created successfully", userId: "...", role: "lead"}
✅✅ SUCCESS! User created with ID: [uuid]
```

### **If You See Error:**

#### **Error: "Failed to fetch"**
- Server is not deployed
- Run deployment steps above

#### **Error: "User already exists"**
- Try different email
- Or test login instead:

```javascript
// Test Login
fetch('https://mkblwhxlrdcoflliwnyr.supabase.co/functions/v1/make-server-0991178c/signin', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'testuser@example.com',
    password: 'Test123456!'
  })
})
.then(r => r.json())
.then(data => {
  console.log('✅ Login Response:', data);
  if (data.accessToken) {
    console.log('✅✅ SUCCESS! Logged in with token');
  }
})
.catch(console.error);
```

---

## ✅ SOLUTION 3: Use Supabase Dashboard to Create User Manually

### **Step 1: Create Auth User**

1. Go to: https://supabase.com/dashboard/project/mkblwhxlrdcoflliwnyr
2. Click **Authentication → Users**
3. Click **"Add User"**
4. Enter:
   - Email: `testuser@example.com`
   - Password: `Test123456!`
   - Auto Confirm: **YES**
5. Click **Save**
6. **Copy the User ID** (you'll need it)

### **Step 2: Create User Profile in Database**

1. Go to **SQL Editor**
2. Paste this (replace `USER_ID_HERE` with the ID you copied):

```sql
-- Insert user profile
INSERT INTO kv_store_0991178c (key, value)
VALUES (
  'user:USER_ID_HERE',
  '{
    "userId": "USER_ID_HERE",
    "email": "testuser@example.com",
    "firstName": "Test User",
    "country": "US",
    "role": "student",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "progress": {
      "foundation": {"completed": 0, "total": 12},
      "advanced": {"completed": 0, "total": 15}
    },
    "completedLessons": [],
    "quizScores": {},
    "advancedUnlocked": false
  }'::jsonb
);
```

3. Click **Run**
4. Now you can login with: `testuser@example.com` / `Test123456!`

---

## ✅ SOLUTION 4: Check Server Logs

### **View Edge Function Logs:**

```bash
supabase functions logs make-server-0991178c --project-ref mkblwhxlrdcoflliwnyr
```

**Look for:**
- Error messages
- "Unauthorized" warnings
- Missing environment variables

---

## 🎯 After Applying Fix

### **Test This:**

1. **Open your app**
2. **Click "Get Started"**
3. **Fill in:**
   ```
   First Name: John Doe
   Email: john.doe@example.com
   Password: Password123!
   Country: United States
   ```
4. **Click "Start Free Trial"**

### **Should See:**
- ✅ Toast: "Account created successfully!"
- ✅ Toast: "Welcome to Forex Academy!"
- ✅ Redirect to Dashboard
- ✅ Name "John Doe" in header
- ✅ 3 free lessons available

### **Or Try Demo Account:**
```
Email: demo-student@test.com
Password: demo123456
```

---

## 🔍 Verify Everything Works

### **✅ Check 1: Server Health**
```
https://mkblwhxlrdcoflliwnyr.supabase.co/functions/v1/make-server-0991178c/health
```
Should return: `{"status":"ok"}`

### **✅ Check 2: Auth Status Indicator**
- Look at bottom-right of your app
- Should be **GREEN circle with ✓** when logged in
- Should be **RED circle with ✗** when logged out

### **✅ Check 3: Browser Console**
- Open F12
- No red errors
- Should see successful API responses

### **✅ Check 4: LocalStorage**
- F12 → Application → Local Storage
- Should have:
  - `accessToken` (JWT string)
  - `userId` (UUID string)

---

## 🚨 Emergency Bypass: Use Demo Mode

If nothing works, you can test the UI without backend:

### **Temporarily Modify App.tsx:**

Add this at the top of the `handleAuth` function:

```typescript
const handleAuth = async (email: string, password: string, firstName?: string, country?: string) => {
  // TEMPORARY: Bypass for testing UI only
  if (email.includes('demo')) {
    const mockUser = {
      userId: 'demo-123',
      email,
      firstName: firstName || 'Demo',
      country: country || 'US',
      role: 'student',
      progress: {
        foundation: { completed: 5, total: 12 },
        advanced: { completed: 0, total: 15 }
      },
      completedLessons: ['f1', 'f2', 'f3', 'f4', 'f5'],
      quizScores: {},
      advancedUnlocked: true
    };
    
    setUserProfile(mockUser);
    setAccessToken('demo-token');
    setCurrentView('dashboard');
    setAuthModalOpen(false);
    toast.success('Demo mode activated!');
    return;
  }
  
  // ... rest of the function
```

**Now you can login with:**
- Email: `demo@test.com`
- Password: anything

**⚠️ Remove this after testing!**

---

## 📞 Get More Help

### **Collect This Information:**

1. **Server Health Response:**
   ```
   Visit: https://mkblwhxlrdcoflliwnyr.supabase.co/functions/v1/make-server-0991178c/health
   Response: [paste what you see]
   ```

2. **Browser Console Errors:**
   ```
   [Copy any red errors from console]
   ```

3. **Network Request Status:**
   ```
   F12 → Network → Try signup → Check status code
   Status: [200, 400, 500, etc.]
   Response: [paste response]
   ```

### **Check Supabase Dashboard:**
- Project Status: Active/Paused?
- Edge Functions: Deployed?
- Auth: Enabled?
- Database: kv_store_0991178c table exists?

---

## ✅ Success Checklist

Mark these as you verify:

- [ ] Server health returns `{"status":"ok"}`
- [ ] Edge function deployed
- [ ] Environment variables set
- [ ] Can signup with new email
- [ ] Receives success toast messages
- [ ] Redirects to dashboard
- [ ] Name appears in dashboard header
- [ ] Can see lessons
- [ ] Auth indicator shows green
- [ ] Session persists on refresh
- [ ] Can logout successfully

**If all checked → System is working!** 🎉

---

## 💡 Quick Reference

### **Your Project Details:**
```
Project ID: mkblwhxlrdcoflliwnyr
Project URL: https://mkblwhxlrdcoflliwnyr.supabase.co
Edge Function: make-server-0991178c
Health Check: https://mkblwhxlrdcoflliwnyr.supabase.co/functions/v1/make-server-0991178c/health
```

### **Test Accounts:**
```
Free Trial:
  Email: demo-lead@test.com
  Password: demo123456

Full Student:
  Email: demo-student@test.com
  Password: demo123456

Pro Trader:
  Email: demo-pro-trader@test.com
  Password: demo123456
```

### **Deployment Command:**
```bash
supabase functions deploy make-server-0991178c --project-ref mkblwhxlrdcoflliwnyr
```

---

**99% of authentication issues are fixed by deploying the edge function and setting environment variables!** 🚀
