"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';

export default function TeamPage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [gen1List, setGen1List] = useState<any[]>([]);
    const [gen2List, setGen2List] = useState<any[]>([]);
    const [gen3List, setGen3List] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [inviteCode, setInviteCode] = useState("");

    useEffect(() => {
        const fetchTeamData = async () => {
            const uid = localStorage.getItem("nexmine_uid");
            if (!uid) {
                router.push('/login');
                return;
            }

            try {
                // Get Current User
                const userDoc = await getDoc(doc(db, "users", uid));
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    setUser(userData);
                    setInviteCode(userData.myInviteCode || '');

                    // Get Gen 1
                    const usersRef = collection(db, "users");
                    const q1 = query(usersRef, where("referredBy", "==", uid));
                    const snap1 = await getDocs(q1);
                    const g1 = snap1.docs.map(d => ({ id: d.id, ...d.data() } as any));
                    setGen1List(g1);

                    // Get Gen 2
                    let g2: any[] = [];
                    if (g1.length > 0) {
                        const g1Uids = g1.map(u => u.uid);
                        // Firestore 'in' query has max 10, so split into chunks if needed
                        for (let i = 0; i < g1Uids.length; i += 10) {
                            const chunk = g1Uids.slice(i, i + 10);
                            const q2 = query(usersRef, where("referredBy", "in", chunk));
                            const snap2 = await getDocs(q2);
                            g2 = [...g2, ...snap2.docs.map(d => ({ id: d.id, ...d.data() } as any))];
                        }
                    }
                    setGen2List(g2);

                    // Get Gen 3
                    let g3: any[] = [];
                    if (g2.length > 0) {
                        const g2Uids = g2.map(u => u.uid);
                        for (let i = 0; i < g2Uids.length; i += 10) {
                            const chunk = g2Uids.slice(i, i + 10);
                            const q3 = query(usersRef, where("referredBy", "in", chunk));
                            const snap3 = await getDocs(q3);
                            g3 = [...g3, ...snap3.docs.map(d => ({ id: d.id, ...d.data() } as any))];
                        }
                    }
                    setGen3List(g3);

                } else {
                    router.push('/login');
                }
            } catch (err) {
                console.error("Failed to load team data", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTeamData();
    }, [router]);

    const handleCopyInvite = () => {
        navigator.clipboard.writeText(inviteCode);
        alert("Invitation code copied!");
    };

    const teamSize = gen1List.length + gen2List.length + gen3List.length;

    return (
        <div className="team-root">
            {/* Header */}
            <header className="page-header">
                <button className="back-btn" onClick={() => router.back()}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="19" y1="12" x2="5" y2="12"></line>
                        <polyline points="12 19 5 12 12 5"></polyline>
                    </svg>
                </button>
                <h1 className="header-title">My Team</h1>
                <div style={{ width: 24 }}></div>
            </header>

            {isLoading ? (
                <div className="loading-state">
                    <div className="spinner"></div>
                    <p>Loading Team Data...</p>
                </div>
            ) : (
                <main className="main-content">

                    {/* Invite Section */}
                    <div className="invite-card">
                        <div className="invite-icon">
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"></path>
                                <circle cx="8.5" cy="7" r="4"></circle>
                                <line x1="20" y1="8" x2="20" y2="14"></line>
                                <line x1="23" y1="11" x2="17" y2="11"></line>
                            </svg>
                        </div>
                        <div className="invite-info">
                            <span className="invite-title">My Invitation Code</span>
                            <span className="invite-code">{inviteCode}</span>
                        </div>
                        <button className="copy-btn" onClick={handleCopyInvite}>Copy</button>
                    </div>

                    {/* 4 Cards Grid - Replaced mock data with live Team Sizes */}
                    <div className="stats-grid-4">
                        <div className="stat-card">
                            <span className="sc-title">Total Team Size</span>
                            <span className="sc-val">{teamSize}</span>
                            <div className="sc-trend">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 21 12 3 19 10 12 3 5 10 12 3"></polygon></svg>
                                <span>Active</span>
                            </div>
                        </div>
                        <div className="stat-card">
                            <span className="sc-title">Direct Referrals</span>
                            <span className="sc-val">{gen1List.length}</span>
                            <div className="sc-trend">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 21 12 3 19 10 12 3 5 10 12 3"></polygon></svg>
                                <span>Gen 1</span>
                            </div>
                        </div>
                        <div className="stat-card">
                            <span className="sc-title">My Tier</span>
                            <span className="sc-val">{user?.tier || 'Basic'}</span>
                            <div className="sc-trend">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 21 12 3 19 10 12 3 5 10 12 3"></polygon></svg>
                                <span>Current</span>
                            </div>
                        </div>
                        <div className="stat-card">
                            <span className="sc-title">Team Commission</span>
                            <span className="sc-val">{(user?.totalProfit * 0.1 || 0).toFixed(2)}$</span>
                            <div className="sc-trend">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 21 12 3 19 10 12 3 5 10 12 3"></polygon></svg>
                                <span>Est.</span>
                            </div>
                        </div>
                    </div>

                    {/* Team Data Within Three Generations */}
                    <div className="section-header">
                        <h2 className="section-title">Generational Breakdown</h2>
                    </div>
                    <div className="generations-list">

                        {/* Gen 1 */}
                        <div className="gen-item">
                            <div className="gen-header">
                                <div className="gh-left">
                                    <div className="badge badge-1"><span className="inner-b">1</span></div>
                                    <span className="gh-title">Generation 1</span>
                                </div>
                                <span className="gr-val highlight">{gen1List.length} Members</span>
                            </div>
                            <div className="gen-row"><span className="gr-lbl">Direct Invites</span></div>
                        </div>

                        {/* Gen 2 */}
                        <div className="gen-item">
                            <div className="gen-header">
                                <div className="gh-left">
                                    <div className="badge badge-2"><span className="inner-b">2</span></div>
                                    <span className="gh-title">Generation 2</span>
                                </div>
                                <span className="gr-val highlight">{gen2List.length} Members</span>
                            </div>
                            <div className="gen-row"><span className="gr-lbl">Invited by Gen 1</span></div>
                        </div>

                        {/* Gen 3 */}
                        <div className="gen-item">
                            <div className="gen-header">
                                <div className="gh-left">
                                    <div className="badge badge-3"><span className="inner-b">3</span></div>
                                    <span className="gh-title">Generation 3</span>
                                </div>
                                <span className="gr-val highlight">{gen3List.length} Members</span>
                            </div>
                            <div className="gen-row no-border"><span className="gr-lbl">Invited by Gen 2</span></div>
                        </div>

                    </div>
                </main>
            )}

            <style jsx>{`
        .team-root {
          min-height: 100vh;
          width: 100%;
          background: #00030D;
          display: flex;
          flex-direction: column;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          color: #ffffff;
          padding-bottom: 30px;
        }

        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 20px;
          background: #010413;
          border-bottom: 1px solid rgba(129,136,148,0.15);
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
          color: #fff;
        }

        .loading-state {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 300px;
            color: #818894;
        }
        .spinner {
            width: 24px; height: 24px;
            border: 3px solid rgba(14,165,233,0.3);
            border-top-color: #0ea5e9;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-bottom: 12px;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .main-content {
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .invite-card {
            background: linear-gradient(135deg, rgba(14,165,233,0.1) 0%, rgba(2,132,199,0.05) 100%);
            border: 1px solid rgba(14,165,233,0.3);
            border-radius: 20px;
            padding: 20px;
            display: flex;
            align-items: center;
            gap: 16px;
            box-shadow: 0 8px 25px rgba(0,0,0,0.2);
        }
        .invite-icon {
            width: 50px; height: 50px;
            background: linear-gradient(135deg, #0ea5e9, #0284c7);
            border-radius: 14px;
            display: flex; align-items: center; justify-content: center;
            flex-shrink: 0;
            box-shadow: 0 4px 15px rgba(14,165,233,0.4);
        }
        .invite-info {
            display: flex; flex-direction: column; flex: 1;
        }
        .invite-title { font-size: 13px; color: #818894; font-weight: 600; margin-bottom: 4px; }
        .invite-code { font-size: 22px; font-weight: 800; color: #fff; letter-spacing: 2px; }
        .copy-btn {
            background: rgba(14,165,233,0.15);
            border: 1px solid rgba(14,165,233,0.3);
            color: #0ea5e9;
            padding: 8px 16px;
            border-radius: 12px;
            font-weight: 700;
            font-size: 13px;
            cursor: pointer;
            transition: all 0.2s;
        }
        .copy-btn:hover { background: rgba(14,165,233,0.25); }

        .stats-grid-4 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }
        .stat-card {
           background: #010413;
           border: 1px solid rgba(129,136,148,0.15);
           border-radius: 16px;
           padding: 16px;
           display: flex;
           flex-direction: column;
           gap: 6px;
           box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        }
        .sc-title { font-size: 12px; color: #818894; font-weight: 600; }
        .sc-val { font-size: 18px; font-weight: 800; color: #ffffff; }
        .sc-trend {
           display: flex;
           align-items: center;
           gap: 4px;
           color: #00d084;
           font-size: 11px;
           font-weight: 700;
           margin-top: 2px;
        }

        .section-header { margin-top: 10px; display: flex; justify-content: space-between; align-items: center; }
        .section-title { font-size: 16px; font-weight: 700; margin: 0; color: #fff; }

        .generations-list {
           display: flex;
           flex-direction: column;
           gap: 12px;
        }
        .gen-item {
           background: #010413;
           border: 1px solid rgba(129,136,148,0.15);
           border-radius: 20px;
           padding: 18px 20px 14px;
           box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        }
        .gen-header {
           display: flex;
           justify-content: space-between;
           align-items: center;
           margin-bottom: 16px;
        }
        .gh-left {
           display: flex;
           align-items: center;
           gap: 10px;
        }
        .badge {
           width: 28px; height: 28px;
           border-radius: 50%;
           display: flex;
           align-items: center;
           justify-content: center;
           font-weight: 800;
           font-size: 14px;
           color: #fff;
        }
        .badge-1 { background: linear-gradient(135deg, #0ea5e9, #0284c7); box-shadow: 0 4px 10px rgba(14,165,233,0.3); }
        .badge-2 { background: linear-gradient(135deg, #8b5cf6, #6d28d9); box-shadow: 0 4px 10px rgba(139,92,246,0.3); }
        .badge-3 { background: linear-gradient(135deg, #10b981, #059669); box-shadow: 0 4px 10px rgba(16,185,129,0.3); }
        
        .gh-title { font-size: 15px; font-weight: 700; color: #ffffff; }
        
        .gen-row {
           display: flex;
           justify-content: space-between;
           padding: 10px 0;
           border-bottom: 1px dashed rgba(129,136,148,0.2);
        }
        .gen-row.no-border { border-bottom: none; padding-bottom: 0; }
        .gr-lbl { font-size: 13px; color: #818894; font-weight: 500; }
        .gr-val { font-size: 14px; font-weight: 700; color: #ffffff; }
        .gr-val.highlight { color: #0ea5e9; font-size: 16px; }

      `}</style>
        </div>
    );
}
