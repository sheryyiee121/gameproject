"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { LEVELS, getUserLevel } from '@/lib/levels';

export default function MembershipPage() {
    const router = useRouter();
    const [totalDeposited, setTotalDeposited] = useState(0);
    const [walletBalance, setWalletBalance] = useState(0);

    useEffect(() => {
        const uid = localStorage.getItem('nexmine_uid');
        if (!uid) {
            router.push('/login');
            return;
        }

        getDoc(doc(db, 'users', uid)).then(snap => {
            if (snap.exists()) {
                const data = snap.data();
                setWalletBalance(Number(data.balances?.usdt || 0));
            } else {
                router.push('/login');
            }
        });

        fetch(`/api/levels/status?uid=${uid}`)
            .then(res => res.json())
            .then(data => {
                if (data.success) setTotalDeposited(Number(data.qualifyingDepositUsdt || 0));
            })
            .catch((e) => console.error('Failed to load deposits', e));
    }, [router]);

    const currentLevel = getUserLevel(totalDeposited);

    return (
        <div className="mem-root">
            <header className="top-bar">
                <button className="back-btn" onClick={() => router.back()} aria-label="Back">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
                </button>
                <h1 className="page-title">Membership Levels</h1>
                <div style={{ width: 42 }} />
            </header>

            <div className="current-banner" style={{ borderColor: currentLevel.color }}>
                <div className="banner-left">
                    <span className="banner-emoji">{currentLevel.emoji}</span>
                    <div>
                        <p className="banner-sub">Your Current Level</p>
                        <h2 className="banner-level" style={{ color: currentLevel.color }}>{currentLevel.name}</h2>
                    </div>
                </div>
                <div className="banner-right">
                    <p className="banner-dep-lbl">Qualifying Deposits</p>
                    <p className="banner-dep-val">{totalDeposited.toFixed(2)} USDT</p>
                    <p className="banner-note">Wallet: {walletBalance.toFixed(2)} USDT (does not unlock levels)</p>
                </div>
            </div>

            <main className="level-list">
                {LEVELS.map((lvl, idx) => {
                    const isUnlocked = totalDeposited >= lvl.minDeposit;
                    const isCurrentLevel = lvl.name === currentLevel.name;
                    const nextMin = LEVELS[idx + 1]?.minDeposit ?? null;
                    const progress = isUnlocked
                        ? (nextMin ? Math.min(100, ((totalDeposited - lvl.minDeposit) / (nextMin - lvl.minDeposit)) * 100) : 100)
                        : Math.min(100, (totalDeposited / Math.max(lvl.minDeposit, 1)) * 100);

                    return (
                        <div key={lvl.name} className={`upgrade-card ${isCurrentLevel ? 'active-card' : ''} ${isUnlocked ? '' : 'locked-card'}`} style={isCurrentLevel ? { borderColor: lvl.color } : {}}>
                            <div className="ticket" style={{ background: `${lvl.color}22`, borderColor: lvl.color }}>
                                <span className="t-amt" style={{ color: lvl.color }}>+{lvl.bonus}</span>
                                <span className="t-lbl" style={{ color: lvl.color }}>USDT{'\n'}Bonus</span>
                            </div>
                            <div className="card-info">
                                <div className="card-title-row">
                                    <h3 className="card-title">{lvl.emoji} {lvl.name} Level</h3>
                                    {isCurrentLevel && <span className="current-badge">YOUR LEVEL</span>}
                                    {!isUnlocked && <span className="lock-badge">Locked</span>}
                                </div>
                                <p className="card-desc">
                                    Requires {lvl.minDeposit} USDT confirmed deposit · Get +{lvl.bonus} USDT bonus
                                </p>
                                <div className="progress-bar">
                                    <div className="progress-fill" style={{ width: `${progress}%`, background: lvl.color }} />
                                </div>
                                <div className="card-bottom">
                                    <span className="amount-text" style={{ color: lvl.color }}>
                                        {totalDeposited.toFixed(2)} / {lvl.minDeposit} USDT
                                    </span>
                                    {isUnlocked
                                        ? <span className="btn-claim received">✓ Unlocked</span>
                                        : <span className="btn-claim locked">Need {(lvl.minDeposit - totalDeposited).toFixed(2)} more</span>
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
        .page-title { font-size: 20px; font-weight: 800; color: #fff; margin: 0; }
        .current-banner {
          margin: 20px 20px 0;
          background: #fff;
          border: 2px solid;
          border-radius: 20px;
          padding: 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
          box-shadow: 0 6px 20px rgba(0,0,0,0.04);
        }
        .banner-left { display: flex; align-items: center; gap: 14px; }
        .banner-emoji { font-size: 42px; }
        .banner-sub { font-size: 11px; color: #64748b; font-weight: 600; margin: 0; }
        .banner-level { font-size: 26px; font-weight: 900; margin: 0; }
        .banner-right { text-align: right; }
        .banner-dep-lbl { font-size: 11px; color: #64748b; margin: 0; font-weight: 600; }
        .banner-dep-val { font-size: 18px; font-weight: 900; color: #0f172a; margin: 0; }
        .banner-note { font-size: 11px; color: #94a3b8; margin: 6px 0 0; max-width: 220px; }
        .level-list { display: flex; flex-direction: column; gap: 14px; padding: 20px; }
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
        .locked-card { opacity: 0.78; }
        .active-card { border-width: 2px; box-shadow: 0 8px 25px rgba(0,0,0,0.07); }
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
        .card-title-row { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
        .card-title { font-size: 15px; font-weight: 800; margin: 0; color: #0f172a; }
        .current-badge, .lock-badge {
          font-size: 9px; font-weight: 800;
          padding: 2px 8px; border-radius: 20px;
        }
        .current-badge { background: linear-gradient(135deg, #0ea5e9, #0284c7); color: #fff; }
        .lock-badge { background: #f1f5f9; color: #64748b; }
        .card-desc { font-size: 11px; color: #64748b; font-weight: 500; margin: 0; }
        .progress-bar { height: 6px; background: #f1f5f9; border-radius: 3px; overflow: hidden; margin-bottom: 2px; }
        .progress-fill { height: 100%; border-radius: 3px; transition: width 0.5s; }
        .card-bottom { display: flex; justify-content: space-between; align-items: center; gap: 8px; }
        .amount-text { font-size: 12px; font-weight: 700; }
        .btn-claim { padding: 5px 12px; border-radius: 12px; font-size: 10px; font-weight: 800; border: none; }
        .btn-claim.received { background: transparent; border: 1px solid #cbd5e1; color: #64748b; }
        .btn-claim.locked { background: #f1f5f9; color: #94a3b8; }
        @media (max-width: 640px) {
          .current-banner { flex-direction: column; align-items: flex-start; }
          .banner-right { text-align: left; }
        }
      `}</style>
        </div>
    );
}
