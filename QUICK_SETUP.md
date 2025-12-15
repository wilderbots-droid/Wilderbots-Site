# Quick Setup Guide - Add Two Email Accounts

## Method 1: Command Line (Fastest)

Run this command with your passwords:

```bash
node scripts/add-hostinger-emails.js "your-support-password" "your-careers-password"
```

**Example:**
```bash
node scripts/add-hostinger-emails.js "MySupportPass123" "MyCareersPass456"
```

This will automatically:
- ✅ Configure `support@wilderbots.com` (set as default)
- ✅ Configure `careers@wilderbots.com`
- ✅ Set up both SMTP (sending) and IMAP (receiving)
- ✅ Use Hostinger server settings automatically

## Method 2: Admin Panel (Manual)

1. **Log in to Admin Panel**
   - Go to `/admin/login`

2. **Add Support Email Configuration**
   - Navigate to: **Email Management → SMTP Settings**
   - Click **"Add SMTP Configuration"**
   - Fill in:
     ```
     Name: Hostinger - Support
     Host: smtp.hostinger.com
     Port: 465
     Secure: ✓ (checked)
     Username: support@wilderbots.com
     Password: [your support password]
     From Name: Support Team
     From Address: support@wilderbots.com
     
     IMAP Host: imap.hostinger.com
     IMAP Port: 993
     IMAP Secure: ✓ (checked)
     IMAP Username: support@wilderbots.com
     IMAP Password: [your support password]
     
     Set as Default: ✓ (checked)
     Active: ✓ (checked)
     ```
   - Click **"Test SMTP"** and **"Test IMAP"**
   - Click **"Save Configuration"**

3. **Add Careers Email Configuration**
   - Click **"Add SMTP Configuration"** again
   - Fill in:
     ```
     Name: Hostinger - Careers
     Host: smtp.hostinger.com
     Port: 465
     Secure: ✓ (checked)
     Username: careers@wilderbots.com
     Password: [your careers password]
     From Name: Careers Team
     From Address: careers@wilderbots.com
     
     IMAP Host: imap.hostinger.com
     IMAP Port: 993
     IMAP Secure: ✓ (checked)
     IMAP Username: careers@wilderbots.com
     IMAP Password: [your careers password]
     
     Set as Default: (leave unchecked)
     Active: ✓ (checked)
     ```
   - Click **"Test SMTP"** and **"Test IMAP"**
   - Click **"Save Configuration"**

## Verify Setup

Check if everything is configured correctly:

```bash
node scripts/check-email-setup.js
```

## Hostinger Server Settings

Both emails use the same Hostinger servers:

- **SMTP (Outgoing):** `smtp.hostinger.com:465` (SSL)
- **IMAP (Incoming):** `imap.hostinger.com:993` (SSL)

## Using the Emails

### Send Email
1. Go to **Email Management → Compose**
2. Select SMTP config (or use default)
3. Fill in recipient, subject, message
4. Click **Send Email**

### Receive Email
1. Go to **Email Management → Inbox**
2. Click **Fetch** to retrieve new emails
3. View and manage emails

## Troubleshooting

- **Passwords:** Make sure you're using the correct email account passwords
- **Test Connections:** Always test SMTP and IMAP before saving
- **Check Status:** Run `node scripts/check-email-setup.js` to verify



