"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authenticateUser } from '@/lib/auth';

export default function LoginPage() {
  const router = useRouter();

  // Inputs State
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  // UI Interactive State
  const [showPassword, setShowPassword] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [authError, setAuthError] = useState('');

  // Touched States for validation triggers on blur or change
  const [usernameTouched, setUsernameTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);

  // Theme auto-detection on mount
  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDark(prefersDark);
  }, []);

  // Validation Patterns
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  // Validates numbers 10-15 digits long, optionally starting with '+'
  const phoneRegex = /^\+?[0-9\s-]{10,15}$/;

  const isUsernameValid = emailRegex.test(username) || phoneRegex.test(username);
  const isPasswordValid = password.length >= 6;

  // Derive Error Messages
  let usernameError = '';
  if (usernameTouched && username === '') {
    usernameError = 'Username is mandatory';
  } else if (usernameTouched && !isUsernameValid) {
    usernameError = 'Please enter a valid email or phone number';
  }

  let passwordError = '';
  if (passwordTouched && password === '') {
    passwordError = 'Password is mandatory';
  } else if (passwordTouched && !isPasswordValid) {
    passwordError = 'Password must be at least 6 characters';
  }

  const isFormValid = isUsernameValid && isPasswordValid && username !== '' && password !== '';

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid || isLoading) return;

    setIsLoading(true);
    setAuthError('');
    
    // Simulate secure network authentication request
    setTimeout(() => {
      const user = authenticateUser(username, password);
      setIsLoading(false);
      
      if (user) {
        setIsSuccess(true);
        // Auto-redirect to custom builder workspace after 2 seconds
        setTimeout(() => {
          router.push('/?tab=builder');
        }, 2000);
      } else {
        setAuthError('Access Denied. Credentials not found in approved database.');
      }
    }, 1500);
  };

  const toggleTheme = () => {
    setIsDark(prev => !prev);
  };

  return (
    <div className={`login-layout-wrapper ${isDark ? 'dark-theme' : ''}`}>
      {/* Dynamic Background Decorative Glass Spheres */}
      <div 
        className="login-decor-sphere" 
        style={{ 
          top: '15%', 
          left: '10%', 
          width: '280px', 
          height: '280px', 
          background: 'rgba(2, 132, 199, 0.25)' 
        }} 
      />
      <div 
        className="login-decor-sphere" 
        style={{ 
          bottom: '15%', 
          right: '10%', 
          width: '320px', 
          height: '320px', 
          background: 'rgba(99, 102, 241, 0.25)' 
        }} 
      />

      <div className="login-card">
        {!isSuccess ? (
          <form onSubmit={handleLoginSubmit} noValidate>
            {/* Header section with branding & theme toggle */}
            <div className="login-card-header">
              <h1 className="login-card-title">DocForge</h1>
              <button 
                type="button" 
                className="login-theme-toggle-btn" 
                onClick={toggleTheme}
                title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
                aria-label="Toggle theme"
              >
                {isDark ? '☀️' : '🌙'}
              </button>
            </div>

            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '2rem', marginTop: '-1.25rem' }}>
              Enter your credentials to secure your workspace portal.
            </p>

            {authError && (
              <div 
                style={{ 
                  background: 'rgba(239, 68, 68, 0.08)', 
                  border: '1px solid rgba(239, 68, 68, 0.2)', 
                  borderRadius: '12px', 
                  padding: '0.75rem 1rem', 
                  fontSize: '0.825rem', 
                  color: '#ef4444', 
                  marginBottom: '1.5rem', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.5rem',
                  animation: 'slideInUp 0.25s ease'
                }}
              >
                <span>🚫</span>
                <strong>{authError}</strong>
              </div>
            )}

            {/* Username Input Field */}
            <div className="login-form-group">
              <label htmlFor="login-username" className="login-label">
                Email or Phone Number
              </label>
              <div className="login-input-container">
                <input
                  id="login-username"
                  type="text"
                  className={`login-input ${usernameError ? 'is-invalid' : ''}`}
                  placeholder="Enter Email or Phone Number"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    if (usernameTouched) setUsernameTouched(true);
                    setAuthError('');
                  }}
                  onBlur={() => setUsernameTouched(true)}
                  disabled={isLoading}
                  autoComplete="username"
                  required
                />
                {usernameTouched && username !== '' && (
                  <span 
                    className="login-field-icon" 
                    style={{ color: isUsernameValid ? '#22c55e' : '#ef4444' }}
                    title={isUsernameValid ? "Valid Input Format" : "Invalid Input Format"}
                  >
                    {isUsernameValid ? '✓' : '⚠'}
                  </span>
                )}
              </div>
              {usernameError && (
                <div className="login-error-container">
                  <span>⚠️</span>
                  <span>{usernameError}</span>
                </div>
              )}
            </div>

            {/* Password Input Field */}
            <div className="login-form-group">
              <label htmlFor="login-password" className="login-label">
                Password
              </label>
              <div className="login-input-container">
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  className={`login-input ${passwordError ? 'is-invalid' : ''}`}
                  placeholder="Enter Password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (passwordTouched) setPasswordTouched(true);
                    setAuthError('');
                  }}
                  onBlur={() => setPasswordTouched(true)}
                  disabled={isLoading}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className="login-field-icon"
                  onClick={() => setShowPassword(prev => !prev)}
                  title={showPassword ? "Hide Password" : "Show Password"}
                  disabled={isLoading}
                  style={{ cursor: 'pointer' }}
                >
                  {showPassword ? '👁️' : '🙈'}
                </button>
              </div>
              {passwordError && (
                <div className="login-error-container">
                  <span>⚠️</span>
                  <span>{passwordError}</span>
                </div>
              )}
            </div>

            {/* Remember Me and Forgot Password Container */}
            <div className="login-actions-row">
              <label className="login-checkbox-label">
                <input
                  type="checkbox"
                  className="login-checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={isLoading}
                />
                <span>Remember Me</span>
              </label>
              <a 
                href="#forgot" 
                className="login-forgot-link"
                onClick={(e) => {
                  e.preventDefault();
                  alert("Password recovery coordinates have been sent to your security key paths!");
                }}
              >
                Forgot Password?
              </a>
            </div>

            {/* Submit Action Button */}
            <button
              type="submit"
              className="login-submit-btn"
              disabled={!isFormValid || isLoading}
            >
              {isLoading ? (
                <>
                  <div className="login-spinner" />
                  <span>Verifying Portal Access...</span>
                </>
              ) : (
                <span>Access Workspace</span>
              )}
            </button>
          </form>
        ) : (
          /* Authentication Success Screen */
          <div className="login-success-card">
            <div className="login-success-icon-container">
              ✓
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem', color: isDark ? '#38bdf8' : 'var(--primary)' }}>
              Portal Access Granted!
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '2rem' }}>
              Welcome back! Loading custom document preparation suites...
            </p>
            <div 
              className="login-spinner" 
              style={{ 
                margin: '0 auto 2rem', 
                borderColor: isDark ? 'rgba(56, 189, 248, 0.2)' : 'rgba(2, 132, 199, 0.2)',
                borderTopColor: isDark ? '#38bdf8' : 'var(--primary)',
                width: '32px',
                height: '32px',
                borderWidth: '3px'
              }} 
            />
            <button
              onClick={() => router.push('/?tab=builder')}
              className="login-submit-btn"
              style={{ maxWidth: '240px', margin: '0 auto' }}
            >
              Enter Workspace Now
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
