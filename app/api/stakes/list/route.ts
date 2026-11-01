import { NextResponse } from 'next/server';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { accrueUserStakes, serializeStake } from '@/lib/profit-engine';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const uid = searchParams.get('uid') || '';
        if (!uid) return NextResponse.json({ success: false, error: 'User is required.' }, { status: 400 });

        await accrueUserStakes(uid);

        const snap = await getDocs(collection(db, 'users', uid, 'stakes'));
        const stakes = snap.docs
            .map((item) => serializeStake(item.id, item.data()))
            .sort((a, b) => String(b.startDate).localeCompare(String(a.startDate)));
        const active = stakes.filter((s) => s.status === 'active');
        const completed = stakes.filter((s) => s.status === 'completed');
        const invested = active.reduce((sum, s) => sum + s.amount, 0);

        return NextResponse.json({
            success: true,
            stakes,
            active,
            completed,
            invested,
        });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message || 'Unable to load stakes.' }, { status: 500 });
    }
}
