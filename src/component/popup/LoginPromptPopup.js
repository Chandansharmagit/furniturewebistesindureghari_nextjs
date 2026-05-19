import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import './LoginPromptPopup.css';

const LoginPromptPopup = ({ isOpen, onClose }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 300);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const result = await login({ email, password });
      if (result && result.success) {
        setSuccess(true);
        setTimeout(() => {
          handleClose();
        }, 1600);
      } else {
        setError(result?.error || 'Invalid credentials. Please verify your email and password.');
      }
    } catch (err) {
      setError('A connection error occurred. Please check your network and try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={`login-prompt-overlay ${isClosing ? 'closing' : ''}`} onClick={handleClose}>
      <div className="login-prompt-popup" onClick={(e) => e.stopPropagation()}>
        
        {/* Close Button */}
        <button className="login-prompt-close-btn" onClick={handleClose} aria-label="Close Dialog">
          ×
        </button>

        {/* Sidebar Info - Compact & Premium */}
        <div className="login-prompt-sidebar">
          <div className="welcome-decoration">
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" fill="#d4af37"/>
              <path d="M12 14C7.58172 14 4 17.5817 4 22H20C20 17.5817 16.4183 14 12 14Z" fill="#d4af37"/>
            </svg>
          </div>
          <div className="welcome-text">
            <h3>Royal Lounge</h3>
            <p>Traditional... bonded with love</p>
          </div>
        </div>

        {/* Credentials Form Container */}
        <div className="login-prompt-content">
          <div className="mb-4">
            <span className="text-[#d4af37] font-semibold text-[10px] tracking-[0.2em] uppercase block mb-1">
              BISHWOKARMA MEMBERSHIP
            </span>
            <h2 className="text-xl md:text-2xl font-serif font-bold text-[#2c3e50] m-0">
              Sign In Directly
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 my-2">
            
            {/* Email Field */}
            <div className="flex flex-col gap-1.5 text-left">
              <label htmlFor="popup-email" className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="popup-email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. Shyam@example.com"
                  className="w-full border border-stone-200 focus:border-[#d4af37] outline-none rounded-xl px-4 py-3 text-stone-700 text-xs transition-all bg-stone-50/20"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="flex flex-col gap-1.5 text-left">
              <label htmlFor="popup-password" className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">
                Secret Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  id="popup-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full border border-stone-200 focus:border-[#d4af37] outline-none rounded-xl px-4 py-3 text-stone-700 text-xs transition-all bg-stone-50/20"
                  required
                />
              </div>
            </div>

            {/* Dynamic Error State */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-100 text-red-700 rounded-xl text-xs text-left animate-shake flex items-start gap-2">
                <span>⚠️</span>
                <span>{error}</span>
              </div>
            )}

            {/* Dynamic Success State */}
            {success && (
              <div className="p-3 bg-emerald-50 border border-emerald-100 text-emerald-800 rounded-xl text-xs text-left flex items-start gap-2">
                <span>✨</span>
                <span><strong>Access Granted!</strong> Welcome to Bishwokarma Luxury Lounge. Synchronizing secure profile details...</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col gap-3">
              <button
                type="submit"
                disabled={loading || success}
                className="w-full bg-[#2c3e50] hover:bg-[#1a252f] text-white font-semibold py-3.5 rounded-xl transition-all duration-300 shadow-md flex items-center justify-center gap-2 hover:shadow-lg disabled:opacity-75 text-xs uppercase tracking-wider cursor-pointer"
              >
                {loading ? 'Verifying Credentials...' : 'Sign In Now'}
              </button>
            </div>

          </form>

          {/* Prompt Footer Links */}
          <div className="login-prompt-footer mt-4 flex items-center justify-between text-xs text-stone-400">
            <a 
              href="/register" 
              onClick={() => handleClose()} 
              className="text-[#d4af37] font-semibold hover:underline"
            >
              Create Free Account
            </a>
            <button 
              type="button"
              onClick={handleClose} 
              className="continue-browsing text-stone-500 hover:text-red-500 transition-colors"
            >
              Browse as Guest
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default LoginPromptPopup;