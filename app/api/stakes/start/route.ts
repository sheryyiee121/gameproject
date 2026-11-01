import { NextResponse } from 'next/server';
import {
    collection,
    doc,
    increment,
    runTransaction,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { DAILY_PROFIT_RATE, getStakingPlan, stakeMaturityIso } from '@/lib/staking';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const uid = String(body?.uid || '');
        const planId = String(body?.planId || '');
        const amount = Number(body?.amount);
        const clientRequestId = String(body?.requestId || '');

        if (!uid) return NextResponse.json({ success: false, error: 'User is required.' }, { status: 400 });
        const plan = getStakingPlan(planId);
        if (!plan) return NextResponse.json({ success: false, error: 'Invalid investment plan.' }, { status: 400 });
        if (!Number.isFinite(amount) || amount < plan.minAmount) {
            return NextResponse.json({ success: false, error: `Minimum amount is ${plan.minAmount} USDT.` }, { status: 400 });
        }

        const result = await runTransaction(db, async (tx) => {
            const userRef = doc(db, 'users', uid);
            const userSnap = await tx.get(userRef);
            if (!userSnap.exists()) throw new Error('User not found.');
            const user = userSnap.data();
            if (user.isBlocked) throw new Error('Account is blocked.');

            if (clientRequestId) {
                const existingRef = doc(db, 'users', uid, 'transactions', `stake_start_${clientRequestId}`);
                const existing = await tx.get(existingRef);
                if (existing.exists()) {
                    return { duplicate: true, stakeId: existing.data()?.stakeId };
                }
            }

            const available = Number(user.balances?.usdt || 0);
            if (available < amount) {
                throw new Error(`Insufficient balance. Available: ${available.toFixed(4)} USDT`);
            }

            const startDate = new Date().toISOString();
            const maturityDate = stakeMaturityIso(startDate, plan.durationDays);
            const dailyProfit = Number((amount * plan.dailyRate).toFixed(8));
            const stakeRef = doc(collection(db, 'users', uid, 'stakes'));
            const txRef = clientRequestId
                ? doc(db, 'users', uid, 'transactions', `stake_start_${clientRequestId}`)
                : doc(collection(db, 'users', uid, 'transactions'));

            tx.set(stakeRef, {
                planId: plan.id,
                planName: plan.name,
                amount,
                deductedFromAvailable: amount,
                durationDays: plan.durationDays,
                dailyRate: plan.dailyRate,
                dailyProfit,
                startDate,
                maturityDate,
                status: 'active',
                totalProfitEarned: 0,
                lastProfitDate: null,
                profitDaysPaid: 0,
                principalReturned: false,
                createdAt: startDate,
            });

            const newStaked = Number(user.stakedAmount || 0) + amount;
            tx.update(userRef, {
                'balances.usdt': increment(-amount),
                stakedAmount: increment(amount),
                miningRate: Number((newStaked * DAILY_PROFIT_RATE).toFixed(8)),
            });

            tx.set(txRef, {
                type: 'stake',
                amount,
                token: 'USDT',
                stakeId: stakeRef.id,
                planId: plan.id,
                planName: plan.name,
                durationDays: plan.durationDays,
                note: `Started ${plan.name} — ${amount} USDT deducted from available balance`,
                timestamp: startDate,
            });

            return { duplicate: false, stakeId: stakeRef.id, dailyProfit, maturityDate, startDate };
        });

        if (result.duplicate) {
            return NextResponse.json({ success: true, duplicate: true, stakeId: result.stakeId });
        }

        return NextResponse.json({
            success: true,
            stakeId: result.stakeId,
            dailyProfit: result.dailyProfit,
            maturityDate: result.maturityDate,
            startDate: result.startDate,
        });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message || 'Unable to start stake.' }, { status: 400 });
    }
}
