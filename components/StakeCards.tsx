"use client";

export function formatMoney(value: number, digits = 2) {
    return Number(value || 0).toFixed(digits);
}

export function formatDate(value?: string | null) {
    if (!value) return '—';
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return value;
    return d.toLocaleString();
}

export function StakeCards({ stakes }: { stakes: any[] }) {
    if (!stakes?.length) {
        return <p className="empty-stakes">No investments in this category yet.</p>;
    }

    return (
        <div className="stake-grid">
            {stakes.map((stake) => (
                <article key={stake.id} className={`stake-card ${stake.status}`}>
                    <div className="stake-card-top">
                        <h4>{stake.planName || 'Staking Plan'}</h4>
                        <span className={`status-pill ${stake.status}`}>{stake.status === 'active' ? 'Active' : 'Completed'}</span>
                    </div>
                    <dl>
                        <div><dt>Invested Amount</dt><dd>{formatMoney(stake.amount)} USDT</dd></div>
                        <div><dt>Deducted From Available</dt><dd>{formatMoney(stake.deductedFromAvailable)} USDT</dd></div>
                        <div><dt>Duration</dt><dd>{stake.durationDays} Days</dd></div>
                        <div><dt>Start Date</dt><dd>{formatDate(stake.startDate)}</dd></div>
                        <div><dt>Maturity Date</dt><dd>{formatDate(stake.maturityDate)}</dd></div>
                        <div><dt>Daily Profit</dt><dd>{formatMoney(stake.dailyProfit, 4)} USDT</dd></div>
                        <div><dt>Total Profit Earned</dt><dd>{formatMoney(stake.totalProfitEarned, 4)} USDT</dd></div>
                        <div><dt>Remaining Days</dt><dd>{stake.status === 'active' ? stake.remainingDays : 0}</dd></div>
                    </dl>
                </article>
            ))}
            <style jsx>{`
                .stake-grid { display: grid; gap: 14px; }
                .stake-card {
                    background: #010413;
                    border: 1px solid rgba(129,136,148,0.18);
                    border-radius: 16px;
                    padding: 16px;
                }
                .stake-card.active { border-color: rgba(14,165,233,0.35); }
                .stake-card-top { display: flex; justify-content: space-between; align-items: center; gap: 8px; margin-bottom: 12px; }
                h4 { margin: 0; color: #fff; font-size: 16px; }
                .status-pill { font-size: 11px; font-weight: 800; border-radius: 999px; padding: 4px 10px; text-transform: uppercase; }
                .status-pill.active { background: rgba(16,185,129,0.15); color: #34d399; }
                .status-pill.completed { background: rgba(148,163,184,0.15); color: #94a3b8; }
                dl { display: grid; grid-template-columns: 1fr 1fr; gap: 10px 12px; margin: 0; }
                dt { font-size: 11px; color: #818894; font-weight: 600; }
                dd { margin: 4px 0 0; font-size: 13px; font-weight: 800; color: #fff; }
                @media (max-width: 640px) { dl { grid-template-columns: 1fr; } }
            `}</style>
        </div>
    );
}
