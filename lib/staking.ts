export const DAILY_PROFIT_RATE = 0.012; // existing 1.2% daily rate — do not change

export const STAKING_PLANS = [
    { id: 'earn-7', name: '7-Day Earn', durationDays: 7, dailyRate: DAILY_PROFIT_RATE, minAmount: 1 },
    { id: 'trade-15', name: '15-Day Trade', durationDays: 15, dailyRate: DAILY_PROFIT_RATE, minAmount: 1 },
    { id: 'earn-30', name: '30-Day Earn', durationDays: 30, dailyRate: DAILY_PROFIT_RATE, minAmount: 1 },
];

export type StakingPlanId = (typeof STAKING_PLANS)[number]['id'];

export function getStakingPlan(planId: string) {
    return STAKING_PLANS.find((p) => p.id === planId) ?? null;
}

export function utcDateStr(date: Date = new Date()) {
    return date.toISOString().slice(0, 10);
}

export function addUtcDays(dateStr: string, days: number) {
    const d = new Date(`${dateStr}T00:00:00.000Z`);
    d.setUTCDate(d.getUTCDate() + days);
    return utcDateStr(d);
}

export function remainingStakeDays(startIso: string, durationDays: number, now = new Date()) {
    const startDay = utcDateStr(new Date(startIso));
    const maturityDay = addUtcDays(startDay, durationDays);
    const today = utcDateStr(now);
    if (today >= maturityDay) return 0;
    const remainingMs = Date.parse(`${maturityDay}T00:00:00.000Z`) - Date.parse(`${today}T00:00:00.000Z`);
    return Math.max(0, Math.round(remainingMs / 86400000));
}

export function stakeMaturityIso(startIso: string, durationDays: number) {
    const start = new Date(startIso);
    const maturity = new Date(start.getTime() + durationDays * 86400000);
    return maturity.toISOString();
}
