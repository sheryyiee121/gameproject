"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { doc, getDoc, updateDoc, collection, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function DicePage() {
    const router = useRouter();
    const [userUid, setUserUid] = useState<string | null>(null);
    const [balance, setBalance] = useState<number>(0);
    const [betAmount, setBetAmount] = useState<string>('');
    const [currentBet, setCurrentBet] = useState<number>(0);
    const [winStreak, setWinStreak] = useState<number>(0);
    const [currentRate, setCurrentRate] = useState<number>(0.00);
    const [rewardAmount, setRewardAmount] = useState<number>(0.00);
    const [loading, setLoading] = useState(false);
    const [rolling, setRolling] = useState(false);
    const [diceResult, setDiceResult] = useState<number | null>(null);
    const [lastRollWasRigged, setLastRollWasRigged] = useState(false);

    useEffect(() => {
        const uid = localStorage.getItem("nexmine_uid");
        if (uid) {
            setUserUid(uid);
            fetchBalance(uid);
        } else {
            router.push('/login');
        }
    }, [router]);

    const fetchBalance = async (uid: string) => {
        try {
            const docRef = doc(db, 'users', uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const data = docSnap.data();
                setBalance(data.balances?.usdt || 0);
            }
        } catch (err) {
            console.error("Error fetching balance:", err);
        }
    };

    const handleBet = async () => {
        if (!userUid || loading || rolling) return;

        let amount = parseFloat(betAmount);

        if (winStreak > 0) {
            amount = currentBet;
        } else {
            if (isNaN(amount) || amount <= 0) {
                alert("Please enter a valid amount.");
                return;
            }
            if (amount > balance) {
                alert("Insufficient USDT balance.");
                return;
            }
        }

        if (winStreak >= 5) {
            alert("Max streak reached! Please claim your rewards.");
            return;
        }

        setLoading(true);
        setRolling(true);
        setDiceResult(null);
        setLastRollWasRigged(false);

        try {
            if (winStreak === 0) {
                const newBalance = balance - amount;
                setBalance(newBalance);
                setCurrentBet(amount);
                await updateDoc(doc(db, 'users', userUid), {
                    'balances.usdt': newBalance
                });
                await addDoc(collection(db, 'users', userUid, 'transactions'), {
                    amount: amount,
                    type: 'withdrawal',
                    description: 'Dice Game Play',
                    token: 'USDT',
                    timestamp: new Date().getTime(),
                    status: 'approved'
                });
            }

            setTimeout(() => {
                const baseAmount = winStreak === 0 ? amount : currentBet;
                const nextRate = winStreak === 0 ? 1.5 : currentRate * 1.5;
                const potentialReward = baseAmount * nextRate;

                // RIG LOGIC
                const forcedFail = potentialReward > 1.00;

                let roll;
                if (forcedFail) {
                    const failRolls = [1, 5, 6];
                    roll = failRolls[Math.floor(Math.random() * failRolls.length)];
                    setLastRollWasRigged(true);
                } else {
                    const allRolls = [1, 2, 3, 4, 5, 6];
                    roll = allRolls[Math.floor(Math.random() * allRolls.length)];
                }

                setDiceResult(roll);

                if ([2, 3, 4].includes(roll)) {
                    setWinStreak(prev => prev + 1);
                    setCurrentRate(nextRate);
                    setRewardAmount(potentialReward);
                } else {
                    setWinStreak(0);
                    setCurrentBet(0);
                    setCurrentRate(0);
                    setRewardAmount(0);
                }
                setRolling(false);
                setLoading(false);
            }, 800);

        } catch (err) {
            console.error(err);
            setLoading(false);
            setRolling(false);
        }
    };

    const handleClaim = async () => {
        if (!userUid || rewardAmount <= 0 || loading || rolling) return;
        setLoading(true);

        try {
            const docRef = doc(db, 'users', userUid);
            const newBalance = balance + rewardAmount;
            await updateDoc(docRef, {
                'balances.usdt': newBalance
            });
            await addDoc(collection(db, 'users', userUid, 'transactions'), {
                amount: rewardAmount,
                type: 'deposit',
                description: 'Dice Base Reward',
                token: 'USDT',
                timestamp: new Date().getTime(),
                status: 'approved'
            });
            setBalance(newBalance);
            alert(`Successfully claimed ${rewardAmount.toFixed(4)} USDT!`);
            setWinStreak(0);
            setCurrentBet(0);
            setCurrentRate(0);
            setRewardAmount(0);
            setBetAmount('');
            setDiceResult(null);
        } catch (err) {
            console.error("Error claiming:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="dice-page">
            <header className="header">
                <button onClick={() => router.back()} className="back-btn">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M15 18l-6-6 6-6" />
                    </svg>
                </button>
                <h1 className="header-title">Dice</h1>
                <div className="history-btn">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                </div>
            </header>

            <div className="rules-banner">
                Rules: 2-3-4 Success ×1.5; 1-5-6 Fail Reset; Max 5 Streak
            </div>

            <main className="content">
                <div className="total-assets-card">
                    <div className="card-header">
                        <span className="card-title">Total Assets</span>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                    </div>
                    <div className="card-main-val">
                        <span className="amount">{(balance || 0).toFixed(4)}</span>
                        <span className="currency">USDT</span>
                    </div>
                    <div className="card-trend">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="12" y1="19" x2="12" y2="5"></line>
                            <polyline points="5 12 12 5 19 12"></polyline>
                        </svg>
                        <span className="trend-val">+0.00$(+0.01%)</span>
                        <span className="trend-period">Mining ROI</span>
                    </div>
                    <div className="inner-boxes">
                        <div className="inner-box">
                            <span className="box-title">Available</span>
                            <span className="box-val">${(balance || 0).toFixed(4)}</span>
                        </div>
                        <div className="inner-box">
                            <span className="box-title">Total USDCs</span>
                            <span className="box-val">$0.0000</span>
                        </div>
                    </div>
                </div>

                <div className="dice-display">
                    <div className={`dice-image-wrapper ${rolling ? "rolling" : ""}`}>
                        <img src="/gamefi_dice.png" alt="Glowing Dice" className="main-dice" />
                        {diceResult && !rolling && (
                            <div className={`result-overlay ${[2, 3, 4].includes(diceResult) ? "success" : "fail"}`}>
                                Rolled: {diceResult} {lastRollWasRigged && '(Limits Applied)'}
                            </div>
                        )}
                    </div>
                </div>

                <div className="instructions">
                    Dice Rules: 2-3-4 Success (Rate ×1.5), 1-5-6 Fail (Reset), You Can Claim Rewards And Take Profit At Any Time
                </div>

                <div className="input-group">
                    <input
                        type="number"
                        placeholder="Please enter amount"
                        value={betAmount}
                        onChange={(e) => setBetAmount(e.target.value)}
                        disabled={winStreak > 0 || rolling}
                        className="bet-input"
                        step="0.01"
                        max="1"
                    />
                </div>

                <div className="action-buttons">
                    <button className="btn btn-bet" onClick={handleBet} disabled={loading || winStreak >= 5}>
                        {rolling ? 'Rolling...' : (winStreak > 0 ? 'Roll Again' : 'Bet')}
                    </button>
                    <button className="btn btn-claim" onClick={handleClaim} disabled={rewardAmount <= 0 || loading || rolling}>
                        Claim
                    </button>
                </div>

                <div className="stats-box">
                    <div className="stat-row">
                        <span className="stat-label">Current Bet</span>
                        <span className="stat-val">{currentBet > 0 ? currentBet.toFixed(4) : '0'} USDT</span>
                    </div>
                    <div className="stat-row">
                        <span className="stat-label">Win Streak</span>
                        <span className="stat-val">{winStreak} / 5</span>
                    </div>
                    <div className="stat-row">
                        <span className="stat-label">Current Rate</span>
                        <span className="stat-val highlight">{currentRate.toFixed(2)}x</span>
                    </div>
                    <div className="stat-row">
                        <span className="stat-label">Reward Amount</span>
                        <span className="stat-val highlight">{rewardAmount.toFixed(4)} USDT</span>
                    </div>
                </div>

                <div className="tips-box">
                    <div className="tips-header">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
                        </svg>
                        <span>Tips</span>
                    </div>
                    <p className="tips-text">
                        Each Success Multiplies Rate By ×1.5 (Max 5 Times, Highest 7.59x). Failure Resets The Bet. Suitable For Fast-Paced Combo Challenges.
                    </p>
                </div>
            </main>

            <style jsx>{`
                .dice-page {
                    min-height: 100vh;
                    background: #060B19;
                    color: #fff;
                    font-family: -apple-system, sans-serif;
                    display: flex;
                    flex-direction: column;
                }
                .header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 16px 20px;
                }
                .back-btn, .history-btn {
                    background: none;
                    border: none;
                    color: #fff;
                    cursor: pointer;
                    padding: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .header-title {
                    font-size: 18px;
                    font-weight: 700;
                    margin: 0;
                }
                .rules-banner {
                    margin: 0 20px;
                    padding: 12px;
                    background: transparent;
                    border: 1px solid rgba(129, 136, 148, 0.2);
                    border-radius: 20px;
                    text-align: center;
                    font-size: 13.5px;
                    color: #fff;
                    letter-spacing: 0.2px;
                }
                .content {
                    flex: 1;
                    padding: 20px;
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                }
                .total-assets-card {
                    background: #010413; border-radius: 24px; padding: 24px 20px; display: flex; flex-direction: column; align-items: center; gap: 12px; box-shadow: 0 8px 30px rgba(0,0,0,0.4); border: 1px solid rgba(129,136,148,0.15); margin-bottom: 20px;
                }
                .card-header { display: flex; align-items: center; justify-content: center; gap: 8px; width: 100%; }
                .card-title { font-size: 14px; color: #818894; font-weight: 600; }
                .card-main-val { display: flex; align-items: baseline; gap: 6px; }
                .amount { font-size: 34px; font-weight: 800; color: #ffffff; letter-spacing: -1px; }
                .currency { font-size: 15px; font-weight: 700; color: #0ea5e9; }
                .card-trend { display: flex; align-items: center; gap: 6px; margin-bottom: 8px; }
                .trend-val { font-size: 14px; font-weight: 700; color: #10b981; }
                .trend-period { font-size: 13px; color: #94a3b8; font-weight: 500; }
                .inner-boxes { display: flex; width: 100%; gap: 12px; }
                .inner-box { flex: 1; background: #000717; border-radius: 16px; padding: 16px; display: flex; flex-direction: column; gap: 4px; border: 1px solid rgba(129,136,148,0.15); }
                .box-title { font-size: 12px; color: #818894; font-weight: 600; }
                .box-val { font-size: 16px; font-weight: 800; color: #ffffff; }
                .dice-display {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    margin: 10px 0;
                }
                .dice-image-wrapper {
                    width: 150px;
                    height: 150px;
                    position: relative;
                    border-radius: 24px;
                    background: #020815;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.5), inset 0 0 20px rgba(14,165,233,0.1);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border: 1px solid rgba(129, 136, 148, 0.2);
                }
                .main-dice {
                    width: 140%;
                    height: auto;
                    mix-blend-mode: screen;
                    object-fit: contain;
                    transition: transform 0.3s ease;
                }
                @keyframes shake {
                    0% { transform: rotate(0deg) scale(1); }
                    25% { transform: rotate(-10deg) scale(1.1); }
                    50% { transform: rotate(10deg) scale(0.9); }
                    75% { transform: rotate(-10deg) scale(1.1); }
                    100% { transform: rotate(0deg) scale(1); }
                }
                .rolling .main-dice {
                    animation: shake 0.4s infinite;
                }
                .result-overlay {
                    position: absolute;
                    bottom: -35px;
                    padding: 6px 14px;
                    border-radius: 20px;
                    font-weight: bold;
                    font-size: 13px;
                    z-index: 10;
                    white-space: nowrap;
                }
                .success {
                    background: rgba(16,185,129,0.2);
                    color: #10B981;
                    border: 1px solid rgba(16,185,129,0.5);
                }
                .fail {
                    background: rgba(239,68,68,0.2);
                    color: #EF4444;
                    border: 1px solid rgba(239,68,68,0.5);
                }
                .instructions {
                    font-size: 12px;
                    color: #94a3b8;
                    text-align: center;
                    line-height: 1.5;
                    padding: 0 10px;
                }
                .input-group {
                    width: 100%;
                }
                .bet-input {
                    width: 100%;
                    background: transparent;
                    border: 1px solid rgba(129, 136, 148, 0.3);
                    border-radius: 8px;
                    padding: 16px;
                    color: #fff;
                    font-size: 15px;
                    outline: none;
                }
                .bet-input:disabled {
                    opacity: 0.5;
                }
                .action-buttons {
                    display: flex;
                    gap: 15px;
                }
                .btn {
                    flex: 1;
                    border: none;
                    border-radius: 24px;
                    padding: 16px 0;
                    font-size: 16px;
                    font-weight: 700;
                    color: #fff;
                    cursor: pointer;
                    transition: opacity 0.2s, transform 0.1s;
                }
                .btn:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }
                .btn:active:not(:disabled) {
                    transform: scale(0.97);
                }
                .btn-bet {
                    background: #0ea5e9;
                }
                .btn-claim {
                    background: #1e3a8a;
                    border: 1px solid #1d4ed8;
                }
                .stats-box {
                    background: transparent;
                    border: 1px solid rgba(129, 136, 148, 0.2);
                    border-radius: 12px;
                    padding: 16px;
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }
                .stat-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    font-size: 14px;
                }
                .stat-label {
                    color: #cbd5e1;
                }
                .stat-val {
                    color: #fff;
                    font-weight: 600;
                }
                .highlight {
                    color: #0ea5e9;
                }
                .tips-box {
                    margin-top: 10px;
                }
                .tips-header {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    color: #0ea5e9;
                    font-weight: 600;
                    font-size: 15px;
                    margin-bottom: 8px;
                }
                .tips-text {
                    font-size: 12px;
                    color: #94a3b8;
                    line-height: 1.5;
                    margin: 0;
                }
            `}</style>
        </div>
    );
}
