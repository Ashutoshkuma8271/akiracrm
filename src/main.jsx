import React, { StrictMode, Component } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Akira CRM Error:', error, errorInfo);
  }

  handleReset = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch (e) {
      console.warn(e);
    }
    window.location.href = window.location.origin + window.location.pathname;
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          background: '#FAF8F4',
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          padding: '24px',
          textAlign: 'center',
          color: '#0F1E17'
        }}>
          <div style={{
            background: '#FFFFFF',
            border: '1px solid #E8E4D9',
            borderRadius: '16px',
            padding: '36px',
            maxWidth: '520px',
            boxShadow: '0 8px 30px rgba(0,0,0,0.08)'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: '#0B2B1B',
              margin: '0 auto 16px',
              display: 'grid',
              placeItems: 'center'
            }}>
              <svg viewBox="0 0 100 100" width="28" height="28">
                <circle cx="50" cy="50" r="48" fill="#0B2B1B" />
                <path d="M35 65 C30 45 45 30 65 35 C65 55 50 70 35 65 Z" fill="#22C55E" />
                <path d="M35 65 L60 40" stroke="#FAF7F0" strokeWidth="4" strokeLinecap="round" />
              </svg>
            </div>
            <h2 style={{ fontSize: '22px', marginBottom: '8px', color: '#071F13', fontFamily: "'Playfair Display', serif" }}>
              Akira Fresh CRM
            </h2>
            <p style={{ fontSize: '13px', color: '#64748B', marginBottom: '24px', lineHeight: 1.5 }}>
              Tap <strong>"Reset Demo Cache"</strong> below to refresh your live Cold-Chain CRM dashboard.
            </p>
            {this.state.error && (
              <pre style={{
                background: '#FFF1F2',
                border: '1px solid #FECDD3',
                color: '#991B1B',
                padding: '10px',
                borderRadius: '8px',
                fontSize: '11px',
                textAlign: 'left',
                overflowX: 'auto',
                marginBottom: '20px'
              }}>
                {this.state.error.message || String(this.state.error)}
              </pre>
            )}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                onClick={this.handleReset}
                style={{
                  background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                  color: '#FFFFFF',
                  border: 0,
                  padding: '11px 24px',
                  borderRadius: '8px',
                  fontWeight: '700',
                  fontSize: '13px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(16,185,129,0.3)'
                }}
              >
                Reset Demo Cache & Load UI
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>
);
