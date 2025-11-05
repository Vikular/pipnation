# 🌐 GoDaddy Domain Setup Guide for Pip Nation Academy

## Overview
This guide will walk you through connecting your GoDaddy domain to your Pip Nation Academy platform hosted on Figma Make/Supabase.

---

## 📋 Prerequisites

Before you begin, make sure you have:
- [ ] Access to your GoDaddy account
- [ ] Your domain name purchased and active
- [ ] Your Figma Make deployment URL (provided after publishing)
- [ ] Admin access to your Supabase project

---

## 🔍 Step 1: Get Your Deployment URL

### From Figma Make:
1. Click the **"Publish"** button in Figma Make
2. Copy the deployment URL that's generated (it will look like: `https://your-project-name.figma-make.app` or similar)
3. Save this URL - you'll need it for DNS configuration

### From Supabase (if applicable):
1. Go to your Supabase project dashboard
2. Navigate to **Settings** → **API**
3. Copy your **Project URL** (e.g., `https://xxxxx.supabase.co`)

---

## 🔧 Step 2: Configure DNS in GoDaddy

### Login to GoDaddy:
1. Go to [https://www.godaddy.com](https://www.godaddy.com)
2. Click **Sign In** (top right)
3. Enter your username and password

### Access DNS Management:
1. Once logged in, click on your **profile icon** (top right)
2. Select **"My Products"**
3. Find your domain in the list
4. Click the **"DNS"** button next to your domain name

---

## ⚙️ Step 3: Add DNS Records

You have two options for connecting your domain:

### **Option A: Using CNAME Record (Recommended for Subdomains)**

If you want to use `www.yourdomain.com` or a subdomain:

1. **Delete existing CNAME records** (if any exist for `www`)
   - Find any CNAME record with name `www`
   - Click the three dots (⋮) → Delete

2. **Add new CNAME record**:
   - Click **"Add"** button
   - **Type**: Select `CNAME`
   - **Name**: Enter `www` (or your subdomain like `app`)
   - **Value**: Enter your Figma Make URL without `https://` 
     - Example: `your-project-name.figma-make.app`
   - **TTL**: Leave as default (1 Hour) or set to 600 seconds
   - Click **"Save"**

### **Option B: Using A Record (For Root Domain)**

If you want to use just `yourdomain.com` (without www):

1. **Get the IP address**:
   - You'll need to get the IP address of your Figma Make deployment
   - Open Terminal/Command Prompt
   - Run: `ping your-project-name.figma-make.app`
   - Copy the IP address shown

2. **Delete existing A records** (if needed)
   - Find A record with name `@`
   - Click three dots (⋮) → Delete

3. **Add new A record**:
   - Click **"Add"** button
   - **Type**: Select `A`
   - **Name**: Enter `@`
   - **Value**: Enter the IP address you got from ping
   - **TTL**: Leave as default
   - Click **"Save"**

### **Option C: Both Root and WWW (Recommended)**

To make both `yourdomain.com` AND `www.yourdomain.com` work:

1. **Add A record for root** (follow Option B above)
2. **Add CNAME record for www** (follow Option A above)
3. **Add domain forwarding** (optional):
   - Scroll down to **"Forwarding"** section
   - Set up forwarding from `yourdomain.com` to `www.yourdomain.com`
   - Select **"Permanent (301)"** redirect
   - Click **"Save"**

---

## 🔐 Step 4: Configure SSL/HTTPS

### In GoDaddy:
GoDaddy domains automatically work with SSL when pointed to platforms that support it.

### In Figma Make/Supabase:
1. Go to your deployment settings
2. Enable SSL/HTTPS (usually automatic)
3. Add your custom domain in the platform settings
4. Wait for SSL certificate to be issued (5-10 minutes)

---

## ⏱️ Step 5: Wait for DNS Propagation

**Important**: DNS changes take time to propagate globally.

- **Minimum wait time**: 30 minutes
- **Average wait time**: 2-4 hours
- **Maximum wait time**: 24-48 hours

### Check DNS Propagation Status:
1. Visit [https://dnschecker.org](https://dnschecker.org)
2. Enter your domain name
3. Select record type (A or CNAME)
4. Click **"Search"**
5. Wait until most locations show your new IP/target

---

## ✅ Step 6: Verify Domain Connection

### Test Your Domain:
1. Open a new incognito/private browser window
2. Go to `https://www.yourdomain.com` or `https://yourdomain.com`
3. You should see your Pip Nation Academy landing page

### If it doesn't work immediately:
- Clear your browser cache
- Try a different browser
- Use incognito/private mode
- Wait a few more hours for DNS propagation
- Check DNS settings again for typos

---

## 🎯 Step 7: Update Supabase Settings

After your domain is connected, update Supabase allowed URLs:

1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Select your Pip Nation Academy project
3. Go to **Authentication** → **URL Configuration**
4. Add your custom domain to:
   - **Site URL**: `https://www.yourdomain.com`
   - **Redirect URLs**: Add both:
     - `https://yourdomain.com/**`
     - `https://www.yourdomain.com/**`
5. Click **"Save"**

---

## 📧 Step 8: Update Email Settings (Optional)

If you want professional emails like `admin@yourdomain.com`:

1. In GoDaddy, go to **My Products**
2. Find **Email** section
3. Purchase email hosting (if not already)
4. Set up email forwarding or full email accounts
5. Configure email clients (Gmail, Outlook, etc.)

---

## 🚨 Troubleshooting Common Issues

### Issue 1: "Site Can't Be Reached"
**Solution**: DNS hasn't propagated yet. Wait 2-4 hours and try again.

### Issue 2: Shows GoDaddy Parking Page
**Solution**: 
- Check DNS records are correct
- Make sure you saved the changes
- Clear browser cache
- Wait for propagation

### Issue 3: SSL Certificate Error
**Solution**:
- Wait for SSL provisioning (can take up to 10 minutes)
- Check that HTTPS is enabled in deployment platform
- Try accessing with `http://` first, then switch to `https://`

### Issue 4: Authentication Doesn't Work
**Solution**:
- Update Supabase redirect URLs (Step 7)
- Clear browser cookies
- Check browser console for errors

### Issue 5: Mixed Content Warnings
**Solution**:
- Ensure all assets load via HTTPS
- Update any hard-coded HTTP URLs to HTTPS
- Check Supabase storage URLs are HTTPS

---

## 📱 Testing Checklist

After setup, test these features:

- [ ] Landing page loads correctly
- [ ] Logo and images display properly
- [ ] User signup works
- [ ] User login works
- [ ] Course enrollment works
- [ ] Payment modal opens
- [ ] Admin dashboard accessible
- [ ] Mobile responsive design works
- [ ] All navigation links work
- [ ] SSL certificate is valid (green padlock)

---

## 🔄 Alternative: Using Cloudflare (Advanced)

For better performance and security, consider using Cloudflare:

1. Sign up at [https://cloudflare.com](https://cloudflare.com)
2. Add your domain
3. Cloudflare will scan existing DNS records
4. Update nameservers in GoDaddy to Cloudflare's nameservers
5. Configure DNS in Cloudflare instead of GoDaddy
6. Enable SSL/TLS (Full or Full Strict)
7. Enable caching and performance features

Benefits:
- Free SSL certificate
- CDN for faster loading
- DDoS protection
- Better analytics
- Page rules for redirects

---

## 📞 Support Contacts

### GoDaddy Support:
- Phone: 1-480-505-8877
- Chat: Available in GoDaddy dashboard
- Help: [https://www.godaddy.com/help](https://www.godaddy.com/help)

### Figma Make Support:
- Check Figma Make documentation
- Support channels in Figma community

### Supabase Support:
- Discord: [https://discord.supabase.com](https://discord.supabase.com)
- Docs: [https://supabase.com/docs](https://supabase.com/docs)

---

## 📌 Quick Reference

### Your Configuration Details:
```
Domain: _________________ (e.g., pipnationacademy.com)
Deployment URL: _________________ (from Figma Make)
Supabase Project: _________________ (your project ID)
```

### DNS Records to Add:
```
Type: A
Name: @
Value: [IP ADDRESS]
TTL: 600

Type: CNAME  
Name: www
Value: [YOUR-PROJECT].figma-make.app
TTL: 600
```

---

## ✨ Final Notes

1. **Backup**: Take screenshots of your current DNS settings before making changes
2. **Timing**: Do this during low-traffic hours to minimize disruption
3. **Testing**: Always test in incognito mode after making changes
4. **Documentation**: Keep this guide handy for future reference
5. **Patience**: DNS changes take time - don't panic if it doesn't work immediately!

---

## 🎉 Success!

Once everything is configured:
- Your domain points to Pip Nation Academy ✅
- SSL certificate is active ✅
- Users can access via your custom domain ✅
- Authentication works properly ✅

You now have a professional forex education platform at your own domain!

---

**Last Updated**: October 27, 2025  
**Platform**: Pip Nation Academy  
**Version**: 2.0 (Post-Rebranding)
