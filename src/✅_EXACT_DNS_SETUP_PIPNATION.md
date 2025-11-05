# ✅ EXACT DNS Setup for pipnationacademy.com

**Your CNAME Target**: `sites.figma.net`  
**Domain**: pipnationacademy.com  
**Platform**: Figma Make

---

## 🎯 EXACT Steps to Fix CNAME Conflict

### Step 1: Delete Conflicting WWW Record

1. **Login to GoDaddy**: https://dcc.godaddy.com/control/dns
2. **Select domain**: pipnationacademy.com
3. **Look for existing record** with name `www`:
   - Could be Type: A
   - Could be Type: CNAME
   - Could point to parking page
4. **Click the three dots (⋮)** on the right of that record
5. **Click "Delete"**
6. **Confirm "Yes, delete"**
7. **Wait 5 seconds** for table to refresh

---

### Step 2: Add New CNAME Record

1. **Click "Add" button** (top right or bottom of DNS records)
2. **Select Type**: `CNAME`
3. **Fill in EXACTLY**:
   ```
   Type: CNAME
   Name: www
   Value: sites.figma.net
   TTL: 600 (or 1 Hour)
   ```
4. **Click "Save"**

✅ CNAME for www is now set!

---

### Step 3: Set Up Root Domain (@)

You need BOTH www AND root domain to work:

**Option A: Use A Record (Recommended)**

1. **Get the IP address** for sites.figma.net:
   - Open Command Prompt (Windows) or Terminal (Mac)
   - Run: `ping sites.figma.net`
   - Copy the IP address shown (e.g., `76.76.21.21`)

2. **In GoDaddy, click "Add"**
3. **Select Type**: `A`
4. **Fill in**:
   ```
   Type: A
   Name: @
   Value: [IP ADDRESS from ping]
   TTL: 600
   ```
5. **Click "Save"**

**Option B: Use GoDaddy Forwarding (Easier)**

If you can't get the IP:

1. **Scroll down** to "Forwarding" section in GoDaddy
2. **Click "Add Forwarding"**
3. **Set up**:
   ```
   Forward from: pipnationacademy.com
   Forward to: https://www.pipnationacademy.com
   Redirect type: Permanent (301)
   ```
4. **Save**

---

## 📋 Your Final DNS Records Should Look Like This

After setup, your DNS table should show:

```
Type    Name    Value                   TTL
----    ----    -----                   ---
CNAME   www     sites.figma.net         600
A       @       [IP ADDRESS]            600
```

Plus any existing MX (email) or TXT (verification) records - **keep those!**

---

## 🔍 Finding the IP Address (If Needed)

### Windows:
1. Press `Win + R`
2. Type `cmd` and press Enter
3. Type: `ping sites.figma.net`
4. Look for line like: `Pinging sites.figma.net [76.76.21.21]`
5. Copy that IP: `76.76.21.21`

### Mac:
1. Open Terminal (Cmd + Space, type "Terminal")
2. Type: `ping sites.figma.net`
3. Look for line like: `PING sites.figma.net (76.76.21.21)`
4. Copy that IP: `76.76.21.21`
5. Press Ctrl+C to stop ping

### Alternative - Use Online Tool:
1. Go to: https://www.nslookup.io/
2. Enter: `sites.figma.net`
3. Click "Find DNS Records"
4. Copy the A record IP address

---

## ⏱️ After DNS Setup

**Wait Time**: 30 minutes to 2 hours for DNS propagation

**Check Status**:
- Visit: https://dnschecker.org
- Enter: `pipnationacademy.com`
- Select: CNAME
- Check if it shows `sites.figma.net`

---

## 🧪 Test Your Domain

After 30 minutes:

1. **Clear browser cache**
2. **Open incognito window**
3. **Visit**: `https://www.pipnationacademy.com`
4. **Should load** your Pip Nation Academy site!

Also test:
- `https://pipnationacademy.com` (without www)
- Both should work

---

## 🎯 Quick Reference

### Your DNS Configuration:
```
Domain: pipnationacademy.com
CNAME: www → sites.figma.net
A Record: @ → [IP of sites.figma.net]
Supabase: mkblwhxlrdcoflliwnyr.supabase.co
```

### Your Supabase Auth URLs:
```
Site URL: https://www.pipnationacademy.com
Redirect URLs:
  - https://pipnationacademy.com/**
  - https://www.pipnationacademy.com/**
```

---

## ✅ Verification Checklist

- [ ] Deleted old `www` record in GoDaddy
- [ ] Added CNAME: `www` → `sites.figma.net`
- [ ] Added A record for `@` (root)
- [ ] Waited 30+ minutes for propagation
- [ ] Tested https://www.pipnationacademy.com
- [ ] SSL shows green padlock
- [ ] Site loads correctly
- [ ] Signup/login works
- [ ] Updated Supabase URLs

---

## 🚨 If Still Getting CNAME Conflict

Try these:

### Solution 1: Clear DNS Cache
1. Delete ALL records with name `www`
2. Wait 60 seconds
3. Refresh the page
4. Try adding CNAME again

### Solution 2: Use Different Name First
1. Add CNAME with name `test` → `sites.figma.net`
2. If that works, delete it
3. Now add `www` → `sites.figma.net`

### Solution 3: Contact GoDaddy
If still blocked:
1. Call GoDaddy: 1-480-505-8877
2. Say: "I need to add a CNAME record for www but getting conflict error"
3. Ask them to clear any parking page records

---

## 🎉 Success!

Once DNS is set up and propagated:

✅ `pipnationacademy.com` works  
✅ `www.pipnationacademy.com` works  
✅ SSL certificate active  
✅ Supabase auth configured  
✅ Platform is LIVE!

---

**Next Step**: Follow the testing guide in `/✅_PIPNATIONACADEMY_CONFIG.md` to test all features!

---

**Last Updated**: October 27, 2025  
**CNAME Target**: sites.figma.net  
**Status**: Ready to Configure!
