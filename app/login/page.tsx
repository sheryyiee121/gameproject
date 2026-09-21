"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    // Reset language to English on entry
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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      alert("Please enter both email and password.");
      return;
    }

    setIsLoggingIn(true);
    try {
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("email", "==", email), where("password", "==", password));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        alert("Invalid credentials! User not found.");
      } else {
        const userDoc = querySnapshot.docs[0];
        localStorage.setItem("nexmine_uid", userDoc.id);
        router.push("/dashboard");
      }
    } catch (err: any) {
      alert("Login error: " + err.message);
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="login-root">
      {/* Animated background orbs */}
      <div className="bg-orb orb-1"></div>
      <div className="bg-orb orb-2"></div>
      <div className="bg-orb orb-3"></div>

      {/* Top bar */}
      <div className="top-bar">
        <button className="back-btn" onClick={() => router.back()} aria-label="Go back">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
      </div>

      {/* Hero */}
      <div className="hero">
        <div className="hero-logo">
          <img src="/nexmine-ai-logo.png" alt="Nexmine AI" className="hero-logo-img" />
        </div>
        <p className="hero-sub">Sign in to continue mining</p>
      </div>

      {/* Glass Form Card */}
      <div className="glass-card">
        <form className="login-form" onSubmit={handleLogin} noValidate>
          {/* Email */}
          <div className="field-group">
            <label className="field-label" htmlFor="email">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#818894" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
              Email Address
            </label>
            <input
              id="email"
              type="email"
              className="field-input"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>

          {/* Password */}
          <div className="field-group">
            <label className="field-label" htmlFor="password">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#818894" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></svg>
              Password
            </label>
            <div className="input-wrapper">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                className="field-input"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                className="eye-btn"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0112 20C7 20 2.73 16.39 1 12a10.07 10.07 0 012.06-3.94M9.9 4.24A9.12 9.12 0 0112 4c5 0 9.27 3.61 11 8a10.07 10.07 0 01-1.35 2.71" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Forgot password */}
          <div className="forgot-row">
            <a href="#" className="forgot-link">Forgot Password?</a>
          </div>

          {/* Login button */}
          <button type="submit" className="login-btn" disabled={isLoggingIn}>
            {isLoggingIn ? (
              <span className="btn-loading">
                <span className="spinner"></span> Signing in...
              </span>
            ) : "Sign In"}
          </button>

          {/* Divider */}
          <div className="divider-row">
            <span className="divider-line"></span>
            <span className="divider-text">or</span>
            <span className="divider-line"></span>
          </div>

          {/* Sign up link */}
          <p className="signup-text">
            Don&apos;t have an account?{" "}
            <a href="/" className="signup-link">Create Account</a>
          </p>
        </form>
      </div>

      <style jsx>{`
        .login-root {
          min-height: 100vh;
          width: 100%;
          background: #050B18;
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          color: #ffffff;
          padding-bottom: 40px;
          box-sizing: border-box;
          overflow: hidden;
        }

        /* Animated background orbs */
        .bg-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.15;
          pointer-events: none;
        }
        .orb-1 {
          width: 300px; height: 300px;
          background: #1677FF;
          top: -80px; right: -60px;
          animation: orbFloat 8s ease-in-out infinite;
        }
        .orb-2 {
          width: 250px; height: 250px;
          background: #00D9FF;
          bottom: 100px; left: -80px;
          animation: orbFloat 10s ease-in-out infinite reverse;
        }
        .orb-3 {
          width: 200px; height: 200px;
          background: #1677FF;
          bottom: -50px; right: -40px;
          animation: orbFloat 12s ease-in-out infinite;
        }
        @keyframes orbFloat {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-30px) scale(1.1); }
        }

        .top-bar {
          width: 100%;
          max-width: 480px;
          display: flex;
          justify-content: flex-start;
          align-items: center;
          gap: 16px;
          padding: 16px 20px;
          box-sizing: border-box;
          position: relative;
          z-index: 2;
        }
        .back-btn {
          background: rgba(24,50,82,0.5);
          border: 1px solid #183252;
          color: #8FA3BF;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px; height: 40px;
          border-radius: 12px;
          transition: all 0.2s;
        }
        .back-btn:hover { background: #183252; color: #fff; }

        .brand-mark {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .brand-logo {
          height: 36px;
          width: auto;
          object-fit: contain;
        }

        .hero {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 20px 20px 10px;
          text-align: center;
          position: relative;
          z-index: 2;
          width: 100%;
          max-width: 480px;
          box-sizing: border-box;
        }
        .hero-logo {
          margin-bottom: 20px;
        }
        .hero-logo-img {
          width: 200px;
          height: auto;
          object-fit: contain;
        }
        .hero-sub {
          font-size: 15px;
          color: #8FA3BF;
          margin: 0;
          font-weight: 500;
        }

        /* Glass card */
        .glass-card {
          width: 100%;
          max-width: 480px;
          margin: 10px 0;
          padding: 0 20px;
          box-sizing: border-box;
          position: relative;
          z-index: 2;
        }
        .login-form {
          background: #0D1930;
          border: 1px solid #183252;
          border-radius: 16px;
          padding: 32px 24px;
          display: flex;
          flex-direction: column;
          gap: 20px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.5);
        }

        .field-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .field-label {
          font-size: 13px;
          font-weight: 600;
          color: #8FA3BF;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }
        .field-input {
          width: 100%;
          background: #0A1224;
          border: 1px solid #183252;
          border-radius: 12px;
          padding: 15px 18px;
          font-size: 15px;
          color: #ffffff;
          outline: none;
          transition: all 0.2s;
          box-sizing: border-box;
          -webkit-appearance: none;
        }
        .field-input::placeholder { color: #8FA3BF; opacity: 0.7; }
        .field-input:focus {
          border-color: #00D9FF;
          box-shadow: 0 0 0 3px rgba(0,217,255,0.15);
        }
        .field-input:-webkit-autofill {
          -webkit-box-shadow: 0 0 0 1000px #0A1224 inset;
          -webkit-text-fill-color: #ffffff;
        }
        .input-wrapper .field-input { padding-right: 48px; }

        .eye-btn {
          position: absolute;
          right: 14px;
          background: none;
          border: none;
          color: #8FA3BF;
          cursor: pointer;
          display: flex;
          align-items: center;
          padding: 0;
          transition: color 0.2s;
        }
        .eye-btn:hover { color: #00D9FF; }

        .forgot-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: -8px;
        }
        .remember-me {
          font-size: 13px;
          color: #8FA3BF;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .forgot-link {
          font-size: 13px;
          color: #1677FF;
          text-decoration: none;
          font-weight: 500;
          transition: opacity 0.2s;
        }
        .forgot-link:hover { opacity: 0.8; }

        .login-btn {
          width: 100%;
          padding: 16px;
          border-radius: 12px;
          border: none;
          background: #00D9FF;
          color: #0D1930;
          font-size: 16px;
          font-weight: 800;
          cursor: pointer;
          letter-spacing: 0.3px;
          transition: all 0.2s;
          margin-top: 4px;
          box-shadow: 0 8px 25px rgba(0,217,255,0.25);
        }
        .login-btn:hover { box-shadow: 0 12px 35px rgba(0,217,255,0.4); transform: translateY(-1px); }
        .login-btn:active { transform: translateY(0) scale(0.98); }
        .login-btn:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }

        .btn-loading {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        .spinner {
          width: 16px; height: 16px;
          border: 2px solid rgba(13,25,48,0.3);
          border-top-color: #0D1930;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .divider-row {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .divider-line {
          flex: 1;
          height: 1px;
          background: #183252;
        }
        .divider-text {
          font-size: 12px;
          color: #8FA3BF;
          font-weight: 500;
          text-transform: uppercase;
        }

        .signup-text {
          font-size: 14px;
          color: #8FA3BF;
          text-align: center;
          margin: 0;
        }
        .signup-link {
          color: #00D9FF;
          text-decoration: none;
          font-weight: 700;
        }
        .signup-link:hover { text-decoration: underline; }

        @media (max-width: 360px) {
          .hero-title { font-size: 22px; }
          .login-form { padding: 24px 18px; }
        }
      `}</style>
    </div>
  );
}
