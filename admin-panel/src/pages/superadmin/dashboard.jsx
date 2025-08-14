// src/pages/superadmin/dashboard.jsx
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Spin } from 'antd';
import SuperAdminLayout from '../../components/superadmin/SuperAdminLayout';
import { 
  Typography, 
  Card, 
  Row, 
  Col, 
  Statistic, 
  Button, 
  Table, 
  Tag, 
  Progress,
  Alert,
  Space
} from 'antd';
import { 
  UserOutlined, 
  TeamOutlined, 
  SecurityScanOutlined, 
  BankOutlined,
  PlusOutlined,
  EyeOutlined,
  WarningOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

const SuperAdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Check authentication
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('superAdminToken');
      const user = localStorage.getItem('superAdminUser');
      
      if (!token || !user) {
        router.push('/superadmin/login');
        return;
      }
      
      setLoading(false);
    }
  }, [router]);

  // Mock data for admin users
  const recentAdminUsers = [
    {
      key: '1',
      name: 'John Administrator',
      role: 'Admin',
      department: 'Land Registry',
      status: 'active',
      lastLogin: '2025-08-14 09:30 AM'
    },
    {
      key: '2',
      name: 'Sarah Manager',
      role: 'Manager', 
      department: 'Motor Traffic',
      status: 'active',
      lastLogin: '2025-08-14 08:45 AM'
    },
    {
      key: '3',
      name: 'Mike Officer',
      role: 'Officer',
      department: 'Immigration',
      status: 'inactive',
      lastLogin: '2025-08-13 04:20 PM'
    }
  ];

  const columns = [
    {
      title: 'Admin User',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <Text strong>{text}</Text>
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role) => {
        const colors = { Admin: 'red', Manager: 'blue', Officer: 'green' };
        return <Tag color={colors[role]}>{role}</Tag>;
      }
    },
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department'
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'active' ? 'success' : 'warning'}>
          {status.toUpperCase()}
        </Tag>
      )
    },
    {
      title: 'Last Login',
      dataIndex: 'lastLogin',
      key: 'lastLogin'
    },
    {
      title: 'Actions',
      key: 'actions',
      render: () => (
        <Button type="text" icon={<EyeOutlined />} size="small">
          View
        </Button>
      )
    }
  ];

  if (loading) {
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

  return (
    <SuperAdminLayout pageTitle="Super Admin Dashboard">
      <div>
        <div style={{ marginBottom: '24px' }}>
          <Title level={2} style={{ margin: 0, color: '#1e3c72' }}>
            Super Administrator Dashboard
          </Title>
          <Paragraph style={{ marginTop: '8px', color: '#666' }}>
            Complete system overview and administrative control panel for government services portal.
          </Paragraph>
        </div>

        {/* System Alert */}
        <Alert
          message="System Status: All Services Operational"
          description="All government service portals are running smoothly. No critical issues detected."
          type="success"
          icon={<CheckCircleOutlined />}
          showIcon
          closable
          style={{ marginBottom: '24px' }}
        />

        {/* Statistics Cards */}
        <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Total Admin Users"
                value={28}
                prefix={<UserOutlined />}
                valueStyle={{ color: '#1890ff' }}
                suffix="Active"
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Government Departments"
                value={12}
                prefix={<BankOutlined />}
                valueStyle={{ color: '#52c41a' }}
                suffix="Connected"
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Security Roles"
                value={5}
                prefix={<SecurityScanOutlined />}
                valueStyle={{ color: '#722ed1' }}
                suffix="Defined"
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="System Health"
                value={98.5}
                precision={1}
                valueStyle={{ color: '#389e0d' }}
                suffix="%"
              />
            </Card>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          {/* Recent Admin Users */}
          <Col xs={24} lg={16}>
            <Card 
              title="Recent Admin Users" 
              extra={
                <Button 
                  type="primary" 
                  icon={<PlusOutlined />}
                  onClick={() => router.push('/superadmin/users')}
                >
                  Add New User
                </Button>
              }
            >
              <Table
                columns={columns}
                dataSource={recentAdminUsers}
                pagination={false}
                size="middle"
              />
            </Card>
          </Col>

          {/* Quick Actions & System Info */}
          <Col xs={24} lg={8}>
            <Space direction="vertical" style={{ width: '100%' }} size="middle">
              {/* Quick Actions */}
              <Card title="Quick Actions" size="small">
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Button 
                    block 
                    icon={<UserOutlined />}
                    onClick={() => router.push('/superadmin/users')}
                  >
                    Create Admin User
                  </Button>
                  <Button 
                    block 
                    icon={<BankOutlined />}
                    onClick={() => router.push('/superadmin/departments')}
                  >
                    Add Department
                  </Button>
                  <Button 
                    block 
                    icon={<SecurityScanOutlined />}
                    onClick={() => router.push('/superadmin/roles')}
                  >
                    Manage Roles
                  </Button>
                </Space>
              </Card>

              {/* System Performance */}
              <Card title="System Performance" size="small">
                <div style={{ marginBottom: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <Text style={{ fontSize: 12 }}>CPU Usage</Text>
                    <Text style={{ fontSize: 12 }}>45%</Text>
                  </div>
                  <Progress percent={45} size="small" />
                </div>
                <div style={{ marginBottom: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <Text style={{ fontSize: 12 }}>Memory Usage</Text>
                    <Text style={{ fontSize: 12 }}>62%</Text>
                  </div>
                  <Progress percent={62} size="small" status="active" />
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <Text style={{ fontSize: 12 }}>Database Health</Text>
                    <Text style={{ fontSize: 12 }}>95%</Text>
                  </div>
                  <Progress percent={95} size="small" />
                </div>
              </Card>

              {/* Security Status */}
              <Card title="Security Status" size="small">
                <Space direction="vertical" style={{ width: '100%' }} size="small">
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text style={{ fontSize: 12 }}>Failed Login Attempts:</Text>
                    <Text style={{ fontSize: 12, color: '#ff4d4f' }}>3</Text>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text style={{ fontSize: 12 }}>Active Sessions:</Text>
                    <Text style={{ fontSize: 12, color: '#52c41a' }}>15</Text>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text style={{ fontSize: 12 }}>Last Security Scan:</Text>
                    <Text style={{ fontSize: 12 }}>2 hours ago</Text>
                  </div>
                </Space>
              </Card>
            </Space>
          </Col>
        </Row>
      </div>
    </SuperAdminLayout>
  );
};

export default SuperAdminDashboard;