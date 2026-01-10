'use client'

import { useState } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    // TODO: Replace with your Supabase auth logic
    // Example:
    // const { data, error } = await supabase.auth.signInWithPassword({
    //   email,
    //   password,
    // });
    
    setTimeout(() => {
      setIsLoading(false);
      // Handle auth response
    }, 1500);
  };

  return (
    <>
      <style>{`
        :root {
          --background: #F7F3EA;
          --surface-1: #FFFFFF;
          --surface-2: #FBF8F1;
          --surface-3: #F3EEE4;
          --text: #0F172A;
          --text-muted: #475569;
          --icon: #334155;
          --hover-surface: #F3EEE4;
          --selected-surface: #EFE7DA;
          --disabled-surface: #F1ECE2;
          --disabled-border: #EAE3D6;
          --primary: #3B2A22;
          --primary-hover: #33241D;
          --primary-active: #2A1D18;
          --on-primary: #FFFFFF;
          --border: #E6DFD2;
          --border-strong: #D7CEBE;
          --radius: 10px;
          --shadow: rgba(15, 23, 42, 0.08);
          --overlay: rgba(15, 23, 42, 0.45);
        }

        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Serif+Display&display=swap');

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .login-page {
          min-height: 100vh;
          background: var(--background);
          display: flex;
          font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
        }

        /* Left side - decorative */
        .login-hero {
          flex: 1;
          background: var(--primary);
          display: none;
          flex-direction: column;
          justify-content: space-between;
          padding: 48px;
          position: relative;
          overflow: hidden;
        }

        @media (min-width: 1024px) {
          .login-hero {
            display: flex;
          }
        }

        .hero-pattern {
          position: absolute;
          inset: 0;
          opacity: 0.05;
          background-image: 
            repeating-linear-gradient(
              45deg,
              transparent,
              transparent 40px,
              rgba(255,255,255,0.1) 40px,
              rgba(255,255,255,0.1) 80px
            );
        }

        .hero-logo {
          color: var(--on-primary);
          font-family: 'DM Serif Display', serif;
          font-size: 28px;
          letter-spacing: -0.5px;
          position: relative;
          z-index: 1;
        }

        .hero-content {
          position: relative;
          z-index: 1;
        }

        .hero-title {
          font-family: 'DM Serif Display', serif;
          font-size: 56px;
          line-height: 1.1;
          color: var(--on-primary);
          margin-bottom: 24px;
          letter-spacing: -1px;
        }

        .hero-subtitle {
          font-size: 18px;
          color: rgba(255, 255, 255, 0.7);
          line-height: 1.6;
          max-width: 400px;
        }

        .hero-features {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-top: 48px;
        }

        .hero-feature {
          display: flex;
          align-items: center;
          gap: 12px;
          color: rgba(255, 255, 255, 0.85);
          font-size: 15px;
        }

        .hero-feature-icon {
          width: 32px;
          height: 32px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .hero-footer {
          color: rgba(255, 255, 255, 0.5);
          font-size: 14px;
          position: relative;
          z-index: 1;
        }

        /* Right side - form */
        .login-form-container {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 32px 24px;
          max-width: 100%;
        }

        @media (min-width: 1024px) {
          .login-form-container {
            max-width: 560px;
          }
        }

        .login-card {
          width: 100%;
          max-width: 400px;
        }

        .mobile-logo {
          font-family: 'DM Serif Display', serif;
          font-size: 24px;
          color: var(--primary);
          margin-bottom: 48px;
          text-align: center;
        }

        @media (min-width: 1024px) {
          .mobile-logo {
            display: none;
          }
        }

        .login-header {
          margin-bottom: 32px;
        }

        .login-title {
          font-size: 28px;
          font-weight: 600;
          color: var(--text);
          margin-bottom: 8px;
          letter-spacing: -0.5px;
        }

        .login-subtitle {
          font-size: 15px;
          color: var(--text-muted);
          line-height: 1.5;
        }

        .login-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-label {
          font-size: 14px;
          font-weight: 500;
          color: var(--text);
        }

        .form-input {
          width: 100%;
          height: 48px;
          padding: 0 16px;
          font-size: 15px;
          font-family: inherit;
          color: var(--text);
          background: var(--surface-1);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          outline: none;
          transition: all 0.2s ease;
        }

        .form-input::placeholder {
          color: var(--text-muted);
          opacity: 0.6;
        }

        .form-input:hover {
          border-color: var(--border-strong);
        }

        .form-input:focus {
          border-color: var(--primary);
          box-shadow: 0 0 0 3px rgba(59, 42, 34, 0.1);
        }

        .form-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .checkbox-group {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
        }

        .checkbox-input {
          width: 18px;
          height: 18px;
          accent-color: var(--primary);
          cursor: pointer;
        }

        .checkbox-label {
          font-size: 14px;
          color: var(--text-muted);
          user-select: none;
        }

        .forgot-link {
          font-size: 14px;
          color: var(--primary);
          text-decoration: none;
          font-weight: 500;
          transition: color 0.2s ease;
        }

        .forgot-link:hover {
          color: var(--primary-hover);
          text-decoration: underline;
        }

        .error-message {
          background: #FEF2F2;
          border: 1px solid #FECACA;
          color: #DC2626;
          padding: 12px 16px;
          border-radius: var(--radius);
          font-size: 14px;
        }

        .submit-button {
          width: 100%;
          height: 52px;
          background: var(--primary);
          color: var(--on-primary);
          border: none;
          border-radius: var(--radius);
          font-size: 16px;
          font-weight: 600;
          font-family: inherit;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-top: 8px;
        }

        .submit-button:hover:not(:disabled) {
          background: var(--primary-hover);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(59, 42, 34, 0.2);
        }

        .submit-button:active:not(:disabled) {
          background: var(--primary-active);
          transform: translateY(0);
        }

        .submit-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .spinner {
          width: 20px;
          height: 20px;
          border: 2px solid transparent;
          border-top-color: var(--on-primary);
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .divider {
          display: flex;
          align-items: center;
          gap: 16px;
          margin: 24px 0;
        }

        .divider-line {
          flex: 1;
          height: 1px;
          background: var(--border);
        }

        .divider-text {
          font-size: 13px;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .signup-prompt {
          text-align: center;
          font-size: 15px;
          color: var(--text-muted);
        }

        .signup-link {
          color: var(--primary);
          text-decoration: none;
          font-weight: 600;
          margin-left: 4px;
        }

        .signup-link:hover {
          text-decoration: underline;
        }
      `}</style>

      <div className="login-page">
        {/* Left Hero Section */}
        <div className="login-hero">
          <div className="hero-pattern" />
          <div className="hero-logo">TradeFlow</div>
          
          <div className="hero-content">
            <h1 className="hero-title">
              Run your trade<br />
              business smarter.
            </h1>
            <p className="hero-subtitle">
              From quotes to invoices, job scheduling to customer management — 
              everything you need in one place.
            </p>
            
            <div className="hero-features">
              <div className="hero-feature">
                <div className="hero-feature-icon">
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 11l3 3L22 4" />
                  </svg>
                </div>
                <span>Create invoices in seconds</span>
              </div>
              <div className="hero-feature">
                <div className="hero-feature-icon">
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                </div>
                <span>Schedule jobs effortlessly</span>
              </div>
              <div className="hero-feature">
                <div className="hero-feature-icon">
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>
                <span>Keep customers happy</span>
              </div>
            </div>
          </div>
          
          <div className="hero-footer">
            © 2026 TradeFlow. Built for tradies, by tradies.
          </div>
        </div>

        {/* Right Form Section */}
        <div className="login-form-container">
          <div className="login-card">
            <div className="mobile-logo">TradeFlow</div>
            
            <div className="login-header">
              <h2 className="login-title">Welcome back</h2>
              <p className="login-subtitle">
                Enter your credentials to access your account
              </p>
            </div>

            <form className="login-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label" htmlFor="email">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  className="form-input"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="password">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  className="form-input"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="form-row">
                <label className="checkbox-group">
                  <input type="checkbox" className="checkbox-input" />
                  <span className="checkbox-label">Remember me</span>
                </label>
                <a href="/forgot-password" className="forgot-link">
                  Forgot password?
                </a>
              </div>

              {error && <div className="error-message">{error}</div>}

              <button type="submit" className="submit-button" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <div className="spinner" />
                    Signing in...
                  </>
                ) : (
                  'Sign in'
                )}
              </button>
            </form>

            <div className="divider">
              <div className="divider-line" />
              <span className="divider-text">New here?</span>
              <div className="divider-line" />
            </div>

            <p className="signup-prompt">
              Don't have an account?
              <a href="/signup" className="signup-link">Create one</a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}