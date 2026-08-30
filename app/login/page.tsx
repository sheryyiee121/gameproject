"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const [isLoggingIn, setIsLoggingIn] = useState(false);

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
      {/* Top bar */}
      <div className="top-bar">
        <button className="back-btn" aria-label="Go back">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <button className="lang-btn" aria-label="Language">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20" />
          </svg>
        </button>
      </div>

      {/* Hero */}
      <div className="hero">
        <div className="coins-img" aria-hidden="true">
          <span className="coin coin-left">💰</span>
          <span className="coin coin-center">🪙</span>
          <span className="coin coin-right">💵</span>
        </div>
        <h1 className="hero-title">Welcome Back!</h1>
        <p className="hero-sub">Log in to your account</p>
      </div>

      {/* Form */}
      <form className="login-form" onSubmit={handleLogin} noValidate>
        {/* Email */}
        <div className="field-group">
          <label className="field-label" htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            className="field-input"
            placeholder="Please enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
        </div>

        {/* Password */}
        <div className="field-group">
          <label className="field-label" htmlFor="password">Password</label>
          <div className="input-wrapper">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              className="field-input"
              placeholder="Please enter your password"
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
          {isLoggingIn ? "Logging in..." : "Log In"}
        </button>

        {/* Sign up link */}
        <p className="signup-text">
          Don&apos;t Have An Account?{" "}
          <a href="/" className="signup-link">Sign Up Now</a>
        </p>
      </form>

      {/* Help button */}
      <button className="help-btn" aria-label="Need help?">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
        </svg>
      </button>

      <style jsx>{`
        .login-root {
          min-height: 100vh;
          width: 100%;
          background: linear-gradient(180deg, #0a1a3a 0%, #0d2251 40%, #0a2040 100%);
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          color: #fff;
          padding-bottom: 40px;
          box-sizing: border-box;
        }

        .top-bar {
          width: 100%;
          max-width: 480px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 20px;
          box-sizing: border-box;
        }
        .back-btn, .lang-btn {
          background: none;
          border: none;
          color: #fff;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          transition: background 0.2s;
        }
        .back-btn:hover, .lang-btn:hover {
          background: rgba(255,255,255,0.1);
        }

        .hero {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 8px 20px 28px;
          text-align: center;
        }
        .coins-img {
          font-size: 40px;
          margin-bottom: 12px;
          display: flex;
          gap: 4px;
          align-items: flex-end;
        }
        .coin-left  { font-size: 32px; }
        .coin-center { font-size: 46px; }
        .coin-right { font-size: 28px; }
        .hero-title {
          font-size: clamp(20px, 5vw, 26px);
          font-weight: 700;
          margin: 0 0 6px;
        }
        .hero-sub {
          font-size: 14px;
          color: #c8d6f0;
          margin: 0;
        }

        .login-form {
          width: 100%;
          max-width: 480px;
          padding: 0 20px;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .field-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .field-label {
          font-size: 14px;
          font-weight: 500;
          color: #c8d6f0;
        }

        .input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }
        .field-input {
          width: 100%;
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 10px;
          padding: 14px 16px;
          font-size: 14px;
          color: #fff;
          outline: none;
          transition: border-color 0.2s;
          box-sizing: border-box;
          -webkit-appearance: none;
        }
        .field-input::placeholder { color: rgba(255,255,255,0.3); }
        .field-input:focus {
          border-color: rgba(100,180,255,0.5);
          background: rgba(255,255,255,0.1);
        }
        .field-input:-webkit-autofill {
          -webkit-box-shadow: 0 0 0 1000px #0d2251 inset;
          -webkit-text-fill-color: #fff;
        }
        .input-wrapper .field-input { padding-right: 48px; }

        .eye-btn {
          position: absolute;
          right: 14px;
          background: none;
          border: none;
          color: rgba(255,255,255,0.45);
          cursor: pointer;
          display: flex;
          align-items: center;
          padding: 0;
          transition: color 0.2s;
        }
        .eye-btn:hover { color: #fff; }

        .forgot-row {
          display: flex;
          justify-content: flex-end;
          margin-top: -6px;
        }
        .forgot-link {
          font-size: 13px;
          color: #4db8ff;
          text-decoration: none;
        }
        .forgot-link:hover { text-decoration: underline; }

        .login-btn {
          width: 100%;
          padding: 15px;
          border-radius: 10px;
          border: none;
          background: linear-gradient(135deg, #2a3f6f 0%, #3a5fa8 100%);
          color: rgba(255,255,255,0.85);
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          letter-spacing: 0.5px;
          transition: opacity 0.2s, transform 0.1s;
          margin-top: 4px;
        }
        .login-btn:hover { opacity: 0.9; }
        .login-btn:active { transform: scale(0.98); }

        .signup-text {
          font-size: 13px;
          color: rgba(200,214,240,0.65);
          text-align: center;
          margin: 0;
        }
        .signup-link {
          color: #4db8ff;
          text-decoration: none;
          font-weight: 600;
        }
        .signup-link:hover { text-decoration: underline; }

        .help-btn {
          position: fixed;
          bottom: 24px;
          right: 20px;
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: linear-gradient(135deg, #1e88e5, #1565c0);
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 16px rgba(30,136,229,0.45);
          transition: transform 0.2s, box-shadow 0.2s;
          z-index: 99;
        }
        .help-btn:hover {
          transform: scale(1.08);
          box-shadow: 0 6px 22px rgba(30,136,229,0.6);
        }

        @media (max-width: 360px) {
          .hero-title { font-size: 18px; }
        }
      `}</style>
    </div>
  );
}
