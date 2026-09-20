"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc, increment } from 'firebase/firestore';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [showBonus, setShowBonus] = useState(false);
  const [showLangModal, setShowLangModal] = useState(false);

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'pt', name: 'Português (Portuguese)' },
    { code: 'pl', name: 'Polski (Polish)' },
    { code: 'ro', name: 'Română (Romanian)' },
    { code: 'fr', name: 'Français (French)' },
    { code: 'de', name: 'Deutsch (German)' },
    { code: 'zh', name: '中文 (Chinese)' },
    { code: 'el', name: 'Ελληνικά (Greek)' },
    { code: 'it', name: 'Italiano (Italian)' },
    { code: 'cs', name: 'Čeština (Czech)' }
  ];

  const currentLang = typeof window !== 'undefined' ? localStorage.getItem("nexmine_lang") || 'en' : 'en';

  const handleSelectLanguage = (code: string) => {
    localStorage.setItem("nexmine_lang", code);
    document.cookie = `googtrans=/en/${code}; path=/; domain=${window.location.hostname};`;
    document.cookie = `googtrans=/en/${code}; path=/;`;
    setShowLangModal(false);
    window.location.reload();
  };

  useEffect(() => {
    const uid = localStorage.getItem("nexmine_uid");
    if (uid) {
      getDoc(doc(db, "users", uid)).then(docSnap => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setUser(data);
          // Check if they haven't claimed the bonus yet
          if (!data.hasClaimedBonus) {
            setShowBonus(true);
          }
        } else {
          router.push('/login');
        }
      });
    } else {
      router.push('/login');
    }
  }, [router]);

  const handleClaimBonus = async () => {
    if (!user) return;
    try {
      await updateDoc(doc(db, "users", user.uid), {
        'balances.usdt': increment(5),
        hasClaimedBonus: true
      });
      setShowBonus(false);
      alert("Incredible! $5 USDT has been instantly deposited into your Wallet!");
    } catch (err: any) {
      alert("Failed to claim bonus: " + err.message);
    }
  };

  return (
    <div className="dashboard-root">
      {/* 5 Dollar Bonus Modal */}
      {showBonus && (
        <div className="bonus-modal-overlay">
          <div className="bonus-modal-content">
            <h2>🎉 Welcome to Nexmine!</h2>
            <p>We are thrilled to have you! Click the button below to instantly claim your <strong>$5 USDT</strong> starter bonus.</p>
            <button className="claim-btn" onClick={handleClaimBonus}>
              Claim $5 USDT
            </button>
          </div>
        </div>
      )}

      {/* Top Navbar */}
      <header className="top-nav">
        <div className="logo-section">
          <img src="/nexmine-ai-logo.png" alt="Nexmine AI" style={{ height: '32px', width: 'auto', objectFit: 'contain' }} />
        </div>
        <div className="nav-icons">
          <a href="https://t.me/Nexminesupport1" target="_blank" rel="noopener noreferrer" className="icon-btn" aria-label="Customer Support">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 18v-6a9 9 0 0118 0v6"></path>
              <path d="M21 19a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 012-2h3zM3 19a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H3z"></path>
            </svg>
          </a>
          <button className="icon-btn" aria-label="Language" onClick={() => setShowLangModal(true)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="2" y1="12" x2="22" y2="12"></line>
              <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"></path>
            </svg>
          </button>
          <button className="icon-btn" aria-label="Notifications" onClick={() => alert('🔔 Notifications coming soon!')}>
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
          <h2 style={{
            color: '#fff',
            fontSize: '28px',
            textAlign: 'center',
            fontWeight: '800',
            margin: '60px 0',
            letterSpacing: '-0.5px',
            background: 'linear-gradient(135deg, #ffffff 0%, #94a3b8 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Nexmine is bringing rewards
          </h2>
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
          <div className="action-item" onClick={() => router.push('/task')}>
            <div className="action-icon-wrapper gift-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 12 20 22 4 22 4 12" /><rect x="2" y="7" width="20" height="5" /><line x1="12" y1="22" x2="12" y2="7" /><path d="M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7z" /><path d="M12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z" /></svg>
            </div>
            <span className="action-label">Task Center</span>
          </div>
          <div className="action-item" onClick={() => router.push('/membership')}>
            <div className="action-icon-wrapper diamond-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 3h12l4 6-10 13L2 9z" /></svg>
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
          <div className="action-item" onClick={() => router.push('/tutorial')}>
            <div className="action-icon-wrapper help-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
            </div>
            <span className="action-label">Operation Tutorial</span>
          </div>
        </div>

        {/* Feature Cards Grid (Bonus Center & GameFi) */}
        <div className="feature-cards-grid">
          <div className="feature-card" onClick={() => router.push('/task')} style={{ cursor: 'pointer' }}>
            <span className="feature-title">Bonus Center</span>
            <div className="feature-img-wrapper">
              <img src="/bonus_center.png" alt="Bonus Center" className="feature-img" />
            </div>
          </div>
          <div className="feature-card" onClick={() => router.push('/gamefi')}>
            <span className="feature-title">GameFi</span>
            <div className="feature-img-wrapper" style={{ right: 0, bottom: -5 }}>
              <img src="/gamefi_safe.png" alt="GameFi" className="feature-img" />
            </div>
          </div>
        </div>

        <div className="profit-card">
          <div className="profit-col">
            <span className="profit-title">Today Profit</span>
            <span className="profit-val">{(user?.todayProfit || 0).toFixed(4)}$</span>
          </div>
          <div className="divider"></div>
          <div className="profit-col">
            <span className="profit-title">Total Profit</span>
            <span className="profit-val">{(user?.totalProfit || 0).toFixed(4)}$</span>
          </div>
        </div>

        <div className="reward-card">
          <div className="reward-info">
            <span className="reward-title">Free Mining Reward</span>
            <span className="reward-val">0.018$</span>
          </div>
          <button className="claim-btn" onClick={() => alert('⛏️ Mining rewards are credited automatically by admin. Check your balance!')}>Claim</button>
        </div>

        {/* Promo Banner */}
        <div className="promo-banner">
          <div className="banner-content">
            <h2 className="banner-title">NEXMINE<br /><span style={{ color: '#ff9800' }}>BIG BONUS COMING SOON</span></h2>
          </div>
        </div>

        {/* Partners Slideshow */}
        <div className="partners-section">
          <h3 style={{ fontSize: '16px', color: '#fff', fontWeight: 'bold', padding: '0 20px', marginBottom: '15px' }}>Partners</h3>
          <div className="marquee-container">
            <div className="marquee-content">
              {[1, 2].map((set) => (
                <div key={set} style={{ display: 'flex', gap: '15px', paddingRight: '15px' }}>
                  <div className="partner-item">
                    <img src="https://cryptologos.cc/logos/bnb-bnb-logo.svg?v=040" alt="Binance" style={{ width: 22, height: 22, marginRight: 6 }} />
                    <span style={{ color: '#F0B90B', fontWeight: 800, fontSize: '14px', letterSpacing: '0.5px' }}>BINANCE</span>
                  </div>
                  <div className="partner-item">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" alt="Google" style={{ height: 24 }} />
                  </div>
                  <div className="partner-item">
                    <svg width="18" height="18" viewBox="0 0 88 88" style={{ marginRight: 8 }}>
                      <path fill="#f35325" d="M0 0h41.5v41.5H0z" /><path fill="#81bc06" d="M46.5 0H88v41.5H46.5z" /><path fill="#05a6f0" d="M0 46.5h41.5V88H0z" /><path fill="#ffba08" d="M46.5 46.5H88V88H46.5z" />
                    </svg>
                    <span style={{ color: '#fff', fontWeight: 600, fontSize: '15px' }}>Microsoft</span>
                  </div>
                  <div className="partner-item">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/2/21/Nvidia_logo.svg" alt="Nvidia" style={{ height: 26, filter: 'brightness(0) invert(1)' }} />
                  </div>
                  <div className="partner-item">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/4/4d/OpenAI_Logo.svg" alt="OpenAI" style={{ height: 24, filter: 'brightness(0) invert(1)' }} />
                  </div>
                  <div className="partner-item">
                    <span style={{ color: '#d97757', fontWeight: 700, fontSize: '15px', marginRight: '4px', fontFamily: 'serif' }}>Claude</span>
                    <span style={{ color: '#fff', fontSize: '11px', opacity: 0.8 }}>by Anthropic</span>
                  </div>
                  <div className="partner-item">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/f/f9/Salesforce.com_logo.svg" alt="Salesforce" style={{ height: 28, transform: 'scale(1.1)' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Language Modal */}
      {showLangModal && (
        <div className="modal-overlay" onClick={() => setShowLangModal(false)}>
          <div className="lang-modal" onClick={e => e.stopPropagation()}>
            <div className="lang-modal-header">
              <h3>Select Language</h3>
              <button className="close-btn" onClick={() => setShowLangModal(false)}>✕</button>
            </div>
            <div className="lang-grid">
              {languages.map(lang => (
                <button
                  key={lang.code}
                  className={`lang-btn ${currentLang === lang.code ? 'active' : ''}`}
                  onClick={() => handleSelectLanguage(lang.code)}
                >
                  {lang.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

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
      </nav >

      <style jsx>{`
        .dashboard-root {
          min-height: 100vh;
          width: 100%;
          background: #00030D;
          display: flex;
          flex-direction: column;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          color: #ffffff;
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
          color: #ffffff;
          letter-spacing: -0.5px;
        }
        .nav-icons {
          display: flex;
          gap: 12px;
        }
        .icon-btn {
          background: #010413;
          border: 1px solid rgba(129,136,148,0.2);
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
          border-radius: 50%;
          width: 42px;
          height: 42px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #818894;
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
          color: #818894;
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
          color: #ffffff;
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
          background: #010413;
          border: 4px solid rgba(129,136,148,0.15);
          border-radius: 50%;
          box-shadow: 0 15px 35px rgba(14,165,233,0.2), inset 0 0 20px rgba(14,165,233,0.05);
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
          background: #010413;
          border: 1px solid rgba(129,136,148,0.15);
          box-shadow: 0 4px 15px rgba(0,0,0,0.2);
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
          color: #818894;
          font-weight: 600;
          text-transform: uppercase;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .stat-val {
          font-size: 13px;
          font-weight: 800;
          color: #ffffff;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        /* Bright panel area at bottom */
        .dark-panel {
          background: #010413;
          border-top-left-radius: 32px;
          border-top-right-radius: 32px;
          padding: 24px 20px 90px;
          display: flex;
          flex-direction: column;
          gap: 18px;
          z-index: 1;
          box-shadow: 0 -15px 40px rgba(0,0,0,0.4);
        }

        .announcement-bar {
          background: rgba(14,165,233,0.08);
          border: 1px solid rgba(14,165,233,0.2);
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
          color: #0ea5e9;
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
          color: #818894;
          font-weight: 600;
        }

        .feature-cards-grid {
          display: flex;
          gap: 12px;
          margin: 5px 0;
        }
        .feature-card {
          flex: 1;
          background: linear-gradient(145deg, #0f1c32 0%, #061023 100%);
          border: 1px solid rgba(56,189,248,0.2);
          border-radius: 16px;
          padding: 16px;
          display: flex;
          flex-direction: column;
          position: relative;
          min-height: 130px;
          overflow: hidden;
          box-shadow: 0 10px 20px rgba(0,0,0,0.3), inset 0 0 20px rgba(14,165,233,0.05);
          cursor: pointer;
          transition: transform 0.2s;
        }
        .feature-card:hover {
          transform: translateY(-2px);
          border-color: rgba(56,189,248,0.4);
        }
        .feature-title {
          font-size: 15px;
          font-weight: 800;
          color: #ffffff;
          position: relative;
          z-index: 2;
          text-shadow: 0 2px 4px rgba(0,0,0,0.5);
          text-transform: capitalize;
        }
        .feature-img-wrapper {
          position: absolute;
          bottom: -5px;
          right: -15px;
          width: 100px;
          height: 100px;
          display: flex;
          align-items: flex-end;
          justify-content: flex-end;
          z-index: 1;
        }
        .feature-img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          mix-blend-mode: lighten;
          -webkit-mask-image: linear-gradient(to right, transparent, black 25%);
          mask-image: linear-gradient(to right, transparent, black 25%);
        }

        .profit-card {
          background: #000717;
          border: 1px solid rgba(129,136,148,0.15);
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
          color: #818894;
          font-weight: 500;
        }
        .profit-val {
          font-size: 22px;
          font-weight: 800;
          color: #ffffff;
        }
        .divider {
          width: 2px;
          height: 48px;
          background: rgba(129,136,148,0.2);
          border-radius: 2px;
        }

        .reward-card {
          background: #000717;
          border: 1px solid rgba(14,165,233,0.25);
          box-shadow: 0 10px 25px rgba(14,165,233,0.1);
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
          color: #818894;
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
        /* Modal Styles */
        .bonus-modal-overlay {
            position: fixed;
            top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(0,0,0,0.6);
            z-index: 9999;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .bonus-modal-content {
            background: #010413;
            border: 1px solid rgba(129,136,148,0.2);
            width: 90%;
            max-width: 350px;
            border-radius: 16px;
            padding: 30px 20px;
            text-align: center;
            box-shadow: 0 10px 25px rgba(0,0,0,0.6);
            animation: popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
        .bonus-modal-content h2 {
            margin: 0 0 15px 0;
            color: #0ea5e9;
            font-size: 22px;
        }
        .bonus-modal-content p {
            margin: 0 0 25px 0;
            color: #818894;
            line-height: 1.5;
            font-size: 15px;
        }
        .claim-btn {
            background: linear-gradient(135deg, #0ea5e9, #3b82f6);
            color: white;
            border: none;
            padding: 14px 24px;
            width: 100%;
            border-radius: 12px;
            font-weight: bold;
            font-size: 16px;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(14, 165, 233, 0.4);
        }
        @keyframes popIn {
            0% { transform: scale(0.8); opacity: 0; }
            100% { transform: scale(1); opacity: 1; }
        }

        .modal-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          backdrop-filter: blur(4px);
        }
        .lang-modal {
          background: #010413;
          border-radius: 20px;
          border: 1px solid rgba(129,136,148,0.2);
          width: 90%;
          max-width: 400px;
          padding: 24px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.5);
        }
        .lang-modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        .lang-modal-header h3 {
          margin: 0;
          font-size: 18px;
          color: #fff;
        }
        .close-btn {
          background: transparent;
          border: none;
          color: #818894;
          font-size: 20px;
          cursor: pointer;
        }
        .lang-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }
        .lang-btn {
          background: #000717;
          border: 1px solid rgba(129,136,148,0.2);
          border-radius: 12px;
          padding: 14px;
          color: #fff;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }
        .lang-btn.active {
          background: rgba(14,165,233,0.1);
          border-color: #0ea5e9;
          color: #0ea5e9;
        }

        .bottom-nav {
          position: fixed;
          bottom: 0; left: 0; right: 0;
          background: rgba(1,4,19,0.97);
          backdrop-filter: blur(12px);
          border-top: 1px solid rgba(129,136,148,0.15);
          display: flex;
          justify-content: space-around;
          align-items: flex-end;
          padding: 10px 10px 24px;
          z-index: 100;
          box-shadow: 0 -5px 30px rgba(0,0,0,0.4);
        }
        .nav-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          background: none;
          border: none;
          color: #818894;
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
          border: 6px solid #00030D;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 25px rgba(14,165,233,0.4);
          cursor: pointer;
          margin-bottom: 6px;
        }
        .partners-section {
          margin-top: 25px;
          margin-bottom: 5px;
        }
        .marquee-container {
          width: 100vw;
          margin-left: -20px;
          overflow: hidden;
          background: transparent;
          padding: 5px 0;
          position: relative;
        }
        .marquee-content {
          display: flex;
          align-items: center;
          animation: scrollMarquee 20s linear infinite;
          width: max-content;
          padding-left: 20px;
        }
        .partner-item {
          background: #000717;
          border: 1px solid rgba(129,136,148,0.25);
          border-radius: 12px;
          padding: 0 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 52px;
          white-space: nowrap;
        }
        @keyframes scrollMarquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div >
  );
}
