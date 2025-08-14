// components/superadmin/SuperAdminGuard.jsx
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Spin } from 'antd';
import { isSuperAdminAuthenticated } from '../../utils/superAdminAuth';

const SuperAdminGuard = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Set client-side flag
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const checkAuth = async () => {
      try {
        if (!isSuperAdminAuthenticated()) {
          await router.push('/superadmin/login');
          return;
        }
        setLoading(false);
      } catch (error) {
        console.error('Super admin auth check error:', error);
        await router.push('/superadmin/login');
      }
    };

    checkAuth();
  }, [router, isClient]);

  // Show loading on server-side and during auth check
  if (!isClient || loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)'
      }}>
        <Spin size="large" />
      </div>
    );
  }

  return <>{children}</>;
};

export default SuperAdminGuard;