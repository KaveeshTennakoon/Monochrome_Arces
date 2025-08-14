// src/pages/superadmin/login.jsx
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

// Super Admin Credentials
const CREDENTIALS = {
  username: 'superadmin',
  password: 'SuperAdmin@2025'
};

const SuperAdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  // Check if already authenticated
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('superAdminToken');
      if (token) {
        router.push('/superadmin/users');
      }
    }
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simple validation
    if (username === CREDENTIALS.username && password === CREDENTIALS.password) {
      // Store session
      localStorage.setItem('superAdminToken', 'super-admin-token-' + Date.now());
      localStorage.setItem('superAdminUser', JSON.stringify({
        id: 'superadmin',
        name: 'Super Administrator',
        role: 'superadmin'
      }));

      alert('Login successful!');
      router.push('/superadmin/users');
    } else {
      setError('Invalid credentials');
    }
    
    setLoading(false);
  };

  const goBackToAdmin = () => {
    router.push('/admin/login');
  };

  return (
    <>
      <Head>
        <title>Super Admin Login</title>
      </Head>
      
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}>
        <div style={{
          background: 'white',
          padding: '40px',
          borderRadius: '12px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
          width: '100%',
          maxWidth: '400px'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <div style={{
              width: '60px',
              height: '60px',
              background: '#1e3c72',
              borderRadius: '12px',
              margin: '0 auto 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '24px'
            }}>
              👑
            </div>
            <h1 style={{ margin: 0, color: '#1e3c72' }}>Super Admin Portal</h1>
            <p style={{ color: '#666', margin: '8px 0 0' }}>System Administration Access</p>
          </div>

          <div style={{
            background: '#fff3cd',
            border: '1px solid #ffeaa7',
            borderRadius: '6px',
            padding: '12px',
            marginBottom: '24px'
          }}>
            <strong>⚠️ Restricted Access</strong>
            <br />
            <small>This area is restricted to authorized super administrators only.</small>
          </div>

          <form onSubmit={handleSubmit}>
            {error && (
              <div style={{
                background: '#f8d7da',
                color: '#721c24',
                padding: '12px',
                borderRadius: '6px',
                marginBottom: '16px',
                border: '1px solid #f5c6cb'
              }}>
                {error}
              </div>
            )}

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  fontSize: '14px'
                }}
                placeholder="Enter username"
                required
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  fontSize: '14px'
                }}
                placeholder="Enter password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '14px',
                background: loading ? '#ccc' : 'linear-gradient(135deg, #1e3c72, #2a5298)',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '16px',
                fontWeight: '500',
                cursor: loading ? 'not-allowed' : 'pointer',
                marginBottom: '16px'
              }}
            >
              {loading ? 'Authenticating...' : 'Access Super Admin Portal'}
            </button>
          </form>

          <div style={{ textAlign: 'center' }}>
            <button
              onClick={goBackToAdmin}
              style={{
                background: 'none',
                border: 'none',
                color: '#666',
                textDecoration: 'underline',
                cursor: 'pointer'
              }}
            >
              ← Back to Regular Admin Login
            </button>
          </div>

          <div style={{
            marginTop: '24px',
            padding: '16px',
            background: '#f8f9fa',
            borderRadius: '6px',
            fontSize: '12px'
          }}>
            <strong>Demo Credentials:</strong>
            <br />
            Username: <code>{CREDENTIALS.username}</code>
            <br />
            Password: <code>{CREDENTIALS.password}</code>
          </div>
        </div>
      </div>
    </>
  );
};

export default SuperAdminLogin;