import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { Spin } from 'antd';
import { isAuthenticated } from '../utils/auth';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    if (isAuthenticated()) {
      // Redirect to admin dashboard if authenticated
      router.push('/admin/dashboard');
    } else {
      // Redirect to login if not authenticated
      router.push('/admin/login');
    }
  }, [router]);

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh' 
    }}>
      <Spin size="large" />
    </div>
  );
}