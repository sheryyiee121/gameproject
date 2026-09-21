"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const SECTIONS = [
    {
        emoji: '🚀',
        title: 'Getting Started – Registration',
        color: '#0ea5e9',
        bullets: [
            'Download or open the Nexmine web app in your browser.',
            'Tap "Register" on the login screen and fill in your username and password.',
            'If you have a referral/invitation code from a friend, enter it in the "Invite Code" field — this links you to their team.',
            'After registering, log in with your credentials.',
            'You will automatically receive a $5 USDT Welcome Bonus on your first login — tap "Claim $5 USDT" on the popup.',
            'Your unique Invitation Code is generated automatically. Share it with friends to earn referral bonuses.',
        ],
    },
    {
        emoji: '⛏️',
        title: 'Mining – Earning Passive Income',
        color: '#10b981',
        bullets: [
            'Every account on Nexmine is linked to an automatic mining engine that runs 24/7.',
            'Your Mining Rate (e.g. $0.15/day) is set by the admin based on your membership tier and deposit level.',
            'Go to the Mining tab (center button in the bottom nav) to see your live earnings counter ticking up in real time.',
            'The live counter shows exactly how much USDT you have mined since your last reset.',
            'Earnings are credited to your USDT balance by the admin on a scheduled basis.',
            'Mining runs automatically — you do NOT need to keep the app open.',
            'Your daily rate range is $0.05 – $1.00 per day depending on your deposit/membership tier.',
            'Higher deposits and higher membership tiers unlock faster mining rates.',
        ],
    },
    {
        emoji: '💰',
        title: 'Deposit – Adding Funds',
        color: '#f59e0b',
        bullets: [
            'Go to Asset → Deposit (or use the Deposit button on the Asset page).',
            'Choose your preferred coin: USDT, USDC, or BTC.',
            'Select your preferred network: BEP20/ERC20, TRC20, SOL, or Bitcoin Network.',
            'Copy the wallet address shown on screen — this is the Nexmine platform address.',
            'Send your crypto from your personal wallet or exchange to this address.',
            'After the blockchain confirms the transaction, inform admin via support chat.',
            'Admin will credit the funds to your Nexmine balance.',
            'Depositing more USDT unlocks higher membership tiers (Basic → Bronze → VIP) and larger mining rewards.',
            '⚠️ Always double-check the network matches your sending wallet to avoid losing funds.',
        ],
    },
    {
        emoji: '📤',
        title: 'Withdraw – Cashing Out',
        color: '#ef4444',
        bullets: [
            'Go to Asset → Withdraw on the Asset page.',
            'Minimum withdrawal amount is $6.00 USDT.',
            'Select your withdrawal network: TRC20, BEP20, or ERC20.',
            'Enter the destination wallet address where you want to receive your USDT.',
            'Enter the withdrawal amount (tap MAX to withdraw your full balance).',
            'Enter your Fund Password to authorize the transaction.',
            '  • If this is your first withdrawal, you will be asked to SET a Fund Password. Keep it safe!',
            '  • For future withdrawals, you will verify with the same Fund Password.',
            'Submit the request — your balance is deducted instantly.',
            'Withdrawal status will show as "Processing" and will be updated to "Approved" or "Rejected" by admin.',
            'You can track all past withdrawals in the Withdrawal History section.',
        ],
    },
    {
        emoji: '🎮',
        title: 'GameFi – Casino Games',
        color: '#a855f7',
        bullets: [
            'Tap GameFi from the dashboard to access three casino-style games.',
            '🎰 Slot Machine: Spin the reels — matching 3 symbols across the payline wins a reward. Adjust your bet using the +/- buttons. The increment grows exponentially as your bet increases.',
            '🎲 Dice Roll: Predict if the roll will be High (4-6) or Low (1-3). Correct guess = 1.8x your bet returned.',
            '🎡 Lucky Wheel: Choose your spin cost (or tap MAX to bet your full balance) and spin the wheel. You land on one of 8 segments with varying multipliers.',
            'All game costs are deducted from your USDT balance BEFORE the animation starts — so you are always charged even if you navigate away.',
            'All wins are credited instantly to your USDT balance after the animation.',
            'Every game play and reward is logged in your Fund Flow (Bill page) with a custom description.',
            '⚠️ GameFi is for entertainment. Play responsibly within your means.',
        ],
    },
    {
        emoji: '👥',
        title: 'My Team – Referral Program',
        color: '#0ea5e9',
        bullets: [
            'Go to "My Team" from the dashboard or bottom nav.',
            'Your unique Invitation Code is shown at the top — tap Copy to share it.',
            'When someone registers using your code, they join as your Generation 1 (Gen 1) referral.',
            'People invited by your Gen 1 become your Generation 2, and so on up to Gen 3.',
            'Referral Bonus Tiers (bonus earned when a referred member makes a deposit):',
            '  • 1–3 team members → $5 bonus per deposit',
            '  • 3–5 team members → $10 bonus per deposit',
            '  • 5–10 team members → $10 bonus per deposit',
            '  • 10–50 team members → $20 bonus per deposit',
            'Your team dashboard shows total team size, Gen 1 direct invites, Gen 2, Gen 3 counts, and estimated team commission.',
            'The more active members you recruit, the higher your passive referral income.',
        ],
    },
    {
        emoji: '🏅',
        title: 'Membership Levels',
        color: '#ffd700',
        bullets: [
            'Your membership level is determined by your total USDT deposited to the platform.',
            '⭐ Basic – 0+ USDT deposited → Default starting level (no bonus)',
            '🥉 Bronze – 50+ USDT deposited → +$5 USDT bonus',
            '🥈 Silver – 100+ USDT deposited → +$10 USDT bonus',
            '🥇 Gold – 300+ USDT deposited → +$25 USDT bonus',
            '💎 Platinum – 600+ USDT deposited → +$50 USDT bonus',
            '💠 Diamond – 1,500+ USDT deposited → +$250 USDT bonus',
            '👑 VIP – 5,000+ USDT deposited → +$500 USDT bonus',
            'A higher level unlocks a faster daily mining rate, higher referral bonuses, and access to exclusive platform events.',
            'Go to Dashboard → Membership Levels to see your current level and progress to the next tier.',
        ],
    },
    {
        emoji: '🎁',
        title: 'Task Center – Bonus Tasks',
        color: '#f97316',
        bullets: [
            'Go to the Task tab in the bottom navigation.',
            'The Upgrade Bonus section shows all membership tier upgrade rewards.',
            'When you deposit enough to reach a new tier, you can CLAIM the corresponding bonus (e.g., +$5 for Bronze at 50 USDT).',
            'Tasks already completed show a "Received" badge — each bonus can only be claimed once.',
            'The Daily Bonus tab (🔥) and Activity Bonus tab offer additional time-limited rewards.',
            'Check the Task Center regularly — new bonus events may be added by admin.',
            'The promo banner at the top shows the current platform-wide deposit bonus campaign.',
        ],
    },
    {
        emoji: '👤',
        title: 'Profile & Account Settings',
        color: '#94a3b8',
        bullets: [
            'Go to Profile (bottom-right nav icon) to manage your account.',
            'Your UID and Invitation Code are shown in your profile card.',
            'Fund Password: A secondary password required for every withdrawal. Set it on your first withdrawal and remember it — it cannot be recovered automatically.',
            'Login Password: Change your login password at any time from the Profile page. You must enter your old password to confirm.',
            'Total Assets, Total Profit, and Today\'s Profit are displayed in your profile stats section.',
            'You can view your total team size and navigate to the My Team page from here.',
            'Tap "Logout / Sign Out" to safely log out of your account.',
            '⚠️ "Delete My Account" permanently removes all your data and balance. This CANNOT be undone.',
        ],
    },
    {
        emoji: '📊',
        title: 'Asset Page – Your Wallet Overview',
        color: '#38bdf8',
        bullets: [
            'The Asset page shows your full USDT balance and a summary of your recent transactions.',
            'Tap "Deposit" to go to the deposit page and add funds.',
            'Tap "Withdraw" to go to the withdrawal form.',
            'The last 5 transactions are shown here. Tap "View Full" to go to the Fund Flow (Bill) page for complete history.',
            'Transaction types include: Admin Deposit, Withdrawal, Lucky Wheel Play Cost, Dice Game Play, Slot Machine Play, Slot Machine Reward, etc.',
        ],
    },
    {
        emoji: '📋',
        title: 'Fund Flow (Bill History)',
        color: '#6366f1',
        bullets: [
            'Accessible from the Asset page → "View Full" button.',
            'Shows your complete, chronological transaction history from newest to oldest.',
            'Each record shows: amount (green = credit, red = debit), description, date, and status.',
            'Descriptions are custom-labeled per action: e.g., "Lucky Wheel Reward", "Slot Machine Play", "Admin Deposit".',
            'Use this page to audit all money movements in and out of your account.',
        ],
    },
];

