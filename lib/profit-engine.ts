import {
    collection,
    doc,
    getDocs,
    increment,
    runTransaction,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { addUtcDays, remainingStakeDays, utcDateStr } from '@/lib/staking';

type StakeRecord = {
    id: string;
    amount: number;
    dailyProfit: number;
    dailyRate: number;
    durationDays: number;
    startDate: string;
    maturityDate: string;
    status: string;
    totalProfitEarned: number;
    lastProfitDate?: string | null;
    principalReturned?: boolean;
    planName?: string;
};

function toIso(value: unknown) {
    if (!value) return new Date().toISOString();
    if (typeof value === 'string') return value;
    if (typeof value === 'object' && value !== null && 'toDate' in value && typeof (value as { toDate: () => Date }).toDate === 'function') {
        return (value as { toDate: () => Date }).toDate().toISOString();
    }
    return new Date().toISOString();
}

async function processStake(uid: string, stake: StakeRecord) {
    if (stake.status !== 'active') return { credited: 0, completed: false, skipped: true };

    const startIso = toIso(stake.startDate);
    const startDay = utcDateStr(new Date(startIso));
    const durationDays = Number(stake.durationDays || 0);
    const maturityDay = addUtcDays(startDay, durationDays);
    const today = utcDateStr();
    const dailyProfit = Number(stake.dailyProfit || (Number(stake.amount) * Number(stake.dailyRate || 0)));
    const amount = Number(stake.amount || 0);

    let cursor = stake.lastProfitDate || addUtcDays(startDay, -1);
    let credited = 0;
    let completed = false;

    while (true) {
        const nextDay = addUtcDays(cursor, 1);
        if (nextDay > today || nextDay >= maturityDay) break;
        if (dailyProfit <= 0) {
            cursor = nextDay;
            continue;
        }

        const profitTxId = `stake_profit_${stake.id}_${nextDay}`;
        await runTransaction(db, async (tx) => {
            const userRef = doc(db, 'users', uid);
            const stakeRef = doc(db, 'users', uid, 'stakes', stake.id);
            const profitRef = doc(db, 'users', uid, 'transactions', profitTxId);
            const [userSnap, stakeSnap, profitSnap] = await Promise.all([
                tx.get(userRef),
                tx.get(stakeRef),
                tx.get(profitRef),
            ]);
            if (!userSnap.exists() || !stakeSnap.exists() || profitSnap.exists()) return;

            const current = stakeSnap.data();
            if (current.status !== 'active') return;

            const lastReset = userSnap.data()?.profitDayKey;
            const todayProfitUpdate = lastReset === nextDay
                ? increment(dailyProfit)
                : dailyProfit;

            tx.set(profitRef, {
                type: 'staking_profit',
                amount: dailyProfit,
                token: 'USDT',
                stakeId: stake.id,
                planName: current.planName || stake.planName || '',
                profitDate: nextDay,
                note: `Daily staking profit for ${nextDay}`,
                timestamp: new Date().toISOString(),
            });
            tx.update(userRef, {
                'balances.usdt': increment(dailyProfit),
                totalProfit: increment(dailyProfit),
                todayProfit: todayProfitUpdate,
                profitDayKey: nextDay,
            });
            tx.update(stakeRef, {
                totalProfitEarned: increment(dailyProfit),
                lastProfitDate: nextDay,
                profitDaysPaid: increment(1),
            });
        });
        credited += dailyProfit;
        cursor = nextDay;
    }

    if (today >= maturityDay) {
        const principalTxId = `principal_return_${stake.id}`;
        await runTransaction(db, async (tx) => {
            const userRef = doc(db, 'users', uid);
            const stakeRef = doc(db, 'users', uid, 'stakes', stake.id);
            const principalRef = doc(db, 'users', uid, 'transactions', principalTxId);
            const [stakeSnap, principalSnap] = await Promise.all([
                tx.get(stakeRef),
                tx.get(principalRef),
            ]);
            if (!stakeSnap.exists()) return;
            const current = stakeSnap.data();
            if (current.status === 'completed' && current.principalReturned) return;

            if (!principalSnap.exists() && !current.principalReturned) {
                tx.set(principalRef, {
                    type: 'principal_return',
                    amount,
                    token: 'USDT',
                    stakeId: stake.id,
                    planName: current.planName || stake.planName || '',
                    note: 'Staking principal returned at maturity',
                    timestamp: new Date().toISOString(),
                });
                tx.update(userRef, {
                    'balances.usdt': increment(amount),
                    stakedAmount: increment(-amount),
                });
            }

            tx.update(stakeRef, {
                status: 'completed',
                principalReturned: true,
                completedAt: new Date().toISOString(),
            });
        });
        completed = true;
    }

    return { credited, completed, skipped: false };
}

export async function accrueUserStakes(uid: string) {
    const snap = await getDocs(collection(db, 'users', uid, 'stakes'));
    let credited = 0;
    let completed = 0;
    for (const item of snap.docs) {
        const data = item.data();
        const result = await processStake(uid, {
            id: item.id,
            amount: Number(data.amount || 0),
            dailyProfit: Number(data.dailyProfit || 0),
            dailyRate: Number(data.dailyRate || 0),
            durationDays: Number(data.durationDays || 0),
            startDate: toIso(data.startDate),
            maturityDate: toIso(data.maturityDate),
            status: data.status,
            totalProfitEarned: Number(data.totalProfitEarned || 0),
            lastProfitDate: data.lastProfitDate || null,
            principalReturned: !!data.principalReturned,
            planName: data.planName,
        });
        credited += result.credited;
        if (result.completed) completed += 1;
    }
    return { credited, completed, stakeCount: snap.size };
}

export async function accrueAllStakes() {
    const usersSnap = await getDocs(collection(db, 'users'));
    let usersProcessed = 0;
    let credited = 0;
    let completed = 0;
    for (const userDoc of usersSnap.docs) {
        const result = await accrueUserStakes(userDoc.id);
        usersProcessed += 1;
        credited += result.credited;
        completed += result.completed;
    }
    return { usersProcessed, credited, completed, ranAt: new Date().toISOString() };
}

export function serializeStake(id: string, data: Record<string, any>) {
    const startDate = toIso(data.startDate);
    const durationDays = Number(data.durationDays || 0);
    const status = data.status === 'completed' ? 'completed' : 'active';
    return {
        id,
        planId: data.planId,
        planName: data.planName,
        amount: Number(data.amount || 0),
        deductedFromAvailable: Number(data.deductedFromAvailable || data.amount || 0),
        durationDays,
        dailyRate: Number(data.dailyRate || 0),
        dailyProfit: Number(data.dailyProfit || 0),
        startDate,
        maturityDate: toIso(data.maturityDate),
        status,
        totalProfitEarned: Number(data.totalProfitEarned || 0),
        remainingDays: status === 'active' ? remainingStakeDays(startDate, durationDays) : 0,
        lastProfitDate: data.lastProfitDate || null,
        principalReturned: !!data.principalReturned,
    };
}
