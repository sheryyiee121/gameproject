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
        if (!depositId) {
            return NextResponse.json({ success: false, error: 'depositId is required.' }, { status: 400 });
        }

        const result = await runTransaction(db, async (tx) => {
            const depositRef = doc(db, 'depositRequests', depositId);
            const depositSnap = await tx.get(depositRef);
            if (!depositSnap.exists()) throw new Error('Deposit request not found.');
            const deposit = depositSnap.data();
            if (deposit.status !== 'approved') throw new Error('Only approved deposits can be reversed.');
            if (deposit.reversed) throw new Error('Deposit already reversed.');

            const uid = deposit.uid;
            const amount = Number(deposit.amount || 0);
            const coin = String(deposit.coin || 'USDT');
            const tokenKey = coin.toLowerCase();
            const userRef = doc(db, 'users', uid);
            const reverseTxRef = doc(db, 'users', uid, 'transactions', `deposit_reversed_${depositId}`);
            const creditTxRef = doc(db, 'users', uid, 'transactions', `deposit_approved_${depositId}`);
            const [reverseSnap, creditSnap] = await Promise.all([tx.get(reverseTxRef), tx.get(creditTxRef)]);
            if (reverseSnap.exists()) throw new Error('Deposit already reversed.');

            tx.update(depositRef, {
                status: 'reversed',
                reversed: true,
                reversedAt: new Date().toISOString(),
            });
            tx.update(userRef, {
                [`balances.${tokenKey}`]: increment(-amount),
            });
            if (creditSnap.exists()) {
                tx.update(creditTxRef, { reversed: true });
            }
            tx.set(reverseTxRef, {
                type: 'deposit_reversed',
                amount,
                token: coin,
                depositRequestId: depositId,
                note: 'Approved deposit reversed by Admin',
                timestamp: new Date().toISOString(),
            });

            return { uid, coin };
        });

        if (isUsdtToken(result.coin)) {
            const qualifyingDepositUsdt = await computeQualifyingDepositUsdt(result.uid);
            const level = getUserLevel(qualifyingDepositUsdt);
            await runTransaction(db, async (tx) => {
                tx.update(doc(db, 'users', result.uid), {
                    qualifyingDepositUsdt,
                    tier: level.name,
                });
            });
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message || 'Reverse failed.' }, { status: 400 });
    }
}
