"use client";

import { useRouter } from "next/navigation";

export default function WelcomePage() {
    const router = useRouter();

    return (
        <div className="welcome-root">
            {/* Background design */}
            <div className="bg-orb orb-1"></div>
            <div className="bg-orb orb-2"></div>

            <div className="content-container">
                {/* Logo */}
                <div className="logo-wrapper">
                    <img src="/nexmine-ai-logo.png" alt="Nexmine AI" className="hero-logo" />
                </div>

                {/* Text Content */}
                <h1 className="welcome-title">Welcome to <span className="highlight">Nexmine</span></h1>
                <p className="welcome-subtitle">The leading platform for intelligent automated mining. Join our ecosystem and start maximizing your digital assets today.</p>

                {/* Buttons */}
                <div className="button-group">
                    <button
                        className="btn-primary"
                        onClick={() => router.push('/')}
                    >
                        Sign Up
                    </button>
                    <button
                        className="btn-secondary"
                        onClick={() => router.push('/login')}
                    >
                        Sign In
                    </button>
                </div>
            </div>

            <style jsx>{`
                .welcome-root {
                    min-height: 100vh;
                    width: 100%;
                    background: #050B18;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    position: relative;
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                    overflow: hidden;
                    padding: 24px;
                    box-sizing: border-box;
                }
                .bg-orb {
                    position: absolute;
                    border-radius: 50%;
                    filter: blur(90px);
                    opacity: 0.15;
                    pointer-events: none;
                }
                .orb-1 { width: 350px; height: 350px; background: #00D9FF; top: -50px; left: -100px; animation: float 8s infinite alternate ease-in-out; }
                .orb-2 { width: 300px; height: 300px; background: #1677FF; bottom: -80px; right: -80px; animation: float 10s infinite alternate-reverse ease-in-out; }
                @keyframes float { 0% { transform: translateY(0); } 100% { transform: translateY(30px); } }

                .content-container {
                    background: rgba(13, 25, 48, 0.6);
                    border: 1px solid rgba(24, 50, 82, 0.8);
                    border-radius: 24px;
                    padding: 40px 30px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    text-align: center;
                    z-index: 10;
                    backdrop-filter: blur(12px);
                    max-width: 440px;
                    width: 100%;
                    box-shadow: 0 20px 50px rgba(0,0,0,0.5);
                }
                .logo-wrapper { margin-bottom: 28px; }
                .hero-logo { width: 240px; height: auto; object-fit: contain; }

                .welcome-title {
                    font-size: 28px;
                    font-weight: 800;
                    color: #fff;
                    margin: 0 0 12px 0;
                    letter-spacing: -0.5px;
                }
                .highlight { color: #00D9FF; }
                .welcome-subtitle {
                    font-size: 15px;
                    color: #8FA3BF;
                    line-height: 1.6;
                    margin: 0 0 40px 0;
                }

                .button-group {
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                    width: 100%;
                }
                .btn-primary {
                    background: #00D9FF;
                    color: #0D1930;
                    border: none;
                    border-radius: 14px;
                    padding: 16px;
                    font-size: 16px;
                    font-weight: 800;
                    cursor: pointer;
                    transition: all 0.2s;
                    box-shadow: 0 8px 25px rgba(0,217,255,0.25);
                }
                .btn-primary:hover {
                    box-shadow: 0 12px 35px rgba(0,217,255,0.4);
                    transform: translateY(-2px);
                }
                .btn-primary:active {
                    transform: translateY(0) scale(0.98);
                }
                
                .btn-secondary {
                    background: rgba(24, 50, 82, 0.5);
                    color: #00D9FF;
                    border: 1px solid rgba(0, 217, 255, 0.3);
                    border-radius: 14px;
                    padding: 16px;
                    font-size: 16px;
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .btn-secondary:hover {
                    background: rgba(0, 217, 255, 0.1);
                    border-color: rgba(0, 217, 255, 0.5);
                }
                .btn-secondary:active {
                    transform: scale(0.98);
                }
            `}</style>
        </div>
    );
}
