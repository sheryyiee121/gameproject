"use client";

import React from 'react';
import { useRouter } from 'next/navigation';

export default function TaskPage() {
  const router = useRouter();

  return (
    <div className="task-root">
      {/* Top Tabs */}
      <div className="top-container">
        <div className="tabs-container">
          <button className="tab active">Bonus Center</button>
          <button className="tab">Leaderboard</button>
        </div>
      </div>

      <main className="main-content">
        {/* Promo Banner */}
        <div className="promo-banner">
          <div className="promo-content">
            <h2 className="promo-title">EXCLUSIVE<br />DEPOSIT REWARD</h2>
            <p className="promo-subtitle">&gt;&gt; UPGRADE YOUR PARTICIPATION &amp; UNLOCK BIGGER REWARDS &lt;&lt;</p>
            <div className="promo-boxes">
              <div className="promo-box">
                <span className="p-lbl">DEPOSIT</span>
                <span className="p-amt">100 <span className="p-cur">USDT</span></span>
              </div>
              <div className="promo-box highlight">
                <span className="p-lbl">GET</span>
                <span className="p-amt">10 <span className="p-cur">BONUS</span></span>
              </div>
            </div>
          </div>
        </div>

        {/* Rewards Card */}
        <div className="rewards-card">
          <div className="reward-stats">
            <div className="stat-box">
              <span className="stat-lbl">Today Reward</span>
              <span className="stat-val">0 USDT</span>
            </div>
            <div className="stat-box">
              <span className="stat-lbl">Total Reward</span>
              <span className="stat-val">6 USDT</span>
            </div>
          </div>
          <div className="reward-actions">
            <button className="btn-outline">Collect</button>
            <button className="btn-solid">Reward Details</button>
          </div>
        </div>

        {/* Sub Navigation */}
        <div className="sub-nav">
          <button className="sub-nav-item active">Upgrade Bonus</button>
          <button className="sub-nav-item">Daily Bonus 🔥</button>
          <button className="sub-nav-item">Activity Bonus</button>
        </div>

        {/* Upgrade Items */}
        <div className="upgrade-list">

          {/* Bronze */}
          <div className="upgrade-card">
            <div className="ticket">
              <span className="t-amt">5</span>
              <span className="t-lbl">USDT<br />Bonus</span>
            </div>
            <div className="card-info">
              <h3 className="card-title">Upgrade To Bronze</h3>
              <p className="card-desc">Upgrade To Bronze And Get +5 USDT</p>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: '100%' }}></div>
              </div>
              <div className="card-bottom">
                <span className="amount-text">0 USDT</span>
                <button className="btn-claim received">Received</button>
              </div>
            </div>
          </div>

          {/* Silver */}
          <div className="upgrade-card">
            <div className="ticket">
              <span className="t-amt">10</span>
              <span className="t-lbl">USDT<br />Bonus</span>
            </div>
            <div className="card-info">
              <h3 className="card-title">Upgrade To Silver</h3>
              <p className="card-desc">Upgrade To Silver And Get +10 USDT</p>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: '0%' }}></div>
              </div>
              <div className="card-bottom">
                <span className="amount-text">0 USDT</span>
                <button className="btn-claim disabled">CLAIM BONUS</button>
              </div>
            </div>
          </div>

          {/* Gold */}
          <div className="upgrade-card">
            <div className="ticket">
              <span className="t-amt">25</span>
              <span className="t-lbl">USDT<br />Bonus</span>
            </div>
            <div className="card-info">
              <h3 className="card-title">Upgrade To Gold</h3>
              <p className="card-desc">Upgrade To Gold And Get +25 USDT</p>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: '0%' }}></div>
              </div>
              <div className="card-bottom">
                <span className="amount-text">0 USDT</span>
                <button className="btn-claim disabled">CLAIM BONUS</button>
              </div>
            </div>
          </div>

          {/* Platinium */}
          <div className="upgrade-card">
            <div className="ticket">
              <span className="t-amt">50</span>
              <span className="t-lbl">USDT<br />Bonus</span>
            </div>
            <div className="card-info">
              <h3 className="card-title">Upgrading To Platinium</h3>
              <p className="card-desc">Upgrade To Platinium And Get +50 USDT</p>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: '0%' }}></div>
              </div>
              <div className="card-bottom">
                <span className="amount-text">0 USDT</span>
                <button className="btn-claim disabled">CLAIM BONUS</button>
              </div>
            </div>
          </div>

          {/* Diamond */}
          <div className="upgrade-card">
            <div className="ticket">
              <span className="t-amt">250</span>
              <span className="t-lbl">USDT<br />Bonus</span>
            </div>
            <div className="card-info">
              <h3 className="card-title">Upgrade To Diamond</h3>
              <p className="card-desc">Upgrade To Diamond And Get +250 USDT</p>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: '0%' }}></div>
              </div>
              <div className="card-bottom">
                <span className="amount-text">0 USDT</span>
                <button className="btn-claim disabled">CLAIM BONUS</button>
              </div>
            </div>
          </div>

          {/* VIP */}
          <div className="upgrade-card">
            <div className="ticket">
              <span className="t-amt" style={{ fontSize: '14px' }}>500</span>
              <span className="t-lbl">USDT<br />Bonus</span>
            </div>
            <div className="card-info">
              <h3 className="card-title">Upgrade To VIP</h3>
              <p className="card-desc">Upgrade To VIP And Get +500 USDT</p>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: '0%' }}></div>
              </div>
              <div className="card-bottom">
                <span className="amount-text">0 USDT</span>
                <button className="btn-claim disabled">CLAIM BONUS</button>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="bottom-nav">
        <button className="nav-item" onClick={() => router.push('/dashboard')}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
          <span>Home</span>
        </button>
        <button className="nav-item active">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
          <span>Task</span>
        </button>
        <div className="nav-item center-mining-wrapper" onClick={() => router.push('/mining')}>
          <button className="mining-btn">
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
        .task-root {
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

        .top-container {
          padding: 16px 20px 10px;
          display: flex;
          justify-content: center;
        }
        .tabs-container {
          background: #ffffff;
          border-radius: 30px;
          padding: 4px;
          display: flex;
          box-shadow: 0 2px 10px rgba(0,0,0,0.02);
          border: 1px solid #f1f5f9;
          width: 80%;
          max-width: 300px;
        }
        .tab {
          flex: 1;
          background: transparent;
          border: none;
          padding: 8px 0;
          border-radius: 24px;
          font-size: 14px;
          font-weight: 700;
          color: #64748b;
          cursor: pointer;
          transition: all 0.2s;
        }
        .tab.active {
          background: linear-gradient(135deg, #0ea5e9, #0284c7);
          color: #fff;
          box-shadow: 0 4px 12px rgba(14,165,233,0.3);
        }

        .main-content {
          display: flex;
          flex-direction: column;
          padding: 8px 20px 20px;
          gap: 16px;
        }

        .promo-banner {
          background: linear-gradient(135deg, #001f54 0%, #0a4087 100%);
          border-radius: 20px;
          padding: 20px;
          position: relative;
          overflow: hidden;
          box-shadow: 0 10px 25px rgba(10,64,135,0.25);
          color: #ffffff;
        }
        .promo-banner::before {
            content: "";
            position: absolute;
            top:-50%; left:-50%; right:-50%; bottom:-50%;
            background: radial-gradient(circle at 80% 50%, rgba(14,165,233,0.4), transparent 60%);
        }
        .promo-content {
          position: relative;
          z-index: 2;
        }
        .promo-title {
          font-size: 24px;
          font-weight: 900;
          font-style: italic;
          line-height: 1.1;
          margin: 0 0 6px;
          text-shadow: 0 2px 10px rgba(14,165,233,0.5);
          color: #e0f2fe;
        }
        .promo-subtitle {
          font-size: 9px;
          font-weight: 700;
          color: #bae6fd;
          letter-spacing: 0.5px;
          margin-bottom: 16px;
        }
        .promo-boxes {
          display: flex;
          gap: 10px;
        }
        .promo-box {
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 12px;
          padding: 10px;
          display: flex;
          flex-direction: column;
          align-items: center;
          flex: 1;
        }
        .promo-box.highlight {
          background: rgba(14,165,233,0.2);
          border-color: #38bdf8;
        }
        .p-lbl {
           font-size: 10px;
           font-weight: 600;
           color: #e0f2fe;
        }
        .p-amt {
           font-size: 22px;
           font-weight: 900;
           line-height: 1.1;
        }
        .p-cur {
           font-size: 11px;
           font-weight: 700;
        }

        .rewards-card {
          background: #ffffff;
          border-radius: 20px;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 20px;
          box-shadow: 0 6px 20px rgba(0,0,0,0.02);
          border: 1px solid #e2e8f0;
        }
        .reward-stats {
          display: flex;
          gap: 16px;
        }
        .stat-box {
          flex: 1;
          background: #f8fafc;
          border-radius: 12px;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .stat-lbl {
          font-size: 12px;
          color: #64748b;
          font-weight: 600;
        }
        .stat-val {
          font-size: 17px;
          font-weight: 800;
          color: #0f172a;
        }
        .reward-actions {
          display: flex;
          gap: 12px;
        }
        .btn-outline {
          flex: 1;
          background: transparent;
          border: 2px solid #0ea5e9;
          color: #0ea5e9;
          border-radius: 24px;
          padding: 12px;
          font-weight: 700;
          font-size: 14px;
        }
        .btn-solid {
          flex: 1;
          background: linear-gradient(135deg, #0ea5e9, #0284c7);
          color: #fff;
          border: none;
          border-radius: 24px;
          padding: 12px;
          font-weight: 700;
          font-size: 14px;
          box-shadow: 0 4px 12px rgba(14,165,233,0.25);
        }

        .sub-nav {
          display: flex;
          justify-content: space-between;
          border-bottom: 2px solid #e2e8f0;
          margin-bottom: 10px;
        }
        .sub-nav-item {
          background: none;
          border: none;
          padding: 10px 0;
          font-size: 14px;
          font-weight: 700;
          color: #64748b;
          cursor: pointer;
        }
        .sub-nav-item.active {
          color: #0f172a;
          border-bottom: 3px solid #0ea5e9;
          margin-bottom: -2px;
        }

        .upgrade-list {
          display: flex;
          flex-direction: column;
          gap: 14px;
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
        .ticket {
          width: 52px;
          height: 64px;
          background: #e0f2fe;
          border: 2px solid #0ea5e9;
          border-radius: 12px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: #0284c7;
          flex-shrink: 0;
        }
        .t-amt {
          font-size: 20px;
          font-weight: 900;
          line-height: 1;
        }
        .t-lbl {
          font-size: 9px;
          font-weight: 800;
          text-align: center;
          margin-top: 2px;
          line-height: 1.1;
        }

        .card-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .card-title {
          font-size: 15px;
          font-weight: 800;
          margin: 0;
          color: #0f172a;
        }
        .card-desc {
          font-size: 11px;
          color: #64748b;
          font-weight: 500;
          margin: 0 0 4px 0;
        }
        .progress-bar {
          height: 6px;
          background: #f1f5f9;
          border-radius: 3px;
          overflow: hidden;
          margin-bottom: 4px;
        }
        .progress-fill {
          height: 100%;
          background: #0ea5e9;
          border-radius: 3px;
        }
        .card-bottom {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .amount-text {
          font-size: 12px;
          font-weight: 700;
          color: #0ea5e9;
        }
        .btn-claim {
          padding: 6px 14px;
          border-radius: 12px;
          font-size: 10px;
          font-weight: 800;
          border: none;
        }
        .btn-claim.disabled {
          background: #f1f5f9;
          color: #94a3b8;
        }
        .btn-claim.received {
          background: transparent;
          border: 1px solid #cbd5e1;
          color: #64748b;
        }

        /* Bottom Nav styles */
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
          background: linear-gradient(135deg, #0ea5e9, #0284c7);
          border: 6px solid #f8fafc;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 25px rgba(14,165,233,0.4);
          cursor: pointer;
          margin-bottom: 6px;
        }
      `}</style>
    </div>
  );
}
