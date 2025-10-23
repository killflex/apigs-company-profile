# Contact Form & Inquiries Management System

## Overview

This system provides a complete end-to-end solution for handling contact form submissions with email notifications and an admin panel for managing inquiries.

## Features

### 🌐 Contact Form (Frontend)

- **Location**: `/contact` page
- **File**: `components/contact-form.tsx`
- User-friendly form with validation
- Fields: Name, Email, Phone, Company, Position, Inquiry Type, Subject, Message, Budget, Timeline
- Real-time form submission with loading states
- Success/error notifications
- Auto-clear form after successful submission
- Indonesian language support

### 📧 Email Notifications (Resend)

- **Admin Notification**: Professional HTML email sent to admin with all inquiry details
- **User Confirmation**: Branded confirmation email sent to the user with inquiry summary
- Detailed inquiry information including reference ID
- Automatic fallback if email delivery fails (doesn't break form submission)

### 💾 Database Integration (Neon PostgreSQL)

- All inquiries saved to `inquiries` table
- Tracks: status, priority, follow-up dates, notes
- Full audit trail with `createdAt` and `updatedAt` timestamps
- Source tracking (website, referral, etc.)

### 👨‍💼 Admin Panel

- **Location**: `/admin/inquiries`
- **File**: `app/admin/inquiries/page.tsx`
- Real-time inquiry list with auto-refresh
- Advanced filtering: Search, Status, Priority, Type
- Inquiry cards with detailed information
- Actions: View details, Update status, Delete
- Visual status indicators and priority badges
- Responsive design

## Architecture

### API Endpoints

#### 1. POST `/api/contact`

**Purpose**: Submit a new contact form inquiry

**Request Body**:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "company": "ACME Corp",
  "position": "CTO",
  "inquiryType": "project",
  "subject": "New Project Inquiry",
  "message": "We need help with...",
  "budget": "$50,000 - $100,000",
  "timeline": "3-6 months"
}
```

**Response**:

```json
{
  "success": true,
  "message": "Thank you for your inquiry! We will get back to you soon.",
  "inquiryId": "abc123..."
}
```

**Features**:

- Zod validation for all fields
- Saves to database
- Sends admin notification email
- Sends user confirmation email
- Comprehensive error handling
- Detailed logging for debugging

#### 2. GET `/api/admin/inquiries`

**Purpose**: Fetch all inquiries with filtering

**Query Parameters**:

- `search`: Search in name, email, company, subject
- `status`: Filter by status (new, contacted, qualified, converted, closed)
- `priority`: Filter by priority (low, medium, high, urgent)
- `type`: Filter by inquiry type (general, project, partnership, support)
- `sortBy`: Sort field (createdAt, priority, status)
- `sortOrder`: Sort order (asc, desc)

**Response**:

```json
{
  "success": true,
  "inquiries": [...],
  "count": 15
}
```

#### 3. PATCH `/api/admin/inquiries?id={inquiryId}`

**Purpose**: Update inquiry status, priority, notes, or follow-up date

**Request Body**:

```json
{
  "status": "contacted",
  "priority": "high",
  "notes": "Called customer, will follow up next week",
  "followUpDate": "2024-10-15T10:00:00Z"
}
```

#### 4. DELETE `/api/admin/inquiries?id={inquiryId}`

**Purpose**: Delete an inquiry

**Response**:

```json
{
  "success": true,
  "message": "Inquiry deleted successfully"
}
```

## Database Schema

### `inquiries` Table

```typescript
{
  id: string (CUID primary key)
  name: string (required)
  email: string (required)
  phone: string (optional)
  company: string (optional)
  position: string (optional)
  subject: string (required)
  message: string (required)
  inquiryType: enum ['general', 'project', 'partnership', 'support']
  budget: string (optional)
  timeline: string (optional)
  source: string (e.g., 'website', 'referral')
  status: enum ['new', 'contacted', 'qualified', 'converted', 'closed']
  priority: enum ['low', 'medium', 'high', 'urgent']
  followUpDate: date (optional)
  notes: text (optional)
  createdAt: timestamp
  updatedAt: timestamp
}
```

## Setup Instructions

### 1. Install Dependencies

Already installed in the project:

- `resend` - Email service SDK
- `drizzle-orm` - Database ORM
- `@neondatabase/serverless` - Neon PostgreSQL driver
- `zod` - Data validation

### 2. Environment Variables

Add to your `.env` file:

```bash
# Resend Email Service
RESEND_API_KEY="re_your_api_key_here"
ADMIN_EMAIL="admin@yourdomain.com"

# Database (already configured)
DATABASE_URL="your_neon_database_url"
```

### 3. Get Resend API Key

1. Sign up at [resend.com](https://resend.com)
2. Verify your domain (recommended) or use the sandbox
3. Generate an API key from the dashboard
4. Add to `.env` file

### 4. Configure Email Sender

In `app/api/contact/route.ts`, update the `from` field:

**Before** (using sandbox):

```typescript
from: "APIGS Contact Form <onboarding@resend.dev>";
```

**After** (using your verified domain):

```typescript
from: "APIGS Contact Form <noreply@yourdomain.com>";
```

### 5. Database Migration

The `inquiries` table schema is already in `lib/db/schema.ts`. To push to database:

```bash
pnpm db:push
```

## Usage Examples

### Frontend - Submit Contact Form

```typescript
// components/contact-form.tsx
const response = await fetch("/api/contact", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(formData),
});

