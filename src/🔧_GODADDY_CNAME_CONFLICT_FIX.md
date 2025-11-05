# 🔧 GoDaddy CNAME Conflict - How to Fix

**Issue**: Getting conflict error when trying to add CNAME record  
**Cause**: Existing DNS records are blocking the new CNAME  
**Solution**: Delete conflicting records first, then add CNAME

---

## 🚨 Understanding the Conflict

**CNAME rules**:
- A CNAME record CANNOT exist alongside other records for the same name
- You can't have both an A record AND a CNAME for `www`
- You can't have both a CNAME AND another CNAME for `www`
- GoDaddy parking page records also cause conflicts

**Common conflicts**:
1. Existing A record for `www` → Blocks CNAME for `www`
2. Existing CNAME for `www` → Blocks new CNAME for `www`
3. GoDaddy parking page → Blocks custom CNAME

---

## ✅ Step-by-Step Fix

### Step 1: Login to GoDaddy DNS Management

1. Go to: https://dcc.godaddy.com/control/dns
2. Login with your GoDaddy account
3. Select domain: **pipnationacademy.com**
4. You should see your DNS records

---

### Step 2: Identify Conflicting Records

Look for these records in your DNS table:

**Check for existing records with these names**:
- `@` (root domain)
- `www` (subdomain)
- `*` (wildcard)

**Common conflicts you'll see**:

#### Conflict Type 1: Existing A Record
```
Type: A
Name: www
Value: 160.153.136.3 (or similar IP)
```
→ **This blocks your CNAME for www**

#### Conflict Type 2: Existing CNAME
```
Type: CNAME
Name: www  
Value: @
```
→ **This blocks your new CNAME**

#### Conflict Type 3: GoDaddy Parking
```
Type: A
Name: @
Value: 160.153.136.3 (GoDaddy parking IP)
```
→ **This is the parking page**

---

### Step 3: Delete Conflicting Records

**For `www` CNAME conflict**:

1. **Find the existing record** for `www` (either A or CNAME)
2. **Click the three dots** (⋮) on the right side of that record
3. **Click "Delete"**
4. **Confirm deletion**
5. **Wait 5 seconds** for the table to refresh

**For `@` (root) conflict**:

1. **Find existing A record** for `@`
2. **Click the three dots** (⋮)
3. **Click "Delete"**
4. **Confirm deletion**

⚠️ **Important**: Only delete records you're replacing. Don't delete MX records (email) or TXT records (verification).

---

### Step 4: Add Your New CNAME Record

Now that conflicts are cleared:

1. **Click "Add" button** (usually top right)
2. **Select record type**: `CNAME`
3. **Fill in details**:

For Figma Make / Vercel / Netlify:
```
Type: CNAME
Name: www
Value: [YOUR-DEPLOYMENT-URL]
TTL: 600 (or 1 Hour)
```

