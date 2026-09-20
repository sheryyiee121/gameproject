"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { db } from '@/lib/firebase';
import { doc, getDoc, deleteDoc, updateDoc } from 'firebase/firestore';

export default function ProfilePage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [oldLoginPass, setOldLoginPass] = useState('');
    const [newLoginPass, setNewLoginPass] = useState('');
    const [oldFundPass, setOldFundPass] = useState('');
    const [newFundPass, setNewFundPass] = useState('');
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
                    setUser({ uid: uid, ...docSnap.data() });
                } else {
                    router.push('/login');
                }
            });
        } else {
            router.push('/login');
        }
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem("nexmine_uid");
        router.push("/login");
    };

    const handleDeleteAccount = async () => {
        const proceed = window.confirm("Are you ABSOLUTELY sure you want to delete your account? This cannot be undone.");
        if (proceed && user) {
            try {
                await deleteDoc(doc(db, "users", user.uid));
                localStorage.removeItem("nexmine_uid");
                router.push("/login");
            } catch (err: any) {
                alert("Failed to delete: " + err.message);
            }
        }
    };

    const handleCopy = (text: string) => {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text);
            alert("Referral link copied to clipboard!");
        }
    };

    const handleUpdateLoginPassword = async () => {
        if (!newLoginPass.trim()) return;
        if (oldLoginPass.trim() !== user.password) {
            alert("Incorrect old password!");
            return;
        }
        try {
            await updateDoc(doc(db, "users", user.uid), { password: newLoginPass.trim() });
            setUser({ ...user, password: newLoginPass.trim() });
            alert("Login password updated successfully!");
            setOldLoginPass('');
            setNewLoginPass('');
        } catch (err: any) {
            alert("Failed to update password: " + err.message);
        }
    };

    const handleUpdateFundPassword = async () => {
        if (!newFundPass.trim()) return;
        if (user.fundPassword && oldFundPass.trim() !== user.fundPassword) {
            alert("Incorrect old fund password!");
            return;
        }
        try {
            await updateDoc(doc(db, "users", user.uid), { fundPassword: newFundPass.trim() });
            setUser({ ...user, fundPassword: newFundPass.trim() });
            alert("Fund password updated successfully!");
            setOldFundPass('');
            setNewFundPass('');
        } catch (err: any) {
            alert("Failed to update password: " + err.message);
        }
    };

    return (
        <div className="profile-root">
            {/* Top Navbar */}
            <header className="top-nav">
                <div className="logo-section">
                    <img src="/nexmine-ai-logo.png" alt="Nexmine" style={{ height: '36px', width: 'auto', objectFit: 'contain' }} />
                </div>
                <div className="nav-icons">
                    <button className="icon-btn" aria-label="Language" onClick={() => setShowLangModal(true)}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="2" y1="12" x2="22" y2="12"></line>
                            <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"></path>
                        </svg>
                    </button>
                    <button className="icon-btn" aria-label="Notifications" onClick={() => alert('🔔 Notifications coming soon!')}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                            <path d="M13.73 21a2 2 0 01-3.46 0"></path>
                        </svg>
                    </button>
                </div>
            </header>

            <main className="main-content">
                {/* Profile Card */}
                <div className="profile-card">
                    <div className="profile-avatar">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                            <circle cx="12" cy="7" r="4" />
                        </svg>
                    </div>
                    <div className="profile-info">
                        <div className="username-row">
                            <h2 className="username">{user?.username || 'Loading...'}</h2>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="chevron-icon">
                                <polyline points="9 18 15 12 9 6"></polyline>
                            </svg>
                        </div>
                        <div className="badges-row">
                            <div className="badge">
                                <span>UID: {user?.uid || '---'}</span>
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                            </div>
                            <div className="badge" onClick={() => user?.myInviteCode && handleCopy(`https://nexmine.net/?ref=${user.myInviteCode}`)} style={{ cursor: 'pointer' }}>
                                <span>Ref Link: {user?.myInviteCode ? `nexmine.net/?ref=${user.myInviteCode}` : 'Loading...'}</span>
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Level Banners */}
                <div className="banners-grid">
                    <div className="banner-card" onClick={() => router.push('/membership')} style={{ cursor: 'pointer' }}>
                        <div className="banner-content">
                            <span className="banner-title">Level</span>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="chevron-sm"><polyline points="9 18 15 12 9 6"></polyline></svg>
                        </div>
                        <div className="banner-graphic">
                            <span className="emoji-graphic">💻</span>
                        </div>
                    </div>
                    <div className="banner-card" onClick={() => router.push('/team')} style={{ cursor: 'pointer' }}>
                        <div className="banner-content">
                            <span className="banner-title">Invite<br />Friends</span>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="chevron-sm"><polyline points="9 18 15 12 9 6"></polyline></svg>
                        </div>
                        <div className="banner-graphic">
                            <span className="emoji-graphic">🎁</span>
                        </div>
                    </div>
                </div>

                {/* Action Icons Grid */}
                <div className="action-grid">
                    <div className="action-item" style={{ cursor: 'pointer' }} onClick={() => router.push('/mining')}>
                        <div className="action-icon-wrapper" style={{ background: 'linear-gradient(135deg, #1f3a60, #2c5282)' }}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5M2 12l10 5 10-5" /></svg>
                        </div>
                        <span className="action-label">Mining</span>
                    </div>
                    <div className="action-item">
                        <div className="action-icon-wrapper" style={{ background: 'linear-gradient(135deg, #1f3a60, #2c5282)' }}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
                        </div>
                        <span className="action-label">{(user?.totalProfit || 0).toFixed(4)}$</span>
                    </div>
                    <div className="action-item" style={{ cursor: 'pointer' }} onClick={() => router.push('/team')}>
                        <div className="action-icon-wrapper" style={{ background: 'linear-gradient(135deg, #1f3a60, #2c5282)' }}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
                        </div>
                        <span className="action-label">My Team</span>
                    </div>
                    <div className="action-item">
                        <div className="action-icon-wrapper" style={{ background: 'linear-gradient(135deg, #1f3a60, #2c5282)' }}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="16" rx="2" ry="2" /><rect x="9" y="9" width="6" height="6" /><line x1="9" y1="1" x2="9" y2="4" /><line x1="15" y1="1" x2="15" y2="4" /><line x1="9" y1="20" x2="9" y2="23" /><line x1="15" y1="20" x2="15" y2="23" /><line x1="20" y1="9" x2="23" y2="9" /><line x1="20" y1="14" x2="23" y2="14" /><line x1="1" y1="9" x2="4" y2="9" /><line x1="1" y1="14" x2="4" y2="14" /></svg>
                        </div>
                        <span className="action-label">My Device</span>
                    </div>
                </div>

                {/* Stats Section */}
                <div className="stats-card">
                    <div className="stats-row" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <div className="stat-col">
                            <span className="stat-label">Total Assets</span>
                            <span className="stat-val">${(user?.balances?.usdt || 0).toFixed(4)}</span>
                        </div>
                        <div className="stat-col flex-end">
                            <div className="stat-header">
                                <span className="stat-label">Available</span>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6a7c9d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="chevron-sm"><polyline points="9 18 15 12 9 6"></polyline></svg>
                            </div>
                            <span className="stat-val text-blue">${(user?.balances?.usdt || 0).toFixed(4)}</span>
                        </div>
                    </div>

                    <div className="stats-row" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <div className="stat-col">
                            <span className="stat-label">Total Profit</span>
                            <span className="stat-val">{(user?.totalProfit || 0).toFixed(4)}$</span>
                        </div>
                        <div className="stat-col flex-end">
                            <div className="stat-header">
                                <span className="stat-label">Today Profit</span>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6a7c9d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="chevron-sm"><polyline points="9 18 15 12 9 6"></polyline></svg>
                            </div>
                            <span className="stat-val">{(user?.todayProfit || 0).toFixed(4)}$</span>
                        </div>
                    </div>

                    <div className="stats-row" style={{ cursor: 'pointer' }} onClick={() => router.push('/team')}>
                        <div className="stat-col">
                            <span className="stat-label">Team Members</span>
                            <span className="stat-val">0</span>
                        </div>
                        <div className="stat-col flex-end">
                            <div className="stat-header">
                                <span className="stat-label">New Members</span>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6a7c9d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="chevron-sm"><polyline points="9 18 15 12 9 6"></polyline></svg>
                            </div>
                            <span className="stat-val">0</span>
                        </div>
                    </div>
                </div>

                {/* Settings List */}
                <div className="settings-list">
                    <div className="setting-item">
                        <div className="setting-left">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#92a2bd" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="4"></circle><line x1="21.17" y1="8" x2="12" y2="8"></line><line x1="3.95" y1="6.06" x2="8.54" y2="14"></line><line x1="10.88" y1="21.94" x2="15.46" y2="14"></line></svg>
                            <span>Authenticator</span>
                        </div>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6a7c9d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                    </div>
                    <div className="setting-card">
                        <div className="setting-header">
                            <div className="setting-left">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#92a2bd" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                                <span>Fund Password</span>
                            </div>
                        </div>
                        <div className="setting-field-col">
                            {user?.fundPassword && (
                                <input
                                    type="password"
                                    placeholder="Enter Old Fund Password"
                                    className="setting-input"
                                    value={oldFundPass}
                                    onChange={e => setOldFundPass(e.target.value)}
                                />
                            )}
                            <input
                                type="password"
                                placeholder={user?.fundPassword ? "Enter New Fund Password" : "Set New Fund Password"}
                                className="setting-input"
                                value={newFundPass}
                                onChange={e => setNewFundPass(e.target.value)}
                            />
                            <button className="setting-btn" style={{ width: '100%', marginTop: '4px' }} onClick={handleUpdateFundPassword}>
                                {user?.fundPassword ? 'Update Password' : 'Set Password'}
                            </button>
                        </div>
                    </div>

                    <div className="setting-card">
                        <div className="setting-header">
                            <div className="setting-left">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#92a2bd" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                                <span>Login Password</span>
                            </div>
                        </div>
                        <div className="setting-field-col">
                            <input
                                type="password"
                                placeholder="Enter Old Login Password"
                                className="setting-input"
                                value={oldLoginPass}
                                onChange={e => setOldLoginPass(e.target.value)}
                            />
                            <input
                                type="password"
                                placeholder="Enter New Login Password"
                                className="setting-input"
                                value={newLoginPass}
                                onChange={e => setNewLoginPass(e.target.value)}
                            />
                            <button className="setting-btn" style={{ width: '100%', marginTop: '4px' }} onClick={handleUpdateLoginPassword}>
                                Update Login Password
                            </button>
                        </div>
                    </div>
                    <div className="setting-item" onClick={handleLogout} style={{ border: '1px solid #e2e8f0', background: '#334155' }}>
                        <div className="setting-left">
                            <span style={{ color: '#fff', marginLeft: '36px' }}>Logout / Sign Out</span>
                        </div>
                    </div>
                    <div className="setting-item" onClick={handleDeleteAccount} style={{ border: '2px solid #ef4444', background: 'transparent' }}>
                        <div className="setting-left">
                            <span style={{ color: '#ef4444', marginLeft: '36px' }}>Delete My Account</span>
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
                <button className="nav-item" onClick={() => router.push('/asset')}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                    <span>Asset</span>
                </button>
                <button className="nav-item active">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                    <span>Profile</span>
                </button>
            </nav>

            <style jsx>{`
        .profile-root {
          min-height: 100vh;
          width: 100%;
          background: #00030D;
          display: flex;
          flex-direction: column;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          color: #ffffff;
          position: relative;
          padding-bottom: 140px;
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
          padding: 4px 20px 20px;
          gap: 20px;
        }

        .profile-card {
          background: #010413;
          border-radius: 20px;
          padding: 20px;
          display: flex;
          align-items: center;
          gap: 16px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.3);
          position: relative;
          border: 1px solid rgba(129,136,148,0.15);
        }
        .profile-avatar {
          width: 68px;
          height: 68px;
          border-radius: 50%;
          background: #000717;
          border: 3px solid rgba(14,165,233,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(14,165,233,0.15);
          flex-shrink: 0;
        }
        .profile-info {
           display: flex;
           flex-direction: column;
           gap: 6px;
           flex: 1;
        }
        .username-row {
           display: flex;
           align-items: center;
           justify-content: space-between;
        }
        .username {
           font-size: 19px;
           font-weight: 800;
           color: #ffffff;
           margin: 0;
        }
        .chevron-icon {
           color: #818894;
        }
        .badges-row {
           display: flex;
           gap: 8px;
        }
        .badge {
           background: rgba(14,165,233,0.1);
           border: 1px solid rgba(14,165,233,0.25);
           border-radius: 12px;
           padding: 4px 10px;
           display: flex;
           align-items: center;
           gap: 6px;
           font-size: 10.5px;
           color: #0ea5e9;
           font-weight: 600;
        }

        .banners-grid {
           display: grid;
           grid-template-columns: 1fr 1fr;
           gap: 12px;
        }
        .banner-card {
           background: #010413;
           border-radius: 20px;
           padding: 16px;
           display: flex;
           justify-content: space-between;
           border: 1px solid rgba(129,136,148,0.15);
           min-height: 80px;
           position: relative;
           overflow: hidden;
           box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        }
        .banner-content {
           display: flex;
           flex-direction: column;
           justify-content: space-between;
           z-index: 2;
        }
        .banner-title {
           font-weight: 800;
           font-size: 14px;
           line-height: 1.2;
           color: #ffffff;
        }
        .chevron-sm {
           margin-top: 8px;
           color: #0ea5e9;
        }
        .banner-graphic {
           position: absolute;
           right: 0px;
           bottom: -5px;
           font-size: 50px;
           opacity: 0.9;
           z-index: 1;
        }

        .action-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
          margin: 5px 0;
        }
        .action-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 10px;
        }
        .action-icon-wrapper {
          width: 52px;
          height: 52px;
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 6px 16px rgba(0,0,0,0.06);
          transition: transform 0.2s;
        }
        .action-item:hover .action-icon-wrapper { transform: translateY(-3px); }
        .action-label {
          font-size: 12px;
          color: #818894;
          font-weight: 600;
        }

        .stats-card {
           background: #010413;
           border-radius: 20px;
           border: 1px solid rgba(129,136,148,0.15);
           padding: 0;
           display: flex;
           flex-direction: column;
           box-shadow: 0 8px 24px rgba(0,0,0,0.3);
        }
        .stats-row {
           display: flex;
           padding: 20px 24px;
        }
        .stat-col {
           flex: 1;
           display: flex;
           flex-direction: column;
           gap: 6px;
        }
        .stat-col.flex-end {
           align-items: flex-start;
           padding-left: 20px;
        }
        .stat-header {
           display: flex;
           align-items: center;
           justify-content: space-between;
           width: 100%;
        }
        .stat-label {
           font-size: 13px;
           color: #818894;
           font-weight: 500;
        }
        .stat-val {
           font-size: 18px;
           font-weight: 800;
           color: #ffffff;
        }
        .text-blue {
           color: #0ea5e9;
        }

        .settings-list {
           display: flex;
           flex-direction: column;
           gap: 8px;
        }
        .setting-item {
           background: #010413;
           display: flex;
           align-items: center;
           justify-content: space-between;
           padding: 18px 20px;
           border-radius: 16px;
           border: 1px solid rgba(129,136,148,0.15);
           cursor: pointer;
           box-shadow: 0 2px 8px rgba(0,0,0,0.2);
           transition: transform 0.2s, box-shadow 0.2s;
        }

        .setting-card {
          background: #010413;
          border: 1px solid rgba(129,136,148,0.15);
          border-radius: 16px;
          padding: 16px 20px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        }
        .setting-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }
        .setting-field-row {
          display: flex;
          gap: 10px;
        }
        .setting-field-col {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .setting-input {
          flex: 1;
          background: #000717;
          border: 1px solid rgba(129,136,148,0.2);
          border-radius: 12px;
          padding: 10px 14px;
          color: #ffffff;
          font-size: 14px;
          outline: none;
        }
        .setting-input:focus {
          border-color: #0ea5e9;
        }
        .setting-btn {
          background: linear-gradient(135deg, #0ea5e9, #0284c7);
          color: #ffffff;
          border: none;
          border-radius: 12px;
          padding: 0 20px;
          font-weight: 700;
          font-size: 13px;
          cursor: pointer;
        }

        .setting-item:hover {
           transform: translateY(-2px);
           box-shadow: 0 6px 16px rgba(0,0,0,0.3);
        }
        .setting-left {
           display: flex;
           align-items: center;
           gap: 16px;
           font-size: 15px;
           font-weight: 600;
           color: #ffffff;
        }
        .setting-left svg {
           color: #0ea5e9;
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

        /* Bottom Nav */
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
        .nav-item.active { color: #0ea5e9; }
        .center-mining-wrapper { position: relative; top: -24px; }
        .mining-btn {
          width: 64px; height: 64px;
          border-radius: 50%;
          background: linear-gradient(135deg, #0ea5e9, #0284c7);
          border: 6px solid #00030D;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 8px 25px rgba(14,165,233,0.4);
          cursor: pointer; margin-bottom: 6px;
        }
      `}</style>
        </div>
    );
}
