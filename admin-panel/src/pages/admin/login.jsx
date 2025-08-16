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
import { authAPI, handleAPIError } from '../../utils/api';

const { Title, Text } = Typography;

const AdminLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form] = Form.useForm();
  const router = useRouter();

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
      
      // Call the authentication API
      const response = await authAPI.login({ username, password });
      
      if (response.success) {
        // Store user data and token
        const { user, token } = response.data;
        
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
        localStorage.setItem(TOKEN_STORAGE_KEY, token);

        message.success('Login successful!');
        
        // Small delay to show success message
        setTimeout(() => {
          router.push('/admin/dashboard');
        }, 500);
      } else {
        setError(response.message || 'Invalid username or password. Please try again.');
      }
    } catch (err) {
      handleAPIError(err);
      
      // Handle specific error messages
      if (err.message.includes('401') || err.message.includes('Unauthorized')) {
        setError('Invalid username or password. Please try again.');
      } else if (err.message.includes('403') || err.message.includes('Forbidden')) {
        setError('Your account has been disabled. Please contact the system administrator.');
      } else if (err.message.includes('404') || err.message.includes('Not Found')) {
        setError('User not found. Please check your username.');
      } else if (err.message.includes('429') || err.message.includes('Too Many Requests')) {
        setError('Too many login attempts. Please try again later.');
      } else if (err.message.includes('500') || err.message.includes('Internal Server Error')) {
        setError('Server error. Please try again later or contact support.');
      } else if (err.message.includes('Network') || err.message.includes('fetch')) {
        setError('Network error. Please check your internet connection.');
      } else {
        setError('Login failed. Please try again.');
      }
      
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSuperAdminAccess = () => {
    router.push('/superadmin/login');
  };

  const handleForgotPassword = () => {
    message.info('Please contact your system administrator to reset your password.');
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
                    { required: true, message: 'Please enter your username' },
                    { min: 3, message: 'Username must be at least 3 characters' }
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
                    { required: true, message: 'Please enter your password' },
                    { min: 6, message: 'Password must be at least 6 characters' }
                  ]}
                >
                  <Input.Password
                    prefix={<LockOutlined />}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    disabled={loading}
                  />
                </Form.Item>

                <Form.Item style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Button 
                      type="link" 
                      onClick={handleForgotPassword}
                      style={{ padding: 0, fontSize: '14px' }}
                      disabled={loading}
                    >
                      Forgot Password?
                    </Button>
                  </div>
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

              {/* Connection Status */}
              <div style={{ 
                marginTop: '32px', 
                padding: '16px', 
                background: '#f8f9fa', 
                borderRadius: '8px',
                border: '1px solid #e9ecef',
                textAlign: 'center'
              }}>
                <Text style={{ fontSize: '12px', color: '#666' }}>
                  🔒 Secure connection established
                </Text>
              </div>
            </Card>

            {/* Footer */}
            <div style={{ textAlign: 'center', marginTop: '24px' }}>
              <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: '12px' }}>
                Government Services Portal © 2025
              </Text>
              <br />
              <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: '11px' }}>
                Powered by Ministry of Digital Technology
              </Text>
            </div>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default AdminLogin;