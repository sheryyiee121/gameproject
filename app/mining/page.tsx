"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

export default function MiningPage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const uid = localStorage.getItem("nexmine_uid");
        if (uid) {
            getDoc(doc(db, "users", uid)).then(docSnap => {
                if (docSnap.exists()) {
                    setUser(docSnap.data());
                } else {
                    router.push('/login');
                }
            });
        } else {
            router.push('/login');
        }
    }, [router]);

    return (
        <div className="mining-root">
            {/* Top Navbar */}
            <header className="top-nav">
                <div className="empty-space" style={{ width: 24 }}></div>
                <h1 className="nav-title">Mining</h1>
                <div className="empty-space" style={{ width: 24 }}></div>
            </header>

            <main className="main-content">

                {/* Tier Info */}
                <div className="tier-header">
                    <div className="tier-icon">
                        <span className="emoji-badge">🥉</span>
                    </div>
                    <h2 className="tier-name">{user?.tier || 'Bronze'}</h2>
                </div>

                {/* Stats Grid */}
                <div className="stats-grid">
                    <div className="stat-box">
                        <span className="lbl">Account Balance</span>
                        <div className="val-row">
                            <span className="usdt-icon">₮</span>
                            <span className="val">{user?.balances?.usdt?.toFixed(4) || '0.00'}</span>
                        </div>
                    </div>
                    <div className="stat-box">
                        <span className="lbl">Total Stake Amount</span>
                        <div className="val-row">
                            <span className="usdt-icon">₮</span>
                            <span className="val">300.0000</span>
                        </div>
                    </div>
                    <div className="stat-box">
                        <span className="lbl">Total Profit</span>
                        <div className="val-row">
                            <span className="profit-icon">✨</span>
                            <span className="val">0.0000</span>
                        </div>
                    </div>
                    <div className="stat-box">
                        <span className="lbl">Today Profit</span>
                        <div className="val-row">
                            <span className="profit-icon">✨</span>
                            <span className="val">0.0000</span>
                        </div>
                    </div>
                </div>

                {/* Action Grid */}
                <div className="action-grid">
                    <div className="action-item">
                        <div className="action-icon stripe-blue">
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 3h5v5"></path><path d="M4 20L21 3"></path><path d="M21 16v5h-5"></path><path d="M15 15l6 6"></path><path d="M4 4l5 5"></path></svg>
                        </div>
                        <span className="action-label">Stake Record</span>
                    </div>
                    <div className="action-item">
                        <div className="action-icon stripe-teal">
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"></path><line x1="12" y1="18" x2="12" y2="22"></line><line x1="12" y1="2" x2="12" y2="6"></line></svg>
                        </div>
                        <span className="action-label">Profit</span>
                    </div>
                    <div className="action-item">
                        <div className="action-icon stripe-blue">
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
                        </div>
                        <span className="action-label">Equipment</span>
                    </div>
                    <div className="action-item">
                        <div className="action-icon stripe-blue">
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><circle cx="12" cy="17" r="0.5"></circle></svg>
                        </div>
                        <span className="action-label">Tutorial</span>
                    </div>
                </div>

                {/* Orb Graphic */}
                <div className="orb-container">
                    <div className="shield-blob">
                        <svg width="60" height="60" viewBox="0 0 24 24" fill="none">
                            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="#0ea5e9" />
                        </svg>
                    </div>
                </div>

                {/* Buttons */}
                <div className="button-group">
                    <button className="btn-stake">Stake</button>
                    <button className="btn-run">Run Today</button>
                </div>

                {/* Details List */}
                <div className="details-list">
                    <div className="detail-row">
                        <span className="d-label">Stake Amount</span>
                        <div className="d-val flex-val">
                            <span className="usdt-icon-sm">₮</span>
                            <span>300</span>
                        </div>
                    </div>
                    <div className="detail-row">
                        <span className="d-label">Number Of Runs</span>
                        <span className="d-val">1/1</span>
                    </div>
                    <div className="detail-row">
                        <span className="d-label">Estimated Earning</span>
                        <span className="d-val">3-3.6 $</span>
                    </div>
                    <div className="detail-row">
                        <span className="d-label">Daily Rate</span>
                        <span className="d-val">1%-1.2%</span>
                    </div>
                    <div className="detail-row">
                        <span className="d-label">Running Time</span>
                        <span className="d-val">5 Minutes</span>
                    </div>
                </div>

            </main>

            {/* Bottom Nav */}
            <nav className="bottom-nav">
                <button className="nav-item" onClick={() => router.push('/dashboard')}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"></path>
                        <polyline points="9 22 9 12 15 12 15 22"></polyline>
                    </svg>
                    <span>Home</span>
                </button>
                <button className="nav-item" onClick={() => router.push('/task')}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <line x1="16" y1="13" x2="8" y2="13"></line>
                        <line x1="16" y1="17" x2="8" y2="17"></line>
                        <polyline points="10 9 9 9 8 9"></polyline>
                    </svg>
                    <span>Task</span>
                </button>
                <div className="nav-item center-mining-wrapper active">
                    <button className="mining-btn active">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 2L2 7l10 5 10-5-10-5z" fill="#fff" />
                            <path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
                        </svg>
                    </button>
                    <span>Mining</span>
                </div>
                <button className="nav-item" onClick={() => router.push('/asset')}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                    <span>Asset</span>
                </button>
                <button className="nav-item" onClick={() => router.push('/profile')}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                    <span>Profile</span>
                </button>
            </nav>

            <style jsx>{`
        .mining-root {
          min-height: 100vh;
          width: 100%;
          background: linear-gradient(135deg, #f6f9fc 0%, #eef2f6 100%);
          display: flex;
          flex-direction: column;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          color: #0f172a;
          position: relative;
          padding-bottom: 90px;
        }

        .top-nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 18px 20px 10px;
        }
        .nav-title {
          font-size: 18px;
          font-weight: 700;
          color: #0f172a;
          margin: 0;
        }

        .main-content {
          display: flex;
          flex-direction: column;
          padding: 4px 20px 20px;
          gap: 16px;
        }

        .tier-header {
           display: flex;
           align-items: center;
           gap: 12px;
           margin-bottom: 4px;
        }
        .tier-icon {
           width: 44px;
           height: 44px;
           background: #ffffff;
           border-radius: 50%;
           display: flex;
           align-items: center;
           justify-content: center;
           font-size: 22px;
           box-shadow: 0 4px 12px rgba(0,0,0,0.05);
           border: 2px solid #f1f5f9;
        }
        .tier-name {
           font-size: 20px;
           font-weight: 800;
           color: #0f172a;
           margin: 0;
        }

        .stats-grid {
           display: grid;
           grid-template-columns: 1fr 1fr;
           gap: 12px;
        }
        .stat-box {
           background: #ffffff;
           border-radius: 16px;
           border: 1px solid #e2e8f0;
           padding: 16px;
           display: flex;
           flex-direction: column;
           gap: 8px;
           box-shadow: 0 4px 10px rgba(0,0,0,0.02);
        }
        .lbl {
           font-size: 11.5px;
           font-weight: 600;
           color: #64748b;
        }
        .val-row {
           display: flex;
           align-items: center;
           gap: 6px;
        }
        .usdt-icon {
           background: #10b981;
           color: #fff;
           width: 16px;
           height: 16px;
           border-radius: 50%;
           display: flex;
           align-items: center;
           justify-content: center;
           font-size: 10px;
           font-weight: bold;
        }
        .usdt-icon-sm {
           background: #10b981;
           color: #fff;
           width: 14px;
           height: 14px;
           border-radius: 50%;
           display: flex;
           align-items: center;
           justify-content: center;
           font-size: 9px;
           font-weight: bold;
        }
        .profit-icon {
           font-size: 14px;
        }
        .val {
           font-size: 16px;
           font-weight: 800;
           color: #0f172a;
        }

        .action-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 10px;
          margin-top: 10px;
        }
        .action-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 8px;
        }
        .action-icon {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 6px 12px rgba(0,0,0,0.08);
          transition: transform 0.2s;
        }
        .action-item:hover .action-icon { transform: translateY(-3px); }
        .stripe-blue { background: linear-gradient(135deg, #1e293b, #334155); }
        .stripe-teal { background: linear-gradient(135deg, #0f766e, #115e59); }
        .action-label {
          font-size: 11px;
          color: #334155;
          font-weight: 700;
        }

        .orb-container {
           margin: 30px 0;
           display: flex;
           justify-content: center;
           align-items: center;
        }
        .shield-blob {
          width: 160px;
          height: 160px;
          background: #ffffff;
          border: 4px solid #f8fafc;
          border-radius: 50%;
          box-shadow: 0 15px 35px rgba(14,165,233,0.15), inset 0 0 20px rgba(14,165,233,0.05);
          display: flex;
          align-items: center;
          justify-content: center;
          animation: float 4s ease-in-out infinite;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }

        .button-group {
           display: flex;
           flex-direction: column;
           gap: 12px;
           margin-bottom: 10px;
        }
        .btn-stake {
           background: linear-gradient(135deg, #0ea5e9, #0284c7);
           color: #fff;
           border: none;
           padding: 16px;
           border-radius: 30px;
           font-size: 15px;
           font-weight: 700;
           box-shadow: 0 6px 20px rgba(14,165,233,0.25);
        }
        .btn-run {
           background: transparent;
           color: #0c4a6e;
           border: 2px solid #bae6fd;
           padding: 16px;
           border-radius: 30px;
           font-size: 15px;
           font-weight: 700;
        }

        .details-list {
           display: flex;
           flex-direction: column;
           gap: 16px;
           padding: 10px 4px;
        }
        .detail-row {
           display: flex;
           justify-content: space-between;
           align-items: center;
           border-bottom: 2px dotted #cbd5e1;
           padding-bottom: 10px;
        }
        .d-label {
           font-size: 13.5px;
           font-weight: 600;
           color: #64748b;
        }
        .d-val {
           font-size: 14.5px;
           font-weight: 800;
           color: #0f172a;
        }
        .flex-val {
           display: flex;
           align-items: center;
           gap: 6px;
        }

        /* Bottom Nav */
        .bottom-nav {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background: rgba(255,255,255,0.95);
          backdrop-filter: blur(10px);
          border-top: 1px solid rgba(0,0,0,0.05);
          display: flex;
          justify-content: space-around;
          align-items: flex-end;
          padding: 10px 10px 24px;
          z-index: 100;
          box-shadow: 0 -5px 25px rgba(0,0,0,0.03);
        }
        .nav-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          background: none;
          border: none;
          color: #94a3b8;
          cursor: pointer;
          font-size: 11.5px;
          font-weight: 600;
        }
        .nav-item.active {
          color: #0ea5e9;
        }
        .center-mining-wrapper {
          position: relative;
          top: -24px;
        }
        .mining-btn {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: #cbd5e1;
          border: 6px solid #f8fafc;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
          cursor: pointer;
          margin-bottom: 6px;
        }
        .mining-btn.active {
          background: linear-gradient(135deg, #0ea5e9, #0284c7);
          box-shadow: 0 8px 25px rgba(14,165,233,0.4);
        }
      `}</style>
        </div>
    );
}
