'use client'

import { useState } from 'react';
import './login.css'
import { login } from './actions';
import { useRouter } from 'next/navigation';
export default function LoginPage() {

  const router = useRouter()

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData,setFormData] = useState({
    email:'',
    password:'',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    const result = await login(formData)
    console.log(result.error)
    if (result.error) {
      setError(result.error);
      setIsLoading(false)
    } else {
      router.push('./')
    }

    setTimeout(() => {
      setIsLoading(false);
      // Handle auth response
    }, 1500);
  };

  return (
    <>
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
                  name='email'
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
                  type="password"
                  name='password'
                  className="form-input"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
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