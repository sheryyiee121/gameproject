import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
    try {
        let body: any = {};
        try {
            body = await request.json();
        } catch (e) {
            return NextResponse.json({ success: false, error: "Invalid JSON" }, { status: 400 });
        }

        const { email } = body;

        if (!email) {
            return NextResponse.json({ success: false, error: "Email is required" }, { status: 400 });
        }

        // Connect to database in production to save this OTP mapping to the email.
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

        const htmlTemplate = `
      <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto; color: #333;">
        <h2 style="color: #0ea5e9;">Nexmine Verification</h2>
        <p>Hello,</p>
        <p>You requested a verification code to sign up or verify your account.</p>
        <div style="margin: 20px 0; padding: 15px; background: #f1f5f9; border-radius: 8px; text-align: center;">
          <span style="letter-spacing: 5px; font-size: 28px; font-weight: bold; color: #0ea5e9;">${otpCode}</span>
        </div>
        <p style="font-size: 14px; color: #666;">This code is valid for 10 minutes. If you did not request this, please ignore this email.</p>
        <p>Best regards,<br/>The Nexmine Team</p>
      </div>
    `;

        const data = await resend.emails.send({
            from: 'Nexmine <info@nexmine.net>',
            to: email,
            subject: '🔒 Your Nexmine Verification Code',
            html: htmlTemplate
        });

        return NextResponse.json({ success: true, message: "OTP sent successfully!", data });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
