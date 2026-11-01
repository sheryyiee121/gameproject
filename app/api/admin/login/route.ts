import { NextResponse } from 'next/server';
import { adminCookieHeader, createAdminSessionToken, verifyAdminPassword } from '@/lib/admin-auth';

export const runtime = 'nodejs';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const password = String(body?.password || '');
        if (!password) {
            return NextResponse.json({ success: false, error: 'Password is required.' }, { status: 400 });
        }

        const valid = await verifyAdminPassword(password);
        if (!valid) {
            return NextResponse.json({ success: false, error: 'Invalid admin password.' }, { status: 401 });
        }

        const token = createAdminSessionToken();
        const response = NextResponse.json({ success: true });
        response.headers.set('Set-Cookie', adminCookieHeader(token));
        return response;
    } catch {
        return NextResponse.json({ success: false, error: 'Login failed.' }, { status: 500 });
    }
}
