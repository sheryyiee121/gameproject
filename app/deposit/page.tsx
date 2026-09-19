"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

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

    // Hardcoded addresses provided by Admin
    const addresses: Record<string, Record<string, string>> = {
        USDT: {
            'BEP20 / ERC20': '0xc8985fd4de706497593080c387c8a86ee82b71f2',
            'TRC20': 'TBHn9sWLAc6kP1rxfdQU5zBNpyUUbtu9wN',
            'SOL': 'AmHseTi1eaMBwa4VufTiNXEdVdTeSZ4LeJLucTxwRbV7'
        },
        USDC: {
            'BEP20 / ERC20': '0xc8985fd4de706497593080c387c8a86ee82b71f2',
            'SOL': 'AmHseTi1eaMBwa4VufTiNXEdVdTeSZ4LeJLucTxwRbV7'
        },
        BTC: {
            'Bitcoin Network': '18egKgZVuLZuftaUDTskLFeYKb6gC5iLXZ'
        }
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

                    {/* QR Code Placeholder (could be a real QR generator later) */}
                    <div style={{ width: '150px', height: '150px', background: '#f1f5f9', margin: '0 auto 20px auto', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ color: '#94a3b8', fontSize: '12px' }}>QR Code Mapping</span>
                    </div>

                    <h4 style={{ margin: 0, marginBottom: '8px', fontSize: '15px' }}>Deposit Address</h4>
                    <p style={{ background: '#f8fafc', padding: '12px', borderRadius: '6px', fontSize: '13px', wordBreak: 'break-all', marginBottom: '15px', border: '1px solid #e2e8f0' }}>
                        {currentAddress}
                    </p>

                    <button onClick={handleCopy} style={{ width: '100%', padding: '14px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer' }}>
                        Copy Address
                    </button>
                </div>

                <div style={{ marginTop: '20px', padding: '15px', background: '#fffbeb', borderLeft: '4px solid #f59e0b', borderRadius: '4px' }}>
                    <p style={{ margin: 0, fontSize: '13px', color: '#b45309', lineHeight: '1.5' }}>
                        <strong>Important:</strong> Only send {selectedCoin} to this address using the selected network. After transferring, please wait 3-5 minutes for the Admin to verify and manually fund your account balance.
                    </p>
                </div>

            </main>

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
        </div>
    );
}

