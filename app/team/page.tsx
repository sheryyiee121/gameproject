"use client";

import React from 'react';
import { useRouter } from 'next/navigation';

export default function TeamPage() {
    const router = useRouter();

    return (
        <div className="team-root">
            {/* Header */}
            <header className="page-header">
                <button className="back-btn" onClick={() => router.back()}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="19" y1="12" x2="5" y2="12"></line>
                        <polyline points="12 19 5 12 12 5"></polyline>
                    </svg>
                </button>
                <h1 className="header-title">Team</h1>
                <div style={{ width: 24 }}></div>
            </header>

            <main className="main-content">

                {/* 4 Cards Grid */}
                <div className="stats-grid-4">
                    <div className="stat-card">
                        <span className="sc-title">Team Size</span>
                        <span className="sc-val">0/0</span>
                        <div className="sc-trend">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 21 12 3 19 10 12 3 5 10 12 3"></polygon></svg>
                            <span>+0</span>
                        </div>
                    </div>
                    <div className="stat-card">
                        <span className="sc-title">Team Performance</span>
                        <span className="sc-val">0</span>
                        <div className="sc-trend">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 21 12 3 19 10 12 3 5 10 12 3"></polygon></svg>
                            <span>+0</span>
                        </div>
                    </div>
                    <div className="stat-card">
                        <span className="sc-title">Personal Performance</span>
                        <span className="sc-val">300</span>
                        <div className="sc-trend">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 21 12 3 19 10 12 3 5 10 12 3"></polygon></svg>
                            <span>+0</span>
                        </div>
                    </div>
                    <div className="stat-card">
                        <span className="sc-title">Team Benefits</span>
                        <span className="sc-val">0</span>
                        <div className="sc-trend">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 21 12 3 19 10 12 3 5 10 12 3"></polygon></svg>
                            <span>+0</span>
                        </div>
                    </div>
                </div>

                {/* Team List Button */}
                <button className="team-list-btn">
                    <span>Team List</span>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                </button>

                {/* Data View Section */}
                <div className="section-header">
                    <h2 className="section-title">Data View</h2>
                    <button className="btn-all">
                        All <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
                    </button>
                </div>

                <div className="chart-card">
                    <div className="tags-container">
                        <div className="tag active"><span className="dot blue"></span>Team Performance</div>
                        <div className="tag"><span className="dot teal"></span>Team Benefits</div>
                        <div className="tag"><span className="dot pink"></span>Team Size</div>
                        <div className="tag"><span className="dot yellow"></span>Team Recharge</div>
                        <div className="tag"><span className="dot purple"></span>Team Withdrawal</div>
                    </div>

                    <div className="chart-wrapper">
                        <div className="donut-chart">
                            <div className="donut-center">
                                <span className="d-val">0</span>
                                <span className="d-lbl">Team Performance</span>
                            </div>
                        </div>
                        {/* Legend text around chart */}
                        <div className="legend-text top-right">0%<br />Achievement...</div>
                        <div className="legend-text top-left">0%<br />Three gen...</div>
                        <div className="legend-text bottom-right">0%<br />Second gen...</div>
                    </div>

                    <div className="generation-stats">
                        <div className="gen-stat">
                            <span className="gs-title">Effective Number Of People In First Generation</span>
                            <span className="gs-val">0</span>
                        </div>
                        <div className="gen-stat">
                            <span className="gs-title">Effective Number Of People In The Second Generation</span>
                            <span className="gs-val">0</span>
                        </div>
                        <div className="gen-stat">
                            <span className="gs-title">Effective Number Of People In Third Generations</span>
                            <span className="gs-val">0</span>
                        </div>
                    </div>
                </div>

                {/* Deposit and Withdrawal */}
                <div className="section-header">
                    <h2 className="section-title">Team Deposit And Withdrawal</h2>
                </div>
                <div className="split-cards">
                    <div className="split-card">
                        <span className="sc-lbl">Cumulative Recharge</span>
                        <span className="sc-h-val">0 USDT</span>
                        <span className="sc-sub">New Members <span className="green">+ 0</span></span>
                    </div>
                    <div className="split-card">
                        <span className="sc-lbl">Cumulative Withdrawals</span>
                        <span className="sc-h-val">0 USDT</span>
                        <span className="sc-sub">New Members <span className="green">+ 0</span></span>
                    </div>
                </div>

                {/* Team Data Within Three Generations */}
                <div className="section-header">
                    <h2 className="section-title">Team Data Within Three Generations</h2>
                </div>
                <div className="generations-list">

                    {/* Gen 1 */}
                    <div className="gen-item">
                        <div className="gen-header">
                            <div className="gh-left">
                                <div className="badge badge-1"><span className="inner-b">1</span></div>
                                <span className="gh-title">First Generation Data</span>
                            </div>
                            <button className="btn-more"><span className="dots">...</span></button>
                        </div>
                        <div className="gen-row"><span className="gr-lbl">Team Size</span><span className="gr-val">0/0</span></div>
                        <div className="gen-row"><span className="gr-lbl">Cumulative Recharge</span><span className="gr-val">0</span></div>
                        <div className="gen-row no-border"><span className="gr-lbl">Total Rewards</span><span className="gr-val">0</span></div>
                    </div>

                    {/* Gen 2 */}
                    <div className="gen-item">
                        <div className="gen-header">
                            <div className="gh-left">
                                <div className="badge badge-2"><span className="inner-b">2</span></div>
                                <span className="gh-title">Second Generation Data</span>
                            </div>
                            <button className="btn-more"><span className="dots">...</span></button>
                        </div>
                        <div className="gen-row"><span className="gr-lbl">Team Size</span><span className="gr-val">0/0</span></div>
                        <div className="gen-row"><span className="gr-lbl">Cumulative Recharge</span><span className="gr-val">0</span></div>
                        <div className="gen-row no-border"><span className="gr-lbl">Total Rewards</span><span className="gr-val">0</span></div>
                    </div>

                    {/* Gen 3 */}
                    <div className="gen-item">
                        <div className="gen-header">
                            <div className="gh-left">
                                <div className="badge badge-3"><span className="inner-b">3</span></div>
                                <span className="gh-title">Three Generations Of Data</span>
                            </div>
                            <button className="btn-more"><span className="dots">...</span></button>
                        </div>
                        <div className="gen-row"><span className="gr-lbl">Team Size</span><span className="gr-val">0/0</span></div>
                        <div className="gen-row"><span className="gr-lbl">Cumulative Recharge</span><span className="gr-val">0</span></div>
                        <div className="gen-row no-border"><span className="gr-lbl">Total Rewards</span><span className="gr-val">0</span></div>
                    </div>

                </div>

            </main>

            <style jsx>{`
        .team-root {
          min-height: 100vh;
          width: 100%;
          background: #f8fafc;
          display: flex;
          flex-direction: column;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          color: #0f172a;
          padding-bottom: 30px;
        }

        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 20px;
          background: #ffffff;
          box-shadow: 0 2px 10px rgba(0,0,0,0.02);
          position: sticky;
          top: 0;
          z-index: 10;
        }
        .back-btn {
          background: none;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .header-title {
          font-size: 17px;
          font-weight: 700;
          margin: 0;
        }

        .main-content {
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .stats-grid-4 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }
        .stat-card {
           background: #ffffff;
           border: 1px solid #e2e8f0;
           border-radius: 16px;
           padding: 16px;
           display: flex;
           flex-direction: column;
           box-shadow: 0 4px 15px rgba(0,0,0,0.02);
           gap: 6px;
        }
        .sc-title {
           font-size: 11px;
           color: #64748b;
           font-weight: 600;
        }
        .sc-val {
           font-size: 19px;
           font-weight: 800;
           color: #0f172a;
        }
        .sc-trend {
           display: flex;
           align-items: center;
           gap: 4px;
           color: #10b981;
           font-size: 12.5px;
           font-weight: 700;
           margin-top: 2px;
        }

        .team-list-btn {
           background: linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%);
           border: 1px solid #e2e8f0;
           border-left: 4px solid #0ea5e9;
           border-radius: 14px;
           padding: 16px 20px;
           display: flex;
           justify-content: space-between;
           align-items: center;
           box-shadow: 0 4px 15px rgba(0,0,0,0.02);
           font-size: 15px;
           font-weight: 700;
           color: #0f172a;
           cursor: pointer;
        }

        .section-header {
           display: flex;
           justify-content: space-between;
           align-items: center;
           margin-top: 10px;
        }
        .section-title {
           font-size: 15px;
           font-weight: 800;
           color: #0f172a;
           margin: 0;
        }
        .btn-all {
           background: #f1f5f9;
           border: none;
           padding: 4px 10px;
           border-radius: 12px;
           font-size: 12px;
           font-weight: 600;
           color: #64748b;
           display: flex;
           align-items: center;
           gap: 2px;
        }

        .chart-card {
           background: #ffffff;
           border: 1px solid #e2e8f0;
           border-radius: 20px;
           padding: 20px;
           box-shadow: 0 6px 20px rgba(0,0,0,0.02);
           display: flex;
           flex-direction: column;
           align-items: center;
        }
        .tags-container {
           display: flex;
           flex-wrap: wrap;
           justify-content: center;
           gap: 10px;
           margin-bottom: 24px;
        }
        .tag {
           display: flex;
           align-items: center;
           gap: 4px;
           font-size: 11px;
           font-weight: 600;
           color: #64748b;
        }
        .tag.active {
           padding: 4px 10px;
           border: 1px solid #0ea5e9;
           border-radius: 12px;
           color: #0ea5e9;
           margin: -4px -10px;
        }
        .dot {
           width: 8px; height: 8px; border-radius: 50%;
        }
        .dot.blue { background: #0ea5e9; }
        .dot.teal { background: #14b8a6; }
        .dot.pink { background: #ec4899; }
        .dot.yellow { background: #f59e0b; }
        .dot.purple { background: #8b5cf6; }

        .chart-wrapper {
           position: relative;
           width: 100%;
           height: 180px;
           display: flex;
           justify-content: center;
           align-items: center;
           margin-bottom: 24px;
        }
        .donut-chart {
           width: 130px;
           height: 130px;
           border-radius: 50%;
           background: conic-gradient(
               #bfdbfe 0% 15%,
               #f1f5f9 15% 40%,
               #86efac 40% 75%,
               #fde68a 75% 100%
           );
           display: flex;
           align-items: center;
           justify-content: center;
        }
        .donut-center {
           width: 96px;
           height: 96px;
           background: #ffffff;
           border-radius: 50%;
           display: flex;
           flex-direction: column;
           align-items: center;
           justify-content: center;
           box-shadow: inset 0 2px 10px rgba(0,0,0,0.05);
        }
        .d-val { font-size: 26px; font-weight: 900; line-height: 1; }
        .d-lbl { font-size: 10px; color: #64748b; font-weight: 600; text-align: center; }

        .legend-text {
           position: absolute;
           font-size: 10px;
           color: #64748b;
           text-align: left;
           line-height: 1.2;
        }
        .legend-text.top-right { top: 20px; right: 10px; border-left: 1px solid #cbd5e1; padding-left: 6px; }
        .legend-text.top-left { top: 60px; left: 10px; border-right: 1px solid #cbd5e1; padding-right: 6px; text-align: right; }
        .legend-text.bottom-right { bottom: 0; right: 20px; border-left: 1px solid #cbd5e1; padding-left: 6px; }

        .generation-stats {
           display: grid;
           grid-template-columns: 1fr 1fr 1fr;
           gap: 12px;
           width: 100%;
           border-top: 1px solid #f1f5f9;
           padding-top: 16px;
        }
        .gen-stat {
           display: flex;
           flex-direction: column;
           align-items: center;
           text-align: center;
           gap: 8px;
        }
        .gs-title {
           font-size: 9px;
           color: #64748b;
           font-weight: 600;
           line-height: 1.3;
        }
        .gs-val {
           font-size: 16px;
           font-weight: 800;
           color: #0f172a;
        }

        .split-cards {
           display: flex;
           gap: 12px;
        }
        .split-card {
           flex: 1;
           background: #ffffff;
           border: 1px solid #e2e8f0;
           border-radius: 16px;
           padding: 16px;
           display: flex;
           flex-direction: column;
           gap: 10px;
        }
        .sc-lbl { font-size: 12px; color: #64748b; font-weight: 600; }
        .sc-h-val { font-size: 18px; font-weight: 800; color: #0f172a; }
        .sc-sub { font-size: 11px; font-weight: 600; color: #0f172a; margin-top: 4px;}
        .green { color: #10b981; }

        .generations-list {
           display: flex;
           flex-direction: column;
           gap: 16px;
        }
        .gen-item {
           background: #ffffff;
           border: 1px solid #e2e8f0;
           border-radius: 16px;
           box-shadow: 0 4px 15px rgba(0,0,0,0.02);
           display: flex;
           flex-direction: column;
        }
        .gen-header {
           display: flex;
           justify-content: space-between;
           align-items: center;
           padding: 16px;
           border-bottom: 2px solid #f1f5f9;
        }
        .gh-left {
           display: flex;
           align-items: center;
           gap: 10px;
        }
        .badge {
           width: 24px; height: 28px;
           clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
           display: flex;
           align-items: center;
           justify-content: center;
           color: #fff; font-size: 11px; font-weight: 800;
        }
        .badge.badge-1 { background: #ef4444; }
        .badge.badge-2 { background: #94a3b8; }
        .badge.badge-3 { background: #f59e0b; }
        .inner-b { transform: translateY(-1px); }
        .gh-title { font-size: 14px; font-weight: 800; color: #0f172a; }
        .btn-more { background: #f1f5f9; border: none; padding: 4px 12px; border-radius: 8px; color: #64748b; font-weight: 800; font-size: 11px; line-height: 1; }

        .gen-row {
           display: flex;
           justify-content: space-between;
           align-items: center;
           padding: 14px 16px;
           border-bottom: 1px solid #f1f5f9;
        }
        .gen-row.no-border { border-bottom: none; }
        .gr-lbl { font-size: 12.5px; color: #64748b; font-weight: 600; }
        .gr-val { font-size: 15px; font-weight: 700; color: #0f172a; }
      `}</style>
        </div>
    );
}
