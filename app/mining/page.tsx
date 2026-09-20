"use client";

import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

// Helper: get the tier bonus amount based on referrer's team size
export function getReferralBonus(teamSize: number): number {
    if (teamSize >= 10) return 20;
    if (teamSize >= 5) return 10;
    if (teamSize >= 3) return 10;
    if (teamSize >= 1) return 5;
    return 0;
}

export default function MiningPage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [liveEarned, setLiveEarned] = useState(0);      // live accumulating since miningStartedAt
    const [ratePerSec, setRatePerSec] = useState(0);
    const intervalRef = useRef<any>(null);

    useEffect(() => {
        const uid = localStorage.getItem("nexmine_uid");
        if (!uid) { router.push('/login'); return; }

        getDoc(doc(db, "users", uid)).then(docSnap => {
            if (!docSnap.exists()) { router.push('/login'); return; }
            const data = docSnap.data();
            setUser(data);

            // miningRate is $ per 24 hours
            const dailyRate = data.miningRate ?? 0.15;      // fallback if old account
            const perSec = dailyRate / 86400;
            setRatePerSec(perSec);

            // Calculate elapsed seconds since miningStartedAt
            let startMs = Date.now(); // fallback: right now
            if (data.miningStartedAt?.toDate) {
                startMs = data.miningStartedAt.toDate().getTime();
            }

            // Seed the counter with already-elapsed earnings, cap at 24h worth
            const elapsedSec = Math.min((Date.now() - startMs) / 1000, 86400);
            const alreadyEarned = perSec * elapsedSec;
            setLiveEarned(alreadyEarned);

            // Tick every second
            intervalRef.current = setInterval(() => {
                setLiveEarned(prev => {
                    const next = prev + perSec;
                    return next; // uncapped — admin resets miningStartedAt to clear
                });
            }, 1000);
        });

        return () => clearInterval(intervalRef.current);
    }, [router]);

    const dailyRate = user?.miningRate ?? 0.15;
    const hourlyRate = dailyRate / 24;

    return (
        <div className="mining-root">
            {/* Top Navbar */}
            <header className="top-nav">
                <div style={{ width: 24 }}></div>
                <h1 className="nav-title">Mining</h1>
                <div style={{ width: 24 }}></div>
            </header>

            <main className="main-content">

                {/* Tier Header */}
                <div className="tier-header">
                    <div className="tier-icon">
                        <span className="emoji-badge">🥉</span>
                    </div>
                    <h2 className="tier-name">{user?.tier || 'Bronze'}</h2>
                </div>

                {/* ——— LIVE MINING TRACKER ——— */}
                <div className="live-card">
                    <div className="live-pulse-ring">
                        <div className="live-pulse-dot"></div>
                    </div>
                    <span className="live-label">⚡ Live Mining Earnings</span>
                    <div className="live-amount">
                        <span className="live-symbol">$</span>
                        <span className="live-value">{liveEarned.toFixed(6)}</span>
                        <span className="live-token">USDT</span>
                    </div>
                    <div className="rate-row">
                        <div className="rate-pill">
                            <span className="rate-dot"></span>
                            <span>${hourlyRate.toFixed(5)} / hr</span>
                        </div>
                        <div className="rate-pill">
                            <span className="rate-dot"></span>
                            <span>${dailyRate.toFixed(4)} / day</span>
                        </div>
                    </div>
                    <p className="live-note">Mining runs automatically 24/7</p>
                </div>

                {/* Stats Grid */}
                <div className="stats-grid">
                    <div className="stat-box">
                        <span className="lbl">Account Balance</span>
                        <div className="val-row">
                            <span className="usdt-icon">₮</span>
                            <span className="val">{user?.balances?.usdt?.toFixed(4) || '0.0000'}</span>
                        </div>
                    </div>
                    <div className="stat-box">
                        <span className="lbl">Daily Mining Rate</span>
                        <div className="val-row">
                            <span className="profit-icon">⚡</span>
                            <span className="val">${dailyRate.toFixed(4)}</span>
                        </div>
                    </div>
                    <div className="stat-box">
                        <span className="lbl">Total Profit</span>
                        <div className="val-row">
                            <span className="profit-icon">✨</span>
                            <span className="val">{(user?.totalProfit || 0).toFixed(4)}</span>
                        </div>
                    </div>
                    <div className="stat-box">
                        <span className="lbl">Today Profit</span>
                        <div className="val-row">
                            <span className="profit-icon">✨</span>
                            <span className="val">{(user?.todayProfit || 0).toFixed(4)}</span>
                        </div>
                    </div>
                </div>

                {/* Action Grid */}
                <div className="action-grid">
                    <div className="action-item" onClick={() => alert('📈 Stake Record coming soon! Your staking history will appear here.')} style={{ cursor: 'pointer' }}>
                        <div className="action-icon stripe-blue">
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 3h5v5"></path><path d="M4 20L21 3"></path><path d="M21 16v5h-5"></path><path d="M15 15l6 6"></path><path d="M4 4l5 5"></path></svg>
                        </div>
                        <span className="action-label">Stake Record</span>
                    </div>
                    <div className="action-item" onClick={() => alert('💰 Profit tracking coming soon! Detailed profit analytics will appear here.')} style={{ cursor: 'pointer' }}>
                        <div className="action-icon stripe-teal">
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"></path><line x1="12" y1="18" x2="12" y2="22"></line><line x1="12" y1="2" x2="12" y2="6"></line></svg>
                        </div>
                        <span className="action-label">Profit</span>
                    </div>
                    <div className="action-item" onClick={() => alert('⚙️ Equipment upgrades coming soon! Boost your mining rate with premium equipment.')} style={{ cursor: 'pointer' }}>
                        <div className="action-icon stripe-blue">
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
                        </div>
                        <span className="action-label">Equipment</span>
                    </div>
                    <div className="action-item" onClick={() => router.push('/tutorial')} style={{ cursor: 'pointer' }}>
                        <div className="action-icon stripe-blue">
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><circle cx="12" cy="17" r="0.5"></circle></svg>
                        </div>
                        <span className="action-label">Tutorial</span>
                    </div>
                </div>

                {/* Orb Graphic */}
                <div className="orb-container">
                    <div className="shield-blob">
                        <img src="/nexmine-ai-logo.png" alt="Nexmine AI" className="orb-logo" />
                    </div>
                </div>

                {/* Details List */}
                <div className="details-list">
                    <div className="detail-row">
                        <span className="d-label">Mining Rate Range</span>
                        <span className="d-val">$0.05 – $1.00 / day</span>
                    </div>
                    <div className="detail-row">
                        <span className="d-label">Your Daily Rate</span>
                        <span className="d-val">${dailyRate.toFixed(4)} USDT</span>
                    </div>
                    <div className="detail-row">
                        <span className="d-label">Running Time</span>
                        <span className="d-val">24 / 7 Auto</span>
                    </div>
                    <div className="detail-row">
                        <span className="d-label">Daily Rate</span>
                        <span className="d-val">1% – 1.2%</span>
                    </div>
                </div>

            </main>

            {/* Bottom Nav */}
            <nav className="bottom-nav">
                <button className="nav-item" onClick={() => router.push('/dashboard')}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                    <span>Home</span>
                </button>
                <button className="nav-item" onClick={() => router.push('/task')}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>
                    <span>Task</span>
                </button>
                <div className="nav-item center-mining-wrapper active">
                    <button className="mining-btn active">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z" fill="#fff" /><path d="M2 17l10 5 10-5M2 12l10 5 10-5" /></svg>
                    </button>
                    <span>Mining</span>
                </div>
                <button className="nav-item" onClick={() => router.push('/asset')}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                    <span>Asset</span>
                </button>
                <button className="nav-item" onClick={() => router.push('/profile')}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                    <span>Profile</span>
                </button>
            </nav>

            <style jsx>{`
                .mining-root {
                    min-height: 100vh; width: 100%;
                    background: #00030D;
                    display: flex; flex-direction: column;
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                    color: #ffffff; padding-bottom: 90px;
                }
                .top-nav { display: flex; justify-content: space-between; align-items: center; padding: 18px 20px 10px; }
                .nav-title { font-size: 18px; font-weight: 700; color: #ffffff; margin: 0; }
                .main-content { display: flex; flex-direction: column; padding: 4px 20px 20px; gap: 16px; }

                .tier-header { display: flex; align-items: center; gap: 12px; margin-bottom: 4px; }
                .tier-icon { width: 44px; height: 44px; background: #000717; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 22px; box-shadow: 0 4px 12px rgba(0,0,0,0.3); border: 2px solid rgba(129,136,148,0.15); }
                .tier-name { font-size: 20px; font-weight: 800; color: #ffffff; margin: 0; }
                .emoji-badge { font-size: 22px; }

                /* ——— Live Tracker Card ——— */
                .live-card {
                    background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
                    border-radius: 24px;
                    padding: 24px 20px 20px;
                    display: flex; flex-direction: column; align-items: center; gap: 10px;
                    box-shadow: 0 12px 40px rgba(14,165,233,0.2);
                    position: relative; overflow: hidden;
                }
                .live-card::before {
                    content: ''; position: absolute;
                    top: -60px; right: -60px;
                    width: 200px; height: 200px;
                    background: radial-gradient(circle, rgba(14,165,233,0.15) 0%, transparent 70%);
                    border-radius: 50%;
                }
                .live-pulse-ring {
                    position: absolute; top: 18px; right: 18px;
                    width: 28px; height: 28px;
                    border: 2px solid rgba(16,185,129,0.6);
                    border-radius: 50%;
                    display: flex; align-items: center; justify-content: center;
                    animation: pulseRing 1.5s ease-out infinite;
                }
                .live-pulse-dot {
                    width: 10px; height: 10px;
                    background: #10b981; border-radius: 50%;
                    animation: pulseDot 1.5s ease-in-out infinite;
                }
                @keyframes pulseRing { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.3);opacity:0.5} }
                @keyframes pulseDot { 0%,100%{opacity:1} 50%{opacity:0.5} }

                .live-label { font-size: 12px; font-weight: 700; color: #10b981; text-transform: uppercase; letter-spacing: 1px; }
                .live-amount { display: flex; align-items: baseline; gap: 6px; }
                .live-symbol { font-size: 20px; font-weight: 700; color: #94a3b8; }
                .live-value { font-size: 38px; font-weight: 900; color: #ffffff; letter-spacing: -1px; font-variant-numeric: tabular-nums; }
                .live-token { font-size: 14px; font-weight: 700; color: #38bdf8; }

                .rate-row { display: flex; gap: 10px; }
                .rate-pill { background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.1); border-radius: 20px; padding: 5px 12px; display: flex; align-items: center; gap: 6px; font-size: 12px; color: #cbd5e1; font-weight: 600; }
                .rate-dot { width: 6px; height: 6px; background: #10b981; border-radius: 50%; animation: pulseDot 1.5s ease-in-out infinite; }
                .live-note { font-size: 11px; color: #475569; margin: 0; }

                /* Stats grid */
                .stats-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
                .stat-box { background: #010413; border-radius: 16px; border: 1px solid rgba(129,136,148,0.15); padding: 16px; display: flex; flex-direction: column; gap: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.2); }
                .lbl { font-size: 11.5px; font-weight: 600; color: #818894; }
                .val-row { display: flex; align-items: center; gap: 6px; }
                .usdt-icon { background: #10b981; color: #fff; width: 16px; height: 16px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: bold; }
                .profit-icon { font-size: 14px; }
                .val { font-size: 16px; font-weight: 800; color: #ffffff; }

                /* Action grid */
                .action-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 10px; margin-top: 10px; }
                .action-item { display: flex; flex-direction: column; align-items: center; text-align: center; gap: 8px; }
                .action-icon { width: 50px; height: 50px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 6px 12px rgba(0,0,0,0.08); transition: transform 0.2s; }
                .action-item:hover .action-icon { transform: translateY(-3px); }
                .stripe-blue { background: linear-gradient(135deg,#1e293b,#334155); }
                .stripe-teal { background: linear-gradient(135deg,#0f766e,#115e59); }
                .action-label { font-size: 11px; color: #818894; font-weight: 700; }

                /* Orb */
                .orb-container { margin: 10px 0; display: flex; justify-content: center; align-items: center; }
                .shield-blob { width: 130px; height: 130px; background: #000717; border: 4px solid rgba(14,165,233,0.1); border-radius: 50%; box-shadow: 0 15px 35px rgba(14,165,233,0.15); display: flex; align-items: center; justify-content: center; animation: float 4s ease-in-out infinite; }
                .orb-logo { width: 90px; height: auto; object-fit: contain; filter: drop-shadow(0 4px 16px rgba(14,165,233,0.3)); }
                @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }

                /* Referral tier table */
                .tier-table-card { background: #010413; border-radius: 20px; border: 1px solid rgba(129,136,148,0.15); overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.3); }
                .tier-table-title { margin: 0; padding: 16px 20px 12px; font-size: 15px; font-weight: 800; color: #ffffff; border-bottom: 1px solid rgba(129,136,148,0.1); }
                .tier-row { display: flex; justify-content: space-between; padding: 12px 20px; border-bottom: 1px solid rgba(129,136,148,0.05); font-size: 14px; color: #818894; font-weight: 500; }
                .header-row { background: #000717; font-weight: 700; color: #818894; font-size: 12px; text-transform: uppercase; }
                .last-row { border-bottom: none; }
                .bonus-val { font-weight: 800; color: #10b981; font-size: 15px; }
                .bonus-val.gold { color: #f59e0b; }

                /* Details list */
                .details-list { display: flex; flex-direction: column; gap: 14px; padding: 4px 4px; }
                .detail-row { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px dotted rgba(129,136,148,0.2); padding-bottom: 10px; }
                .d-label { font-size: 13.5px; font-weight: 600; color: #818894; }
                .d-val { font-size: 14.5px; font-weight: 800; color: #ffffff; }

                /* Bottom Nav */
                .bottom-nav { position: fixed; bottom: 0; left: 0; right: 0; background: rgba(1,4,19,0.97); backdrop-filter: blur(12px); border-top: 1px solid rgba(129,136,148,0.15); display: flex; justify-content: space-around; align-items: flex-end; padding: 10px 10px 24px; z-index: 100; box-shadow: 0 -5px 30px rgba(0,0,0,0.4); }
                .nav-item { display: flex; flex-direction: column; align-items: center; gap: 6px; background: none; border: none; color: #818894; cursor: pointer; font-size: 11.5px; font-weight: 600; }
                .nav-item.active { color: #0ea5e9; }
                .center-mining-wrapper { position: relative; top: -24px; }
                .mining-btn { width: 64px; height: 64px; border-radius: 50%; background: #000717; border: 6px solid #00030D; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 15px rgba(0,0,0,0.3); cursor: pointer; margin-bottom: 6px; }
                .mining-btn.active { background: linear-gradient(135deg,#0ea5e9,#0284c7); box-shadow: 0 8px 25px rgba(14,165,233,0.4); }
            `}</style>
        </div>
    );
}
