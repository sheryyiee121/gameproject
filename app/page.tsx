"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, doc, setDoc, serverTimestamp } from "firebase/firestore";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [invitationCode, setInvitationCode] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [isRegistering, setIsRegistering] = useState(false);
  const [clientIp, setClientIp] = useState("Unknown");
  const [clientLocation, setClientLocation] = useState("Unknown");
  const router = useRouter();

  useEffect(() => {
    // Silently grab IP upon page load to speed up registration
    fetch("https://api.ipify.org?format=json")
      .then(res => res.json())
      .then(data => setClientIp(data.ip || "Unknown"))
      .catch(() => { });

    // Prompt user natively for GPS Tracking Permission
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          try {
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${pos.coords.latitude}&lon=${pos.coords.longitude}`);
            if (res.ok) {
              const data = await res.json();
              const city = data.address?.city || data.address?.town || data.address?.village || "";
              const country = data.address?.country || "";
              setClientLocation(`${city}${city && country ? ', ' : ''}${country}`);
            }
          } catch {
            setClientLocation("GPS Captured (Reverse Geocode Blocked)");
          }
        },
        () => {
          // If User clicks "Block"
          setClientLocation("User Denied Tracking Request");
        }
      );
    }
  }, []);

  const handleSendCode = async () => {
    if (!email) return;

    try {
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("email", "==", email));
      const snap = await getDocs(q);
      if (!snap.empty) {
        alert("An account with this email already exists! Please log in instead.");
        return;
      }
    } catch (err: any) {
      alert("Database error: " + err.message);
      return;
    }

    setCodeSent(true);
    setCountdown(60);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setCodeSent(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    try {
      const response = await fetch('/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await response.json();
      if (!data.success) {
        alert("Failed to send code: " + data.error);
        clearInterval(timer);
        setCodeSent(false);
      }
    } catch (err) {
      alert("Error sending verification code.");
      clearInterval(timer);
      setCodeSent(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !verificationCode || !username) {
      alert("Please fill in username, email, password, and verification code");
      return;
    }

    setIsRegistering(true);
    try {
      const numericUid = Math.floor(10000000 + Math.random() * 90000000).toString();

      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      let generatedInviteCode = "";
      for (let i = 0; i < 7; i++) {
        generatedInviteCode += chars.charAt(Math.floor(Math.random() * chars.length));
      }

      let referredBy: string | null = null;
      if (invitationCode.trim()) {
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("myInviteCode", "==", invitationCode.trim().toUpperCase()));
        const snap = await getDocs(q);
        if (snap.empty) {
          alert("Invalid invitation code. Please check and try again.");
          setIsRegistering(false);
          return;
        }
        referredBy = snap.docs[0].data().uid;
      }

      let device = "Unknown";
      if (typeof navigator !== "undefined") {
        const ua = navigator.userAgent;
        const isMobile = /Mobile|Android|iPhone|iPad|iPod/i.test(ua) ? "Mobile" : "Desktop";
        let os = "Unknown OS";
        if (/Windows/i.test(ua)) os = "Windows";
        else if (/Mac/i.test(ua)) os = "Mac";
        else if (/Android/i.test(ua)) os = "Android";
        else if (/iPhone|iPad|iPod/i.test(ua)) os = "iOS";
        else if (/Linux/i.test(ua)) os = "Linux";
        device = `${os} (${isMobile})`;
      }

      await setDoc(doc(db, "users", numericUid), {
        uid: numericUid,
        email: email,
        username: username,
        password: password,
        ipAddress: clientIp,
        location: clientLocation,
        device: device,
        invitationCode: invitationCode.trim().toUpperCase() || null,
        myInviteCode: generatedInviteCode,
        referredBy: referredBy,
        isBlocked: false,
        balances: { usdt: 0, usdc: 0, btc: 0 },
        totalProfit: 0,
        todayProfit: 0,
        miningRate: parseFloat((Math.random() * (1 - 0.05) + 0.05).toFixed(4)),
        miningStartedAt: serverTimestamp(),
        hasClaimedBonus: false,
        tier: "Bronze",
        createdAt: serverTimestamp()
      });

      localStorage.setItem("nexmine_uid", numericUid);
      router.push('/dashboard');
    } catch (err: any) {
      alert("Registration failed: " + err.message);
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <div className="signup-root">
      {/* Animated background orbs */}
      <div className="bg-orb orb-1"></div>
      <div className="bg-orb orb-2"></div>
      <div className="bg-orb orb-3"></div>

      {/* Top bar */}
      <div className="top-bar">
        <button className="back-btn" onClick={() => router.push('/login')} aria-label="Go back">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
      </div>

      {/* Hero section */}
      <div className="hero">
        <div className="hero-logo">
          <img src="/nexmine-ai-logo.png" alt="Nexmine AI" className="hero-logo-img" />
        </div>
        <p className="hero-sub">Start mining in under 30 seconds</p>
      </div>

      {/* Glass Form Card */}
      <div className="glass-card">
        <form className="signup-form" onSubmit={handleRegister} noValidate>
          {/* Username */}
          <div className="field-group">
            <label className="field-label" htmlFor="username">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#818894" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
              Username
            </label>
            <input
              id="username"
              type="text"
              className="field-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Choose a username"
            />
          </div>

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
                placeholder="Create a strong password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
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

          {/* Verification Code */}
          <div className="field-group">
            <label className="field-label" htmlFor="verificationCode">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#818894" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
              Verification Code
            </label>
            <div className="input-wrapper code-wrapper">
              <input
                id="verificationCode"
                type="text"
                className="field-input"
                placeholder="Enter email code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
              />
              <button
                type="button"
                className="send-code-btn"
                onClick={handleSendCode}
                disabled={codeSent || !email}
              >
                {codeSent ? `${countdown}s` : "Send"}
              </button>
            </div>
          </div>

          {/* Invitation Code */}
          <div className="field-group">
            <label className="field-label" htmlFor="invitationCode">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#818894" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="8.5" cy="7" r="4" /><line x1="20" y1="8" x2="20" y2="14" /><line x1="23" y1="11" x2="17" y2="11" /></svg>
              Invitation Code <span className="optional">(Optional)</span>
            </label>
            <div className="input-wrapper">
              <input
                id="invitationCode"
                type="text"
                className="field-input"
                placeholder="Enter referral code"
                value={invitationCode}
                onChange={(e) => setInvitationCode(e.target.value)}
              />
              {invitationCode && (
                <button
                  type="button"
                  className="clear-btn"
                  onClick={() => setInvitationCode("")}
                  aria-label="Clear invitation code"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Register button */}
          <button type="submit" className="register-btn" disabled={isRegistering}>
            {isRegistering ? (
              <span className="btn-loading">
                <span className="spinner"></span> Creating Account...
              </span>
            ) : "Create Account"}
          </button>

          {/* Terms */}
          <p className="terms-text">
            By signing up, you agree to our{" "}
            <a href="#" className="terms-link">Terms</a>
            {" "}and{" "}
            <a href="#" className="terms-link">Privacy Policy</a>
          </p>

          {/* Divider */}
          <div className="divider-row">
            <span className="divider-line"></span>
            <span className="divider-text">or</span>
            <span className="divider-line"></span>
          </div>

          {/* Login link */}
          <p className="login-text">
            Already have an account?{" "}
            <a href="/login" className="login-link">Sign In</a>
          </p>
        </form>
      </div>

      <style jsx>{`
        .signup-root {
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
          bottom: 150px; left: -100px;
          animation: orbFloat 10s ease-in-out infinite reverse;
        }
        .orb-3 {
          width: 200px; height: 200px;
          background: #1677FF;
          bottom: -50px; left: 30%;
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

        .brand-mark { display: flex; align-items: center; gap: 8px; }
        .brand-logo { height: 36px; width: auto; object-fit: contain; }

        .hero {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 12px 20px 10px;
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
          font-size: 14px;
          color: #8FA3BF;
          margin: 0;
          font-weight: 500;
        }

        /* Glass card */
        .glass-card {
          width: 100%;
          max-width: 480px;
          margin: 6px 0;
          padding: 0 20px;
          box-sizing: border-box;
          position: relative;
          z-index: 2;
        }
        .signup-form {
          background: #0D1930;
          border: 1px solid #183252;
          border-radius: 16px;
          padding: 28px 22px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.5);
        }

        .field-group { display: flex; flex-direction: column; gap: 7px; }
        .field-label {
          font-size: 13px;
          font-weight: 600;
          color: #8FA3BF;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .optional { font-weight: 400; font-size: 11px; color: rgba(143,163,191,0.6); }

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
          padding: 14px 16px;
          font-size: 14px;
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
        .input-wrapper .field-input { padding-right: 80px; }
        .code-wrapper .field-input { padding-right: 80px; }

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

        .send-code-btn {
          position: absolute;
          right: 8px;
          background: rgba(0,217,255,0.12);
          border: 1px solid rgba(0,217,255,0.25);
          color: #00D9FF;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          white-space: nowrap;
          padding: 8px 14px;
          border-radius: 10px;
          transition: all 0.2s;
        }
        .send-code-btn:disabled {
          color: rgba(0,217,255,0.4);
          border-color: rgba(0,217,255,0.1);
          cursor: not-allowed;
        }
        .send-code-btn:not(:disabled):hover {
          background: rgba(0,217,255,0.2);
        }

        .clear-btn {
          position: absolute;
          right: 14px;
          width: 24px; height: 24px;
          border-radius: 8px;
          background: rgba(24,50,82,0.5);
          border: 1px solid #183252;
          color: #8FA3BF;
          font-size: 11px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }
        .clear-btn:hover { background: rgba(239,68,68,0.15); color: #ef4444; border-color: rgba(239,68,68,0.3); }

        .register-btn {
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
        .register-btn:hover { box-shadow: 0 12px 35px rgba(0,217,255,0.4); transform: translateY(-1px); }
        .register-btn:active { transform: translateY(0) scale(0.98); }
        .register-btn:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }

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

        .terms-text {
          font-size: 12px;
          color: #8FA3BF;
          text-align: center;
          margin: 0;
          line-height: 1.6;
        }
        .terms-link {
          color: #1677FF;
          text-decoration: none;
          font-weight: 500;
        }
        .terms-link:hover { text-decoration: underline; }

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

        .login-text {
          font-size: 14px;
          color: #8FA3BF;
          text-align: center;
          margin: 0;
        }
        .login-link {
          color: #00D9FF;
          text-decoration: none;
          font-weight: 700;
        }
        .login-link:hover { text-decoration: underline; }

        @media (max-width: 360px) {
          .send-code-btn { font-size: 11px; padding: 6px 10px; }
          .hero-title { font-size: 20px; }
          .signup-form { padding: 22px 16px; }
        }
      `}</style>
    </div>
  );
}
