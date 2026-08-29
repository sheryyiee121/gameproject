import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy_key_for_build');

export async function POST(request: Request) {
    try {
        // Parse the body if a JSON payload is provided, otherwise fallback to defaults
        let body: any = {};
        try {
            body = await request.json();
        } catch (e) {
            // no body provided, continue with defaults
        }

        const { to, subject, html } = body;

        const data = await resend.emails.send({
            // We are using the domain provided here. If the domain hasn't been verified 
            // in the Resend dashboard yet, this might need to change back to 'onboarding@resend.dev' temporarily.
            from: 'Nexmine <info@nexmine.net>',
            to: to || 'lumonstudios2026@gmail.com',
            subject: subject || 'Hello from Nexmine',
            html: html || '<p>Congrats on successfully integrating your <strong>Resend</strong> email API with your Next.js application!</p>'
        });

        return NextResponse.json({ success: true, data });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
