"use client";

import React from 'react';
import { useRouter } from 'next/navigation';

export default function AssetPage() {
  const router = useRouter();

  return (
    <div className="asset-root">
      {/* Top Navbar */}
      <header className="top-nav">
        <div className="empty-space" style={{ width: 24 }}></div>
        <h1 className="nav-title">Assets</h1>
        <div className="empty-space" style={{ width: 24 }}></div>
      </header>

      <main className="main-content">

        {/* Tabs */}
        <div className="tabs-container">
          <button className="tab active">Assets</button>
          <button className="tab">Exchange</button>
        </div>

        {/* Total Assets Card */}
        <div className="total-assets-card">
          <div className="card-header">
            <span className="card-title">Total Assets</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
          </div>

          <div className="card-main-val">
            <span className="amount">788.6932</span>
            <span className="currency">USDT</span>
          </div>

          <div className="card-trend">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="19" x2="12" y2="5"></line>
              <polyline points="5 12 12 5 19 12"></polyline>
            </svg>
            <span className="trend-val">+233.2035$(41%)</span>
            <span className="trend-period">Last 7 Days</span>
          </div>

          <div className="inner-boxes">
            <div className="inner-box">
              <span className="box-title">Available</span>
              <span className="box-val">488.6932$</span>
            </div>
            <div className="inner-box">
              <span className="box-title">Stake Amount</span>
              <span className="box-val">300$</span>
            </div>
          </div>
        </div>

        {/* Action Icons Grid */}
        <div className="action-row">
          <div className="action-item">
            <div className="action-icon-wrapper">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
            </div>
            <span className="action-label">Deposit</span>
          </div>
          <div className="action-item">
            <div className="action-icon-wrapper">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="17 8 12 3 7 8"></polyline>
                <line x1="12" y1="3" x2="12" y2="15"></line>
              </svg>
            </div>
            <span className="action-label">Withdraw</span>
          </div>
          <div className="action-item">
            <div className="action-icon-wrapper">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
            </div>
            <span className="action-label">Bill</span>
          </div>
        </div>

        {/* Asset List */}
        <div className="asset-list-card">
          <div className="asset-list-header">
            <span>Asset List</span>
          </div>

          {/* SXX */}
          <div className="asset-row">
            <div className="asset-left">
              <div className="coin-icon" style={{ background: '#0ea5e9' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" fill="#fff" />
                  <path d="M2 17l10 5 10-5M2 12l10 5 10-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <span className="coin-name">SXX</span>
            </div>
            <div className="asset-right">
              <span className="coin-bal">22163.2962</span>
              <span className="coin-usd">≈ 110.8164 USDT</span>
            </div>
          </div>

          {/* TRX */}
          <div className="asset-row">
            <div className="asset-left">
              <div className="coin-icon" style={{ background: '#ef4444' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2"></polygon><line x1="12" y1="22" x2="12" y2="12"></line><line x1="22" y1="8.5" x2="12" y2="12"></line><line x1="2" y1="8.5" x2="12" y2="12"></line></svg>
              </div>
              <span className="coin-name">TRX</span>
            </div>
            <div className="asset-right">
              <span className="coin-bal">0</span>
              <span className="coin-usd">≈ 0 USDT</span>
            </div>
          </div>

          {/* USDT */}
          <div className="asset-row">
            <div className="asset-left">
              <div className="coin-icon" style={{ background: '#10b981' }}>
                <span style={{ color: '#fff', fontWeight: 'bold', fontSize: '14px' }}>₮</span>
              </div>
              <span className="coin-name">USDT</span>
            </div>
            <div className="asset-right">
              <span className="coin-bal">165.929</span>
              <span className="coin-usd">≈ 165.929 USDT</span>
            </div>
          </div>

          {/* DOGE */}
          <div className="asset-row">
            <div className="asset-left">
              <div className="coin-icon" style={{ background: '#f59e0b' }}>
                <span style={{ color: '#fff', fontWeight: 'bold', fontSize: '14px' }}>Ð</span>
              </div>
              <span className="coin-name">DOGE</span>
            </div>
            <div className="asset-right">
              <span className="coin-bal">0</span>
              <span className="coin-usd">≈ 0 USDT</span>
            </div>
          </div>

          {/* FIL */}
          <div className="asset-row">
            <div className="asset-left">
              <div className="coin-icon" style={{ background: '#3b82f6' }}>
                <span style={{ color: '#fff', fontWeight: 'bold', fontSize: '14px' }}>⨎</span>
              </div>
              <span className="coin-name">FIL</span>
            </div>
            <div className="asset-right">
              <span className="coin-bal">0</span>
              <span className="coin-usd">≈ 0 USDT</span>
            </div>
          </div>

          {/* ETH */}
          <div className="asset-row" style={{ borderBottom: 'none' }}>
            <div className="asset-left">
              <div className="coin-icon" style={{ background: '#6366f1' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 12 12 22 22 12 12 2"></polygon></svg>
              </div>
              <span className="coin-name">ETH</span>
            </div>
            <div className="asset-right">
              <span className="coin-bal">0</span>
              <span className="coin-usd">≈ 0 USDT</span>
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
        <button className="nav-item active">
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
        .asset-root {
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
          padding: 10px 20px 20px;
          gap: 20px;
        }

        .tabs-container {
          background: #ffffff;
          border-radius: 30px;
          padding: 4px;
          display: flex;
          box-shadow: 0 2px 10px rgba(0,0,0,0.02);
          border: 1px solid #f1f5f9;
        }
        .tab {
          flex: 1;
          background: transparent;
          border: none;
          padding: 10px 0;
          border-radius: 24px;
          font-size: 15px;
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

        .total-assets-card {
          background: #ffffff;
          border-radius: 24px;
          padding: 24px 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          box-shadow: 0 8px 30px rgba(0,0,0,0.03);
          border: 1px solid #e2e8f0;
          position: relative;
          overflow: hidden;
        }
        .total-assets-card::before {
            content: "";
            position: absolute;
            top: 0; left: 0; right: 0; height: 4px;
            background: linear-gradient(90deg, #0ea5e9, #38bdf8);
        }
        
        .card-header {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .card-title {
          font-size: 14px;
          color: #64748b;
          font-weight: 600;
        }
        
        .card-main-val {
          display: flex;
          align-items: baseline;
          gap: 8px;
        }
        .amount {
          font-size: 34px;
          font-weight: 800;
          color: #0f172a;
          letter-spacing: -1px;
        }
        .currency {
          font-size: 15px;
          font-weight: 700;
          color: #0ea5e9;
        }

        .card-trend {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 8px;
        }
        .trend-val {
          font-size: 14px;
          font-weight: 700;
          color: #10b981;
        }
        .trend-period {
          font-size: 13px;
          color: #94a3b8;
          font-weight: 500;
        }

        .inner-boxes {
          display: flex;
          width: 100%;
          gap: 12px;
        }
        .inner-box {
          flex: 1;
          background: #f8fafc;
          border-radius: 16px;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 4px;
          border: 1px solid #f1f5f9;
        }
        .box-title {
          font-size: 12px;
          color: #64748b;
          font-weight: 600;
        }
        .box-val {
          font-size: 16px;
          font-weight: 800;
          color: #0f172a;
        }

        .action-row {
          display: flex;
          justify-content: center;
          gap: 40px;
          margin: 10px 0;
        }
        .action-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
        }
        .action-icon-wrapper {
          width: 52px;
          height: 52px;
          border-radius: 50%;
          background: linear-gradient(135deg, #1e293b, #334155);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 6px 16px rgba(0,0,0,0.06);
          transition: transform 0.2s;
        }
        .action-item:hover .action-icon-wrapper { transform: translateY(-3px); }
        .action-label {
          font-size: 13px;
          color: #334155;
          font-weight: 700;
        }

        .asset-list-card {
          background: #ffffff;
          border-radius: 20px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 8px 30px rgba(0,0,0,0.02);
          display: flex;
          flex-direction: column;
        }
        .asset-list-header {
          padding: 20px;
          border-bottom: 1px solid #f1f5f9;
        }
        .asset-list-header span {
          font-size: 14px;
          font-weight: 700;
          color: #64748b;
        }

        .asset-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 20px;
          border-bottom: 1px solid #f1f5f9;
        }
        .asset-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .coin-icon {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }
        .coin-name {
          font-size: 16px;
          font-weight: 800;
          color: #0f172a;
        }
        .asset-right {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 2px;
        }
        .coin-bal {
          font-size: 16px;
          font-weight: 800;
          color: #0f172a;
        }
        .coin-usd {
          font-size: 12px;
          font-weight: 600;
          color: #94a3b8;
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
