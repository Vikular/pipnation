# 🚀 CNAME Added - Next Critical Steps

**Status**: ✅ CNAME added in GoDaddy  
**Domain**: pipnationacademy.com  
**CNAME**: www → sites.figma.net  

---

## ⚠️ CRITICAL: You're Not Done Yet!

Adding CNAME in GoDaddy is only **Step 1 of 3**. You still need to:

1. ✅ Add CNAME in GoDaddy (DONE!)
2. ⏳ **Add custom domain in Figma Make** (DO NOW!)
3. ⏳ Wait for DNS propagation (30 mins - 2 hours)

---

## 🔴 STEP 2: Add Domain in Figma Make (CRITICAL!)

**You MUST tell Figma Make about your custom domain!**

### How to Add Custom Domain in Figma Make:

1. **Go to your Figma Make project**
2. **Click "Settings"** or **"Publish"** button
3. **Look for "Custom Domain"** or **"Domains"** section
4. **Click "Add Custom Domain"**
5. **Enter**: `www.pipnationacademy.com`
6. **Also add**: `pipnationacademy.com` (without www)
7. **Click "Save"** or **"Verify"**

Figma Make will:
- ✅ Verify your DNS is configured correctly
- ✅ Issue SSL certificate for your domain
- ✅ Connect your site to the custom domain

---

## 📍 Where to Find Custom Domain Settings in Figma Make

### Option 1: Via Publish Button
1. Click **"Publish"** in top right
2. Look for **"Custom Domain"** tab
3. Click **"Add Domain"**

### Option 2: Via Settings
1. Click **"Settings"** (gear icon)
2. Find **"Domains"** section
3. Click **"Add Custom Domain"**

### Option 3: Via Dashboard
1. Go to Figma Make dashboard
2. Select your Pip Nation Academy project
3. Click **"Domains"**
4. Add your domain

---

## ✅ What to Enter in Figma Make

**Primary Domain**:
```
www.pipnationacademy.com
```

**Additional Domains** (add both):
```
pipnationacademy.com
www.pipnationacademy.com
```

**Redirect**: 
- Set `pipnationacademy.com` to redirect to `www.pipnationacademy.com`

---

## ⏱️ STEP 3: Wait for Propagation

After adding domain in Figma Make:

**DNS Propagation Time**: 
- Minimum: 30 minutes
- Average: 2-4 hours  
- Maximum: 24-48 hours

**What's happening**:
- DNS servers worldwide are updating
- SSL certificate is being issued
- Domain is being verified

**Check Status**:
- Visit: https://dnschecker.org
- Enter: `www.pipnationacademy.com`
- Type: CNAME
- Should show: `sites.figma.net`

---

## 🧪 How to Test Domain

### After 30 Minutes:

1. **Clear browser cache completely**
   - Settings → Clear browsing data
   - Cookies and cached files
   - Time range: All time

2. **Open incognito window**

3. **Visit**: `https://www.pipnationacademy.com`

**Expected Results**:

✅ **If DNS propagated**:
- Site loads instantly
- Green padlock (SSL)
- Shows Pip Nation Academy
- No security warnings

⏳ **If still propagating**:
- "Site can't be reached"
- "DNS_PROBE_FINISHED_NXDOMAIN"
- Certificate error
- → Wait longer and try again

---

## 🔐 STEP 4: Update Supabase (After Domain Works)

Once your domain loads successfully:

1. **Go to**: https://supabase.com/dashboard/project/mkblwhxlrdcoflliwnyr
2. **Authentication** → **URL Configuration**
3. **Update**:

**Site URL**:
```
https://www.pipnationacademy.com
```

**Redirect URLs** (add all):
```
https://pipnationacademy.com/**
https://www.pipnationacademy.com/**
https://pipnationacademy.com
https://www.pipnationacademy.com
```

4. **Click "Save"**

⚠️ **Important**: Don't update Supabase until your domain actually loads!

---

## 📋 Complete Checklist

### GoDaddy DNS (Done ✅):
- [x] Added CNAME: www → sites.figma.net
- [ ] Added A record for @ (root) - **Do this if you haven't!**

### Figma Make (Do Now ⏳):
- [ ] Open Figma Make project
- [ ] Go to Settings/Domains
- [ ] Add custom domain: www.pipnationacademy.com
- [ ] Add root domain: pipnationacademy.com
- [ ] Wait for verification

