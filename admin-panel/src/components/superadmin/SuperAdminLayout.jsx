// components/superadmin/SuperAdminLayout.jsx
import React, { useState, useEffect } from 'react';
import { Layout, Menu, Avatar, Dropdown, Typography, Space, Button, Badge } from 'antd';
import {
  DashboardOutlined,
  TeamOutlined,
  SettingOutlined,
  UserOutlined,
  LogoutOutlined,
  CrownOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  AuditOutlined,
  SecurityScanOutlined,
  BankOutlined,
  UsergroupAddOutlined
} from '@ant-design/icons';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { getCurrentSuperAdmin, superAdminLogout } from '../../utils/superAdminAuth';

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;

const SuperAdminLayout = ({ children, pageTitle = "Super Admin Dashboard" }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const user = getCurrentSuperAdmin();
    setCurrentUser(user);
  }, []);

  // Super Admin Menu Items
  const menuItems = [
    {
      key: '/superadmin/dashboard',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
    },
    {
      key: '/superadmin/users',
      icon: <UsergroupAddOutlined />,
      label: 'User Management',
    },
    {
      key: '/superadmin/departments',
      icon: <BankOutlined />,
      label: 'Government Departments',
    },
    {
      key: '/superadmin/roles',
      icon: <SecurityScanOutlined />,
      label: 'Roles & Permissions',
    },
    {
      key: '/superadmin/audit',
      icon: <AuditOutlined />,
      label: 'Audit Logs',
    },
    {
      key: '/superadmin/settings',
      icon: <SettingOutlined />,
      label: 'System Settings',
    },
  ];

  // Super Admin profile dropdown menu
  const adminMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Profile Settings',
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      danger: true,
    },
  ];

  const handleMenuClick = ({ key }) => {
    if (key === 'logout') {
      superAdminLogout();
    } else if (key === 'profile') {
      router.push('/superadmin/profile');
    }
  };

  const handleSidebarMenuClick = ({ key }) => {
    router.push(key);
  };

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  return (
    <>
      <Head>
        <title>{pageTitle} - Super Admin Portal</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      
      <Layout style={{ minHeight: '100vh' }}>
        {/* Sidebar */}
        <Sider 
          trigger={null} 
          collapsible 
          collapsed={collapsed}
          width={250}
          style={{
            background: 'linear-gradient(180deg, #1e3c72 0%, #2a5298 100%)',
            boxShadow: '2px 0 8px 0 rgba(29,35,41,.15)',
          }}
        >
          {/* Logo Section */}
          <div style={{ 
            padding: '16px', 
            textAlign: 'center',
            borderBottom: '1px solid rgba(255,255,255,0.1)'
          }}>
            {collapsed ? (
              <div style={{ 
                width: 32, 
                height: 32, 
                background: 'rgba(255,255,255,0.1)', 
                borderRadius: '8px',
                margin: '0 auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 'bold'
              }}>
                <CrownOutlined />
              </div>
            ) : (
              <div>
                <Title level={4} style={{ margin: 0, color: 'white' }}>
                  <CrownOutlined style={{ marginRight: 8 }} />
                  Super Admin
                </Title>
                <Text style={{ fontSize: '12px', color: 'rgba(255,255,255,0.8)' }}>
                  System Control Panel
                </Text>
              </div>
            )}
          </div>

          {/* Navigation Menu */}
          <Menu
            mode="inline"
            selectedKeys={[router.pathname]}
            style={{ 
              border: 'none', 
              paddingTop: '8px',
              background: 'transparent'
            }}
            theme="dark"
            items={menuItems}
            onClick={handleSidebarMenuClick}
          />
        </Sider>

        {/* Main Layout */}
        <Layout>
          {/* Header */}
          <Header style={{ 
            background: 'white', 
            padding: '0 24px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '3px solid #1e3c72'
          }}>
            {/* Left side - Collapse button */}
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Button
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={toggleCollapsed}
                style={{
                  fontSize: '16px',
                  width: 64,
                  height: 64,
                }}
              />
              <div style={{ marginLeft: 16 }}>
                <Text style={{ fontSize: '18px', fontWeight: 600, color: '#1e3c72' }}>
                  Super Administrator Portal
                </Text>
              </div>
            </div>

            {/* Right side - Profile */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              {/* System Status */}
              <Badge status="success" text="All Systems Operational" />

              {/* Super Admin Profile Dropdown */}
              <Dropdown
                menu={{
                  items: adminMenuItems,
                  onClick: handleMenuClick,
                }}
                placement="bottomRight"
                arrow
              >
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  cursor: 'pointer',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  transition: 'background-color 0.3s',
                  border: '2px solid #1e3c72'
                }}>
                  <Avatar 
                    size="default" 
                    icon={<CrownOutlined />} 
                    style={{ 
                      marginRight: '8px',
                      background: 'linear-gradient(135deg, #ff6b6b, #c44569)'
                    }}
                  />
                  <Space direction="vertical" size={0}>
                    <Text strong style={{ lineHeight: 1.2, color: '#1e3c72' }}>
                      {currentUser?.name || 'Super Administrator'}
                    </Text>
                    <Text type="secondary" style={{ fontSize: '12px', lineHeight: 1.2 }}>
                      System Controller
                    </Text>
                  </Space>
                </div>
              </Dropdown>
            </div>
          </Header>

          {/* Content Area */}
          <Content style={{
            margin: '24px',
            padding: '24px',
            background: '#fff',
            borderRadius: '12px',
            minHeight: 280,
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
            border: '1px solid #e8e8e8'
          }}>
            {children}
          </Content>
        </Layout>
      </Layout>
    </>
  );
};

export default SuperAdminLayout;