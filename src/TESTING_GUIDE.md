# Forex Academy - Testing Guide

## Quick Start Testing

### Method 1: Using Demo Helper (Easiest)

1. **Open the application** - You'll see the landing page
2. **Click the purple gear icon** in the bottom-right corner
3. **Click "Create"** next to any user role you want to test:
   - **Free Trial User** - Access first 3 lessons only
   - **Paid Student** - Full Foundation + Advanced access
   - **Pro Trader** - Signal Room access
   - **Admin** - Platform management

Demo users are automatically created with:
- Email: `demo-{role}@test.com`
- Password: `demo123456`

### Method 2: Manual Signup

1. Click "Get Started Free" or "Start Free Trial"
2. Fill in your details:
   - First Name
   - Email
   - Country
3. You'll be created as a "Lead" (free trial user)
4. You can then upgrade or change roles via admin panel

## Testing User Flows

### Test Flow 1: Free Trial User Journey

1. **Create a Lead user** (demo helper or signup)
2. **Observe**: Can only access first 3 foundation lessons
3. **See upgrade prompt** suggesting paid plans
4. **Try to access** locked lessons (shows "Upgrade to Unlock")

### Test Flow 2: Student Progression

1. **Create a Student user** (use demo helper)
2. **Complete lessons** by clicking them and marking complete
3. **Track progress** in the dashboard progress bars
4. **Complete all 12 foundation lessons**
5. **Take the Foundation Quiz** (lesson 12)
   - Score 80%+ to pass
6. **Observe**: Advanced course unlocks automatically! 🎉

### Test Flow 3: FTMO Submission & Pro Trader

1. **Start as a Student** with Advanced unlocked
2. **Complete Advanced course** (or skip for testing)
3. **Click "Submit FTMO Proof"** button
4. **Enter proof details**:
   - Proof URL: Any valid URL (e.g., `https://example.com/proof.png`)
   - Notes: Optional context
5. **Submit** - Status shows "Pending"
6. **Switch to Admin account** (logout and login as admin)
7. **Go to Admin Dashboard** → "FTMO Verifications" tab
8. **Review submission** and click "Approve"
9. **Switch back to Student account**
10. **Observe**: Now a "Pro Trader" with Signal Room access! 🚀

### Test Flow 4: Admin Management

1. **Create or login as Admin**
   ```bash
   # Option 1: Use demo helper to create admin
   # Option 2: Use bootstrap endpoint:
   curl -X POST YOUR_SUPABASE_URL/functions/v1/make-server-0991178c/bootstrap-admin \
     -H "Content-Type: application/json" \
     -d '{"email":"admin@test.com","password":"admin123","firstName":"Admin","country":"US"}'
   ```
2. **View all users** in User Management tab
3. **Manually change user roles** using dropdown
4. **Verify FTMO submissions** in Verifications tab
5. **Monitor statistics** in dashboard cards

## Testing Specific Features

### Lesson Completion

1. Click any unlocked lesson
2. Lesson viewer opens with content
3. Click "Mark as Complete"
4. Return to dashboard
5. Verify lesson shows green checkmark
6. Verify progress bar updates

### Quiz System

1. Open a quiz lesson (Foundation or Advanced final)
2. Answer all 5 questions
3. Click "Submit Quiz"
4. View your score
5. **Pass (80%+)**: See success message, unlock content
6. **Fail (<80%)**: See retry message

### Role Progression Logic

**Lead → Student:**
- Manual: Admin changes role
- Automatic: Payment webhook (integrate payment processor)

**Student → Advanced Unlocked:**
- Complete all 12 foundation lessons
- Pass foundation final quiz (80%+)
- ✅ Automatic unlock

**Student → Pro Trader:**
- Submit FTMO proof
- Admin approves
- ✅ Automatic role upgrade

### Payment Integration (To Implement)

The platform includes payment webhook endpoints:

```javascript
// Simulate payment success
POST /webhook/payment
{
  "userId": "user-uuid-here",
  "plan": "monthly",
  "status": "success"
}
```

Integrate with:
- Stripe
- Flutterwave (Africa)
- Paystack (Africa)
- PayPal

## Expected Behaviors

