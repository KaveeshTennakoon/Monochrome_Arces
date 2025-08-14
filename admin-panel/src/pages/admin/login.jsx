import React, { useState } from 'react';
import { 
  Form, 
  Input, 
  Button, 
  Card, 
  Typography, 
  Row, 
  Col, 
  Space,
  Alert,
  Checkbox,
  Divider
} from 'antd';
import { 
  UserOutlined, 
  LockOutlined, 
  LoginOutlined,
  SafetyOutlined,
  BankOutlined
} from '@ant-design/icons';
import { useRouter } from 'next/router';
import Head from 'next/head';

const { Title, Text, Paragraph } = Typography;

const AdminLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form] = Form.useForm();
  const router = useRouter();

  const handleLogin = async (values) => {
    setLoading(true);
    setError('');

    try {
      // Simulate API call - Replace with actual authentication logic
      console.log('Login attempt:', values);
      
      // Mock authentication logic - Replace with real API call
      const { username, password } = values;
      
      // Simulate different user roles and credentials
      const mockUsers = [
        {
          username: 'admin',
          password: 'admin123',
          role: 'admin',
          name: 'Admin User',
          permissions: ['appointments', 'services', 'users', 'analytics']
        },
        {
          username: 'officer1',
          password: 'officer123',
          role: 'officer',
          name: 'Government Officer',
          permissions: ['appointments', 'services']
        },
        {
          username: 'manager',
          password: 'manager123',
          role: 'manager',
          name: 'Department Manager',
          permissions: ['appointments', 'services', 'analytics']
        }
      ];

      // Find matching user
      const user = mockUsers.find(u => u.username === username && u.password === password);

      if (user) {
        // Store user data in localStorage (in production, use secure token management)
        localStorage.setItem('adminUser', JSON.stringify({
          id: user.username,
          name: user.name,
          role: user.role,
          permissions: user.permissions,
          loginTime: new Date().toISOString()
        }));

        // Store authentication token (mock)
        localStorage.setItem('adminToken', 'mock-jwt-token-' + Date.now());

        // Redirect to dashboard
        router.push('/admin/dashboard');
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

  const handleSuperAdminRedirect = () => {
    router.push('/superadmin/login');
  };

  return (
    <>
      <Head>
        <title>Admin Login - Government Services Portal</title>
        <meta name="description" content="Admin login for Government Services Portal" />
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
                borderRadius: '12px',
                border: 'none'
              }}
              bodyStyle={{ padding: '40px' }}
            >
              {/* Header */}
              <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                <div style={{
                  width: 64,
                  height: 64,
                  background: '#1890ff',
                  borderRadius: '12px',
                  margin: '0 auto 16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <BankOutlined style={{ fontSize: '32px', color: 'white' }} />
                </div>
                <Title level={2} style={{ margin: 0, color: '#1890ff' }}>
                  Government Portal
                </Title>
                <Text type="secondary" style={{ fontSize: '16px' }}>
                  Admin Dashboard Login
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
              >
                {error && (
                  <Alert
                    message={error}
                    type="error"
                    showIcon
                    style={{ marginBottom: '24px' }}
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
                  />
                </Form.Item>

                <Form.Item>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Form.Item name="remember" valuePropName="checked" noStyle>
                      <Checkbox>Remember me</Checkbox>
                    </Form.Item>
                    <Button type="link" style={{ padding: 0 }}>
                      Forgot password?
                    </Button>
                  </div>
                </Form.Item>

                <Form.Item style={{ marginBottom: '16px' }}>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    block
                    icon={<LoginOutlined />}
                    style={{ height: '48px', fontSize: '16px' }}
                  >
                    {loading ? 'Signing In...' : 'Sign In'}
                  </Button>
                </Form.Item>
              </Form>

              <Divider>
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  Administrative Access
                </Text>
              </Divider>

              {/* Super Admin Access */}
              <div style={{ textAlign: 'center' }}>
                <Button
                  type="link"
                  icon={<SafetyOutlined />}
                  onClick={handleSuperAdminRedirect}
                  style={{ padding: 0 }}
                >
                  Super Admin Access
                </Button>
              </div>

              {/* Demo Credentials */}
              <div style={{ 
                marginTop: '24px', 
                padding: '16px', 
                background: '#f5f5f5', 
                borderRadius: '8px',
                border: '1px solid #e8e8e8'
              }}>
                <Text strong style={{ fontSize: '12px', color: '#666' }}>
                  Demo Credentials:
                </Text>
                <div style={{ fontSize: '11px', color: '#888', marginTop: '4px' }}>
                  <div>Admin: <code>admin / admin123</code></div>
                  <div>Officer: <code>officer1 / officer123</code></div>
                  <div>Manager: <code>manager / manager123</code></div>
                </div>
              </div>
            </Card>

            {/* Footer */}
            <div style={{ textAlign: 'center', marginTop: '24px' }}>
              <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: '12px' }}>
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