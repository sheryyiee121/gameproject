import { NextResponse } from 'next/server';
import { getUserLevel, getNextLevel, LEVELS } from '@/lib/levels';
import { syncUserLevelFromDeposits } from '@/lib/qualifying-deposits';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const uid = searchParams.get('uid') || '';
        if (!uid) return NextResponse.json({ success: false, error: 'User is required.' }, { status: 400 });

        const { qualifyingDepositUsdt, level } = await syncUserLevelFromDeposits(uid);
        const current = getUserLevel(qualifyingDepositUsdt);
        const next = getNextLevel(qualifyingDepositUsdt);

        return NextResponse.json({
            success: true,
            qualifyingDepositUsdt,
            level,
            nextLevel: next ? { name: next.name, minDeposit: next.minDeposit } : null,
            remainingToNext: next ? Math.max(0, next.minDeposit - qualifyingDepositUsdt) : 0,
            levels: LEVELS.map((lvl) => ({
                ...lvl,
                unlocked: qualifyingDepositUsdt >= lvl.minDeposit,
                progress: Math.min(100, next && lvl.name === current.name
                    ? ((qualifyingDepositUsdt - lvl.minDeposit) / (next.minDeposit - lvl.minDeposit)) * 100
                    : qualifyingDepositUsdt >= lvl.minDeposit ? 100 : (qualifyingDepositUsdt / Math.max(lvl.minDeposit, 1)) * 100),
            })),
        });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message || 'Unable to load level status.' }, { status: 500 });
    }
}
