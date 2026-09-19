"use client";

import React from 'react';
import { useRouter } from 'next/navigation';

export default function GameFiPage() {
  const router = useRouter();

  const games = [
    {
      title: "Dice",
      image: "/gamefi_dice.png",
      glow: "radial-gradient(circle at 100% 50%, rgba(14, 165, 233, 0.4) 0%, rgba(6, 16, 35, 1) 70%)",
    },
    {
      title: "Lucky Wheel",
      image: "/gamefi_wheel.png",
      glow: "radial-gradient(circle at 100% 50%, rgba(56, 189, 248, 0.4) 0%, rgba(6, 16, 35, 1) 70%)",
    },
    {
      title: "Today's Luck Begins",
      image: "/gamefi_slots.png",
      glow: "radial-gradient(circle at 100% 50%, rgba(37, 99, 235, 0.3) 0%, rgba(6, 16, 35, 1) 70%)",
    }
  ];

  return (
    <div className="gamefi-root">
      {/* Top Navbar */}
      <header className="top-nav">
        <button className="back-btn" onClick={() => router.back()} aria-label="Go back">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <h1 className="nav-title">Activity Entrance</h1>
        <div className="empty-space" style={{ width: 24 }}></div>
      </header>

      <main className="main-content">
        {games.map((game, idx) => (
          <div className="game-card" key={idx} onClick={() => {
            if (game.title === 'Dice') router.push('/gamefi/dice');
            else if (game.title === 'Lucky Wheel') router.push('/gamefi/wheel');
            else if (game.title === "Today's Luck Begins") router.push('/gamefi/slots');
            else alert(`${game.title} is coming soon!`);
          }}>
            <div className="card-bg" style={{ background: game.glow }}></div>

            <div className="card-left">
              <h2 className="game-title">{game.title}</h2>
              <div className="enter-btn-wrapper">
                <span className="enter-text">Enter Activity</span>
                <div className="enter-icon">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="card-right">
              <img src={game.image} alt={game.title} className="game-img" />
            </div>
          </div>
        ))}
      </main>

      <style jsx>{`
        .gamefi-root {
          min-height: 100vh;
          background: #060B19;
          color: #ffffff;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          display: flex;
          flex-direction: column;
        }

        .top-nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 18px 20px;
          background: transparent;
        }
        .nav-title {
          font-size: 18px;
          font-weight: 700;
          color: #fff;
          margin: 0;
        }
        .back-btn {
          background: none;
          border: none;
          padding: 0;
          color: #fff;
          cursor: pointer;
        }

        .main-content {
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .game-card {
          position: relative;
          background: #0A132C;
          border: 1px solid rgba(14, 165, 233, 0.2);
          border-radius: 16px;
          height: 125px;
          display: flex;
          justify-content: space-between;
          overflow: hidden;
          cursor: pointer;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
          transition: transform 0.3s, border-color 0.3s;
        }
        .game-card:hover {
          transform: translateY(-3px);
          border-color: rgba(14, 165, 233, 0.6);
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.6);
        }

        .card-bg {
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          z-index: 1;
          /* Full image background layer */
          background-image: url('https://images.unsplash.com/photo-1534796636912-36528970b4f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80');
          background-size: cover;
          background-position: center;
          opacity: 0.3;
          mix-blend-mode: screen;
        }
        .card-bg::after {
          content: "";
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          /* Base gradient combining the specific game glow */
          background: inherit;
        }

        .card-left {
          position: relative;
          z-index: 2;
          padding: 24px 20px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 12px;
          width: 60%;
          /* Left gradient to ensure text readability against the full background */
          background: linear-gradient(90deg, rgba(6, 11, 25, 0.9) 0%, rgba(6, 11, 25, 0.4) 70%, transparent 100%);
        }
        .game-title {
          margin: 0;
          font-size: 19px;
          font-weight: 800;
          letter-spacing: 0.5px;
          text-shadow: 0 2px 4px rgba(0,0,0,0.8);
        }
        
        .enter-btn-wrapper {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .enter-text {
          font-size: 13px;
          font-weight: 600;
          color: #fff;
          text-shadow: 0 1px 2px rgba(0,0,0,0.5);
        }
        .enter-icon {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #0ea5e9;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 8px rgba(14,165,233,0.6);
        }

        .card-right {
          position: relative;
          z-index: 2;
          width: 150px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .game-img {
          height: 160%;
          width: auto;
          position: absolute;
          right: -10px;
          top: -30%;
          pointer-events: none;
          mix-blend-mode: lighten;
          transition: transform 0.4s ease;
          -webkit-mask-image: linear-gradient(to right, transparent, black 25%);
          mask-image: linear-gradient(to right, transparent, black 25%);
        }
        .game-card:hover .game-img {
          transform: scale(1.08) rotate(-2deg);
        }
      `}</style>
    </div>
  );
}
