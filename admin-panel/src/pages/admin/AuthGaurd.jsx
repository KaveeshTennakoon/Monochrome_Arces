import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Spin } from 'antd';
import { isAuthenticated } from '../../utils/auth';

const AuthGuard = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      if (!isAuthenticated()) {
        router.push('/admin/login');
        return;
      }
      setLoading(false);
    };

    checkAuth();
  }, [router]);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: '#f5f5f5'
      }}>
        <Spin size="large" />
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthGuard;
