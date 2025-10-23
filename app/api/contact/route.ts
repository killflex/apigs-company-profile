import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { inquiries } from "@/lib/db/schema";
import { Resend } from "resend";
import { z } from "zod";

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// Contact form validation schema
const contactSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional().or(z.literal("")),
  company: z.string().optional().or(z.literal("")),
  inquiryType: z.enum(["general", "project", "partnership", "support"]),
  subject: z.string().min(1, "Subject is required").max(200),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(2000),
});

// GET /api/contact - Test endpoint
export async function GET() {
  return NextResponse.json(
    {
      message: "Hello World! 👋",
      status: "Contact API is running",
      endpoints: {
        GET: "Test endpoint (you are here)",
        POST: "Submit contact form",
      },
      timestamp: new Date().toISOString(),
    },
    { status: 200 }
  );
}

// POST /api/contact
export async function POST(request: Request) {
  try {
    const data = await request.json();

    console.log("📥 Received form data:", JSON.stringify(data, null, 2));

    // Validate the form data
    const validationResult = contactSchema.safeParse(data);

    if (!validationResult.success) {
      console.error("❌ Validation failed:", validationResult.error.issues);
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validationResult.error.issues,
        },
        { status: 400 }
      );
    }

    const validatedData = validationResult.data;

    // Save to database
    const newInquiry = await db
      .insert(inquiries)
      .values({
        inquiryType: validatedData.inquiryType,
        name: validatedData.name,
        email: validatedData.email,
        phone: validatedData.phone || null,
        company: validatedData.company || null,
        subject: validatedData.subject,
        message: validatedData.message,
        status: "new",
        priority: "medium",
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    console.log("✅ Inquiry saved to database:", newInquiry[0].id);

    // Check if Resend API key is configured
    if (!process.env.RESEND_API_KEY) {
      console.warn("⚠️ RESEND_API_KEY not configured - skipping email sending");
      return NextResponse.json(
        {
          success: true,
          message: "Inquiry saved successfully (email notifications disabled)",
          inquiryId: newInquiry[0].id,
        },
        { status: 201 }
      );
    }

    // Send email notification to admin
    try {
      console.log(
        "📧 Attempting to send admin email to:",
        process.env.ADMIN_EMAIL
      );

      const adminEmail = await resend.emails.send({
        from: "APIGS Contact Form <onboarding@resend.dev>",
        to: process.env.ADMIN_EMAIL || "ferryhasanbackup@gmail.com",
        subject: `New ${validatedData.inquiryType.toUpperCase()} Inquiry: ${
          validatedData.subject
        }`,
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background-color: #2563eb; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
                .content { background-color: #f9fafb; padding: 20px; }
                .field { margin-bottom: 15px; padding: 10px; background-color: white; border-radius: 4px; }
                .label { font-weight: bold; color: #4b5563; font-size: 12px; text-transform: uppercase; }
                .value { color: #1f2937; margin-top: 5px; }
                .badge { display: inline-block; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: bold; }
                .badge-${
                  validatedData.inquiryType
                } { background-color: #dbeafe; color: #1e40af; }
                .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 12px; text-align: center; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>🔔 New Contact Form Submission</h1>
                  <span class="badge badge-${
                    validatedData.inquiryType
                  }">${validatedData.inquiryType.toUpperCase()}</span>
                </div>
                <div class="content">
                  <div class="field">
                    <div class="label">Name</div>
                    <div class="value">${validatedData.name}</div>
                  </div>
                  <div class="field">
                    <div class="label">Email</div>
                    <div class="value"><a href="mailto:${
                      validatedData.email
                    }">${validatedData.email}</a></div>
                  </div>
                  ${
                    validatedData.phone
                      ? `<div class="field"><div class="label">Phone</div><div class="value"><a href="tel:${validatedData.phone}">${validatedData.phone}</a></div></div>`
                      : ""
                  }
                  ${
                    validatedData.company
                      ? `<div class="field"><div class="label">Company</div><div class="value">${validatedData.company}</div></div>`
                      : ""
                  }
                  <div class="field">
                    <div class="label">Subject</div>
                    <div class="value"><strong>${
                      validatedData.subject
                    }</strong></div>
                  </div>
                  <div class="field">
                    <div class="label">Message</div>
                    <div class="value">${validatedData.message.replace(
                      /\n/g,
                      "<br>"
                    )}</div>
                  </div>
                </div>
                <div class="footer">
                  <p>📧 This inquiry was submitted through the APIGS website contact form.</p>
                  <p>🆔 Inquiry ID: <strong>${newInquiry[0].id}</strong></p>
                  <p>🕐 Submitted: ${new Date().toLocaleString()}</p>
                </div>
              </div>
            </body>
          </html>
        `,
      });

      console.log("✅ Admin notification email sent:", adminEmail.data?.id);
      console.log("📧 Email details:", JSON.stringify(adminEmail, null, 2));
    } catch (emailError) {
      console.error("❌ Failed to send admin email:", emailError);
      console.error("📧 Email error details:", {
        message:
          emailError instanceof Error ? emailError.message : "Unknown error",
        statusCode:
          typeof emailError === "object" &&
          emailError !== null &&
          "statusCode" in emailError
            ? emailError.statusCode
            : undefined,
        name: emailError instanceof Error ? emailError.name : "Unknown",
      });
      // Don't fail the request if email fails
    }

    // Send confirmation email to user
    try {
      console.log(
        "📧 Attempting to send user confirmation to:",
        validatedData.email
      );

      const userEmail = await resend.emails.send({
        from: "APIGS <onboarding@resend.dev>",
        to: validatedData.email,
        subject: "We received your inquiry - APIGS",
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background-color: #2563eb; color: white; padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0; }
                .content { padding: 30px 20px; background-color: #ffffff; }
                .summary { background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0; }
                .summary-item { margin-bottom: 10px; }
                .summary-label { font-weight: bold; color: #4b5563; }
                .footer { margin-top: 20px; padding: 20px; background-color: #f3f4f6; border-radius: 0 0 8px 8px; color: #6b7280; font-size: 13px; text-align: center; }
                .button { display: inline-block; padding: 12px 24px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>✅ Thank You for Contacting APIGS</h1>
                </div>
                <div class="content">
                  <p>Dear <strong>${validatedData.name}</strong>,</p>
                  <p>Thank you for reaching out to us! We have successfully received your inquiry and our team will review it shortly.</p>
                  
                  <div class="summary">
                    <h3 style="margin-top: 0;">📋 Your Inquiry Summary:</h3>
                    <div class="summary-item">
                      <span class="summary-label">Type:</span> ${
                        validatedData.inquiryType.charAt(0).toUpperCase() +
                        validatedData.inquiryType.slice(1)
                      }
                    </div>
                    <div class="summary-item">
                      <span class="summary-label">Subject:</span> ${
                        validatedData.subject
                      }
                    </div>
                    ${
                      validatedData.company
                        ? `<div class="summary-item"><span class="summary-label">Company:</span> ${validatedData.company}</div>`
                        : ""
                    }
                    <div class="summary-item">
                      <span class="summary-label">Reference ID:</span> ${
                        newInquiry[0].id
                      }
                    </div>
                  </div>

                  <p><strong>⏰ What happens next?</strong></p>
                  <ul>
                    <li>Our team will review your inquiry within 24-48 hours during business days</li>
                    <li>You'll receive a personalized response from our team</li>
                    <li>We may reach out for additional information if needed</li>
                  </ul>

                  <p>If you need immediate assistance, please don't hesitate to call us during business hours or visit our office.</p>

                  <p style="margin-top: 30px;">Best regards,<br><strong>The APIGS Team</strong></p>
                </div>
                <div class="footer">
                  <p>📧 This is an automated confirmation email. Please do not reply to this message.</p>
                  <p>💼 Need immediate help? Contact us at: ${
                    process.env.ADMIN_EMAIL || "admin@apigs.com"
                  }</p>
                </div>
              </div>
            </body>
          </html>
        `,
      });

      console.log("✅ User confirmation email sent:", userEmail.data?.id);
      console.log("📧 User email details:", JSON.stringify(userEmail, null, 2));
    } catch (emailError) {
      console.error("❌ Failed to send user confirmation email:", emailError);
      console.error("📧 User email error details:", {
        message:
          emailError instanceof Error ? emailError.message : "Unknown error",
        statusCode:
          typeof emailError === "object" &&
          emailError !== null &&
          "statusCode" in emailError
            ? emailError.statusCode
            : undefined,
        name: emailError instanceof Error ? emailError.name : "Unknown",
      });
      // Don't fail the request if email fails
    }

    return NextResponse.json(
      {
        success: true,
        message: "Thank you for your inquiry! We will get back to you soon.",
        inquiryId: newInquiry[0].id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ Error processing contact form:", error);

    return NextResponse.json(
      {
        error: "Failed to submit inquiry. Please try again.",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
