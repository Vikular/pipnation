# Forex Academy Platform - Setup Guide

## Overview

This is a comprehensive Forex Trading Education Platform with role-based access control, course progression, and a pathway from beginner to funded trader.

## User Journey

1. **Lead (Free Trial)** → First 3 foundation lessons free
2. **Student (Paid)** → Full access to Foundation + Advanced courses  
3. **Pro Trader** → Signal Room access after passing FTMO challenge
4. **Funded Trader** → Future state with prop firm capital

## Getting Started

### 1. Create Your First Admin User

To access the admin dashboard, you need to create an admin user. You can do this in two ways:

**Option A: Using the Bootstrap Endpoint (One-time setup)**

Make a POST request to create an admin:

```bash
curl -X POST https://YOUR_PROJECT_ID.supabase.co/functions/v1/make-server-0991178c/bootstrap-admin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@forexacademy.com",
    "password": "your-secure-password",
    "firstName": "Admin",
    "country": "US"
  }'
```

**Option B: Manual Creation**
1. Sign up normally through the UI
2. Use the Supabase dashboard to access the KV store
3. Find your user record (key: `user:YOUR_USER_ID`)
4. Update the `role` field to `"admin"`

**Important:** After creating your admin, consider removing or securing the `/bootstrap-admin` endpoint in production.

### 2. Test User Accounts

For testing, create users with different roles:

- **Lead**: Sign up with free trial (access first 3 lessons only)
- **Student**: Sign up and "upgrade" (in a real system, this would be after payment)
- **Pro Trader**: Complete Advanced course + submit FTMO proof
- **Admin**: Use the bootstrap endpoint or manual creation

## Features

### For Students

- **Progress Tracking**: Visual progress bars for each course level
- **Lesson Completion**: Mark lessons as complete and track your journey
- **Quizzes**: Test your knowledge with interactive quizzes
- **FTMO Submission**: Upload proof of passing FTMO challenge
- **Role Progression**: Automatic unlocking of content based on achievements

### For Admins

- **User Management**: View all users, filter by role, manually change roles
- **FTMO Verification**: Review and approve/reject FTMO submissions
- **Analytics**: View user statistics and progress
- **Content Control**: Manage course access and user permissions

## Key Endpoints

### Authentication
- `POST /signup` - Create new user account
- `POST /signin` - Sign in existing user

### User Profile
- `GET /user/:userId` - Get user profile
- `POST /user/:userId/role` - Update user role (admin only)

### Progress Tracking
- `POST /progress/lesson` - Mark lesson as complete
- `POST /quiz/submit` - Submit quiz score

### FTMO Verification
- `POST /ftmo/submit` - Submit FTMO challenge proof
- `GET /admin/ftmo/pending` - Get pending verifications (admin)
- `POST /admin/ftmo/verify` - Approve/reject submission (admin)

### Admin
- `GET /admin/users` - Get all users (admin only)

## Progression Logic

### Foundation → Advanced
**Trigger**: Complete all 12 foundation lessons + pass final quiz (80%+)
**Action**: Advanced course automatically unlocked

### Advanced → Pro Trader
**Trigger**: Submit FTMO challenge proof + admin verification
**Action**: Role upgraded to "pro-trader", Signal Room access granted

### Student → Pro Trader (Alternative)
**Trigger**: Admin manually changes role
**Action**: Immediate access to Signal Room

## Payment Integration

The platform includes webhook endpoints ready for payment processor integration:

```javascript
POST /webhook/payment
{
  userId: "user-id",
  plan: "monthly" | "annual",
  status: "success" | "failed"
}
```

### Recommended Payment Processors
- **Stripe** - Global payment processing
- **Flutterwave/Paystack** - African markets
- **PayPal** - Alternative option

## Community Integration

The platform is designed to integrate with:
- **Discord** - Main community and Signal Room
- **Telegram** - Alternative community option
- **Calendly** - Mentorship session scheduling

### Implementation Notes
- Use Discord/Telegram bot APIs to auto-invite users based on role changes
- Generate unique invite links for different access levels
- Remove users from general channels when promoted to Signal Room

## Database Structure (KV Store)

### User Profile
```json
{
  "user:USER_ID": {
    "userId": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "country": "US",
    "role": "student",
    "progress": {
      "foundation": { "completed": 5, "total": 12 },
      "advanced": { "completed": 0, "total": 15 }
    },
    "completedLessons": ["f1", "f2", "f3"],
    "quizScores": {
      "f12": { "score": 85, "passed": true }
    },
    "advancedUnlocked": false
  }
}
```

### FTMO Submission
```json
{
  "ftmo:USER_ID:TIMESTAMP": {
    "submissionId": "ftmo:user-id:timestamp",
    "userId": "uuid",
    "proofUrl": "https://...",
    "notes": "Optional notes",
    "status": "pending" | "approved" | "rejected",
    "submittedAt": "2024-01-01T00:00:00Z"
  }
}
```

## Course Content

### Foundation Course (12 Lessons)
1. Introduction to Forex Trading
2. Market Structure Basics
3. Understanding Currency Pairs
4. Support and Resistance
5. Trend Analysis
6. Candlestick Patterns
7. Risk Management Fundamentals
8. Trading Psychology Basics
9. Entry and Exit Strategies
10. Position Sizing
11. Building Your Trading Plan
12. Foundation Review and Quiz

### Advanced Course (15 Lessons)
1. Advanced Market Structure
2. Smart Money Concepts
3. Order Blocks and Fair Value Gaps
4. Liquidity Trading
5. Multi-Timeframe Analysis
6. Advanced Risk Management
7. Trading Psychology Mastery
8. Backtesting Strategies
9. Live Trade Analysis
10. Session Trading Strategies
11. News Trading Techniques
12. Building Your Edge
13. Preparing for FTMO
14. Advanced Strategies Review
15. Advanced Final Exam

## Security Notes

⚠️ **Important for Production:**

1. **Remove Bootstrap Endpoint**: After creating your admin, remove or secure the `/bootstrap-admin` endpoint
2. **Environment Variables**: Never expose `SUPABASE_SERVICE_ROLE_KEY` to the frontend
3. **PII Protection**: This is a prototype - implement proper encryption and data protection for production
4. **Payment Security**: Use proper webhook signature verification for payment processors
5. **Rate Limiting**: Implement rate limiting on auth endpoints
6. **Email Verification**: Configure Supabase email server for production use

## Customization

### Branding
- Update logo and colors in `LandingPage.tsx`
- Modify `styles/globals.css` for typography
- Change hero images using the `unsplash_tool`

### Course Content
- Update lesson lists in `StudentDashboard.tsx`
- Modify quiz questions in `LessonViewer.tsx`
- Add video player integration for real content

### Pricing
- Update pricing tiers in `LandingPage.tsx`
- Configure payment webhook in server `index.tsx`

## Support

For issues or questions:
- Check the console for error messages
- Review Supabase function logs
- Verify environment variables are set correctly

## Next Steps

1. ✅ Create admin account
2. ✅ Test the signup flow
3. ✅ Add real course video content
4. ✅ Integrate payment processor
5. ✅ Set up Discord/Telegram bots
6. ✅ Configure email notifications
7. ✅ Add analytics tracking
8. ✅ Deploy to production

---

**Built with:** React, TypeScript, Tailwind CSS, Supabase, Hono
