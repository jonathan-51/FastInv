'use client'
import './signup.css'
import { useEffect, useState } from 'react';
import { signUp } from './actions';
import { useRouter } from 'next/navigation';

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

  const router = useRouter();

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

    const result = await signUp(formData)
    
    if (result.error) {
      alert(result.error);
    } else {
      router.push('./jobs')
    }

    setTimeout(() => {
      setIsLoading(false);
      // Handle auth response
    }, 1500);
  };


  return (
    <>
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