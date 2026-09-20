"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

const LEVELS = [
    { name: 'Bronze', minDeposit: 0, bonus: 5, color: '#cd7f32', emoji: '🥉' },
    { name: 'Silver', minDeposit: 100, bonus: 10, color: '#94a3b8', emoji: '🥈' },
    { name: 'Gold', minDeposit: 300, bonus: 25, color: '#ffd700', emoji: '🥇' },
    { name: 'Platinum', minDeposit: 600, bonus: 50, color: '#e2e8f0', emoji: '💎' },
    { name: 'Diamond', minDeposit: 1500, bonus: 250, color: '#38bdf8', emoji: '💠' },
    { name: 'VIP', minDeposit: 5000, bonus: 500, color: '#a855f7', emoji: '👑' },
];

function getUserLevel(totalDeposited: number) {
    let current = LEVELS[0];
    for (const lvl of LEVELS) {
        if (totalDeposited >= lvl.minDeposit) current = lvl;
        else break;
    }
    return current;
}

export default function MembershipPage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const uid = localStorage.getItem('nexmine_uid');
        if (uid) {
            getDoc(doc(db, 'users', uid)).then(snap => {
                if (snap.exists()) setUser(snap.data());
                else router.push('/login');
            });
        } else {
            router.push('/login');
        }
    }, [router]);

    const totalDeposited = user?.totalDeposited ?? 0;
    const currentLevel = getUserLevel(totalDeposited);

    return (
        <div className="mem-root">
            {/* Header */}
            <header className="top-bar">
                <button className="back-btn" onClick={() => router.back()} aria-label="Back">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
                </button>
                <h1 className="page-title">Membership Levels</h1>
                <div style={{ width: 42 }} />
            </header>

            {/* Current Level Banner */}
            <div className="current-banner" style={{ borderColor: currentLevel.color }}>
                <div className="banner-left">
                    <span className="banner-emoji">{currentLevel.emoji}</span>
                    <div>
                        <p className="banner-sub">Your Current Level</p>
                        <h2 className="banner-level" style={{ color: currentLevel.color }}>{currentLevel.name}</h2>
                    </div>
                </div>
                <div className="banner-right">
                    <p className="banner-dep-lbl">Total Deposited</p>
                    <p className="banner-dep-val">{totalDeposited.toFixed(2)} USDT</p>
                </div>
            </div>

            {/* Level Cards */}
            <main className="level-list">
                {LEVELS.map((lvl, idx) => {
                    const isCurrentOrBelowLevel = totalDeposited >= lvl.minDeposit;
                    const isCurrentLevel = lvl.name === currentLevel.name;
                    const nextMin = LEVELS[idx + 1]?.minDeposit ?? null;
                    const progress = nextMin
                        ? Math.min(100, ((totalDeposited - lvl.minDeposit) / (nextMin - lvl.minDeposit)) * 100)
                        : 100;

                    return (
                        <div key={lvl.name} className={`upgrade-card ${isCurrentLevel ? 'active-card' : ''}`} style={isCurrentLevel ? { borderColor: lvl.color } : {}}>
                            {/* Ticket */}
                            <div className="ticket" style={{ background: `${lvl.color}22`, borderColor: lvl.color }}>
                                <span className="t-amt" style={{ color: lvl.color }}>+{lvl.bonus}</span>
                                <span className="t-lbl" style={{ color: lvl.color }}>USDT{'\n'}Bonus</span>
                            </div>

                            {/* Info */}
                            <div className="card-info">
                                <div className="card-title-row">
                                    <h3 className="card-title">{lvl.emoji} {lvl.name} Level</h3>
                                    {isCurrentLevel && <span className="current-badge">YOUR LEVEL</span>}
                                </div>
                                <p className="card-desc">
                                    Requires {lvl.minDeposit} USDT deposit &nbsp;·&nbsp; Get +{lvl.bonus} USDT bonus
                                </p>
                                <div className="progress-bar">
                                    <div className="progress-fill" style={{ width: `${isCurrentOrBelowLevel ? progress : 0}%`, background: lvl.color }} />
                                </div>
                                <div className="card-bottom">
                                    <span className="amount-text" style={{ color: lvl.color }}>{totalDeposited.toFixed(2)} USDT</span>
                                    {isCurrentOrBelowLevel
                                        ? <span className="btn-claim received">✓ Unlocked</span>
                                        : <span className="btn-claim locked">Need {lvl.minDeposit} USDT</span>
                                    }
                                </div>
                            </div>
                        </div>
                    );
                })}
            </main>

            <style jsx>{`
        .mem-root {
          min-height: 100vh;
          background: linear-gradient(135deg, #f6f9fc 0%, #eef2f6 100%);
          display: flex;
          flex-direction: column;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          color: #0f172a;
          padding-bottom: 40px;
        }
        .top-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 20px;
          background: linear-gradient(135deg, #001f54 0%, #0a4087 100%);
        }
        .back-btn {
          background: rgba(255,255,255,0.15);
          border: none;
          border-radius: 50%;
          width: 42px; height: 42px;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
        }
        .page-title {
          font-size: 20px; font-weight: 800; color: #fff; margin: 0;
        }
        .current-banner {
          margin: 20px 20px 0;
          background: #fff;
          border: 2px solid;
          border-radius: 20px;
          padding: 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-shadow: 0 6px 20px rgba(0,0,0,0.04);
        }
        .banner-left { display: flex; align-items: center; gap: 14px; }
        .banner-emoji { font-size: 42px; }
        .banner-sub { font-size: 11px; color: #64748b; font-weight: 600; margin: 0; }
        .banner-level { font-size: 26px; font-weight: 900; margin: 0; }
        .banner-right { text-align: right; }
        .banner-dep-lbl { font-size: 11px; color: #64748b; margin: 0; font-weight: 600; }
        .banner-dep-val { font-size: 18px; font-weight: 900; color: #0f172a; margin: 0; }

        .level-list {
          display: flex;
          flex-direction: column;
          gap: 14px;
          padding: 20px;
        }
        .upgrade-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 20px;
          padding: 16px;
          display: flex;
          gap: 16px;
          align-items: center;
          box-shadow: 0 4px 15px rgba(0,0,0,0.02);
        }
        .active-card {
          border-width: 2px;
          box-shadow: 0 8px 25px rgba(0,0,0,0.07);
        }
        .ticket {
          width: 56px; height: 68px;
          border: 2px solid;
          border-radius: 12px;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .t-amt { font-size: 18px; font-weight: 900; line-height: 1; }
        .t-lbl { font-size: 9px; font-weight: 800; text-align: center; margin-top: 3px; white-space: pre-line; line-height: 1.2; }

        .card-info { flex: 1; display: flex; flex-direction: column; gap: 6px; }
        .card-title-row { display: flex; align-items: center; gap: 8px; }
        .card-title { font-size: 15px; font-weight: 800; margin: 0; color: #0f172a; }
        .current-badge {
          font-size: 9px; font-weight: 800;
          background: linear-gradient(135deg, #0ea5e9, #0284c7);
          color: #fff; padding: 2px 8px; border-radius: 20px;
        }
        .card-desc { font-size: 11px; color: #64748b; font-weight: 500; margin: 0; }
        .progress-bar { height: 6px; background: #f1f5f9; border-radius: 3px; overflow: hidden; margin-bottom: 2px; }
        .progress-fill { height: 100%; border-radius: 3px; transition: width 0.5s; }
        .card-bottom { display: flex; justify-content: space-between; align-items: center; }
        .amount-text { font-size: 12px; font-weight: 700; }
        .btn-claim {
          padding: 5px 12px; border-radius: 12px;
          font-size: 10px; font-weight: 800; border: none;
        }
        .btn-claim.received { background: transparent; border: 1px solid #cbd5e1; color: #64748b; }
        .btn-claim.locked { background: #f1f5f9; color: #94a3b8; }
      `}</style>
        </div>
    );
}
