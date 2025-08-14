// src/pages/admin/login.jsx
import React, { useState, useEffect } from 'react';
import { 
  Form, 
  Input, 
  Button, 
  Card, 
  Typography, 
  Row, 
  Col, 
  Alert,
  Space,
  Divider,
  message
} from 'antd';
import { 
  UserOutlined, 
  LockOutlined, 
  LoginOutlined,
  BankOutlined,
  CrownOutlined
} from '@ant-design/icons';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { isAuthenticated, AUTH_STORAGE_KEY, TOKEN_STORAGE_KEY } from '../../utils/auth';

const { Title, Text } = Typography;

const AdminLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form] = Form.useForm();
  const router = useRouter();

  // Demo admin credentials
  const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: 'admin123'
  };

  // Check if already authenticated
  useEffect(() => {
    if (isAuthenticated()) {
      router.push('/admin/dashboard');
    }
  }, [router]);

  const handleLogin = async (values) => {
    setLoading(true);
    setError('');

    try {
      const { username, password } = values;
      
      // Validate credentials (in production, this would be an API call)
      if (username === ADMIN_CREDENTIALS.username && 
          password === ADMIN_CREDENTIALS.password) {
        
        // Create user session
        const userData = {
          id: 'admin001',
          name: 'System Administrator',
          username: username,
          email: 'admin@gov.lk',
          role: 'admin',
          department: 'Land Registry Department',
          permissions: ['appointments', 'services', 'users', 'analytics', 'settings'],
          loginTime: new Date().toISOString()
        };

        const token = 'admin-token-' + Date.now();

        // Store in localStorage
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userData));
        localStorage.setItem(TOKEN_STORAGE_KEY, token);

        message.success('Login successful!');
        
        // Small delay to show success message
        setTimeout(() => {
          router.push('/admin/dashboard');
        }, 500);
      } else {
        setError('Invalid username or password. Please try again.');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSuperAdminAccess = () => {
    router.push('/superadmin/login');
  };

  return (
    <>
      <Head>
        <title>Admin Login - Government Services Portal</title>
        <meta name="description" content="Admin access for Government Services Portal" />
      </Head>

      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}>
        <Row style={{ width: '100%', maxWidth: '1200px' }}>
          <Col xs={24} md={12} lg={8} style={{ margin: '0 auto' }}>
            <Card
              style={{
                boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                borderRadius: '16px',
                border: 'none'
              }}
              styles={{ body: { padding: '48px' } }}
            >
              {/* Header */}
              <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                <div style={{
                  width: 80,
                  height: 80,
                  background: 'linear-gradient(135deg, #667eea, #764ba2)',
                  borderRadius: '20px',
                  margin: '0 auto 20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)'
                }}>
                  <BankOutlined style={{ fontSize: '40px', color: 'white' }} />
                </div>
                <Title level={2} style={{ margin: 0, color: '#333' }}>
                  Government Portal
                </Title>
                <Text style={{ fontSize: '16px', color: '#666' }}>
                  Administrative Access
                </Text>
              </div>

              {/* Login Form */}
              <Form
                form={form}
                name="admin-login"
                onFinish={handleLogin}
                layout="vertical"
                size="large"
                autoComplete="off"
                initialValues={{ username: '', password: '' }}
              >
                {error && (
                  <Alert
                    message="Login Failed"
                    description={error}
                    type="error"
                    showIcon
                    closable
                    style={{ marginBottom: '24px' }}
                    onClose={() => setError('')}
                  />
                )}

                <Form.Item
                  name="username"
                  label="Username"
                  rules={[
                    { required: true, message: 'Please enter your username' }
                  ]}
                >
                  <Input
                    prefix={<UserOutlined />}
                    placeholder="Enter your username"
                    autoComplete="username"
                    disabled={loading}
                  />
                </Form.Item>

                <Form.Item
                  name="password"
                  label="Password"
                  rules={[
                    { required: true, message: 'Please enter your password' }
                  ]}
                >
                  <Input.Password
                    prefix={<LockOutlined />}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    disabled={loading}
                  />
                </Form.Item>

                <Form.Item style={{ marginBottom: '24px' }}>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    block
                    icon={<LoginOutlined />}
                    style={{ 
                      height: '48px', 
                      fontSize: '16px',
                      background: 'linear-gradient(135deg, #667eea, #764ba2)',
                      border: 'none'
                    }}
                  >
                    {loading ? 'Signing in...' : 'Sign In'}
                  </Button>
                </Form.Item>
              </Form>

              {/* Super Admin Access */}
              <Divider style={{ margin: '32px 0' }}>
                <Text style={{ color: '#999', fontSize: '12px' }}>Administrative Access</Text>
              </Divider>

              <Button
                type="default"
                block
                icon={<CrownOutlined />}
                onClick={handleSuperAdminAccess}
                style={{ 
                  height: '40px',
                  borderColor: '#ff6b6b',
                  color: '#ff6b6b'
                }}
                disabled={loading}
              >
                Super Admin Portal
              </Button>

              {/* Demo Credentials */}
              <div style={{ 
                marginTop: '32px', 
                padding: '20px', 
                background: '#f8f9fa', 
                borderRadius: '12px',
                border: '1px solid #e9ecef'
              }}>
                <Text strong style={{ fontSize: '12px', color: '#666' }}>
                  Demo Admin Credentials:
                </Text>
                <div style={{ fontSize: '11px', color: '#888', marginTop: '8px' }}>
                  <div>Username: <code>{ADMIN_CREDENTIALS.username}</code></div>
                  <div>Password: <code>{ADMIN_CREDENTIALS.password}</code></div>
                </div>
                <Text style={{ fontSize: '10px', color: '#999', marginTop: '8px', display: 'block' }}>
                  *For demo purposes only. In production, use secure authentication.
                </Text>
              </div>
            </Card>

            {/* Footer */}
            <div style={{ textAlign: 'center', marginTop: '24px' }}>
              <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: '12px' }}>
                Government Services Portal © 2025
              </Text>
            </div>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default AdminLogin;