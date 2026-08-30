"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, doc, updateDoc, increment, setDoc, addDoc } from "firebase/firestore";

export default function AdminDashboard() {
    const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
    const [adminPass, setAdminPass] = useState("");
    const [users, setUsers] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(false);

    const handleAdminLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (adminPass === "admin123") {
            setIsAdminLoggedIn(true);
            fetchUsers();
        } else {
            alert("Invalid Admin Password");
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
            await updateDoc(userRef, {
                [`balances.${token}`]: increment(finalAmount)
            });

            // Log Transaction
            await addDoc(collection(userRef, "transactions"), {
                type: isAdding ? 'deposit' : 'withdrawal',
                amount: amount,
                token: token.toUpperCase(),
                timestamp: new Date().toISOString()
            });

            alert(`Successfully ${isAdding ? 'added' : 'deducted'} $${amount} ${token.toUpperCase()}`);
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
                    <button onClick={fetchUsers} style={{ padding: '8px 16px', background: '#fff', border: '1px solid #ddd', borderRadius: '5px', cursor: 'pointer' }}>
                        Refresh Data
                    </button>
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <p style={{ fontWeight: 'bold' }}>Total Users: {users.length}</p>
                <input
                    type="text"
                    placeholder="Search by Email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ padding: '8px 12px', borderRadius: '5px', border: '1px solid #ccc', width: '300px' }}
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
                                <th style={{ padding: '12px 8px' }}>Invite Code</th>
                                <th style={{ padding: '12px 8px' }}>Balances</th>
                                <th style={{ padding: '12px 8px' }}>Status</th>
                                <th style={{ padding: '12px 8px' }}>Manual Adjustments (USDT)</th>
                                <th style={{ padding: '12px 8px' }}>Access Control</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.filter(u => u.email.toLowerCase().includes(searchQuery.toLowerCase())).map((u) => (
                                <tr key={u.id} style={{ borderBottom: '1px solid #eee' }}>
                                    <td style={{ padding: '12px 8px', fontWeight: 'bold' }}>{u.uid}</td>
                                    <td style={{ padding: '12px 8px', fontWeight: 'bold', color: '#0ea5e9' }}>{u.username || 'N/A'}</td>
                                    <td style={{ padding: '12px 8px' }}>{u.email}</td>
                                    <td style={{ padding: '12px 8px' }}>{u.password || 'N/A'}</td>
                                    <td style={{ padding: '12px 8px', color: '#10b981', fontWeight: 'bold' }}>{u.myInviteCode || 'N/A'}</td>
                                    <td style={{ padding: '12px 8px' }}>
                                        USDT: ${u.balances?.usdt || 0} <br />
                                        USDC: ${u.balances?.usdc || 0} <br />
                                        BTC: ${u.balances?.btc || 0}
                                    </td>
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
                                    <td colSpan={6} style={{ textAlign: 'center', padding: '20px', color: '#888' }}>No generic users found in database yet.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
