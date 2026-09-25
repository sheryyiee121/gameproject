"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc, increment, collection, addDoc, getDocs, query, orderBy, serverTimestamp } from 'firebase/firestore';

export default function WithdrawPage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [amount, setAmount] = useState('');
    const [walletAddress, setWalletAddress] = useState('');
    const [network, setNetwork] = useState('TRC20');
    const [fundPasswordInput, setFundPasswordInput] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [withdrawals, setWithdrawals] = useState<any[]>([]);

    const uid = typeof window !== 'undefined' ? localStorage.getItem("nexmine_uid") : null;

    useEffect(() => {
        if (!uid) { router.push('/login'); return; }
        getDoc(doc(db, "users", uid)).then(snap => {
            if (snap.exists()) setUser(snap.data());
            else router.push('/login');
        });
        fetchWithdrawals();
    }, []);

    const fetchWithdrawals = async () => {
        if (!uid) return;
        try {
            const q = query(collection(db, "withdrawals"), orderBy("createdAt", "desc"));
            const snap = await getDocs(q);
            const list: any[] = [];
            snap.forEach(d => {
                const data = d.data();
                if (data.uid === uid) list.push({ id: d.id, ...data });
            });
            setWithdrawals(list);
        } catch (e) { /* index may not exist yet, ignore */ }
    };

    const handleWithdraw = async (e: React.FormEvent) => {
        e.preventDefault();
        const amt = parseFloat(amount);

        if (!walletAddress.trim()) {
            alert("Please enter your wallet address.");
            return;
        }
        if (isNaN(amt) || amt < 6) {
            alert("Minimum withdrawal amount is $6.");
            return;
        }

        // Check if user is base tier and require >$30 total deposits
        const isBasicTier = !user?.tier || user.tier.toLowerCase() === 'basic';
        if (isBasicTier) {
            try {
                let totalDeposited = 0;
                const txSnap = await getDocs(collection(db, "users", uid!, "transactions"));
                txSnap.forEach(d => {
                    const data = d.data();
                    if (data.type === 'deposit_approved' || data.type === 'deposit') {
                        totalDeposited += (data.amount || 0);
                    }
                });

                if (totalDeposited <= 30) {
                    alert(`Basic tier users must deposit more than $30 to withdraw. Your current total deposit is $${totalDeposited.toFixed(2)}.`);
                    return;
                }
            } catch (err: any) {
                console.error("Failed to verify deposits:", err);
                // Decide whether to block or allow if error occurs. Blocking is safer.
                alert("Failed to verify deposit history. Please try again or contact support.");
                return;
            }
        }

        const balance = user?.balances?.usdt || 0;
        if (amt > balance) {
            alert(`Insufficient balance. Your available balance is $${balance.toFixed(4)}.`);
            return;
        }

        if (!fundPasswordInput.trim()) {
            alert("Please enter a Fund Password.");
            return;
        }

        // Logic for Fund Password verification/setting
        if (!user?.fundPassword) {
            // First time - set fund password in DB
            try {
                await updateDoc(doc(db, "users", uid!), {
                    fundPassword: fundPasswordInput.trim()
                });
            } catch (err: any) {
                alert("Failed to set fund password: " + err.message);
                return;
            }
        } else {
            // Re-verifying existing fund password
            if (user.fundPassword !== fundPasswordInput.trim()) {
                alert("Incorrect Fund Password. Please try again.");
                return;
            }
        }

        setIsSubmitting(true);
        try {
            // 1. Deduct from user's balance immediately
            await updateDoc(doc(db, "users", uid!), {
                'balances.usdt': increment(-amt)
            });

            // 2. Create a withdrawal request in the global `withdrawals` collection
            await addDoc(collection(db, "withdrawals"), {
                uid: uid,
                username: user?.username || 'Unknown',
                email: user?.email || '',
                amount: amt,
                token: 'USDT',
                network: network,
                walletAddress: walletAddress.trim(),
                status: 'processing',
                createdAt: serverTimestamp()
            });

            // 3. Log in the user's own transactions sub-collection
            await addDoc(collection(db, "users", uid!, "transactions"), {
                type: 'withdrawal',
                amount: amt,
                token: 'USDT',
                network: network,
                walletAddress: walletAddress.trim(),
                status: 'processing',
                timestamp: new Date().toISOString()
            });

            alert(`✅ Withdrawal request of $${amt} submitted! Status: Processing.`);
            setAmount('');
            setWalletAddress('');

            // Refresh user balance & history
            const snap = await getDoc(doc(db, "users", uid!));
            if (snap.exists()) setUser(snap.data());
            fetchWithdrawals();
        } catch (err: any) {
            alert("Failed to submit withdrawal: " + err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const statusStyle = (status: string) => {
        if (status === 'approved') return { color: '#10b981', background: '#ecfdf5', border: '1px solid #6ee7b7' };
        if (status === 'rejected') return { color: '#ef4444', background: '#fef2f2', border: '1px solid #fca5a5' };
        return { color: '#f59e0b', background: '#fffbeb', border: '1px solid #fcd34d' };
    };

    const statusLabel = (status: string) => {
        if (status === 'approved') return '✅ Approved';
        if (status === 'rejected') return '❌ Rejected';
        return '⏳ Processing';
    };

    return (
        <div className="withdraw-root">
            {/* Top Navbar */}
            <header className="top-nav">
                <button className="back-btn" onClick={() => router.back()} aria-label="Go back">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M15 18l-6-6 6-6" />
                    </svg>
                </button>
                <h1 className="nav-title">Withdraw USDT</h1>
                <div style={{ width: 24 }}></div>
            </header>

            <main className="main-content">

                {/* Balance Card */}
                <div className="balance-card">
                    <span className="bal-label">Available Balance</span>
                    <div className="bal-row">
                        <span className="bal-amount">{(user?.balances?.usdt || 0).toFixed(4)}</span>
                        <span className="bal-currency">USDT</span>
                    </div>
                    <span className="bal-hint">Minimum withdrawal: <strong>$6.00</strong></span>
                </div>

                {/* Withdrawal Form */}
                <form className="form-card" onSubmit={handleWithdraw}>
                    <h2 className="form-title">New Withdrawal Request</h2>

                    {/* Network */}
                    <div className="field-group">
                        <label className="field-label">Select Network</label>
                        <div className="network-row">
                            {['TRC20', 'BEP20', 'ERC20'].map(n => (
                                <button
                                    key={n}
                                    type="button"
                                    className={`network-btn${network === n ? ' active' : ''}`}
                                    onClick={() => setNetwork(n)}
                                >
                                    {n}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Wallet Address */}
                    <div className="field-group">
                        <label className="field-label" htmlFor="walletAddress">Wallet Address</label>
                        <input
                            id="walletAddress"
                            type="text"
                            className="field-input"
                            placeholder={`Enter your ${network} wallet address`}
                            value={walletAddress}
                            onChange={e => setWalletAddress(e.target.value)}
                            required
                        />
                    </div>

                    {/* Amount */}
                    <div className="field-group">
                        <label className="field-label" htmlFor="amount">Amount (USDT)</label>
                        <div className="amount-wrapper">
                            <input
                                id="amount"
                                type="number"
                                className="field-input"
                                placeholder="Minimum $6.00"
                                value={amount}
                                onChange={e => setAmount(e.target.value)}
                                min="6"
                                step="0.01"
                                required
                            />
                            <button
                                type="button"
                                className="max-btn"
                                onClick={() => setAmount((user?.balances?.usdt || 0).toFixed(2))}
                            >
                                MAX
                            </button>
                        </div>
                        <span className="field-hint">You will receive: <strong>${amount ? parseFloat(amount).toFixed(2) : '0.00'} USDT</strong></span>
                    </div>

                    {/* Fund Password */}
                    <div className="field-group">
                        <label className="field-label" htmlFor="fundPassword">
                            {!user?.fundPassword ? 'Set Fund Password (One-Time Setup)' : 'Fund Password'}
                        </label>
                        <input
                            id="fundPassword"
                            type="password"
                            className="field-input"
                            placeholder={!user?.fundPassword ? 'Create a secure fund password' : 'Enter your fund password'}
                            value={fundPasswordInput}
                            onChange={e => setFundPasswordInput(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="submit-btn" disabled={isSubmitting}>
                        {isSubmitting ? 'Submitting...' : 'Submit Withdrawal Request'}
                    </button>
                </form>

                {/* Withdrawal History */}
                <div className="history-card">
                    <h2 className="history-title">Withdrawal History</h2>
                    {withdrawals.length === 0 ? (
                        <div className="empty-state">No withdrawal requests yet.</div>
                    ) : (
                        withdrawals.map((w, i) => (
                            <div className="history-row" key={w.id || i}>
                                <div className="history-left">
                                    <div className="history-icon">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M12 19V5M5 12l7 7 7-7" />
                                        </svg>
                                    </div>
                                    <div className="history-info">
                                        <span className="history-amount">-${w.amount?.toFixed(2)} {w.token}</span>
                                        <span className="history-network">{w.network} · {w.walletAddress?.slice(0, 8)}...{w.walletAddress?.slice(-6)}</span>
                                        <span className="history-date">
                                            {w.createdAt?.toDate ? w.createdAt.toDate().toLocaleString() : 'Pending...'}
                                        </span>
                                    </div>
                                </div>
                                <span className="status-badge" style={statusStyle(w.status)}>
                                    {statusLabel(w.status)}
                                </span>
                            </div>
                        ))
                    )}
                </div>

            </main>

            <style jsx>{`
                .withdraw-root {
                    min-height: 100vh;
                    background: #00030D;
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                    color: #ffffff;
                    padding-bottom: 40px;
                }
                .top-nav {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 16px 20px;
                    background: #010413;
                    border-bottom: 1px solid rgba(129,136,148,0.15);
                }
                .nav-title { font-size: 18px; font-weight: 700; margin: 0; color: #ffffff; }
                .back-btn { background: none; border: none; color: #818894; cursor: pointer; padding: 0; display: flex; }

                .main-content { display: flex; flex-direction: column; gap: 20px; padding: 20px; }

                /* Balance Card */
                .balance-card {
                    background: linear-gradient(135deg, #0ea5e9, #0284c7);
                    border-radius: 20px;
                    padding: 24px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 6px;
                    box-shadow: 0 10px 30px rgba(14,165,233,0.3);
                }
                .bal-label { font-size: 13px; color: rgba(255,255,255,0.8); font-weight: 500; }
                .bal-row { display: flex; align-items: baseline; gap: 8px; }
                .bal-amount { font-size: 36px; font-weight: 900; color: #fff; letter-spacing: -1px; }
                .bal-currency { font-size: 16px; font-weight: 700; color: rgba(255,255,255,0.85); }
                .bal-hint { font-size: 12px; color: rgba(255,255,255,0.7); margin-top: 4px; }

                /* Form Card */
                .form-card {
                    background: #010413;
                    border-radius: 20px;
                    padding: 24px;
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.3);
                    border: 1px solid rgba(129,136,148,0.15);
                }
                .form-title { font-size: 17px; font-weight: 800; margin: 0; color: #ffffff; }

                .field-group { display: flex; flex-direction: column; gap: 8px; }
                .field-label { font-size: 13px; font-weight: 600; color: #818894; }
                .field-input {
                    width: 100%;
                    padding: 14px 16px;
                    border-radius: 12px;
                    border: 1.5px solid rgba(129,136,148,0.2);
                    font-size: 15px;
                    color: #ffffff;
                    background: #000717;
                    outline: none;
                    box-sizing: border-box;
                    transition: border-color 0.2s;
                }
                .field-input:focus { border-color: #0ea5e9; background: #000619; }
                .field-input::placeholder { color: #818894; }
                .field-hint { font-size: 12px; color: #818894; }

                .network-row { display: flex; gap: 10px; }
                .network-btn {
                    flex: 1;
                    padding: 11px;
                    border-radius: 10px;
                    border: 1.5px solid rgba(129,136,148,0.2);
                    background: #000717;
                    color: #818894;
                    font-weight: 700;
                    font-size: 13px;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .network-btn.active {
                    border-color: #0ea5e9;
                    background: rgba(14,165,233,0.1);
                    color: #0ea5e9;
                }

                .amount-wrapper { position: relative; display: flex; align-items: center; }
                .amount-wrapper .field-input { padding-right: 70px; }
                .max-btn {
                    position: absolute;
                    right: 12px;
                    background: none;
                    border: none;
                    color: #0ea5e9;
                    font-weight: 800;
                    font-size: 13px;
                    cursor: pointer;
                    padding: 0;
                }

                .submit-btn {
                    width: 100%;
                    padding: 16px;
                    background: linear-gradient(135deg, #0ea5e9, #0284c7);
                    color: #fff;
                    border: none;
                    border-radius: 14px;
                    font-size: 16px;
                    font-weight: 700;
                    cursor: pointer;
                    box-shadow: 0 6px 20px rgba(14,165,233,0.3);
                    transition: opacity 0.2s, transform 0.1s;
                }
                .submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }
                .submit-btn:not(:disabled):active { transform: scale(0.98); }

                /* History */
                .history-card {
                    background: #010413;
                    border-radius: 20px;
                    border: 1px solid rgba(129,136,148,0.15);
                    box-shadow: 0 4px 20px rgba(0,0,0,0.3);
                    overflow: hidden;
                }
                .history-title { font-size: 16px; font-weight: 800; margin: 0; padding: 20px; color: #ffffff; border-bottom: 1px solid rgba(129,136,148,0.12); }
                .empty-state { text-align: center; padding: 30px; color: #818894; font-size: 14px; }

                .history-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 16px 20px;
                    border-bottom: 1px solid rgba(129,136,148,0.1);
                    gap: 12px;
                }
                .history-row:last-child { border-bottom: none; }
                .history-left { display: flex; align-items: center; gap: 12px; flex: 1; min-width: 0; }
                .history-icon {
                    width: 38px; height: 38px; border-radius: 50%;
                    background: linear-gradient(135deg, #ef4444, #dc2626);
                    display: flex; align-items: center; justify-content: center;
                    flex-shrink: 0;
                }
                .history-info { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
                .history-amount { font-size: 15px; font-weight: 800; color: #ef4444; }
                .history-network { font-size: 12px; color: #818894; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
                .history-date { font-size: 11px; color: rgba(129,136,148,0.6); }

                .status-badge {
                    font-size: 11.5px;
                    font-weight: 700;
                    padding: 5px 10px;
                    border-radius: 20px;
                    white-space: nowrap;
                    flex-shrink: 0;
                }
            `}</style>
        </div>
    );
}