**Example for Figma Make**:
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```
(Replace with your actual CNAME target from Figma Make)

4. **Click "Save"**

---

### Step 5: Add Root Domain Record

You also need the root domain to work:

**Option A: A Record (Recommended)**

1. **Click "Add"**
2. **Select**: `A`
3. **Enter**:
   ```
   Type: A
   Name: @
   Value: [IP ADDRESS from Figma Make]
   TTL: 600
   ```
4. **Click "Save"**

**Option B: ALIAS/ANAME (if available)**

Some DNS providers support ALIAS, but GoDaddy typically doesn't. Use A record instead.

---

## 🎯 What You Need From Figma Make

Before setting up DNS, get these from Figma Make:

1. **After publishing**, click "Custom Domain" or "Settings"
2. **You should see instructions** like:

**CNAME Record**:
```
Name: www
Value: cname.vercel-dns.com (or similar)
```

**A Record**:
```
Name: @
Value: 76.76.21.21 (example IP)
```

📝 **Don't have these yet?** Let me know and I'll help you find them!

---

## 🔍 Common CNAME Targets

Depending on where you deployed:

### Figma Make / Vercel:
```
CNAME: cname.vercel-dns.com
```

### Netlify:
```
CNAME: [your-site].netlify.app
```

### GitHub Pages:
```
CNAME: [username].github.io
```

### Custom Server:
```
CNAME: [your-server-domain]
```

---

## ✅ Complete DNS Setup for pipnationacademy.com

Here's what your final DNS should look like:

### Records to Add:

**Record 1: Root domain (A Record)**
```
Type: A
Name: @
Value: [YOUR IP ADDRESS]
TTL: 600
```

**Record 2: WWW subdomain (CNAME)**
```
Type: CNAME
Name: www
Value: [YOUR CNAME TARGET]
TTL: 600
```

**Record 3: Keep existing MX records** (for email)
```
Type: MX
Name: @
Value: [keep existing email settings]
```

**Record 4: Keep existing TXT records** (for verification)
```
Type: TXT
Name: @
Value: [keep existing verification]
```

---

## 🚨 Troubleshooting Specific Errors

### Error: "CNAME record conflicts with another record"

**Solution**:
1. Delete the conflicting A or CNAME record for `www`
2. Wait 5 seconds
3. Try adding CNAME again

---

### Error: "Cannot create CNAME at root (@)"

**This is correct behavior!** 

**Solution**: 
- Use A record for root (`@`)
- Use CNAME for www
- This is the standard setup

---

### Error: "Record already exists"

**Solution**:
1. Look for duplicate record
2. Delete the old one
3. Add the new one

---

### Error: "Invalid CNAME target"

**Solution**:
- Check CNAME target doesn't have `https://`
- Should be just: `cname.vercel-dns.com`
- NOT: `https://cname.vercel-dns.com`
- Remove trailing slashes

---

## 📋 Quick Resolution Checklist

Follow these in order:

- [ ] Login to GoDaddy DNS
- [ ] Find `www` record (A or CNAME)
- [ ] Delete existing `www` record
- [ ] Wait 5 seconds
- [ ] Click "Add" for new record
- [ ] Select "CNAME" type
- [ ] Name: `www`
- [ ] Value: Your CNAME target (from Figma Make)
- [ ] TTL: 600
- [ ] Click "Save"
- [ ] Also add A record for `@` (root)

---

## 🎯 What's Your CNAME Target?

**Before we can proceed, you need to know:**

### If using Figma Make:
After publishing, Figma Make should show you DNS settings like:
```
CNAME: [something].vercel-dns.com
or
A Record: [IP address]
```

### If using Supabase Edge Functions:
You would use the Supabase project URL, but this requires additional setup.

---

## 🤔 Need Help Finding Your CNAME Target?

**Tell me**:
1. Where did you publish your Pip Nation Academy?
   - Figma Make?
   - Vercel directly?
   - Netlify?
   - Other platform?

2. After publishing, did you see any DNS instructions?

3. What does the CNAME conflict error say exactly?

---

## 💡 Alternative: Domain Forwarding (Quick Fix)

If CNAME is too complex, try this temporarily:

### GoDaddy Domain Forwarding:

1. **In GoDaddy**, scroll to **"Forwarding"** section
2. **Click "Add Forwarding"**
3. **Setup**:
   ```
   Forward from: pipnationacademy.com
   Forward to: [Your Figma Make URL]
   Redirect type: Permanent (301)
   Forward settings: Forward only
   ```
4. **Also forward www**:
   ```
   Forward from: www.pipnationacademy.com
   Forward to: [Your Figma Make URL]
   ```

⚠️ **Note**: This is a temporary solution. CNAME is better for production.

---

## 📞 Next Steps

**Tell me**:
1. ✅ What CNAME target are you trying to add? (the "Value" field)
2. ✅ What's the exact error message you're seeing?
3. ✅ Screenshot of your current DNS records?

Then I can give you exact steps to fix it!

---

## 🎯 Quick Answer

**Most likely solution**:

1. Delete the existing A or CNAME record for `www`
2. Add new CNAME:
   ```
   Name: www
   Value: [your-project].vercel-dns.com (or whatever Figma Make gave you)
   ```

**Can you check your Figma Make deployment and tell me what CNAME target it's showing?**

---

**Last Updated**: October 27, 2025  
**Domain**: pipnationacademy.com  
**Status**: Resolving CNAME Conflict
