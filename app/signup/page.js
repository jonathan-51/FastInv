'use client'

import { useState } from 'react';

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    businessName: '',
    trade: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);

  const trades = [
    'Electrician',
    'Plumber',
    'Builder',
    'Carpenter',
    'Painter',
    'Roofer',
    'HVAC Technician',
    'Landscaper',
    'Tiler',
    'Plasterer',
    'Other',
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    setError('');
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // TODO: Replace with your Supabase auth logic
    // Example:
    // const { data, error } = await supabase.auth.signUp({
    //   email: formData.email,
    //   password: formData.password,
    //   options: {
    //     data: {
    //       name: formData.name,
    //       business_name: formData.businessName,
    //       trade: formData.trade,
    //     }
    //   }
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

        .signup-page {
          min-height: 100vh;
          background: var(--background);
          display: flex;
          font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
        }

        /* Left side - decorative */
        .signup-hero {
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
          .signup-hero {
            display: flex;
          }
        }

        .hero-pattern {
          position: absolute;
          inset: 0;
          opacity: 0.05;
          background-image: 
            repeating-linear-gradient(
              -45deg,
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
          font-size: 52px;
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

        .hero-stats {
          display: flex;
          gap: 48px;
          margin-top: 56px;
        }

        .stat-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .stat-number {
          font-family: 'DM Serif Display', serif;
          font-size: 40px;
          color: var(--on-primary);
        }

        .stat-label {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.6);
        }

        .hero-footer {
          color: rgba(255, 255, 255, 0.5);
          font-size: 14px;
          position: relative;
          z-index: 1;
        }

        /* Right side - form */
        .signup-form-container {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 32px 24px;
          max-width: 100%;
          overflow-y: auto;
        }

        @media (min-width: 1024px) {
          .signup-form-container {
            max-width: 560px;
          }
        }

        .signup-card {
          width: 100%;
          max-width: 420px;
        }

        .mobile-logo {
          font-family: 'DM Serif Display', serif;
          font-size: 24px;
          color: var(--primary);
          margin-bottom: 40px;
          text-align: center;
        }

        @media (min-width: 1024px) {
          .mobile-logo {
            display: none;
          }
        }

        .signup-header {
          margin-bottom: 32px;
        }

        .signup-title {
          font-size: 28px;
          font-weight: 600;
          color: var(--text);
          margin-bottom: 8px;
          letter-spacing: -0.5px;
        }

        .signup-subtitle {
          font-size: 15px;
          color: var(--text-muted);
          line-height: 1.5;
        }

        /* Progress indicator */
        .progress-bar {
          display: flex;
          gap: 8px;
          margin-bottom: 32px;
        }

        .progress-step {
          flex: 1;
          height: 4px;
          background: var(--border);
          border-radius: 2px;
          transition: background 0.3s ease;
        }

        .progress-step.active {
          background: var(--primary);
        }

        .step-labels {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
        }

        .step-label {
          font-size: 12px;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .step-label.active {
          color: var(--primary);
          font-weight: 600;
        }

        .signup-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        @media (max-width: 480px) {
          .form-row {
            grid-template-columns: 1fr;
          }
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

        .form-select {
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
          cursor: pointer;
          transition: all 0.2s ease;
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23475569' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 16px center;
        }

        .form-select:hover {
          border-color: var(--border-strong);
        }

        .form-select:focus {
          border-color: var(--primary);
          box-shadow: 0 0 0 3px rgba(59, 42, 34, 0.1);
        }

        .password-hint {
          font-size: 13px;
          color: var(--text-muted);
          margin-top: -4px;
        }

        .error-message {
          background: #FEF2F2;
          border: 1px solid #FECACA;
          color: #DC2626;
          padding: 12px 16px;
          border-radius: var(--radius);
          font-size: 14px;
        }

        .button-group {
          display: flex;
          gap: 12px;
          margin-top: 8px;
        }

        .back-button {
          flex: 1;
          height: 52px;
          background: var(--surface-1);
          color: var(--text);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          font-size: 16px;
          font-weight: 600;
          font-family: inherit;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .back-button:hover {
          background: var(--hover-surface);
          border-color: var(--border-strong);
        }

        .submit-button {
          flex: 2;
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
        }

        .submit-button.full-width {
          flex: 1;
          width: 100%;
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

        .terms-text {
          font-size: 13px;
          color: var(--text-muted);
          text-align: center;
          line-height: 1.5;
          margin-top: 8px;
        }

        .terms-link {
          color: var(--primary);
          text-decoration: none;
        }

        .terms-link:hover {
          text-decoration: underline;
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

        .login-prompt {
          text-align: center;
          font-size: 15px;
          color: var(--text-muted);
        }

        .login-link {
          color: var(--primary);
          text-decoration: none;
          font-weight: 600;
          margin-left: 4px;
        }

        .login-link:hover {
          text-decoration: underline;
        }
      `}</style>

      <div className="signup-page">
        {/* Left Hero Section */}
        <div className="signup-hero">
          <div className="hero-pattern" />
          <div className="hero-logo">TradeFlow</div>

          <div className="hero-content">
            <h1 className="hero-title">
              Join thousands<br />
              of tradies.
            </h1>
            <p className="hero-subtitle">
              Stop drowning in paperwork. Start growing your business with 
              tools built specifically for trade professionals.
            </p>

            <div className="hero-stats">
              <div className="stat-item">
                <span className="stat-number">2,500+</span>
                <span className="stat-label">Active tradies</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">$4.2M</span>
                <span className="stat-label">Invoiced monthly</span>
              </div>
            </div>
          </div>

          <div className="hero-footer">
            © 2026 TradeFlow. Built for tradies, by tradies.
          </div>
        </div>

        {/* Right Form Section */}
        <div className="signup-form-container">
          <div className="signup-card">
            <div className="mobile-logo">TradeFlow</div>

            <div className="signup-header">
              <h2 className="signup-title">Create your account</h2>
              <p className="signup-subtitle">
                {step === 1
                  ? 'Start with your personal details'
                  : 'Tell us about your business'}
              </p>
            </div>

            {/* Progress Steps */}
            <div className="step-labels">
              <span className={`step-label ${step >= 1 ? 'active' : ''}`}>
                Account
              </span>
              <span className={`step-label ${step >= 2 ? 'active' : ''}`}>
                Business
              </span>
            </div>
            <div className="progress-bar">
              <div className={`progress-step ${step >= 1 ? 'active' : ''}`} />
              <div className={`progress-step ${step >= 2 ? 'active' : ''}`} />
            </div>

            {step === 1 ? (
              <form className="signup-form" onSubmit={handleNextStep}>
                <div className="form-group">
                  <label className="form-label" htmlFor="name">
                    Full name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    className="form-input"
                    placeholder="John Smith"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="email">
                    Email address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    className="form-input"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="password">
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    className="form-input"
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <span className="password-hint">
                    Must be at least 8 characters
                  </span>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="confirmPassword">
                    Confirm password
                  </label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    className="form-input"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </div>

                {error && <div className="error-message">{error}</div>}

                <button type="submit" className="submit-button full-width">
                  Continue
                  <svg
                    width="16"
                    height="16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </button>
              </form>
            ) : (
              <form className="signup-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label" htmlFor="businessName">
                    Business name
                  </label>
                  <input
                    id="businessName"
                    name="businessName"
                    type="text"
                    className="form-input"
                    placeholder="Smith's Plumbing"
                    value={formData.businessName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="trade">
                    Your trade
                  </label>
                  <select
                    id="trade"
                    name="trade"
                    className="form-select"
                    value={formData.trade}
                    onChange={handleChange}
                    required
                  >
                    <option value="" disabled>
                      Select your trade
                    </option>
                    {trades.map((trade) => (
                      <option key={trade} value={trade.toLowerCase()}>
                        {trade}
                      </option>
                    ))}
                  </select>
                </div>

                {error && <div className="error-message">{error}</div>}

                <div className="button-group">
                  <button
                    type="button"
                    className="back-button"
                    onClick={() => setStep(1)}
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="submit-button"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <div className="spinner" />
                        Creating...
                      </>
                    ) : (
                      'Create account'
                    )}
                  </button>
                </div>

                <p className="terms-text">
                  By creating an account, you agree to our{' '}
                  <a href="/terms" className="terms-link">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="/privacy" className="terms-link">
                    Privacy Policy
                  </a>
                </p>
              </form>
            )}

            <div className="divider">
              <div className="divider-line" />
              <span className="divider-text">Already a member?</span>
              <div className="divider-line" />
            </div>

            <p className="login-prompt">
              Have an account?
              <a href="/login" className="login-link">
                Sign in
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}