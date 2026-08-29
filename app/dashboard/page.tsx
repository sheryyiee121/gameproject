"use client";

import React from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
    const router = useRouter();

    return (
        <div className="dashboard-root">
            {/* Top Navbar */}
            <header className="top-nav">
                <div className="logo-section">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                        <path d="M12 2L2 7l10 5 10-5-10-5z" fill="#0ea5e9" />
                        <path d="M2 17l10 5 10-5M2 12l10 5 10-5" stroke="#0ea5e9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="logo-text">SaxAi</span>
                </div>
                <div className="nav-icons">
                    <button className="icon-btn" aria-label="Support">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 18v-6a9 9 0 0118 0v6"></path>
                            <path d="M21 19a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 012-2h3zM3 19a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H3z"></path>
                        </svg>
                    </button>
                    <button className="icon-btn" aria-label="Language">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="2" y1="12" x2="22" y2="12"></line>
                            <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"></path>
                        </svg>
                    </button>
                    <button className="icon-btn" aria-label="Notifications">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                            <path d="M13.73 21a2 2 0 01-3.46 0"></path>
                        </svg>
                    </button>
                </div>
            </header>

            {/* Hero Section */}
            <main className="main-content">
                <div className="mining-bonus">
                    <p className="bonus-label">Free Mining Bonus</p>
                    <div className="bonus-amount-row">
                        <span className="bonus-amount">0.0063</span>
                        <span className="bonus-currency">USDT/Hour</span>
                        <span className="trend-icons">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="#00d084"><path d="M12 4l-8 8h16z" /></svg>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="#ff4d4f"><path d="M12 20l8-8H4z" /></svg>
                        </span>
                    </div>
                </div>

                <div className="center-graphic">
                    <div className="shield-blob">
                        <div className="lightning-bolt">
                            <svg viewBox="0 0 24 24" fill="url(#bolt-grad)" width="80" height="80">
                                <defs>
                                    <linearGradient id="bolt-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="#80d0ff" />
                                        <stop offset="100%" stopColor="#1e88e5" />
                                    </linearGradient>
                                </defs>
                                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="stats-row">
                    <div className="stat-pill">
                        <span className="stat-icon">⚛️</span>
                        <div className="stat-info">
                            <span className="stat-title">CPU</span>
                            <span className="stat-val">2008 Tflops</span>
                        </div>
                    </div>
                    <div className="stat-pill">
                        <span className="stat-icon">⏱️</span>
                        <div className="stat-info">
                            <span className="stat-title">Staking Day</span>
                            <span className="stat-val">328 Days</span>
                        </div>
                    </div>
                    <div className="stat-pill">
                        <span className="stat-icon">📱</span>
                        <div className="stat-info">
                            <span className="stat-title">Device</span>
                            <span className="stat-val">--</span>
                        </div>
                    </div>
                </div>
            </main>

            {/* Dark Panel Section */}
            <div className="dark-panel">
                <div className="announcement-bar">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                        <path d="M15.54 8.46a5 5 0 010 7.07"></path>
                    </svg>
                    <div className="scroll-text">
                        <span>Invite 1 Active</span>
                    </div>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="3" y1="12" x2="21" y2="12"></line>
                        <line x1="3" y1="6" x2="21" y2="6"></line>
                        <line x1="3" y1="18" x2="21" y2="18"></line>
                    </svg>
                </div>

                <div className="action-grid">
                    <div className="action-item">
                        <div className="action-icon-wrapper gift-icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 12 20 22 4 22 4 12"></polyline>
                                <rect x="2" y="7" width="20" height="5"></rect>
                                <line x1="12" y1="22" x2="12" y2="7"></line>
                                <path d="M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7z"></path>
                                <path d="M12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z"></path>
                            </svg>
                        </div>
                        <span className="action-label">Task Center</span>
                    </div>
                    <div className="action-item">
                        <div className="action-icon-wrapper diamond-icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M6 3h12l4 6-10 13L2 9z"></path>
                            </svg>
                        </div>
                        <span className="action-label">Membership Levels</span>
                    </div>
                    <div className="action-item" style={{ cursor: 'pointer' }} onClick={() => router.push('/team')}>
                        <div className="action-icon-wrapper team-icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"></path>
                                <circle cx="9" cy="7" r="4"></circle>
                                <path d="M23 21v-2a4 4 0 00-3-3.87"></path>
                                <path d="M16 3.13a4 4 0 010 7.75"></path>
                            </svg>
                        </div>
                        <span className="action-label">My Team</span>
                    </div>
                    <div className="action-item">
                        <div className="action-icon-wrapper help-icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10"></circle>
                                <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"></path>
                                <line x1="12" y1="17" x2="12.01" y2="17"></line>
                            </svg>
                        </div>
                        <span className="action-label">Operation Tutorial</span>
                    </div>
                </div>

                <div className="profit-card">
                    <div className="profit-col">
                        <span className="profit-title">Today Profit</span>
                        <span className="profit-val">3.4538$</span>
                    </div>
                    <div className="divider"></div>
                    <div className="profit-col">
                        <span className="profit-title">Total Profit</span>
                        <span className="profit-val">704.2562$</span>
                    </div>
                </div>

                <div className="reward-card">
                    <div className="reward-info">
                        <span className="reward-title">Free Mining Reward</span>
                        <span className="reward-val">0.018$</span>
                    </div>
                    <button className="claim-btn">Claim</button>
                </div>

                {/* Promo Banner */}
                <div className="promo-banner">
                    <div className="banner-content">
                        <h2 className="banner-title">SAXAI<br /><span style={{ color: '#ff9800' }}>RAKSHA BANDHAN</span></h2>
                        <div className="banner-rewards">
                            <div className="reward-badge">1,000 SSXX</div>
                            <div className="reward-badge">1,500 SSXX</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Navigation */}
            <nav className="bottom-nav">
                <button className="nav-item active">
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
        .dashboard-root {
          min-height: 100vh;
          width: 100%;
          background: linear-gradient(135deg, #f6f9fc 0%, #eef2f6 100%);
          display: flex;
          flex-direction: column;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          color: #0f172a;
          position: relative;
          padding-bottom: 70px;
          overflow-x: hidden;
        }

        .top-nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 20px;
        }
        .logo-section {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .logo-text {
          font-size: 22px;
          font-weight: 800;
          color: #0f172a;
          letter-spacing: -0.5px;
        }
        .nav-icons {
          display: flex;
          gap: 12px;
        }
        .icon-btn {
          background: #ffffff;
          border: 1px solid rgba(0,0,0,0.05);
          box-shadow: 0 4px 12px rgba(0,0,0,0.04);
          border-radius: 50%;
          width: 42px;
          height: 42px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #475569;
          cursor: pointer;
          transition: transform 0.2s;
        }
        .icon-btn:hover { transform: scale(1.05); }

        .main-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 10px 20px 20px;
          flex: 1;
        }
        .mining-bonus {
          text-align: center;
          margin-bottom: 24px;
        }
        .bonus-label {
          margin: 0;
          font-size: 15px;
          color: #64748b;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .bonus-amount-row {
          display: flex;
          align-items: baseline;
          justify-content: center;
          gap: 6px;
          margin-top: 4px;
        }
        .bonus-amount {
          font-size: 38px;
          font-weight: 800;
          color: #0f172a;
          letter-spacing: -1px;
        }
        .bonus-currency {
          font-size: 15px;
          font-weight: 700;
          color: #0ea5e9;
        }
        .trend-icons {
          display: flex;
          flex-direction: column;
          margin-left: 6px;
        }

        .center-graphic {
          margin: 10px 0 30px;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .shield-blob {
          width: 170px;
          height: 170px;
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

        .stats-row {
          display: flex;
          justify-content: center;
          gap: 8px;
          width: 100%;
          padding: 0 10px;
        }
        .stat-pill {
          background: #ffffff;
          border: 1px solid rgba(0,0,0,0.04);
          box-shadow: 0 4px 15px rgba(0,0,0,0.03);
          border-radius: 20px;
          display: flex;
          align-items: center;
          padding: 10px 10px;
          gap: 8px;
          flex: 1;
          min-width: 0;
        }
        .stat-icon {
          font-size: 16px;
          flex-shrink: 0;
        }
        .stat-info {
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        .stat-title {
          font-size: 9.5px;
          color: #94a3b8;
          font-weight: 600;
          text-transform: uppercase;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .stat-val {
          font-size: 13px;
          font-weight: 800;
          color: #1e293b;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        /* Bright panel area at bottom */
        .dark-panel {
          background: #ffffff;
          border-top-left-radius: 32px;
          border-top-right-radius: 32px;
          padding: 24px 20px 90px;
          display: flex;
          flex-direction: column;
          gap: 18px;
          z-index: 1;
          box-shadow: 0 -15px 40px rgba(0,0,0,0.04);
        }

        .announcement-bar {
          background: #f0f9ff;
          border: 1px solid #e0f2fe;
          border-radius: 30px;
          padding: 12px 18px;
          display: flex;
          align-items: center;
          gap: 14px;
        }
        .scroll-text {
          flex: 1;
          font-size: 14.5px;
          font-weight: 600;
          color: #0c4a6e;
        }

        .action-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
          margin-top: 5px;
        }
        .action-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 10px;
        }
        .action-icon-wrapper {
          width: 56px;
          height: 56px;
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 20px rgba(0,0,0,0.08);
          transition: transform 0.2s;
        }
        .action-item:hover .action-icon-wrapper { transform: translateY(-4px); }
        .gift-icon { background: linear-gradient(135deg, #FF6B6B, #FF8E53); }
        .diamond-icon { background: linear-gradient(135deg, #0ea5e9, #38bdf8); }
        .team-icon { background: linear-gradient(135deg, #8B5CF6, #A78BFA); }
        .help-icon { background: linear-gradient(135deg, #10B981, #34D399); }
        .action-label {
          font-size: 13px;
          color: #475569;
          font-weight: 600;
        }

        .profit-card {
          background: #f8fafc;
          border: 1px solid #f1f5f9;
          border-radius: 20px;
          padding: 20px;
          display: flex;
          justify-content: space-around;
          align-items: center;
        }
        .profit-col {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
        }
        .profit-title {
          font-size: 12.5px;
          color: #64748b;
          font-weight: 500;
        }
        .profit-val {
          font-size: 22px;
          font-weight: 800;
          color: #0f172a;
        }
        .divider {
          width: 2px;
          height: 48px;
          background: #e2e8f0;
          border-radius: 2px;
        }

        .reward-card {
          background: #ffffff;
          border: 2px solid #e0f2fe;
          box-shadow: 0 10px 25px rgba(224,242,254,0.5);
          border-radius: 20px;
          padding: 16px 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .reward-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .reward-title {
          font-size: 13px;
          color: #64748b;
          font-weight: 600;
        }
        .reward-val {
          font-size: 24px;
          font-weight: 900;
          color: #0ea5e9;
        }
        .claim-btn {
          background: linear-gradient(135deg, #0ea5e9, #0284c7);
          color: #fff;
          border: none;
          border-radius: 24px;
          padding: 12px 28px;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          box-shadow: 0 4px 15px rgba(14,165,233,0.3);
          transition: transform 0.1s;
        }
        .claim-btn:active { transform: scale(0.95); }

        .promo-banner {
          background: linear-gradient(rgba(14,165,233,0.8), rgba(2,132,199,0.9)), url('https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80') center/cover;
          border-radius: 20px;
          border: none;
          padding: 24px;
          position: relative;
          overflow: hidden;
          margin-top: 5px;
          box-shadow: 0 10px 30px rgba(2,132,199,0.25);
        }
        .banner-content {
          position: relative;
          z-index: 2;
        }
        .banner-title {
          margin: 0;
          font-size: 26px;
          font-style: italic;
          line-height: 1.1;
          color: #ffffff;
          text-transform: uppercase;
        }
        .banner-rewards {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-top: 16px;
          align-items: flex-end;
        }
        .reward-badge {
          background: #ffffff;
          color: #0284c7;
          border: none;
          padding: 6px 14px;
          border-radius: 16px;
          font-weight: 800;
          font-size: 13px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }

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
