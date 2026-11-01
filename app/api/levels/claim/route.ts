import { NextResponse } from 'next/server';
import { doc, increment, runTransaction } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { LEVELS } from '@/lib/levels';
import { computeQualifyingDepositUsdt } from '@/lib/qualifying-deposits';

const TIERS: string[] = LEVELS.map((l) => l.name);

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const uid = String(body?.uid || '');
        const tierName = String(body?.tierName || '');
        const level = LEVELS.find((l) => l.name === tierName);
        if (!uid || !level) {
            return NextResponse.json({ success: false, error: 'Invalid claim request.' }, { status: 400 });
        }
        if (level.bonus <= 0) {
            return NextResponse.json({ success: false, error: 'This level has no bonus to claim.' }, { status: 400 });
        }

        const qualifyingDepositUsdt = await computeQualifyingDepositUsdt(uid);
        if (qualifyingDepositUsdt < level.minDeposit) {
            return NextResponse.json({
                success: false,
                error: `Deposit at least ${level.minDeposit} USDT to unlock ${tierName}.`,
                qualifyingDepositUsdt,
            }, { status: 400 });
        }

        const tierKey = tierName.toLowerCase();
        await runTransaction(db, async (tx) => {
            const userRef = doc(db, 'users', uid);
            const bonusRef = doc(db, 'users', uid, 'transactions', `tier_bonus_${tierKey}`);
            const [userSnap, bonusSnap] = await Promise.all([tx.get(userRef), tx.get(bonusRef)]);
            if (!userSnap.exists()) throw new Error('User not found.');
            if (bonusSnap.exists() || userSnap.data()?.claimedBonuses?.[tierKey]) {
                throw new Error('This bonus was already claimed.');
            }

            const currentTierIndex = TIERS.indexOf(userSnap.data()?.tier || 'Basic');
            const newTierIndex = TIERS.indexOf(tierName);
            const updates: Record<string, unknown> = {
                [`claimedBonuses.${tierKey}`]: true,
                'balances.usdt': increment(level.bonus),
                totalProfit: increment(level.bonus),
                todayProfit: increment(level.bonus),
                qualifyingDepositUsdt,
            };
            if (newTierIndex > currentTierIndex) updates.tier = tierName;
            tx.update(userRef, updates);
            tx.set(bonusRef, {
                type: 'tier_bonus',
                amount: level.bonus,
                token: 'USDT',
                note: `Claimed ${tierName} tier bonus`,
                timestamp: new Date().toISOString(),
            });
        });

        return NextResponse.json({ success: true, qualifyingDepositUsdt, bonus: level.bonus });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message || 'Claim failed.' }, { status: 400 });
    }
}
