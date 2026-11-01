export const LEVELS = [
    { name: 'Basic', minDeposit: 0, bonus: 0, color: '#64748b', emoji: '⭐' },
    { name: 'Bronze', minDeposit: 50, bonus: 5, color: '#cd7f32', emoji: '🥉' },
    { name: 'Silver', minDeposit: 100, bonus: 10, color: '#94a3b8', emoji: '🥈' },
    { name: 'Gold', minDeposit: 300, bonus: 25, color: '#ffd700', emoji: '🥇' },
    { name: 'Platinum', minDeposit: 600, bonus: 50, color: '#e2e8f0', emoji: '💎' },
    { name: 'Diamond', minDeposit: 1500, bonus: 250, color: '#38bdf8', emoji: '💠' },
    { name: 'VIP', minDeposit: 5000, bonus: 500, color: '#a855f7', emoji: '👑' },
];

export type LevelName = (typeof LEVELS)[number]['name'];

export const QUALIFYING_DEPOSIT_TYPES = new Set(['deposit_approved']);

export function getUserLevel(qualifyingDepositUsdt: number) {
    let current = LEVELS[0];
    for (const lvl of LEVELS) {
        if (qualifyingDepositUsdt >= lvl.minDeposit) current = lvl;
        else break;
    }
    return current;
}

export function getNextLevel(qualifyingDepositUsdt: number) {
    const current = getUserLevel(qualifyingDepositUsdt);
    const idx = LEVELS.findIndex((l) => l.name === current.name);
    return LEVELS[idx + 1] ?? null;
}

export function isUsdtToken(token: unknown) {
    const value = String(token || '').trim().toUpperCase();
    return value === 'USDT' || value === '';
}