export default function TutorialPage() {
    const router = useRouter();
    const [openIdx, setOpenIdx] = useState<number | null>(0);

    return (
        <div className="tut-root">
            {/* Header */}
            <header className="top-bar">
                <button className="back-btn" onClick={() => router.back()} aria-label="Back">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M15 18l-6-6 6-6" />
                    </svg>
                </button>
                <h1 className="page-title">Operation Tutorial</h1>
                <div style={{ width: 42 }} />
            </header>

            {/* Intro */}
            <div className="intro-card">
                <span className="intro-emoji">📖</span>
                <div>
                    <p className="intro-title">Welcome to Nexmine</p>
                    <p className="intro-sub">Nexmine is a Cloud Mining &amp; GameFi rewards platform. Register, deposit, mine passively, invite friends, and cash out — all in one app. Tap any section below to learn how it works.</p>
                </div>
            </div>

            {/* Accordion Sections */}
            <main className="sections-list">
                {SECTIONS.map((section, idx) => {
                    const isOpen = openIdx === idx;
                    return (
                        <div key={idx} className={`section-card ${isOpen ? 'open' : ''}`} style={isOpen ? { borderColor: section.color } : {}}>
                            <button
                                className="section-header"
                                onClick={() => setOpenIdx(isOpen ? null : idx)}
                                aria-expanded={isOpen}
                            >
                                <div className="section-left">
                                    <span className="section-emoji" style={{ background: `${section.color}22`, border: `1.5px solid ${section.color}55` }}>
                                        {section.emoji}
                                    </span>
                                    <span className="section-title">{section.title}</span>
                                </div>
                                <svg
                                    className={`chevron ${isOpen ? 'rotated' : ''}`}
                                    width="18" height="18" viewBox="0 0 24 24" fill="none"
                                    stroke={isOpen ? section.color : '#64748b'}
                                    strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                                >
                                    <polyline points="6 9 12 15 18 9" />
                                </svg>
                            </button>

                            {isOpen && (
                                <ul className="bullets-list">
                                    {section.bullets.map((bullet, bIdx) => (
                                        <li key={bIdx} className={`bullet-item ${bullet.startsWith('  •') ? 'sub-bullet' : ''}`}>
                                            {bullet.startsWith('  •') ? (
                                                <>
                                                    <span className="sub-dot" style={{ background: section.color }} />
                                                    <span>{bullet.replace('  • ', '')}</span>
                                                </>
                                            ) : (
                                                <>
                                                    <span className="main-dot" style={{ background: section.color }} />
                                                    <span>{bullet}</span>
                                                </>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    );
                })}
            </main>

            {/* Footer note */}
            <div className="footer-note">
                <p>📞 Need further help? Contact us on <strong>Telegram: @Nexminesupport1</strong></p>
            </div>

            <style jsx>{`
        .tut-root {
          min-height: 100vh;
          background: linear-gradient(135deg, #f6f9fc 0%, #eef2f6 100%);
          display: flex;
          flex-direction: column;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          color: #0f172a;
          padding-bottom: 40px;
        }
        .top-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 20px;
          background: linear-gradient(135deg, #001f54 0%, #0a4087 100%);
          position: sticky; top: 0; z-index: 10;
        }
        .back-btn {
          background: rgba(255,255,255,0.15);
          border: none;
          border-radius: 50%;
          width: 42px; height: 42px;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
        }
        .page-title { font-size: 20px; font-weight: 800; color: #fff; margin: 0; }

        .intro-card {
          margin: 20px 20px 0;
          background: linear-gradient(135deg, #001f54, #0a4087);
          border-radius: 20px;
          padding: 20px;
          display: flex;
          gap: 16px;
          align-items: flex-start;
          color: #fff;
          box-shadow: 0 8px 25px rgba(10,64,135,0.25);
        }
        .intro-emoji { font-size: 36px; flex-shrink: 0; }
        .intro-title { font-size: 17px; font-weight: 800; margin: 0 0 6px; }
        .intro-sub { font-size: 13px; color: #bae6fd; margin: 0; line-height: 1.55; }

        .sections-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
          padding: 20px;
        }

        .section-card {
          background: #fff;
          border: 1.5px solid #e2e8f0;
          border-radius: 18px;
          overflow: hidden;
          box-shadow: 0 4px 15px rgba(0,0,0,0.03);
          transition: border-color 0.2s;
        }
        .section-header {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 18px;
          background: none;
          border: none;
          cursor: pointer;
          text-align: left;
          gap: 10px;
        }
        .section-left {
          display: flex;
          align-items: center;
          gap: 12px;
          flex: 1;
          min-width: 0;
        }
        .section-emoji {
          width: 42px; height: 42px;
          border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          font-size: 20px;
          flex-shrink: 0;
        }
        .section-title {
          font-size: 14px;
          font-weight: 800;
          color: #0f172a;
          line-height: 1.3;
        }
        .chevron { transition: transform 0.25s; flex-shrink: 0; }
        .chevron.rotated { transform: rotate(180deg); }

        .bullets-list {
          list-style: none;
          margin: 0;
          padding: 0 18px 18px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .bullet-item {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          font-size: 13.5px;
          color: #334155;
          line-height: 1.55;
        }
        .sub-bullet {
          padding-left: 24px;
          font-size: 13px;
          color: #64748b;
        }
        .main-dot {
          width: 7px; height: 7px;
          border-radius: 50%;
          flex-shrink: 0;
          margin-top: 6px;
        }
        .sub-dot {
          width: 5px; height: 5px;
          border-radius: 50%;
          flex-shrink: 0;
          margin-top: 7px;
          opacity: 0.7;
        }

        .footer-note {
          margin: 0 20px;
          padding: 16px 20px;
          background: #fff;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          text-align: center;
          font-size: 13px;
          color: #64748b;
          box-shadow: 0 4px 12px rgba(0,0,0,0.02);
        }
        .footer-note strong { color: #0ea5e9; }
      `}</style>
        </div>
    );
}
