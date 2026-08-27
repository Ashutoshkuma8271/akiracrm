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
    console.error('CRM Boundary Error:', error, errorInfo);
  }

  handleReset = () => {
    try {
      localStorage.clear();
    } catch (e) {
      console.warn(e);
    }
    window.location.reload();
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
          fontFamily: 'sans-serif',
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
            <h2 style={{ fontSize: '24px', marginBottom: '12px', color: '#071F13' }}>
              Akira Fresh CRM
            </h2>
            <p style={{ fontSize: '14px', color: '#64748B', marginBottom: '24px', lineHeight: 1.5 }}>
              A temporary display glitch occurred. Tap below to reload your enterprise dashboard.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                onClick={() => window.location.reload()}
                style={{
                  background: '#10B981',
                  color: '#FFFFFF',
                  border: 0,
                  padding: '10px 20px',
                  borderRadius: '8px',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                Reload Page
              </button>
              <button
                onClick={this.handleReset}
                style={{
                  background: '#FFFFFF',
                  color: '#EF4444',
                  border: '1px solid #FECDD3',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                Reset Demo Cache
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
