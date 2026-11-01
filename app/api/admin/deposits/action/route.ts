import { NextResponse } from 'next/server';
import { doc, increment, runTransaction } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { getUserLevel, isUsdtToken } from '@/lib/levels';
import { readAdminCookie, verifyAdminSessionToken } from '@/lib/admin-auth';
import { computeQualifyingDepositUsdt } from '@/lib/qualifying-deposits';

export async function POST(request: Request) {
    try {
        if (!verifyAdminSessionToken(readAdminCookie(request))) {
            return NextResponse.json({ success: false, error: 'Admin session required.' }, { status: 401 });
        }

        const body = await request.json();
        const depositId = String(body?.depositId || '');
        const action = body?.action === 'rejected' ? 'rejected' : body?.action === 'approved' ? 'approved' : null;
        if (!depositId || !action) {
            return NextResponse.json({ success: false, error: 'depositId and action are required.' }, { status: 400 });
        }

        const result = await runTransaction(db, async (tx) => {
            const depositRef = doc(db, 'depositRequests', depositId);
            const depositSnap = await tx.get(depositRef);
            if (!depositSnap.exists()) throw new Error('Deposit request not found.');
            const deposit = depositSnap.data();
            if (deposit.status !== 'processing') {
                throw new Error(`Deposit already ${deposit.status}.`);
            }

            const uid = deposit.uid;
            const amount = Number(deposit.amount || 0);
            const coin = String(deposit.coin || 'USDT');
            const tokenKey = coin.toLowerCase();
            const userRef = doc(db, 'users', uid);
            const creditTxRef = doc(db, 'users', uid, 'transactions', `deposit_approved_${depositId}`);
            const [userSnap, creditSnap] = action === 'approved'
                ? await Promise.all([tx.get(userRef), tx.get(creditTxRef)])
                : [null, null];

            if (action === 'approved') {
                if (!userSnap?.exists()) throw new Error('User not found.');
                if (creditSnap?.exists()) throw new Error('This deposit was already credited.');
            }

            tx.update(depositRef, {
                status: action,
                processedAt: new Date().toISOString(),
            });

            if (action !== 'approved') {
                return { amount: deposit.amount, coin: deposit.coin, uid: deposit.uid, credited: false };
            }

            tx.update(userRef, {
                [`balances.${tokenKey}`]: increment(amount),
            });
            tx.set(creditTxRef, {
                type: 'deposit_approved',
                amount,
                token: coin,
                depositRequestId: depositId,
                countsTowardLevel: isUsdtToken(coin),
                note: 'Deposit request approved by Admin',
                timestamp: new Date().toISOString(),
            });

            return { amount, coin, uid, credited: true };
        });

        if (result.credited && result.uid && isUsdtToken(result.coin)) {
            const qualifyingDepositUsdt = await computeQualifyingDepositUsdt(result.uid);
            const level = getUserLevel(qualifyingDepositUsdt);
            const userRef = doc(db, 'users', result.uid);
            await runTransaction(db, async (tx) => {
                const snap = await tx.get(userRef);
                if (!snap.exists()) return;
                tx.update(userRef, {
                    qualifyingDepositUsdt,
                    tier: level.name,
                });
            });
        }

        return NextResponse.json({ success: true, ...result });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message || 'Deposit action failed.' }, { status: 400 });
    }
}
