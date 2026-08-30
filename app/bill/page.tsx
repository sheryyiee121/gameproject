"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, getDocs, doc, getDoc } from 'firebase/firestore';

export default function FundFlowPage() {
    const router = useRouter();
    const [history, setHistory] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const uid = localStorage.getItem("nexmine_uid");
        if (!uid) {
            router.push('/login');
            return;
        }

        // Fetch transactions
        const fetchTxs = async () => {
            try {
                const q = query(
                    collection(db, "users", uid, "transactions"),
                    orderBy("timestamp", "desc")
                );
                const snapshot = await getDocs(q);
                const txs: any[] = [];
                snapshot.forEach(doc => txs.push({ id: doc.id, ...doc.data() }));
                setHistory(txs);
            } catch (err) {
                console.error("Failed to fetch transactions:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchTxs();
    }, [router]);

    // Format transaction type
    const getTxLabel = (type: string) => {
        if (type === 'deposit') return 'Admin Deposit';
        if (type === 'withdrawal') return 'Withdrawal';
        if (type === 'mining') return 'Computing Power Income';
        if (type === 'task') return 'Task Income';
        if (type === 'bonus') return 'Basic Income Reward';
        return 'System Transaction';
    };

    return (
        <div className="fund-flow-root">
            {/* Header */}
            <header className="ffi-header">
                <button className="icon-btn" onClick={() => router.back()}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="19" y1="12" x2="5" y2="12"></line>
                        <polyline points="12 19 5 12 12 5"></polyline>
                    </svg>
                </button>
                <span className="ffi-title">Fund Flow</span>
                <button className="icon-btn" style={{ background: 'transparent' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
                    </svg>
                </button>
            </header>

            {/* List */}
            <main className="ffi-main">
                {loading ? (
                    <div style={{ color: '#64748b', textAlign: 'center', marginTop: '40px' }}>Loading records...</div>
                ) : history.length === 0 ? (
                    <div style={{ color: '#64748b', textAlign: 'center', marginTop: '40px' }}>No transactions found.</div>
                ) : (
                    history.map((tx) => (
                        <div className="ffi-card" key={tx.id}>
                            <div className="ffi-row">
                                <span className="ffi-label">{getTxLabel(tx.type)}</span>
                                <span className="ffi-amount" style={{ color: tx.type === 'deposit' || tx.type === 'bonus' || tx.type === 'mining' ? '#fff' : '#ef4444' }}>
                                    {tx.type === 'withdrawal' ? '-' : '+'}{Number(tx.amount).toFixed(4)} {tx.token || 'USDT'}
                                </span>
                            </div>
                            <div className="ffi-row" style={{ marginTop: '12px' }}>
                                <span className="ffi-time">{new Date(tx.timestamp).toLocaleString('en-US', { hour12: false }).replace(',', '')}</span>
                                <div className="ffi-status">
                                    <span className="dot"></span>
                                    <span>Completed</span>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </main>

            <style jsx>{`
                .fund-flow-root {
                    background-color: #12151c;
                    min-height: 100vh;
                    font-family: 'Geist', sans-serif;
                    color: #fff;
                    display: flex;
                    flex-direction: column;
                }
                .ffi-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 16px 20px;
                    border-bottom: 1px solid rgba(255,255,255,0.03);
                    background: #12151c;
                    position: sticky;
                    top: 0;
                    z-index: 10;
                }
                .icon-btn {
                    background: none;
                    border: none;
                    color: #fff;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 32px;
                    height: 32px;
                }
                .icon-btn svg {
                    stroke: #fff;
                }
                .ffi-header .icon-btn:last-child svg {
                    stroke: #4b5563; /* Filter icon darker like screenshot */
                }
                .ffi-title {
                    font-size: 18px;
                    font-weight: 700;
                }
                .ffi-main {
                    padding: 20px;
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                }
                .ffi-card {
                    background-color: #171b26;
                    border: 1px solid #1f2937;
                    border-radius: 12px;
                    padding: 20px;
                    display: flex;
                    flex-direction: column;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                }
                .ffi-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .ffi-label {
                    font-size: 15.5px;
                    font-weight: 500;
                    color: #f1f5f9;
                }
                .ffi-amount {
                    font-size: 15.5px;
                    font-weight: 600;
                }
                .ffi-time {
                    font-size: 13px;
                    color: #64748b;
                }
                .ffi-status {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    font-size: 13px;
                    color: #64748b;
                }
                .ffi-status .dot {
                    width: 6px;
                    height: 6px;
                    border-radius: 50%;
                    background-color: #10b981; /* Green completed dot */
                }
            `}</style>
        </div>
    );
}
