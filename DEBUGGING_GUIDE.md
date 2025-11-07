# Debugging Guide for Blank Page Issue

## If you're still seeing a blank page after login, follow these steps:

### 1. Open Browser Console
- Press **F12** (or right-click → Inspect → Console tab)
- Clear the console
- Try logging in again

### 2. Look for These Log Messages
You should see messages like:
```
✅ Restored Supabase session for user: [user-id]
🔄 Fetching user profile for userId: [user-id] (attempt 1)
✅ Profile fetched successfully: {userId, email, role, enrolledCourses}
📝 Setting user profile state...
✅ User profile state set
🔀 Routing to view based on role: lead
→ Setting view to: dashboard
✅ View set to: dashboard
🎨 StudentDashboard rendering with user: {...}
📊 Progress calculated: {foundationProgress: 0, advancedProgress: 0}
```

### 3. Run This Diagnostic Script in Console

Paste this into your browser console:

```javascript
// Diagnostic Script
console.log('=== DIAGNOSTIC CHECK ===');
console.log('1. React Root:', document.getElementById('root'));
console.log('2. React Children:', document.getElementById('root')?.children.length);
console.log('3. Body HTML length:', document.body.innerHTML.length);
console.log('4. Local Storage:',{
  accessToken: localStorage.getItem('accessToken') ? 'Present' : 'Missing',
  userId: localStorage.getItem('userId') ? 'Present' : 'Missing'
});
console.log('5. Current URL:', window.location.href);
console.log('6. Viewport:', {width: window.innerWidth, height: window.innerHeight});

// Check for any visible content
const allDivs = document.querySelectorAll('div');
console.log('7. Total div elements:', allDivs.length);

// Check for errors
const errors = window.console.error;
console.log('8. Console errors captured above');

// Check if dashboard is in DOM
const dashboard = document.querySelector('[class*="min-h-screen"]');
console.log('9. Dashboard element:', dashboard ? 'Found' : 'NOT FOUND');

if (dashboard) {
  console.log('   Dashboard classes:', dashboard.className);
  console.log('   Dashboard children:', dashboard.children.length);
}
```

### 4. Common Issues & Solutions

#### Issue: No log messages at all
**Solution**: The JavaScript isn't loading. Hard refresh: **Ctrl+F5** (Windows) or **Cmd+Shift+R** (Mac)

#### Issue: "Profile not found" error
**Solution**: Your account was created before the backend was fixed. Try with a new email address.

#### Issue: Logs stop at "Setting user profile state"
**Solution**: React state update failing. Check if you see any red errors in console.

#### Issue: Dashboard element NOT FOUND
**Solution**: Component is crashing. Look for red error messages above the diagnostic output.

#### Issue: Dashboard element found but still blank
**Solution**: CSS issue. Check if `min-h-screen` class is being applied. Look for viewport height: if it's 0, that's the problem.

### 5. Quick Fixes to Try

1. **Hard Refresh**: Ctrl+F5 or Cmd+Shift+R
2. **Clear Cache**: 
   - Chrome: Ctrl+Shift+Delete → Clear cached images and files
   - Firefox: Ctrl+Shift+Delete → Cached Web Content
3. **Try Incognito/Private Mode**: This eliminates cache/extension issues
4. **Different Browser**: Try Chrome if using Firefox, or vice versa

### 6. Report Back

If still not working, please copy and paste:
1. All console log output
2. Any RED error messages
3. The output from the diagnostic script
4. Screenshot if possible

This will help me identify the exact issue!