### Lead User (Free Trial)
- ✅ Can access lessons f1, f2, f3
- ❌ Cannot access f4+ (shows upgrade prompt)
- ❌ Cannot access Advanced course
- ❌ Cannot submit FTMO
- ✅ Sees upgrade banners

### Student User
- ✅ Can access all Foundation lessons
- ✅ Can access Advanced IF unlocked
- ✅ Can submit FTMO proof
- ✅ Progress tracking works
- ✅ Quiz results save

### Pro Trader
- ✅ All Student access
- ✅ Signal Room tab visible
- ✅ Can view signals and private community
- ✅ Priority features enabled

### Admin User
- ✅ Access to Admin Dashboard
- ✅ Can view all users
- ✅ Can change any user's role
- ✅ Can approve/reject FTMO
- ✅ Can see platform statistics

## Common Test Scenarios

### Scenario: New User Onboarding
```
1. User visits site
2. Clicks "Start Free Trial"
3. Fills form (email, name, country)
4. Account created as "Lead"
5. Redirected to dashboard
6. Sees first 3 lessons unlocked
7. Welcome email sent (if email configured)
```

### Scenario: Student Course Completion
```
1. Student completes lesson 11/12
2. Takes Foundation Quiz
3. Scores 85% (pass)
4. System auto-unlocks Advanced
5. Dashboard shows "Advanced Unlocked!"
6. Can now access all 15 advanced lessons
```

### Scenario: FTMO Verification
```
1. Student submits FTMO proof
2. Submission saved with status "pending"
3. Admin receives notification (to implement)
4. Admin reviews in dashboard
5. Admin approves
6. User role → "pro-trader"
7. Signal Room unlocks
8. User receives email (to implement)
```

## Debugging Tips

### Issue: User not logging in
- Check browser console for errors
- Verify Supabase credentials in env
- Check network tab for API responses

### Issue: Progress not saving
- Verify access token is valid
- Check server logs in Supabase
- Ensure lesson IDs match between frontend/backend

### Issue: Role not changing
- Verify admin has correct permissions
- Check KV store updates in Supabase
- Refresh user profile after role change

### Issue: FTMO submission not appearing
- Check submission endpoint response
- Verify data saved in KV store (`ftmo:*` keys)
- Ensure admin is fetching pending submissions

## Test Checklist

Before deployment, verify:

- [ ] Signup flow creates user correctly
- [ ] Login works with valid credentials
- [ ] Lead users see only 3 lessons
- [ ] Students see all foundation lessons
- [ ] Lesson completion updates progress
- [ ] Quiz scoring works (80% threshold)
- [ ] Advanced unlocks after foundation completion
- [ ] FTMO submission saves correctly
- [ ] Admin can view all users
- [ ] Admin can change roles
- [ ] Admin can verify FTMO submissions
- [ ] Role changes take effect immediately
- [ ] Logout clears session
- [ ] Toast notifications appear
- [ ] Progress bars update visually
- [ ] Mobile responsive design works

## Performance Testing

Test with multiple users:
1. Create 10+ demo users
2. Complete lessons simultaneously
3. Submit multiple FTMO proofs
4. Verify admin dashboard loads quickly
5. Check KV store query performance

## Security Testing

Verify:
- [ ] Users can only access their own data
- [ ] Admin endpoints require admin role
- [ ] Service role key not exposed to frontend
- [ ] Access tokens validated on server
- [ ] No SQL injection vulnerabilities
- [ ] XSS protection enabled

## Next Steps After Testing

1. **Configure Email**: Set up Supabase SMTP for welcome/notification emails
2. **Add Real Content**: Replace placeholder videos with actual course content
3. **Integrate Payments**: Connect Stripe/Flutterwave webhooks
4. **Set Up Community**: Create Discord bot for auto-invites
5. **Add Analytics**: Track user engagement and course completion
6. **Enable Monitoring**: Set up error tracking (Sentry, etc.)
7. **Optimize Performance**: Add caching, lazy loading
8. **Security Audit**: Review and harden production deployment

## Support & Troubleshooting

For issues:
1. Check browser console
2. Review Supabase function logs
3. Verify environment variables
4. Test API endpoints with curl/Postman
5. Review this testing guide

Happy testing! 🚀
