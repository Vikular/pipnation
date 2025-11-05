# 🚨 Fix CNAME Conflict - pipnationacademy.com

**Error**: "Record name www. conflicts with another record."  
**Domain**: pipnationacademy.com  
**Fix Time**: 2 minutes

---

## ✅ Step-by-Step Fix

### Step 1: Delete the Conflicting Record

1. **In GoDaddy DNS Management** for pipnationacademy.com
2. **Look for this record**:
   ```
   Name: www
   Type: A (or CNAME)
   ```

3. **You'll see something like**:
   ```
   Type: A
   Name: www
   Value: 160.153.136.3 (or some IP address)
   TTL: 600 or 1 Hour
   ```
   OR
   ```
   Type: CNAME
   Name: www
   Value: @ (or something else)
   TTL: 600 or 1 Hour
   ```

4. **Click the three dots (⋮)** on the right side of that record
5. **Click "Delete"**
6. **Click "Confirm"** or "Yes"
7. **Wait 5 seconds** for it to disappear

✅ **The conflict is now cleared!**

---

### Step 2: Before Adding New CNAME - IMPORTANT! ⚠️

**WAIT!** Before you add a CNAME record, you need to know:

**Where is your Pip Nation Academy actually hosted?**

This is critical because the CNAME target depends on your hosting platform.

---

## 🎯 For Figma Make Deployments (Most Likely)

If you're using **Figma Make** to host your site:

### Option A: Add Domain in Figma Make First

**You MUST do this first before adding DNS records!**

1. **In Figma Make**, click your project
2. **Go to Settings** or **Deploy Settings**
3. **Look for "Custom Domain"** or "Domain Settings"
4. **Click "Add Domain"**
5. **Enter**: `pipnationacademy.com` and `www.pipnationacademy.com`
6. **Figma Make will show you DNS instructions** like:

   ```
   Add these DNS records in GoDaddy:

   Type: A
   Name: @
   Value: 76.76.21.21 (example IP)

   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com (or similar)
   ```

7. **Copy those exact values** and use them in Step 3 below

---

### Option B: Use These Standard Records

If Figma Make uses Vercel infrastructure (most common):

**For Root Domain (@)**:
```
Type: A
Name: @
Value: 76.76.21.21
TTL: 600
```

**For WWW Subdomain**:
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 600
```

⚠️ **Note**: These are example values. Use the actual values from Figma Make!

---

## 📋 Complete DNS Setup Steps

### In GoDaddy DNS Management:

**Step 1: Delete existing www record** ✅ (you should have done this above)

**Step 2: Add A Record for Root**
1. Click "Add" button
2. **Type**: Select `A`
3. **Name**: Enter `@`
4. **Value**: Enter IP address (from Figma Make or `76.76.21.21`)
5. **TTL**: `600` or `1 Hour`
6. Click "Save"

**Step 3: Add CNAME Record for WWW**
1. Click "Add" button
2. **Type**: Select `CNAME`
3. **Name**: Enter `www`
4. **Value**: Enter `cname.vercel-dns.com` (or target from Figma Make)
5. **TTL**: `600` or `1 Hour`
6. Click "Save"

**Step 4: Keep Email Records**
- Don't delete any MX records (for email)
- Don't delete TXT records (for verification)

---

## 🔍 How to Find Your Figma Make DNS Settings

### Method 1: Check Deployment Settings
1. Open your Figma Make project
2. Click "Publish" or "Deploy"
3. Look for "Custom Domain" option
4. It should show DNS instructions

### Method 2: Check Documentation
- Look for Figma Make docs on custom domains
- They'll specify what CNAME target to use

### Method 3: Use Vercel Defaults
Most Figma Make projects use Vercel, so:
- CNAME target: `cname.vercel-dns.com`
- A record IP: `76.76.21.21`

---

## ⚡ Quick Fix (Right Now)

If you want to get started immediately:

### Delete the www record (you did this already)

### Add these two records:

**Record 1:**
```
Type: A
Name: @
Value: 76.76.21.21
TTL: 600
```

**Record 2:**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 600
```

