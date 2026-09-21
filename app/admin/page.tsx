"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, doc, updateDoc, increment, setDoc, addDoc, query, orderBy } from "firebase/firestore";

export default function AdminDashboard() {
    const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
    const [adminPass, setAdminPass] = useState("");
    const [users, setUsers] = useState<any[]>([]);
    const [withdrawals, setWithdrawals] = useState<any[]>([]);
    const [deposits, setDeposits] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<'users' | 'withdrawals' | 'deposits'>('users');

    useEffect(() => {
        // Force English language on Admin Panel
        if (typeof window !== "undefined") {
            const currentCookie = document.cookie.match(/(?:^|;) ?googtrans=([^;]*)(?:;|$)/);
            if (currentCookie && currentCookie[1] !== '/en/en') {
                document.cookie = `googtrans=/en/en; path=/; domain=${window.location.hostname};`;
                document.cookie = `googtrans=/en/en; path=/;`;
                localStorage.setItem("nexmine_lang", "en");
                window.location.reload();
            }
        }
    }, []);

    const handleAdminLogin = (e: React.FormEvent) => {
        e.preventDefault();
        const correctPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "admin123";
        if (adminPass === correctPassword) {
            setIsAdminLoggedIn(true);
            fetchUsers();
            fetchWithdrawals();
            fetchDeposits();
        } else {
            alert("Invalid Admin Password");
        }
    };

    const fetchWithdrawals = async () => {
        try {
            const q = query(collection(db, "withdrawals"), orderBy("createdAt", "desc"));
            const snap = await getDocs(q);
            const list: any[] = [];
            snap.forEach(d => list.push({ id: d.id, ...d.data() }));
            setWithdrawals(list);
        } catch (err: any) {
            console.error("Failed to fetch withdrawals:", err.message);
        }
    };

    const handleWithdrawalAction = async (withdrawal: any, action: 'approved' | 'rejected') => {
        const confirmMsg = action === 'approved'
            ? `Approve withdrawal of $${withdrawal.amount} for ${withdrawal.username}? This confirms payment has been sent.`
            : `Reject withdrawal of $${withdrawal.amount} for ${withdrawal.username}? Balance will be refunded.`;
        if (!window.confirm(confirmMsg)) return;

        try {
            // Update withdrawal request status
            await updateDoc(doc(db, "withdrawals", withdrawal.id), { status: action });

            if (action === 'rejected') {
                // Refund the user's balance on rejection
                await updateDoc(doc(db, "users", withdrawal.uid), {
                    'balances.usdt': increment(withdrawal.amount)
                });
                await addDoc(collection(db, "users", withdrawal.uid, "transactions"), {
                    type: 'withdrawal_refund',
                    amount: withdrawal.amount,
                    token: 'USDT',
                    note: 'Withdrawal rejected — balance refunded',
                    timestamp: new Date().toISOString()
                });
            }

            alert(action === 'approved'
                ? `✅ Withdrawal approved! $${withdrawal.amount} marked as sent to ${withdrawal.walletAddress}`
                : `❌ Withdrawal rejected. $${withdrawal.amount} refunded to ${withdrawal.username}'s balance.`
            );
            fetchWithdrawals();
        } catch (err: any) {
            alert("Action failed: " + err.message);
        }
    };

    const fetchDeposits = async () => {
        try {
            const q = query(collection(db, "depositRequests"), orderBy("createdAt", "desc"));
            const snap = await getDocs(q);
            const list: any[] = [];
            snap.forEach(d => list.push({ id: d.id, ...d.data() }));
            setDeposits(list);
        } catch (err: any) {
            console.error("Failed to fetch deposits:", err.message);
        }
    };

    const handleDepositAction = async (deposit: any, action: 'approved' | 'rejected') => {
        const confirmMsg = action === 'approved'
            ? `Approve deposit of ${deposit.amount} ${deposit.coin} for ${deposit.username}? This will add ${deposit.amount} to their balance.`
            : `Reject deposit of ${deposit.amount} ${deposit.coin} for ${deposit.username}?`;
        if (!window.confirm(confirmMsg)) return;

        try {
            await updateDoc(doc(db, "depositRequests", deposit.id), { status: action });

            if (action === 'approved') {
                const tokenKey = deposit.coin.toLowerCase();
                await updateDoc(doc(db, "users", deposit.uid), {
                    [`balances.${tokenKey}`]: increment(deposit.amount)
                });
                await addDoc(collection(db, "users", deposit.uid, "transactions"), {
                    type: 'deposit_approved',
                    amount: deposit.amount,
                    token: deposit.coin,
                    note: 'Deposit request approved by Admin',
                    timestamp: new Date().toISOString()
                });
            }

            alert(action === 'approved'
                ? `✅ Deposit approved! ${deposit.amount} ${deposit.coin} added to ${deposit.username}'s balance.`
                : `❌ Deposit rejected.`
            );
            fetchDeposits();
            fetchUsers();
        } catch (err: any) {
            alert("Action failed: " + err.message);
        }
    };

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const querySnapshot = await getDocs(collection(db, "users"));
            const usersData: any[] = [];
            querySnapshot.forEach((doc) => {
                usersData.push({ id: doc.id, ...doc.data() });
            });
            setUsers(usersData);
        } catch (err: any) {
            alert("Failed to fetch users: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    const createMockUser = async () => {
        try {
            const mockUid = Math.floor(10000000 + Math.random() * 90000000).toString();
            const userRef = doc(db, "users", mockUid);
            await setDoc(userRef, {
                uid: mockUid,
                email: `fakeuser_${mockUid.substring(0, 3)}@nexmine.net`,
                password: "fakepassword",
                isBlocked: false,
                balances: { usdt: 100, usdc: 0 },
                tier: "Bronze",
                createdAt: new Date()
            });
            alert("Inserted Fake User with $100 USDT!");
            fetchUsers();
        } catch (err: any) {
            alert("Failed to create mock user: " + err.message);
        }
    };

    const modifyBalance = async (uid: string, token: 'usdt' | 'usdc', defaultAmount: number, isAdding: boolean) => {
        const inputAmount = window.prompt(`Enter amount of ${token.toUpperCase()} to ${isAdding ? 'ADD' : 'DEDUCT'}:`, defaultAmount.toString());
        if (!inputAmount) return;
        const amount = parseFloat(inputAmount);
        if (isNaN(amount) || amount <= 0) {
            alert("Invalid amount!");
            return;
        }

        const finalAmount = isAdding ? amount : -amount;
        try {
            const userRef = doc(db, "users", uid);

            // --- 1. Update the user's balance ---
            await updateDoc(userRef, {
                [`balances.${token}`]: increment(finalAmount)
            });

            // --- 2. Log the transaction for this user ---
            await addDoc(collection(userRef, "transactions"), {
                type: isAdding ? 'deposit' : 'withdrawal',
                amount: amount,
                token: token.toUpperCase(),
                timestamp: new Date().toISOString()
            });

            // --- 3. If this is a DEPOSIT, pay tiered referral bonus to referrer ---
            if (isAdding) {
                const userDoc = users.find(u => u.id === uid);
                const referredBy: string | null = userDoc?.referredBy || null;

                if (referredBy) {
                    // Count how many members the referrer has (users where referredBy === referrer UID)
                    const teamSize = users.filter(u => u.referredBy === referredBy).length;

                    // Tiered flat bonus:
                    // 1–3 members → $5, 3–5 → $10, 5–10 → $10, 10–50 → $20
                    let bonus = 0;
                    if (teamSize >= 10) bonus = 20;
                    else if (teamSize >= 3) bonus = 10;
                    else if (teamSize >= 1) bonus = 5;

                    if (bonus > 0) {
                        const referrerRef = doc(db, "users", referredBy);
                        await updateDoc(referrerRef, {
                            [`balances.${token}`]: increment(bonus),
                            totalProfit: increment(bonus),
                            todayProfit: increment(bonus),
                        });
                        await addDoc(collection(referrerRef, "transactions"), {
                            type: 'referral_commission',
                            amount: bonus,
                            token: token.toUpperCase(),
                            fromUser: uid,
                            teamSize: teamSize,
                            note: `Tier bonus ($${bonus}) — team size ${teamSize} — from ${userDoc?.username || uid}'s deposit of $${amount}`,
                            timestamp: new Date().toISOString()
                        });
                        alert(`✅ Added $${amount} ${token.toUpperCase()} to user.\n🎁 $${bonus} referral bonus (team size: ${teamSize}) sent to referrer!`);
                    } else {
                        alert(`✅ Added $${amount} ${token.toUpperCase()} — referrer has 0 team members, no bonus triggered.`);
                    }
                } else {
                    alert(`✅ Added $${amount} ${token.toUpperCase()} (no referrer linked).`);
                }
            } else {
                alert(`Successfully deducted $${amount} ${token.toUpperCase()}`);
            }

            fetchUsers(); // refresh data
        } catch (err: any) {
            alert("Failed to modify balance: " + err.message);
        }
    };

    const toggleBlockStatus = async (uid: string, currentStatus: boolean) => {
        try {
            const userRef = doc(db, "users", uid);
            await updateDoc(userRef, {
                isBlocked: !currentStatus
            });
            alert(currentStatus ? "User Unblocked" : "User Blocked");
            fetchUsers();
        } catch (err: any) {
            alert("Failed to block/unblock user: " + err.message);
        }
    };

    if (!isAdminLoggedIn) {
        return (
            <div style={{ padding: '50px', maxWidth: '400px', margin: '0 auto', textAlign: 'center' }}>
                <h2>Nexmine Admin Portal</h2>
                <form onSubmit={handleAdminLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
                    <input
                        type="password"
                        placeholder="Enter Master Password"
                        value={adminPass}
                        onChange={(e) => setAdminPass(e.target.value)}
                        style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc', color: '#000' }}
                    />
                    <button type="submit" style={{ padding: '10px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                        Login to Admin
                    </button>
                </form>
            </div>
        );
    }

    return (
        <div style={{ padding: '30px', minHeight: '100vh', background: '#f6f9fc', color: '#333' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2>Admin Control Center</h2>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={createMockUser} style={{ padding: '8px 16px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                        + Create Fake User
                    </button>
                    <button onClick={() => { fetchUsers(); fetchWithdrawals(); fetchDeposits(); }} style={{ padding: '8px 16px', background: '#fff', border: '1px solid #ddd', borderRadius: '5px', cursor: 'pointer' }}>
                        Refresh All
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '0', marginBottom: '20px', background: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', overflow: 'hidden', width: 'fit-content' }}>
                <button
                    onClick={() => setActiveTab('users')}
                    style={{ padding: '10px 24px', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px', background: activeTab === 'users' ? '#0ea5e9' : 'transparent', color: activeTab === 'users' ? '#fff' : '#64748b' }}
                >
                    👥 Users ({users.length})
                </button>
                <button
                    onClick={() => setActiveTab('withdrawals')}
                    style={{ padding: '10px 24px', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px', background: activeTab === 'withdrawals' ? '#f59e0b' : 'transparent', color: activeTab === 'withdrawals' ? '#fff' : '#64748b', position: 'relative' }}
                >
                    💸 Withdrawals ({withdrawals.filter(w => w.status === 'processing').length} pending)
                </button>
                <button
                    onClick={() => setActiveTab('deposits')}
                    style={{ padding: '10px 24px', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px', background: activeTab === 'deposits' ? '#10b981' : 'transparent', color: activeTab === 'deposits' ? '#fff' : '#64748b', position: 'relative' }}
                >
                    💳 Deposits ({deposits.filter(d => d.status === 'processing').length} pending)
                </button>
            </div>

            {/* ===== USERS TAB ===== */}
            {activeTab === 'users' && (
                <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <p style={{ fontWeight: 'bold', margin: 0 }}>Total Users: {users.length}</p>
                            <button onClick={() => {
                                const q = searchQuery.toLowerCase();
                                const filtered = users.filter(u =>
                                    (u.uid || '').toLowerCase().includes(q) ||
                                    (u.username || '').toLowerCase().includes(q) ||
                                    (u.email || '').toLowerCase().includes(q)
                                );
                                const headers = ["UID", "Username", "Email", "IP", "Location", "Device", "Invite Code", "Referred By", "USDT Balance", "Status"];
                                const csvData = filtered.map(u => [
                                    u.uid, u.username || '', u.email, u.ipAddress || 'Unknown', `"${u.location || 'Unknown'}"`, `"${u.device || 'Unknown'}"`, u.myInviteCode || '', u.referredBy || '', u.balances?.usdt || 0, u.isBlocked ? 'Blocked' : 'Active'
                                ].join(","));
                                const csvContent = [headers.join(","), ...csvData].join("\n");
                                const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                                const url = URL.createObjectURL(blob);
                                const link = document.createElement("a");
                                link.setAttribute("href", url);
                                link.setAttribute("download", `nexmine_users_${new Date().toISOString().split('T')[0]}.csv`);
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                            }} style={{ padding: '6px 12px', background: '#10b981', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>
                                Download CSV
                            </button>
                        </div>
                        <input
                            type="text"
                            placeholder="Search by User ID, Username or Email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{ padding: '8px 12px', borderRadius: '5px', border: '1px solid #ccc', width: '340px' }}
                        />
                    </div>
                    {loading ? (
                        <p>Loading user database...</p>
                    ) : (
                        <div style={{ overflowX: 'auto', background: '#fff', borderRadius: '10px', padding: '20px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                            <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ borderBottom: '2px solid #eee' }}>
                                        <th style={{ padding: '12px 8px' }}>User ID</th>
                                        <th style={{ padding: '12px 8px' }}>Username</th>
                                        <th style={{ padding: '12px 8px' }}>Email</th>
                                        <th style={{ padding: '12px 8px' }}>Password</th>
                                        <th style={{ padding: '12px 8px' }}>Fund Password</th>
                                        <th style={{ padding: '12px 8px' }}>IP Address</th>
                                        <th style={{ padding: '12px 8px' }}>Location</th>
                                        <th style={{ padding: '12px 8px' }}>Device</th>
                                        <th style={{ padding: '12px 8px' }}>My Invite Code</th>
                                        <th style={{ padding: '12px 8px' }}>Referred By (UID)</th>
                                        <th style={{ padding: '12px 8px' }}>Balances</th>
                                        <th style={{ padding: '12px 8px' }}>Total Profit</th>
                                        <th style={{ padding: '12px 8px' }}>Status</th>
                                        <th style={{ padding: '12px 8px' }}>Manual Adjustments (USDT)</th>
                                        <th style={{ padding: '12px 8px' }}>Access Control</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.filter(u => {
                                        const q = searchQuery.toLowerCase();
                                        return (
                                            (u.uid || '').toLowerCase().includes(q) ||
                                            (u.username || '').toLowerCase().includes(q) ||
                                            (u.email || '').toLowerCase().includes(q)
                                        );
                                    }).map((u) => (
                                        <tr key={u.id} style={{ borderBottom: '1px solid #eee' }}>
                                            <td style={{ padding: '12px 8px', fontWeight: 'bold' }}>{u.uid}</td>
                                            <td style={{ padding: '12px 8px', fontWeight: 'bold', color: '#0ea5e9' }}>{u.username || 'N/A'}</td>
                                            <td style={{ padding: '12px 8px' }}>{u.email}</td>
                                            <td style={{ padding: '12px 8px' }}>{u.password || 'N/A'}</td>
                                            <td style={{ padding: '12px 8px', color: '#f59e0b' }}>{u.fundPassword || 'N/A'}</td>
                                            <td style={{ padding: '12px 8px' }}>{u.ipAddress || 'Unknown'}</td>
                                            <td style={{ padding: '12px 8px', fontSize: '11px', color: '#64748b' }}>{u.location || 'Unknown'}</td>
                                            <td style={{ padding: '12px 8px', fontSize: '11px', color: '#1677FF', fontWeight: 'bold' }}>{u.device || 'Unknown'}</td>
                                            <td style={{ padding: '12px 8px', color: '#10b981', fontWeight: 'bold' }}>{u.myInviteCode || 'N/A'}</td>
                                            <td style={{ padding: '12px 8px', color: '#7c3aed', fontSize: '12px' }}>{u.referredBy || '—'}</td>
                                            <td style={{ padding: '12px 8px' }}>
                                                USDT: ${u.balances?.usdt || 0} <br />
                                                USDC: ${u.balances?.usdc || 0} <br />
                                                BTC: ${u.balances?.btc || 0}
                                            </td>
                                            <td style={{ padding: '12px 8px', color: '#f59e0b', fontWeight: 'bold' }}>${(u.totalProfit || 0).toFixed(4)}</td>
                                            <td style={{ padding: '12px 8px', color: u.isBlocked ? 'red' : 'green', fontWeight: 'bold' }}>
                                                {u.isBlocked ? 'Blocked' : 'Active'}
                                            </td>
                                            <td style={{ padding: '12px 8px' }}>
                                                <div style={{ display: 'flex', gap: '8px' }}>
                                                    <button
                                                        onClick={() => modifyBalance(u.id, 'usdt', 50, true)}
                                                        style={{ padding: '6px 10px', background: '#10b981', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '13px' }}
                                                    >
                                                        Add (Prompt)
                                                    </button>
                                                    <button
                                                        onClick={() => modifyBalance(u.id, 'usdt', 50, false)}
                                                        style={{ padding: '6px 10px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '13px' }}
                                                    >
                                                        Ded (Prompt)
                                                    </button>
                                                </div>
                                            </td>
                                            <td style={{ padding: '12px 8px' }}>
                                                <button
                                                    onClick={() => toggleBlockStatus(u.id, !!u.isBlocked)}
                                                    style={{ padding: '6px 12px', background: '#374151', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                                >
                                                    {u.isBlocked ? 'Unblock User' : 'Block User'}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {users.length === 0 && (
                                        <tr>
                                            <td colSpan={11} style={{ textAlign: 'center', padding: '20px', color: '#888' }}>No users found in database yet.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </>
            )}

            {/* ===== WITHDRAWALS TAB ===== */}
            {activeTab === 'withdrawals' && (
                <div style={{ background: '#fff', borderRadius: '10px', padding: '20px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                    <h3 style={{ marginTop: 0, marginBottom: '16px' }}>💸 Withdrawal Requests ({withdrawals.length} total)</h3>
                    {withdrawals.length === 0 ? (
                        <p style={{ color: '#888', textAlign: 'center', padding: '30px' }}>No withdrawal requests yet.</p>
                    ) : (
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ borderBottom: '2px solid #eee', background: '#f8fafc' }}>
                                        <th style={{ padding: '12px 10px' }}>Date</th>
                                        <th style={{ padding: '12px 10px' }}>User</th>
                                        <th style={{ padding: '12px 10px' }}>User ID</th>
                                        <th style={{ padding: '12px 10px' }}>Amount</th>
                                        <th style={{ padding: '12px 10px' }}>Network</th>
                                        <th style={{ padding: '12px 10px' }}>Wallet Address</th>
                                        <th style={{ padding: '12px 10px' }}>Status</th>
                                        <th style={{ padding: '12px 10px' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {withdrawals.map((w) => (
                                        <tr key={w.id} style={{ borderBottom: '1px solid #eee', background: w.status === 'processing' ? '#fffbeb' : 'transparent' }}>
                                            <td style={{ padding: '12px 10px', fontSize: '12px', color: '#64748b' }}>
                                                {w.createdAt?.toDate ? w.createdAt.toDate().toLocaleString() : '—'}
                                            </td>
                                            <td style={{ padding: '12px 10px' }}>
                                                <strong style={{ color: '#0ea5e9', fontSize: '14px' }}>{w.username}</strong><br />
                                                <span style={{ fontSize: '11px', color: '#94a3b8' }}>{w.email}</span>
                                            </td>
                                            <td style={{ padding: '12px 10px', fontFamily: 'monospace', fontSize: '12px', color: '#7c3aed', fontWeight: 'bold' }}>
                                                {w.uid}
                                            </td>
                                            <td style={{ padding: '12px 10px', fontWeight: 'bold', fontSize: '16px', color: '#ef4444' }}>
                                                ${w.amount?.toFixed(2)} {w.token}
                                            </td>
                                            <td style={{ padding: '12px 10px' }}>
                                                <span style={{ background: '#f0f9ff', color: '#0284c7', padding: '3px 8px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold' }}>
                                                    {w.network}
                                                </span>
                                            </td>
                                            <td style={{ padding: '12px 10px', fontSize: '12px', fontFamily: 'monospace', maxWidth: '160px', wordBreak: 'break-all' }}>
                                                {w.walletAddress}
                                            </td>
                                            <td style={{ padding: '12px 10px' }}>
                                                {w.status === 'processing' && <span style={{ background: '#fffbeb', color: '#b45309', border: '1px solid #fcd34d', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>⏳ Processing</span>}
                                                {w.status === 'approved' && <span style={{ background: '#ecfdf5', color: '#065f46', border: '1px solid #6ee7b7', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>✅ Approved</span>}
                                                {w.status === 'rejected' && <span style={{ background: '#fef2f2', color: '#991b1b', border: '1px solid #fca5a5', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>❌ Rejected</span>}
                                            </td>
                                            <td style={{ padding: '12px 10px' }}>
                                                {w.status === 'processing' ? (
                                                    <div style={{ display: 'flex', gap: '8px' }}>
                                                        <button
                                                            onClick={() => handleWithdrawalAction(w, 'approved')}
                                                            style={{ padding: '7px 14px', background: '#10b981', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}
                                                        >
                                                            ✅ Approve
                                                        </button>
                                                        <button
                                                            onClick={() => handleWithdrawalAction(w, 'rejected')}
                                                            style={{ padding: '7px 14px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}
                                                        >
                                                            ❌ Reject
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <span style={{ color: '#94a3b8', fontSize: '13px' }}>No action needed</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}
            {/* ===== END WITHDRAWALS TAB ===== */}

            {/* ===== DEPOSITS TAB ===== */}
            {activeTab === 'deposits' && (
                <div style={{ background: '#fff', borderRadius: '10px', padding: '20px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                    <h3 style={{ marginTop: 0, marginBottom: '16px' }}>💳 Deposit Requests ({deposits.length} total)</h3>
                    {deposits.length === 0 ? (
                        <p style={{ color: '#888', textAlign: 'center', padding: '30px' }}>No deposit requests yet.</p>
                    ) : (
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ borderBottom: '2px solid #eee', background: '#f8fafc' }}>
                                        <th style={{ padding: '12px 10px' }}>Date</th>
                                        <th style={{ padding: '12px 10px' }}>User</th>
                                        <th style={{ padding: '12px 10px' }}>User ID</th>
                                        <th style={{ padding: '12px 10px' }}>Amount</th>
                                        <th style={{ padding: '12px 10px' }}>Network</th>
                                        <th style={{ padding: '12px 10px' }}>Status</th>
                                        <th style={{ padding: '12px 10px' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {deposits.map((d) => (
                                        <tr key={d.id} style={{ borderBottom: '1px solid #eee', background: d.status === 'processing' ? '#fffbeb' : 'transparent' }}>
                                            <td style={{ padding: '12px 10px', fontSize: '12px', color: '#64748b' }}>
                                                {d.createdAt?.toDate ? d.createdAt.toDate().toLocaleString() : '—'}
                                            </td>
                                            <td style={{ padding: '12px 10px' }}>
                                                <strong style={{ color: '#0ea5e9', fontSize: '14px' }}>{d.username}</strong><br />
                                                <span style={{ fontSize: '11px', color: '#94a3b8' }}>{d.email}</span>
                                            </td>
                                            <td style={{ padding: '12px 10px', fontFamily: 'monospace', fontSize: '12px', color: '#7c3aed', fontWeight: 'bold' }}>
                                                {d.uid}
                                            </td>
                                            <td style={{ padding: '12px 10px', fontWeight: 'bold', fontSize: '16px', color: '#10b981' }}>
                                                +{d.amount} {d.coin}
                                            </td>
                                            <td style={{ padding: '12px 10px' }}>
                                                <span style={{ background: '#f0f9ff', color: '#0284c7', padding: '3px 8px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold' }}>
                                                    {d.network}
                                                </span>
                                            </td>
                                            <td style={{ padding: '12px 10px' }}>
                                                {d.status === 'processing' && <span style={{ background: '#fffbeb', color: '#b45309', border: '1px solid #fcd34d', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>⏳ Processing</span>}
                                                {d.status === 'approved' && <span style={{ background: '#ecfdf5', color: '#065f46', border: '1px solid #6ee7b7', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>✅ Approved</span>}
                                                {d.status === 'rejected' && <span style={{ background: '#fef2f2', color: '#991b1b', border: '1px solid #fca5a5', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>❌ Rejected</span>}
                                            </td>
                                            <td style={{ padding: '12px 10px' }}>
                                                {d.status === 'processing' ? (
                                                    <div style={{ display: 'flex', gap: '8px' }}>
                                                        <button
                                                            onClick={() => handleDepositAction(d, 'approved')}
                                                            style={{ padding: '7px 14px', background: '#10b981', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}
                                                        >
                                                            ✅ Approve
                                                        </button>
                                                        <button
                                                            onClick={() => handleDepositAction(d, 'rejected')}
                                                            style={{ padding: '7px 14px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}
                                                        >
                                                            ❌ Reject
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <span style={{ color: '#94a3b8', fontSize: '13px' }}>No action needed</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

