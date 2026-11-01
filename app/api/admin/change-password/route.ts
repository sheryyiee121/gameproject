import { NextResponse } from 'next/server';
import {
    readAdminCookie,
    setAdminPassword,
    validateNewPassword,
    verifyAdminPassword,
    verifyAdminSessionToken,
} from '@/lib/admin-auth';

export const runtime = 'nodejs';

export async function POST(request: Request) {
    try {
        const authorized = verifyAdminSessionToken(readAdminCookie(request));
        if (!authorized) {
            return NextResponse.json({ success: false, error: 'Admin session required.' }, { status: 401 });
        }

        const body = await request.json();
        const currentPassword = String(body?.currentPassword || '');
        const newPassword = String(body?.newPassword || '');
        const confirmPassword = String(body?.confirmPassword || '');

        const validationError = validateNewPassword(newPassword, confirmPassword);
        if (validationError) {
            return NextResponse.json({ success: false, error: validationError }, { status: 400 });
        }

        const currentOk = await verifyAdminPassword(currentPassword);
        if (!currentOk) {
            return NextResponse.json({ success: false, error: 'Current password is incorrect.' }, { status: 401 });
        }

        await setAdminPassword(newPassword);
        return NextResponse.json({ success: true, message: 'Password updated successfully.' });
    } catch {
        return NextResponse.json({ success: false, error: 'Unable to change password.' }, { status: 500 });
    }
}