Save both and wait 30 minutes for DNS propagation.

---

## 🎯 Alternative: Simple A Records Only

If CNAME still gives issues, use A records for both:

**Record 1: Root**
```
Type: A
Name: @
Value: 76.76.21.21
```

**Record 2: WWW**
```
Type: A
Name: www
Value: 76.76.21.21
```

This works but CNAME is preferred.

---

## ✅ After Adding Records

1. **Wait 30 minutes** for DNS propagation
2. **Clear browser cache**
3. **Test**: https://www.pipnationacademy.com
4. **Test**: https://pipnationacademy.com
5. **Both should load your site**

---

## 🚨 Still Getting CNAME Conflict?

### Check for hidden records:

1. In GoDaddy DNS, look for:
   - Multiple www records
   - Wildcard (*) records
   - @ records that block CNAME

2. Delete ALL records named "www"

3. Make sure you're adding CNAME to "www" NOT to "@"
   - ✅ CNAME for `www` → Allowed
   - ❌ CNAME for `@` → Not allowed (use A record)

---

## 📞 What Information Do You Have?

**Please tell me**:

1. ✅ Have you published your site in Figma Make?
2. ✅ Did Figma Make give you DNS instructions after publishing?
3. ✅ What CNAME value are you trying to enter?
4. ✅ Can you see the current DNS records in GoDaddy? What do they show?

---

## 🎯 Most Likely Solution

**Based on the error, here's what to do RIGHT NOW**:

### In GoDaddy:

1. **Find and delete** the existing www record
2. **Add new A record**:
   - Type: A
   - Name: @
   - Value: [get from Figma Make]
3. **Add new CNAME**:
   - Type: CNAME
   - Name: www
   - Value: [get from Figma Make]

### In Figma Make:

1. Go to project settings
2. Add custom domain: pipnationacademy.com
3. Copy the DNS instructions it gives you
4. Use those exact values in GoDaddy

---

## 💡 Pro Tip

**If you're not sure what CNAME value to use**:

1. **Don't add the CNAME yet**
2. **First, publish your site** in Figma Make
3. **Add the domain** in Figma Make settings
4. **Figma Make will tell you** exactly what DNS records to add
5. **Then add them** in GoDaddy

This ensures you use the correct values!

---

## 📸 Visual Guide

**Your GoDaddy DNS should look like this when done**:

```
╔════════╦══════╦═══════════════════════════╦═══════╗
║ Type   ║ Name ║ Value                     ║ TTL   ║
╠════════╬══════╬═══════════════════════════╬═══════╣
║ A      ║ @    ║ 76.76.21.21              ║ 600   ║
║ CNAME  ║ www  ║ cname.vercel-dns.com     ║ 600   ║
║ MX     ║ @    ║ [keep existing]          ║ 600   ║
║ TXT    ║ @    ║ [keep existing]          ║ 600   ║
╚════════╩══════╩═══════════════════════════╩═══════╝
```

---

## ✅ Checklist

- [ ] Deleted existing www record (A or CNAME)
- [ ] Added new A record for @ (root)
- [ ] Added new CNAME for www
- [ ] Kept MX and TXT records
- [ ] Saved all changes
- [ ] Waiting for DNS propagation (30 mins - 2 hours)

---

## 🎉 Next Steps

Once DNS is set up:

1. Wait 30 minutes
2. Visit https://www.pipnationacademy.com
3. Should see your site!
4. Update Supabase URLs (you already did this ✅)
5. Test authentication
6. You're live! 🚀

---

**Need help?** Tell me:
- What you see in your current GoDaddy DNS records
- What CNAME target Figma Make is telling you to use

**Last Updated**: October 27, 2025  
**Status**: Fixing CNAME Conflict
