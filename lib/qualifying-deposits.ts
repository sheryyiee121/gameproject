import {
    collection,
    doc,
    getDoc,
    getDocs,
    query,
    where,
    writeBatch,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { getUserLevel, isUsdtToken } from '@/lib/levels';

export async function computeQualifyingDepositUsdt(uid: string) {
    let total = 0;
    const countedRequestIds = new Set<string>();

    const reqSnap = await getDocs(
        query(collection(db, 'depositRequests'), where('uid', '==', uid))
    );

    reqSnap.forEach((item) => {
        const data = item.data();
        if (data.status !== 'approved' || data.reversed) return;
        if (!isUsdtToken(data.coin || data.token)) return;
        const amount = Number(data.amount || 0);
        if (amount > 0) {
            total += amount;
            countedRequestIds.add(item.id);
        }
    });

    const txSnap = await getDocs(collection(db, 'users', uid, 'transactions'));
    txSnap.forEach((item) => {
        const data = item.data();
        if (data.type !== 'deposit_approved') return;
        if (!isUsdtToken(data.token || data.coin)) return;
        const requestId = data.depositRequestId;
        if (requestId && countedRequestIds.has(requestId)) return;
        if (data.reversed) return;
        const amount = Number(data.amount || 0);
        if (amount > 0) total += amount;
    });

    return Number(total.toFixed(8));
}

export async function syncUserLevelFromDeposits(uid: string) {
    const qualifyingDepositUsdt = await computeQualifyingDepositUsdt(uid);
    const level = getUserLevel(qualifyingDepositUsdt);
    const userRef = doc(db, 'users', uid);
    const snap = await getDoc(userRef);
    if (!snap.exists()) {
        return { qualifyingDepositUsdt, level: level.name };
    }

    const batch = writeBatch(db);
    const currentTier = snap.data()?.tier || 'Basic';
    const updates: Record<string, unknown> = {
        qualifyingDepositUsdt,
    };
    if (currentTier !== level.name) {
        updates.tier = level.name;
    }
    batch.update(userRef, updates);
    await batch.commit();

    return { qualifyingDepositUsdt, level: level.name };
}