### DNS Propagation (Wait ⏳):
- [ ] Wait 30 minutes minimum
- [ ] Check https://dnschecker.org
- [ ] Test https://www.pipnationacademy.com
- [ ] Verify SSL certificate

### Supabase (Do After Domain Works):
- [ ] Update Site URL
- [ ] Update Redirect URLs
- [ ] Save changes
- [ ] Test authentication

### Final Testing:
- [ ] Clear browser cache
- [ ] Visit domain in incognito
- [ ] Test signup
- [ ] Test login
- [ ] Test enrollment
- [ ] Test on mobile

---

## 🎯 Current Status

**What you've done**:
- ✅ Purchased domain: pipnationacademy.com
- ✅ Added CNAME in GoDaddy: www → sites.figma.net
- ✅ Updated Supabase URLs (may need adjustment after domain works)

**What you need to do NOW**:
1. 🔴 **Add custom domain in Figma Make** (critical!)
2. ⏳ Wait for DNS propagation
3. 🧪 Test the domain
4. ✅ Verify everything works

---

## 🚨 Important: Root Domain (@)

You also need to set up the root domain (pipnationacademy.com without www):

### Option 1: A Record (If Figma Make provides IP)
In GoDaddy, add:
```
Type: A
Name: @
Value: [IP address from Figma Make]
TTL: 600
```

### Option 2: Domain Forwarding (Easier)
In GoDaddy:
1. Scroll to **"Forwarding"** section
2. Click **"Add Forwarding"**
3. Set up:
   ```
   Forward from: pipnationacademy.com
   Forward to: https://www.pipnationacademy.com
   Redirect type: Permanent (301)
   ```
4. Save

This makes both URLs work:
- `pipnationacademy.com` → redirects to www version
- `www.pipnationacademy.com` → main site

---

## 💡 Troubleshooting

### Issue: Domain still shows "can't be reached"
**Cause**: DNS not propagated yet  
**Solution**: Wait 2-4 more hours, then try again

### Issue: "SSL certificate error"
**Cause**: Figma Make hasn't issued SSL yet  
**Solution**: 
- Make sure you added domain in Figma Make
- Wait for SSL provisioning (10-15 mins)
- Try accessing without https first

### Issue: Shows Figma Make URL instead of custom domain
**Cause**: Custom domain not added in Figma Make  
**Solution**: Add domain in Figma Make settings

### Issue: Authentication doesn't work on custom domain
**Cause**: Supabase redirect URLs not updated  
**Solution**: Update Supabase URLs (Step 4 above)

---

## 📞 Next Actions (In Order)

### RIGHT NOW:
1. **Go to Figma Make**
2. **Open your Pip Nation Academy project**
3. **Find "Custom Domain" or "Domains" settings**
4. **Add domain**: `www.pipnationacademy.com`
5. **Add domain**: `pipnationacademy.com`
6. **Save and verify**

### AFTER ADDING IN FIGMA MAKE:
1. Wait 30 minutes
2. Test domain
3. If works → Update Supabase
4. Test authentication
5. Launch! 🚀

### IF DOMAIN DOESN'T WORK AFTER 4 HOURS:
1. Check GoDaddy DNS is correct
2. Check Figma Make domain is added
3. Check for typos in domain name
4. Contact Figma Make support

---

## 🎉 When Everything Works

You'll know it's working when:

✅ Visit `https://www.pipnationacademy.com`  
✅ Site loads instantly  
✅ Green padlock shows  
✅ Pip Nation Academy appears  
✅ Can signup/login  
✅ All features work  

Then you're LIVE! 🚀

---

## 📊 Timeline

**Now**: Add domain in Figma Make  
**+10 mins**: Figma Make verifies DNS  
**+30 mins**: DNS starts propagating  
**+2 hours**: Should be working for most people  
**+24 hours**: Working globally  

---

## 🎯 Quick Summary

**You're here**: ✅ CNAME added in GoDaddy

**Next step**: 🔴 Add custom domain in Figma Make (CRITICAL!)

**Then**: ⏳ Wait 30 mins - 2 hours

**Finally**: 🧪 Test and launch!

---

**Can you now go to Figma Make and add your custom domain?** Let me know once you've done that! 🚀

---

**Last Updated**: October 27, 2025  
**Domain**: pipnationacademy.com  
**CNAME**: Added ✅  
**Status**: Need to add in Figma Make
