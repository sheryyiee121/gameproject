"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { doc, getDoc, updateDoc, collection, addDoc, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const PRIZES = [
  "Rewards",
  "5 USDT",
  "20 USDT",
  "50 USDT",
  "0.5 USDT",
  "Bonus",
  "100 USDT",
  "Thanks"
];

export default function LuckyWheelPage() {
  const router = useRouter();
  const [userUid, setUserUid] = useState<string | null>(null);
  const [balance, setBalance] = useState<number>(0);
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinCost, setSpinCost] = useState(1);
  const [showRecords, setShowRecords] = useState(false);
  const [records, setRecords] = useState<any[]>([]);
  const [loadingRecords, setLoadingRecords] = useState(false);

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

  const spinWheel = async () => {
    if (!userUid || isSpinning) return;

    if (balance < spinCost) {
      alert("Insufficient USDT balance to spin! (Cost: 1 USDT)");
      return;
    }

    setIsSpinning(true);

    const tempBalance = balance - spinCost;
    setBalance(tempBalance);

    try {
      await updateDoc(doc(db, 'users', userUid), {
        'balances.usdt': tempBalance
      });
      await addDoc(collection(db, 'users', userUid, 'transactions'), {
        amount: spinCost,
        type: 'withdrawal',
        description: 'Lucky Wheel Play Cost',
        token: 'USDT',
        timestamp: new Date().toISOString(),
        status: 'approved'
      });
    } catch (e) {
      console.error(e);
    }

    // Rig Logic: No big wins allowed.
    // Allowed indexes: 4 (0.5 USDT), 5 (Bonus), 7 (Thanks)
    const allowedIndexes = [4, 5, 7];
    const targetIndex = allowedIndexes[Math.floor(Math.random() * allowedIndexes.length)];

    const baseSpins = 360 * 5;
    const sliceAngle = 360 / PRIZES.length;
    const targetOffset = 360 - (targetIndex * sliceAngle);
    const newRotation = rotation + baseSpins - (rotation % 360) + targetOffset;

    setRotation(newRotation);

    setTimeout(async () => {
      setIsSpinning(false);
      let reward = 0;
      let msg = "";

      if (targetIndex === 4) {
        reward = 0.5;
        msg = "Congratulations! You won 0.5 USDT!";
      } else if (targetIndex === 5) {
        msg = "You landed on Bonus! Check your tasks later.";
      } else {
        msg = "Thanks for playing! Better luck next time.";
      }

      if (reward > 0) {
        const finalBalance = tempBalance + reward;
        setBalance(finalBalance);
        try {
          await updateDoc(doc(db, 'users', userUid), {
            'balances.usdt': finalBalance
          });
          // Log reward
          await addDoc(collection(db, 'users', userUid, 'transactions'), {
            amount: reward,
            type: 'deposit',
            description: 'Lucky Wheel Reward',
            token: 'USDT',
            timestamp: new Date().toISOString(),
            status: 'approved'
          });
        } catch (e) {
          console.error(e);
        }
      }

      setTimeout(() => alert(msg), 300);
    }, 4000);
  };

  const openRecords = async () => {
    setShowRecords(true);
    setLoadingRecords(true);
    try {
      const uid = localStorage.getItem("nexmine_uid");
      if (uid) {
        const q = query(collection(db, 'users', uid, 'transactions'), orderBy('timestamp', 'desc'));
        const snap = await getDocs(q);
        const list = snap.docs.map(d => ({ id: d.id, ...d.data() })).filter((d: any) => d.description?.includes('Lucky Wheel'));
        setRecords(list);
      }
    } catch (e) {
      console.error("Failed to load records", e);
    }
    setLoadingRecords(false);
  };

  return (
    <div className="wheel-page">
      <header className="top-nav">
        <button onClick={() => router.back()} className="icon-btn">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
        </button>
        <span className="nav-title">Lucky Wheel</span>
        <div style={{ width: 24 }}></div>
      </header>

      <div className="feature-menu">
        {['Rules', 'Records', 'Prizes', 'Times X2'].map((item, i) => (
          <div className="menu-item" key={i} onClick={() => {
            if (i === 1) openRecords();
            else alert(item + ' feature coming soon!');
          }}>
            <div className="menu-icon">
              {i === 0 && <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>}
              {i === 1 && <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" /></svg>}
              {i === 2 && <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><polyline points="20 12 20 22 4 22 4 12" /><rect x="2" y="7" width="20" height="5" /><line x1="12" y1="22" x2="12" y2="7" /><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" /><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" /></svg>}
              {i === 3 && <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>}
            </div>
            <span className="menu-label">{item}</span>
          </div>
        ))}
      </div>

      <div className="total-assets-card" style={{ margin: '0 20px 30px' }}>
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

      <div className="wheel-container">
        <div className="wheel-pointer"></div>
        <div
          className="wheel"
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          {PRIZES.map((prize, i) => (
            <div
              key={i}
              className="wheel-slice"
              style={{
                transform: `rotate(${i * 45 - 90}deg)`
              }}
            >
              <div className="slice-content">
                <span className="slice-text">{prize}</span>
              </div>
            </div>
          ))}
        </div>
        <button className="spin-center-btn" onClick={spinWheel} disabled={isSpinning}>GO</button>
      </div>

      <div style={{ textAlign: 'center', marginBottom: '25px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '14px', color: '#94a3b8', fontWeight: 600 }}>Bet:</span>
          <input
            type="number"
            value={spinCost}
            onChange={(e) => setSpinCost(Number(e.target.value) < 0.1 ? 0.1 : Number(e.target.value))}
            style={{ background: 'transparent', border: '1px solid rgba(14,165,233,0.4)', borderRadius: '8px', color: '#fff', padding: '10px 12px', width: '120px', textAlign: 'center', outline: 'none', fontWeight: 'bold' }}
            disabled={isSpinning}
          />
          <button
            onClick={() => setSpinCost(balance > 0.1 ? Number(balance.toFixed(2)) : 0.1)}
            disabled={isSpinning}
            style={{ background: 'radial-gradient(circle at top, #0ea5e9, #0284c7)', border: 'none', color: '#fff', borderRadius: '8px', padding: '10px 16px', cursor: 'pointer', fontSize: '13px', fontWeight: 800 }}>
            MAX
          </button>
        </div>
        <button className="spin-win-btn" onClick={spinWheel} disabled={isSpinning}>
          Spin & Win <span style={{ marginLeft: 8, fontSize: 18 }}>+</span>
        </button>
      </div>

      <div className="banner-container">
        <img src="/invite_banner.png" alt="Daily Invite Challenge" className="promo-banner" />
      </div>

      <div className="bottom-actions">
        <button className="action-btn special-btn">Special Reward Tasks</button>
        <button className="action-btn rules-btn">Wheel Rules</button>
      </div>

      {showRecords && (
        <div className="modal-overlay" onClick={() => setShowRecords(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3 style={{ marginTop: 0, marginBottom: 15, color: '#fff' }}>Game Records</h3>
            <div className="tx-list">
              {loadingRecords ? (
                <p style={{ color: '#94a3b8', textAlign: 'center' }}>Loading...</p>
              ) : records.length === 0 ? (
                <p style={{ color: '#94a3b8', textAlign: 'center' }}>No records found.</p>
              ) : (
                records.map(r => (
                  <div key={r.id} className="tx-item">
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{r.description}</div>
                      <div style={{ fontSize: 11, color: '#64748b' }}>{new Date(r.timestamp).toLocaleString()}</div>
                    </div>
                    <div style={{ fontWeight: 800, color: r.type === 'deposit' ? '#10b981' : '#ef4444' }}>
                      {r.type === 'deposit' ? '+' : '-'}{Number(r.amount).toFixed(2)}
                    </div>
                  </div>
                ))
              )}
            </div>
            <button className="close-btn" onClick={() => setShowRecords(false)}>Close</button>
          </div>
        </div>
      )}

      <style jsx>{`
        .wheel-page {
          min-height: 100vh;
          background: #101625;
          color: #fff;
          font-family: -apple-system, sans-serif;
          display: flex;
          flex-direction: column;
          padding-bottom: 25px;
        }
        .top-nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px;
        }
        .icon-btn {
          background: none; border: none; color: #fff; padding: 0; cursor: pointer;
        }
        .nav-title { font-weight: bold; font-size: 18px; }
        
        .feature-menu {
          display: flex;
          justify-content: center;
          gap: 30px;
          margin: 10px 0 35px;
        }
        .menu-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          cursor: pointer;
        }
        .menu-icon {
          width: 50px; height: 50px;
          border-radius: 50%;
          background: linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02));
          display: flex; align-items: center; justify-content: center;
          border: 1px solid rgba(255,255,255,0.1);
          box-shadow: 0 4px 10px rgba(0,0,0,0.3);
        }
        .menu-label { font-size: 12px; color: #fff; font-weight: 600; }

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

        .wheel-container {
          position: relative;
          width: 310px;
          height: 310px;
          margin: 0 auto 35px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .wheel-pointer {
          position: absolute;
          top: -15px;
          left: 50%;
          transform: translateX(-50%);
          width: 0; height: 0;
          border-left: 14px solid transparent;
          border-right: 14px solid transparent;
          border-top: 28px solid #fff;
          z-index: 10;
          filter: drop-shadow(0 4px 6px rgba(0,0,0,0.5));
        }
        .wheel {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          border: 8px solid #1a2a47;
          background: conic-gradient(
            from 22.5deg,
            #1e3050 0deg 45deg,
            #13203c 45deg 90deg,
            #1e3050 90deg 135deg,
            #13203c 135deg 180deg,
            #1e3050 180deg 225deg,
            #13203c 225deg 270deg,
            #1e3050 270deg 315deg,
            #13203c 315deg 360deg
          );
          position: relative;
          transition: transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99);
          box-shadow: 0 0 30px rgba(0,0,0,0.6), inset 0 0 20px rgba(0,0,0,0.5);
        }
        .wheel-slice {
          position: absolute;
          top: 50%; left: 50%;
          width: 145px; height: 30px;
          margin-top: -15px;
          transform-origin: 0 50%;
        }
        .slice-content {
          position: absolute;
          left: 30px;
          width: 85px;
          text-align: center;
          transform: translateY(5px);
        }
        .slice-text {
          color: #fff;
          font-weight: 800;
          font-size: 13.5px;
          text-shadow: 1px 1px 4px rgba(0,0,0,0.9);
          display: inline-block;
          transform: rotate(90deg);
        }
        .spin-center-btn {
          position: absolute;
          width: 75px; height: 75px;
          background: radial-gradient(circle at 30% 30%, #38bdf8, #0284c7);
          border: 5px solid #0f172a;
          border-radius: 50%;
          color: #fff;
          font-weight: 900;
          font-size: 22px;
          z-index: 5;
          cursor: pointer;
          box-shadow: 0 4px 15px rgba(0,0,0,0.5);
          outline: none;
        }
        .spin-center-btn:active:not(:disabled) { transform: scale(0.95); }

        .spin-win-btn {
          background: #0ea5e9;
          color: #fff;
          border: none;
          padding: 18px 40px;
          border-radius: 30px;
          font-size: 17px;
          font-weight: 700;
          cursor: pointer;
          width: 88%;
          box-shadow: 0 6px 20px rgba(14,165,233,0.4);
          transition: transform 0.2s;
        }
        .spin-win-btn:active:not(:disabled) { transform: scale(0.97); }
        
        .banner-container {
          padding: 0 20px;
          margin-bottom: 25px;
        }
        .promo-banner {
          width: 100%;
          border-radius: 16px;
          border: 1px solid rgba(14, 165, 233, 0.3);
          box-shadow: 0 10px 25px rgba(0,0,0,0.5);
        }

        .bottom-actions {
          display: flex;
          justify-content: center;
          gap: 15px;
          padding: 0 20px;
        }
        .action-btn {
          flex: 1;
          padding: 16px 0;
          border-radius: 24px;
          font-size: 15px;
          font-weight: bold;
          cursor: pointer;
        }
        .special-btn {
          background: #0ea5e9;
          color: #fff;
          border: none;
        }
        .rules-btn {
          background: transparent;
          color: #94a3b8;
          border: 1px solid rgba(148,163,184,0.3);
        }

        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.7); display: flex; align-items: center; justify-content: center; z-index: 100; backdrop-filter: blur(5px); }
        .modal-content { background: #0f172a; border-radius: 20px; padding: 24px; width: 90%; max-width: 400px; border: 1px solid rgba(129,136,148,0.2); }
        .tx-list { max-height: 300px; overflow-y: auto; display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px; }
        .tx-item { background: #1e293b; padding: 12px; border-radius: 12px; display: flex; justify-content: space-between; align-items: center; }
        .close-btn { width: 100%; padding: 14px; background: #334155; border: none; border-radius: 12px; color: #fff; font-weight: bold; cursor: pointer; }
      `}</style>
    </div>
  );
}
