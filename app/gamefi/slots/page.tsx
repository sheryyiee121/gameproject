"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { doc, getDoc, updateDoc, collection, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const SYMBOLS = ['🍒', '⭐', '💎', '🔔', '7️⃣'];

const PAYOUTS: Record<string, number> = {
    '💎,💎,💎': 20,
    '7️⃣,7️⃣,7️⃣': 10,
    '⭐,⭐,⭐': 5,
    '🔔,🔔,🔔': 3,
    '🍒,🍒,🍒': 2,
};

export default function SlotMachinePage() {
    const router = useRouter();
    const [userUid, setUserUid] = useState<string | null>(null);
    const [balance, setBalance] = useState<number>(0);

    const [bet, setBet] = useState<number>(0.1);
    const [reels, setReels] = useState<string[]>(['💎', '⭐', '🍒']);
    const [isSpinning, setIsSpinning] = useState(false);

    const [showWinModal, setShowWinModal] = useState(false);
    const [winData, setWinData] = useState({ amount: 0, multi: 0 });

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
            const docSnap = await getDoc(doc(db, 'users', uid));
            if (docSnap.exists()) {
                const data = docSnap.data();
                setBalance(data.balances?.usdt || 0);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleBetChange = (delta: number) => {
        if (isSpinning) return;
        setBet(prev => {
            let step = 0.1;
            if (prev >= 100) step = 10;
            else if (prev >= 10) step = 1;
            else if (prev >= 1) step = 0.5;

            let amountToAdd = delta > 0 ? step : -step;
            let newVal = prev + amountToAdd;

            if (newVal < 0.1) newVal = 0.1;
            if (newVal > balance) newVal = balance > 0.1 ? balance : 0.1;

            return parseFloat(newVal.toFixed(2));
        });
    };

    const playWinSound = () => {
        try {
            const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
            if (!AudioContext) return;
            const ctx = new AudioContext();

            const playTone = (f: number, t: number) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.type = 'triangle';
                osc.frequency.value = f;
                gain.gain.setValueAtTime(0, ctx.currentTime + t);
                gain.gain.linearRampToValueAtTime(0.4, ctx.currentTime + t + 0.1);
                gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + t + 0.5);
                osc.start(ctx.currentTime + t);
                osc.stop(ctx.currentTime + t + 0.6);
            };

            const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98];
            notes.forEach((freq, idx) => {
                playTone(freq, idx * 0.08);
            });
            // final chord
            [523.25, 659.25, 1046.50].forEach(f => playTone(f, 0.6));
        } catch (e) {
            console.log("Audio play prevented or unavailable.");
        }
    };

    const spin = async () => {
        if (!userUid || isSpinning) return;

        if (balance < bet) {
            alert("Insufficient USDT balance.");
            return;
        }

        const tempBalance = balance - bet;
        setBalance(tempBalance);
        setIsSpinning(true);

        try {
            await updateDoc(doc(db, 'users', userUid), {
                'balances.usdt': tempBalance
            });
            await addDoc(collection(db, 'users', userUid, 'transactions'), {
                amount: bet,
                type: 'withdrawal',
                description: 'Slot Machine Play',
                token: 'USDT',
                timestamp: new Date().toISOString(),
                status: 'approved'
            });
        } catch (err) {
            console.error("Firebase err:", err);
        }

        const spinUiInterval = setInterval(() => {
            setReels([
                SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
                SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
                SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]
            ]);
        }, 100);

        setTimeout(async () => {
            clearInterval(spinUiInterval);

            let finalReels = [
                SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
                SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
                SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]
            ];

            const outcomeKey = finalReels.join(',');
            let multiplier = PAYOUTS[outcomeKey] || 0;
            let potentialWin = bet * multiplier;

            // RIG / Capping Logic (NOBODY WINS MORE THAN $1.00)
            if (potentialWin > 1.00) {
                finalReels = ['💎', '🍒', '7️⃣']; // guaranteed 0 payout key
                multiplier = 0;
                potentialWin = 0;
            }

            setReels(finalReels);

            if (potentialWin > 0) {
                const finalBalance = tempBalance + potentialWin;
                setBalance(finalBalance);

                try {
                    await updateDoc(doc(db, 'users', userUid), {
                        'balances.usdt': finalBalance
                    });
                    await addDoc(collection(db, 'users', userUid, 'transactions'), {
                        amount: potentialWin,
                        type: 'deposit',
                        description: 'Slot Machine Reward',
                        token: 'USDT',
                        timestamp: new Date().toISOString(),
                        status: 'approved'
                    });
                } catch (err) {
                    console.error("Firebase err:", err);
                }
            }

            setIsSpinning(false);

            if (potentialWin > 0) {
                setWinData({ amount: potentialWin, multi: multiplier });
                setShowWinModal(true);
                playWinSound();
            }

        }, 2500);
    };

    return (
        <div className="slot-page">
            <header className="header">
                <button onClick={() => router.back()} className="icon-btn">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
                </button>
                <div className="header-title">Slot Machine</div>
                <div className="header-right-icons">
                    <button className="icon-btn"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg></button>
                    <button className="icon-btn" style={{ marginLeft: 12 }}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><polyline points="20 12 20 22 4 22 4 12" /><rect x="2" y="7" width="20" height="5" /><line x1="12" y1="22" x2="12" y2="7" /><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" /><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" /></svg></button>
                </div>
            </header>

            <div className="content">
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

                <div className="slot-machine-container">
                    <div className="slot-title">Slot Machine</div>

                    <div className="reels-window">
                        <div className="reel-column">
                            <span className={`symbol ${isSpinning ? 'blur' : ''}`}>{reels[0]}</span>
                        </div>
                        <div className="reel-divider"></div>
                        <div className="reel-column">
                            <span className={`symbol ${isSpinning ? 'blur' : ''}`}>{reels[1]}</span>
                        </div>
                        <div className="reel-divider"></div>
                        <div className="reel-column">
                            <span className={`symbol ${isSpinning ? 'blur' : ''}`}>{reels[2]}</span>
                        </div>
                    </div>

                    <div className="win-multi">Win Multiplier: X0~X20</div>
                </div>

                <div className="bottom-controls">
                    <div className="bet-display-box">
                        <img src="/nexmine-ai-logo.png" alt="Bet" className="bet-logo" />
                        <span className="bet-value">{bet.toFixed(2)}</span>
                    </div>

                    <div className="action-row">
                        <button className="control-btn minus-btn" onClick={() => handleBetChange(-0.1)} disabled={isSpinning}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /></svg>
                        </button>

                        <button className="spin-btn" onClick={spin} disabled={isSpinning}>
                            <span className="spin-text">Spin</span>
                        </button>

                        <button className="control-btn plus-btn" onClick={() => handleBetChange(0.1)} disabled={isSpinning}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* BIG WIN MODAL */}
            {showWinModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="big-win-title">BIG WIN</div>

                        <div className="modal-slot-box">
                            <div className="slot-title">Slot Machine</div>
                            <div className="reels-window modal-reels">
                                <div className="reel-column"><span className="symbol">{reels[0]}</span></div>
                                <div className="reel-divider"></div>
                                <div className="reel-column"><span className="symbol">{reels[1]}</span></div>
                                <div className="reel-divider"></div>
                                <div className="reel-column"><span className="symbol">{reels[2]}</span></div>

                                <div className="multi-overlay">x{winData.multi}</div>
                            </div>
                        </div>

                        <div className="congrats-text">CONGRATULATIONS</div>
                        <div className="won-subtext">You won</div>
                        <div className="won-amount">{winData.amount.toFixed(2)} USDT</div>

                        <button className="close-win-btn" onClick={() => setShowWinModal(false)}>Close</button>

                        <div className="floating-coins">
                            {"🪙🪙🪙🪙🪙🪙🪙".split("").map((c, i) => (
                                <span key={i} className="coin" style={{
                                    left: `${Math.random() * 100}%`,
                                    animationDelay: `${Math.random() * 0.5}s`,
                                    fontSize: `${Math.random() * 15 + 20}px`
                                }}>{c}</span>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
                .slot-page {
                    min-height: 100vh;
                    background: radial-gradient(circle at 50% 50%, #081e4b 0%, #030a1c 100%);
                    color: #fff;
                    font-family: -apple-system, sans-serif;
                    display: flex;
                    flex-direction: column;
                    background-image: url('https://images.unsplash.com/photo-1534796636912-36528970b4f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80');
                    background-size: cover;
                    background-position: center;
                    background-blend-mode: multiply;
                }
                .header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 16px 20px;
                    background: transparent;
                }
                .icon-btn {
                    background: none; border: none; padding: 0; cursor: pointer; color: #fff;
                }
                .header-title {
                    font-size: 18px; font-weight: 700;
                }
                .header-right-icons {
                    display: flex; align-items: center;
                }
                .content {
                    flex: 1;
                    padding: 20px;
                    display: flex;
                    flex-direction: column;
                    gap: 25px;
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

                .slot-machine-container {
                    background: linear-gradient(180deg, #053b8f 0%, #020a1f 100%);
                    border: 2px solid #38bdf8;
                    border-radius: 20px;
                    padding: 20px 15px;
                    box-shadow: 0 0 30px rgba(14,165,233,0.3), inset 0 0 20px rgba(56,189,248,0.2);
                    text-align: center;
                    position: relative;
                }
                .slot-machine-container::before {
                    content: ''; position: absolute; top: 0; left: 10px; right: 10px; height: 8px;
                    background: linear-gradient(90deg, transparent, rgba(56,189,248,0.8), transparent);
                    border-radius: 4px;
                }
                .slot-title {
                    font-size: 18px; font-weight: bold; color: #fff; margin-bottom: 16px;
                }
                
                .reels-window {
                    background: #020b1f;
                    border: 3px solid #0f3069;
                    border-radius: 12px;
                    height: 140px;
                    display: flex;
                    box-shadow: inset 0 10px 20px rgba(0,0,0,0.8);
                    overflow: hidden;
                    position: relative;
                }
                .reel-column {
                    flex: 1; display: flex; align-items: center; justify-content: center; position: relative;
                }
                .symbol {
                    font-size: 50px; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.6)); transition: filter 0.1s;
                }
                .blur { filter: blur(4px) drop-shadow(0 4px 6px rgba(0,0,0,0.6)); }
                .reel-divider { width: 4px; background: linear-gradient(180deg, #020b1f 0%, #0f3069 50%, #020b1f 100%); }
                
                .win-multi {
                    margin-top: 16px; font-size: 14px; font-weight: 500; color: #38bdf8;
                }

                .bottom-controls {
                    margin-top: auto;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 20px;
                }
                .bet-display-box {
                    background: rgba(0, 0, 0, 0.4);
                    border: 1px solid rgba(255,255,255,0.1);
                    border-radius: 12px;
                    padding: 12px 0;
                    width: 100%;
                    max-width: 320px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                }
                .bet-logo { width: 20px; height: 20px; object-fit: contain; }
                .bet-value { font-size: 20px; font-weight: bold; color: #fff; }

                .action-row {
                    display: flex; align-items: center; justify-content: center; gap: 30px; width: 100%;
                }
                .control-btn {
                    width: 50px; height: 50px;
                    border-radius: 50%;
                    background: transparent;
                    border: 1px solid rgba(14, 165, 233, 0.5);
                    display: flex; align-items: center; justify-content: center;
                    cursor: pointer;
                    transition: background 0.2s;
                    box-shadow: 0 0 10px rgba(14,165,233,0.1);
                }
                .control-btn:active:not(:disabled) { background: rgba(14, 165, 233, 0.2); }
                .control-btn:disabled { opacity: 0.5; cursor: not-allowed; }

                .spin-btn {
                    width: 100px; height: 100px;
                    border-radius: 50%;
                    background: radial-gradient(circle at 30% 30%, #38bdf8, #0284c7);
                    border: 4px solid rgba(255,255,255,0.2);
                    box-shadow: 0 0 30px rgba(56,189,248,0.5), inset 0 0 15px rgba(255,255,255,0.4);
                    display: flex; align-items: center; justify-content: center;
                    cursor: pointer; outline: none; transition: transform 0.1s;
                }
                .spin-btn:active:not(:disabled) {
                    transform: scale(0.92);
                    box-shadow: 0 0 20px rgba(56,189,248,0.8), inset 0 0 25px rgba(255,255,255,0.5);
                }
                .spin-text {
                    font-size: 24px; font-weight: 800; color: #fff; text-shadow: 0 2px 4px rgba(0,0,0,0.5);
                }
                .spin-btn:disabled { opacity: 0.7; cursor: not-allowed; }

                /* MODAL OVERLAY */
                .modal-overlay {
                    position: fixed;
                    top: 0; left: 0; width: 100vw; height: 100vh;
                    background: rgba(0,0,0,0.85);
                    backdrop-filter: blur(8px);
                    z-index: 1000;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    animation: fadeIn 0.4s ease;
                }
                @keyframes fadeIn {
                    from { opacity: 0; } to { opacity: 1; }
                }
                .modal-content {
                    width: 90%;
                    max-width: 360px;
                    padding: 20px;
                    border-radius: 20px;
                    background: linear-gradient(180deg, #061129, #020713);
                    border: 2px solid #0ea5e9;
                    box-shadow: 0 0 40px rgba(14,165,233,0.4);
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    position: relative;
                    overflow: hidden;
                }
                .big-win-title {
                    font-size: 42px;
                    font-weight: 900;
                    background: linear-gradient(180deg, #ffe066, #f59e0b);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    filter: drop-shadow(0 4px 6px rgba(0,0,0,0.8));
                    margin-bottom: 20px;
                    margin-top: -40px; /* pull up out of container slightly */
                    z-index: 5;
                }
                .modal-slot-box {
                    width: 100%;
                    background: linear-gradient(180deg, #053b8f, #020a1f);
                    border-radius: 16px;
                    border: 2px solid #38bdf8;
                    padding: 15px;
                    margin-bottom: 20px;
                    z-index: 2;
                }
                .modal-reels {
                    position: relative;
                }
                .multi-overlay {
                    position: absolute;
                    top: 50%; left: 50%;
                    transform: translate(-50%, -50%);
                    font-size: 48px;
                    font-weight: 900;
                    color: #fff;
                    text-shadow: 0 0 20px #0ea5e9, 0 0 40px #0284c7;
                    z-index: 3;
                }
                .congrats-text {
                    font-size: 20px;
                    font-weight: 800;
                    color: #fbbf24;
                    margin-bottom: 5px;
                    letter-spacing: 1px;
                }
                .won-subtext {
                    font-size: 16px;
                    font-weight: 600;
                    color: #e2e8f0;
                    margin-bottom: 5px;
                }
                .won-amount {
                    font-size: 32px;
                    font-weight: 900;
                    color: #bae6fd;
                    text-shadow: 0 0 15px rgba(56,189,248,0.8);
                    margin-bottom: 25px;
                }
                .close-win-btn {
                    background: radial-gradient(circle at top, #0ea5e9, #0284c7);
                    border: 2px solid #38bdf8;
                    border-radius: 25px;
                    padding: 12px 40px;
                    color: white;
                    font-size: 16px;
                    font-weight: bold;
                    cursor: pointer;
                    box-shadow: 0 5px 15px rgba(14,165,233,0.5);
                    z-index: 5;
                    transition: transform 0.1s;
                }
                .close-win-btn:active {
                    transform: scale(0.95);
                }

                .floating-coins {
                    position: absolute; top: 0; left: 0; width: 100%; height: 100%;
                    pointer-events: none;
                    z-index: 1;
                }
                .coin {
                    position: absolute;
                    top: -50px;
                    animation: fall 3s ease-in infinite;
                }
                @keyframes fall {
                    0% { transform: translateY(-50px) rotate(0deg); opacity: 1; }
                    100% { transform: translateY(400px) rotate(360deg); opacity: 0; }
                }
            `}</style>
        </div>
    );
}
