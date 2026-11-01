import { NextResponse } from 'next/server';
import { accrueUserStakes } from '@/lib/profit-engine';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const uid = String(body?.uid || '');
        if (!uid) return NextResponse.json({ success: false, error: 'User is required.' }, { status: 400 });
        const result = await accrueUserStakes(uid);
        return NextResponse.json({ success: true, ...result });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message || 'Accrual failed.' }, { status: 500 });
    }
}
