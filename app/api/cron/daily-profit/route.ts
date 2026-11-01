import { NextResponse } from 'next/server';
import { accrueAllStakes, accrueUserStakes } from '@/lib/profit-engine';

function authorize(request: Request) {
    const secret = process.env.CRON_SECRET;
    if (!secret) return process.env.NODE_ENV !== 'production';
    const header = request.headers.get('authorization') || '';
    return header === `Bearer ${secret}`;
}

async function run(request: Request) {
    if (!authorize(request)) {
        return NextResponse.json({ success: false, error: 'Unauthorized.' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const uid = searchParams.get('uid');
    const result = uid ? await accrueUserStakes(uid) : await accrueAllStakes();
    return NextResponse.json({ success: true, ...result });
}

export async function GET(request: Request) {
    return run(request);
}

export async function POST(request: Request) {
    return run(request);
}