const data = await response.json();
if (data.success) {
  // Show success message
  // Clear form
}
```

### Admin - Fetch Inquiries with Filters

```typescript
const params = new URLSearchParams({
  search: "john",
  status: "new",
  priority: "high",
  type: "project",
});

const response = await fetch(`/api/admin/inquiries?${params}`);
const data = await response.json();
```

### Admin - Update Inquiry Status

```typescript
await fetch(`/api/admin/inquiries?id=${inquiryId}`, {
  method: "PATCH",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    status: "contacted",
    notes: "Initial call completed",
  }),
});
```

## Email Templates

### Admin Notification Email

- Professional blue header with inquiry type badge
- All form fields displayed in organized sections
- Clickable email and phone links
- Inquiry ID and timestamp
- Responsive HTML design

### User Confirmation Email

- Branded header with checkmark
- Inquiry summary with reference ID
- "What happens next" section
- Business hours and contact information
- Professional footer

## Status Workflow

```
new → contacted → qualified → converted → closed
                      ↓
                   (lost/rejected)
```

**Status Descriptions**:

- `new` - Fresh inquiry, not yet contacted
- `contacted` - Initial contact made, awaiting response
- `qualified` - Qualified lead, discussions ongoing
- `converted` - Successfully converted to project/client
- `closed` - Inquiry closed (won or lost)

## Priority Levels

- `urgent` - Requires immediate attention (red badge)
- `high` - Important, respond within 24 hours (orange badge)
- `medium` - Standard priority (yellow badge)
- `low` - Can be handled when convenient (green badge)

## Best Practices

### Security

- ✅ Input validation with Zod
- ✅ SQL injection protection via Drizzle ORM
- ✅ Rate limiting recommended for production
- ✅ Admin routes should be protected by authentication

### Performance

- ✅ Server-side filtering for large datasets
- ✅ Indexed database queries
- ✅ Efficient SQL queries with selective field fetching
- ✅ Debounced search inputs

### User Experience

- ✅ Clear error messages
- ✅ Loading states during submission
- ✅ Success confirmations
- ✅ Auto-clear form after success
- ✅ Responsive design for mobile

### Error Handling

- ✅ Graceful email failures (don't break form submission)
- ✅ Comprehensive logging for debugging
- ✅ User-friendly error messages
- ✅ Server-side validation

## Testing

### Test Contact Form Submission

1. Go to `/contact` page
2. Fill in all required fields
3. Submit form
4. Check:
   - Database for new inquiry record
   - Admin email inbox for notification
   - User email inbox for confirmation
   - Browser console for success message

### Test Admin Panel

1. Go to `/admin/inquiries`
2. Verify inquiries are loading from database
3. Test search functionality
4. Test status/priority/type filters
5. Test refresh button
6. Test delete functionality

## Troubleshooting

### Emails Not Sending

- Verify `RESEND_API_KEY` is set correctly
- Check Resend dashboard for API usage and errors
- Verify domain is configured (if not using sandbox)
- Check `ADMIN_EMAIL` environment variable
- Review server logs for email errors

### Form Submission Failing

- Check browser console for JavaScript errors
- Verify API route `/api/contact` is accessible
- Check Neon database connection
- Review validation errors in response
- Check server logs

### Admin Panel Not Loading

- Verify `/api/admin/inquiries` endpoint is working
- Check browser network tab for failed requests
- Verify database connection
- Check Clerk authentication if implemented

## Future Enhancements

### Potential Features

- [ ] Email templates editor in admin panel
- [ ] Automated follow-up reminders
- [ ] Inquiry assignment to team members
- [ ] Bulk actions (bulk status update, export)
- [ ] Analytics dashboard (inquiry sources, conversion rates)
- [ ] File attachments in contact form
- [ ] Webhook integrations (Slack, CRM)
- [ ] Email reply threading
- [ ] Custom fields per inquiry type
- [ ] API rate limiting

## File Structure

```
app/
├── api/
│   ├── contact/
│   │   └── route.ts          # Contact form submission API
│   └── admin/
│       └── inquiries/
│           └── route.ts      # Inquiries management API
├── contact/
│   └── page.tsx              # Contact page
└── admin/
    └── inquiries/
        └── page.tsx          # Admin inquiries panel

components/
└── contact-form.tsx          # Contact form component

lib/
├── db/
│   └── schema.ts            # Database schema (inquiries table)
└── data/
    └── queries.ts           # Centralized data fetching
```

## Support

For issues or questions:

1. Check server logs for detailed error messages
2. Review Resend dashboard for email delivery status
3. Verify environment variables are set correctly
4. Check Neon database connection and table schema

## License

This implementation is part of the APIGS Company Profile project.

---

**Last Updated**: 2024
**Version**: 1.0.0
**Status**: ✅ Production Ready
