"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { db } from '@/lib/firebase';
import { doc, getDoc, collection, addDoc, getDocs, query, orderBy, serverTimestamp, updateDoc, increment } from 'firebase/firestore';

// Official crypto logo URLs from cryptologos.cc CDN
const COIN_LOGOS: Record<string, string> = {
    USDT: 'https://cryptologos.cc/logos/tether-usdt-logo.svg?v=040',
    USDC: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.svg?v=040',
    BTC: 'https://cryptologos.cc/logos/bitcoin-btc-logo.svg?v=040',
};

export default function DepositPage() {
    const router = useRouter();
    const [selectedCoin, setSelectedCoin] = useState<'USDT' | 'USDC' | 'BTC'>('USDT');
    const [selectedNetwork, setSelectedNetwork] = useState<string>('BEP20');
    const [user, setUser] = useState<any>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [depositRequests, setDepositRequests] = useState<any[]>([]);

    const uid = typeof window !== 'undefined' ? localStorage.getItem("nexmine_uid") : null;

    useEffect(() => {
        if (!uid) { router.push('/login'); return; }
        getDoc(doc(db, "users", uid)).then(snap => {
            if (snap.exists()) setUser(snap.data());
            else router.push('/login');
        });
        fetchDepositRequests();
    }, [uid, router]);

    const fetchDepositRequests = async () => {
        if (!uid) return;
        try {
            const q = query(collection(db, "depositRequests"), orderBy("createdAt", "desc"));
            const snap = await getDocs(q);
            const list: any[] = [];
            snap.forEach(d => {
                const data = d.data();
                if (data.uid === uid) list.push({ id: d.id, ...data });
            });
            setDepositRequests(list);
        } catch (e) { /* index may not exist yet, ignore */ }
    };

    const handleDepositConfirmed = async () => {
        if (isSubmitting) return;

        const inputAmount = window.prompt("Please enter the amount you deposited:", "50");
        if (!inputAmount) return;
        const amount = parseFloat(inputAmount);
        if (isNaN(amount) || amount <= 0) {
            alert("Invalid amount entered.");
            return;
        }

        setIsSubmitting(true);
        try {
            await addDoc(collection(db, "depositRequests"), {
                uid: uid,
                username: user?.username || 'Unknown',
                email: user?.email || '',
                amount: amount,
                coin: selectedCoin,
                network: selectedNetwork,
                status: 'processing',
                createdAt: serverTimestamp()
            });

            alert(`✅ Deposit request for ${amount} ${selectedCoin} submitted!\n\nStatus: Processing.\n\nPlease send a screenshot of your successful transaction to the Telegram team to verify and confirm your deposit.`);
            fetchDepositRequests();
        } catch (err: any) {
            alert("Failed to submit deposit request: " + err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const addresses: Record<string, Record<string, string>> = {
        USDT: {
            'BEP20': '0xc8985fd4de706497593080c387c8a86ee82b71f2',
            'ERC20': '0xc8985fd4de706497593080c387c8a86ee82b71f2',
            'TRC20': 'TBHn9sWLAc6kP1rxfdQU5zBNpyUUbtu9wN',
            'SOL': 'AmHseTi1eaMBwa4VufTiNXEdVdTeSZ4LeJLucTxwRbV7'
        },
        USDC: {
            'BEP20': '0xc8985fd4de706497593080c387c8a86ee82b71f2',
            'ERC20': '0xc8985fd4de706497593080c387c8a86ee82b71f2',
            'SOL': 'AmHseTi1eaMBwa4VufTiNXEdVdTeSZ4LeJLucTxwRbV7'
        },
        BTC: {
            'Bitcoin Network': '18egKgZVuLZuftaUDTskLFeYKb6gC5iLXZ'
        }
    };

    const getQrImage = (coin: string, network: string) => {
        if (coin === 'USDT') {
            if (network === 'BEP20') return '/address/BscBep20.png';
            if (network === 'ERC20') return '/address/etherc20.png';
            if (network === 'TRC20') return '/address/TronTrc20.png';
            if (network === 'SOL') return '/address/sol.png';
        } else if (coin === 'USDC') {
            if (network === 'BEP20') return '/address/usdc/bscbep20.png';
            if (network === 'ERC20') return '/address/usdc/etherc20.png';
            if (network === 'SOL') return '/address/usdc/sol.png';
        } else if (coin === 'BTC') {
            if (network === 'Bitcoin Network') return '/address/Btc.png';
        }
        return '';
    };

    const getAvailableNetworks = () => Object.keys(addresses[selectedCoin]);
    const currentAddress = (addresses[selectedCoin] as any)[selectedNetwork] || (addresses[selectedCoin] as any)[getAvailableNetworks()[0]];

    const handleCopy = () => {
        navigator.clipboard.writeText(currentAddress);
        alert('Address Copied to clipboard!');
    };

    return (
        <div className="deposit-root">
            {/* Top Navbar */}
            <header className="top-nav">
                <button className="back-btn" onClick={() => router.back()} aria-label="Go back">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M15 18l-6-6 6-6" />
                    </svg>
                </button>
                <h1 className="nav-title">Deposit Crypto</h1>
                <div className="empty-space" style={{ width: 24 }}></div>
            </header>

            <main className="main-content" style={{ padding: '20px', color: '#1e293b' }}>

                {/* Coin Selection */}
                <h3 style={{ marginBottom: '10px', fontSize: '14px', color: '#64748b' }}>Select Coin</h3>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                    {(['USDT', 'USDC', 'BTC'] as const).map(coin => (
                        <button
                            key={coin}
                            onClick={() => {
                                setSelectedCoin(coin);
                                setSelectedNetwork(Object.keys(addresses[coin])[0]);
                            }}
                            className={`coin-select-btn ${selectedCoin === coin ? 'coin-active' : ''}`}
                        >
                            <img
                                src={COIN_LOGOS[coin]}
                                alt={`${coin} logo`}
                                className="coin-logo"
                            />
                            <span>{coin}</span>
                        </button>
                    ))}
                </div>

                {/* Network Selection */}
                <h3 style={{ marginBottom: '10px', fontSize: '14px', color: '#64748b' }}>Select Network</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '30px' }}>
                    {getAvailableNetworks().map(network => (
                        <button
                            key={network}
                            onClick={() => setSelectedNetwork(network)}
                            style={{
                                padding: '10px 15px', borderRadius: '8px', border: '1px solid',
                                borderColor: selectedNetwork === network || (network === getAvailableNetworks()[0] && !getAvailableNetworks().includes(selectedNetwork)) ? '#10b981' : '#e2e8f0',
                                background: selectedNetwork === network || (network === getAvailableNetworks()[0] && !getAvailableNetworks().includes(selectedNetwork)) ? '#ecfdf5' : '#fff',
                                color: selectedNetwork === network || (network === getAvailableNetworks()[0] && !getAvailableNetworks().includes(selectedNetwork)) ? '#047857' : '#334155',
                                fontWeight: 'bold', cursor: 'pointer', fontSize: '13px'
                            }}
                        >
                            {network}
                        </button>
                    ))}
                </div>

                {/* Address Card */}
                <div style={{ background: '#fff', borderRadius: '12px', padding: '20px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', textAlign: 'center' }}>

                    {/* Selected coin logo in the card */}
                    <div className="address-card-icon">
                        <img
                            src={COIN_LOGOS[selectedCoin]}
                            alt={`${selectedCoin} logo`}
                            style={{ width: '48px', height: '48px' }}
                        />
                        <span style={{ marginTop: '6px', fontWeight: 700, fontSize: '16px', color: '#1e293b' }}>{selectedCoin}</span>
                    </div>

                    {/* QR Code Mapping */}
                    <div style={{ width: '150px', height: '150px', margin: '0 auto 20px auto', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                        {getQrImage(selectedCoin, selectedNetwork.toString()) ? (
                            <img src={getQrImage(selectedCoin, selectedNetwork.toString())} alt="QR Code" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                        ) : (
                            <span style={{ color: '#94a3b8', fontSize: '12px' }}>QR Code Mapping</span>
                        )}
                    </div>

                    <h4 style={{ margin: 0, marginBottom: '8px', fontSize: '15px' }}>Deposit Address</h4>
                    <p style={{ background: '#f8fafc', padding: '12px', borderRadius: '6px', fontSize: '13px', wordBreak: 'break-all', marginBottom: '15px', border: '1px solid #e2e8f0' }}>
                        {currentAddress}
                    </p>

                    <button onClick={handleCopy} style={{ width: '100%', padding: '14px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer' }}>
                        Copy Address
                    </button>
                </div>

                {/* Important Note */}
                <div style={{ marginTop: '20px', padding: '15px', background: '#fffbeb', borderLeft: '4px solid #f59e0b', borderRadius: '4px', textAlign: 'left' }}>
                    <p style={{ margin: 0, fontSize: '13px', color: '#b45309', lineHeight: '1.5' }}>
                        <strong>Important:</strong> Only send {selectedCoin} to this address using the selected network.
                    </p>
                </div>

                <button
                    onClick={handleDepositConfirmed}
                    disabled={isSubmitting}
                    style={{
                        width: '100%', padding: '14px', background: '#10b981', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '16px', cursor: isSubmitting ? 'not-allowed' : 'pointer', marginTop: '15px', opacity: isSubmitting ? 0.7 : 1
                    }}>
                    {isSubmitting ? 'Processing...' : 'Deposit Confirmed'}
                </button>
                <p style={{ fontSize: '12px', color: '#64748b', marginTop: '12px' }}>
                    After clicking <strong>Deposit Confirmed</strong>, please send a screenshot to the Telegram team so they can verify and approve it.
                </p>

                {/* Deposit History */}
                {depositRequests.length > 0 && (
                    <div style={{ background: '#fff', borderRadius: '12px', padding: '20px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', marginTop: '20px' }}>
                        <h4 style={{ margin: '0 0 15px 0', fontSize: '16px' }}>Deposit Requests</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {depositRequests.map(req => (
                                <div key={req.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                                    <div>
                                        <div style={{ fontWeight: 'bold', fontSize: '14px', color: '#1e293b' }}>
                                            +{req.amount} {req.coin} <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 'normal' }}>({req.network})</span>
                                        </div>
                                        <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>
                                            {req.createdAt?.toDate ? req.createdAt.toDate().toLocaleString() : 'Pending...'}
                                        </div>
                                    </div>
                                    <div style={{ fontSize: '12px', fontWeight: 'bold', padding: '4px 10px', borderRadius: '12px', ...req.status === 'processing' ? { background: '#fffbeb', color: '#b45309' } : req.status === 'approved' ? { background: '#ecfdf5', color: '#10b981' } : { background: '#fef2f2', color: '#ef4444' } }}>
                                        {req.status === 'processing' ? '⏳ Processing' : req.status === 'approved' ? '✅ Approved' : '❌ Rejected'}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )
                }

            </main >

            <style jsx>{`
        .deposit-root {
          min-height: 100vh;
          background: #f6f9fc;
        }
        .top-nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 20px;
          background: #fff;
          border-bottom: 1px solid #eef2f6;
        }
        .nav-title {
          font-size: 18px;
          font-weight: 600;
          color: #1e293b;
        }
        .back-btn {
          background: none;
          border: none;
          padding: 0;
          color: #64748b;
          cursor: pointer;
        }
        .coin-select-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 12px;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
          background: #fff;
          color: #334155;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 14px;
        }
        .coin-select-btn:hover {
          border-color: #93c5fd;
          background: #f8faff;
        }
        .coin-select-btn.coin-active {
          border-color: #3b82f6;
          background: #eff6ff;
          color: #1d4ed8;
        }
        .coin-logo {
          width: 24px;
          height: 24px;
          object-fit: contain;
        }
        .address-card-icon {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 16px;
        }
      `}</style>
        </div >
    );
}

