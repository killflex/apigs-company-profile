# 📧 Resend Email Setup & Troubleshooting Guide

## 🚨 Important: Resend Sandbox Mode Limitations

By default, Resend operates in **SANDBOX MODE** with these restrictions:

### Sandbox Mode Restrictions:

- ✅ Can send emails from `onboarding@resend.dev`
- ❌ Can ONLY send to **verified email addresses**
- ❌ Cannot send to any email address

### How to Verify Your Email in Resend:

1. Go to [Resend Dashboard](https://resend.com/emails)
2. Click on **"Emails"** in the sidebar
3. Click **"Add Email"** or **"Verify Email"**
4. Enter your email: `ferryhasanbackup@gmail.com`
5. Check your inbox for verification email
6. Click the verification link
7. ✅ Now you can receive test emails!

## 🎯 Current Configuration

Your `.env.local` file:

```bash
RESEND_API_KEY="re_P51RrHLs_3z2oTipPWWo1HRhBdojFPNhz"
ADMIN_EMAIL="ferryhasanbackup@gmail.com"
```

### Steps to Make Emails Work:

#### Option 1: Verify Your Email (Quick - Recommended for Testing)

1. Go to [Resend Dashboard](https://resend.com/emails)
2. Navigate to **Settings → Emails**
3. Click **"Add email address"**
4. Add: `ferryhasanbackup@gmail.com`
5. Check your Gmail inbox
6. Click verification link
7. ✅ Done! Now test the contact form

#### Option 2: Add Your Own Domain (Production - Recommended)

1. Go to [Resend Dashboard](https://resend.com/domains)
2. Click **"Add Domain"**
3. Enter your domain (e.g., `apigs.com`)
4. Add DNS records Resend provides:
   - SPF record
   - DKIM records
   - DMARC record
5. Wait for DNS propagation (24-48 hours)
6. Update `from` in `app/api/contact/route.ts`:
   ```typescript
   from: "APIGS <noreply@apigs.com>";
   ```

## 🔍 How to Check if Emails are Working

### 1. Check Server Logs

After submitting the contact form, check your terminal for these logs:

**✅ Success:**

```
✅ Inquiry saved to database: cuid_xyz123
📧 Attempting to send admin email to: ferryhasanbackup@gmail.com
✅ Admin notification email sent: abc-123-xyz
📧 Attempting to send user confirmation to: user@example.com
✅ User confirmation email sent: def-456-abc
```

**❌ Error (Email Not Verified):**

```
❌ Failed to send admin email: [Error details]
📧 Email error details: {
  message: "Email address not verified",
  statusCode: 403
}
```

### 2. Check Resend Dashboard

1. Go to [Resend Dashboard](https://resend.com/emails)
2. Click **"Emails"** in sidebar
3. See list of sent emails
4. Check delivery status

### 3. Check Database

```bash
pnpm db:studio
```

- Open `inquiries` table
- Verify the submission is saved
- Even if email fails, data is saved!

## 🐛 Common Issues & Solutions

### Issue 1: "Email address not verified"

**Solution:** Verify your email address in Resend dashboard (see Option 1 above)

### Issue 2: "Invalid API key"

**Solution:**

- Check `.env.local` has correct `RESEND_API_KEY`
- Restart dev server: `pnpm dev`

### Issue 3: "Emails not arriving"

**Solutions:**

1. Check spam/junk folder
2. Verify email address in Resend
3. Check Resend dashboard for delivery status
4. Check server logs for errors

### Issue 4: "Rate limit exceeded"

**Solution:**

- Free plan: 100 emails/day
- Wait 24 hours or upgrade plan
- Check Resend dashboard usage

## 📊 Email Sending Flow

```mermaid
User submits form
    ↓
Save to Database ✅
    ↓
Check RESEND_API_KEY?
    ↓ Yes
Send Admin Email
    ↓ Success?
    ├─ Yes → ✅ Admin notified
    └─ No → ❌ Log error (form still succeeds)
    ↓
Send User Confirmation
    ↓ Success?
    ├─ Yes → ✅ User notified
    └─ No → ❌ Log error (form still succeeds)
    ↓
Return Success Response ✅
```

**Important:** Form submission succeeds even if emails fail!

## 🧪 Testing Checklist

- [ ] Verify email in Resend dashboard
- [ ] Check `RESEND_API_KEY` in `.env.local`
- [ ] Check `ADMIN_EMAIL` in `.env.local`
- [ ] Restart dev server
- [ ] Clear browser cache
- [ ] Submit test form
- [ ] Check terminal logs
- [ ] Check Resend dashboard
- [ ] Check email inbox (and spam)
- [ ] Check database with `pnpm db:studio`

## 📧 Email Templates

### Admin Email Includes:

- 🔔 Inquiry type badge
- 📝 All form fields
- 🆔 Unique inquiry ID
- 🕐 Submission timestamp
- 📧 Clickable email link
- ☎️ Clickable phone link

### User Confirmation Includes:

- ✅ Thank you message
- 📋 Inquiry summary
- 🆔 Reference ID
- ⏰ What happens next
- 💼 Contact information

## 🚀 Quick Commands

```bash
# Start dev server
pnpm dev

# Check database
pnpm db:studio

# Check logs in terminal
# Look for ✅ or ❌ emoji indicators

# Test API directly (optional)
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "subject": "Test",
    "message": "This is a test message",
    "inquiryType": "general"
  }'
```

## 🔐 Security Best Practices

- ✅ Never commit `.env.local` to git
- ✅ Use environment variables for API keys
- ✅ Validate all input with Zod
- ✅ Log errors without exposing sensitive data
- ✅ Rate limit API endpoint in production
- ✅ Use HTTPS in production

## 📞 Next Steps

1. **Right Now:** Verify your email in Resend dashboard
2. **Testing:** Submit test form and check logs
3. **Production:** Add your own domain to Resend
4. **Optional:** Add rate limiting with Upstash Redis
5. **Optional:** Add email templates with React Email components

## 🆘 Still Not Working?

If emails still don't work after verifying your email:

1. Check Resend status: https://status.resend.com
2. Check API key is valid in Resend dashboard
3. Check server logs for detailed error messages
4. Try sending a test email from Resend dashboard
5. Contact Resend support if needed

Remember: **The form still works and saves to database even if emails fail!** ✅

---

**Last Updated:** October 2025
**Resend Documentation:** https://resend.com/docs
**Support:** Check server logs for detailed error messages
