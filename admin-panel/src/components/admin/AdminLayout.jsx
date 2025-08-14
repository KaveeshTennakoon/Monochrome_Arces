// components/admin/AdminLayout.jsx
import React, { useState } from 'react';
import { Layout, Menu, Avatar, Dropdown, Typography, Space, Button, Badge } from 'antd';
import {
  DashboardOutlined,
  CalendarOutlined,
  TeamOutlined,
  SettingOutlined,
  UserOutlined,
  LogoutOutlined,
  BellOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  FileTextOutlined,
  BarChartOutlined,
  BankOutlined
} from '@ant-design/icons';
import { useRouter } from 'next/router';

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;

const AdminLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const router = useRouter();

  // Menu items for sidebar
  const menuItems = [
    {
      key: '/admin/dashboard',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
    },
    {
      key: '/admin/appointments',
      icon: <CalendarOutlined />,
      label: 'Appointments',
    },
    {
      key: '/admin/calendar',
      icon: <CalendarOutlined />,
      label: 'Calendar View',
    },
    {
      key: '/admin/services',
      icon: <BankOutlined />,
      label: 'Services',
    },
    {
      key: '/admin/users',
      icon: <TeamOutlined />,
      label: 'Users Management',
      children: [
        {
          key: '/admin/users/citizens',
          label: 'Citizens',
        },
        {
          key: '/admin/users/officers',
          label: 'Officers',
        },
      ],
    },
    {
      key: '/admin/analytics',
      icon: <BarChartOutlined />,
      label: 'Analytics & Reports',
    },
    {
      key: '/admin/settings',
      icon: <SettingOutlined />,
      label: 'System Settings',
    },
  ];

  // Admin profile dropdown menu
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
      // Handle logout logic here
      console.log('Logout clicked');
      // router.push('/admin/login');
    } else if (key === 'profile') {
      router.push('/admin/profile');
    }
  };

  const handleSidebarMenuClick = ({ key }) => {
    router.push(key);
  };

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Sidebar */}
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed}
        width={250}
        style={{
          background: '#fff',
          boxShadow: '2px 0 8px 0 rgba(29,35,41,.05)',
        }}
      >
        {/* Logo Section */}
        <div style={{ 
          padding: '16px', 
          textAlign: 'center',
          borderBottom: '1px solid #f0f0f0'
        }}>
          {collapsed ? (
            <div style={{ 
              width: 32, 
              height: 32, 
              background: '#1890ff', 
              borderRadius: '6px',
              margin: '0 auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold'
            }}>
              G
            </div>
          ) : (
            <div>
              <Title level={4} style={{ margin: 0, color: '#1890ff' }}>
                Gov Portal
              </Title>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                Admin Dashboard
              </Text>
            </div>
          )}
        </div>

        {/* Navigation Menu */}
        <Menu
          mode="inline"
          selectedKeys={[router.pathname]}
          style={{ border: 'none', paddingTop: '8px' }}
          items={menuItems}
          onClick={handleSidebarMenuClick}
        />
      </Sider>

      {/* Main Layout */}
      <Layout>
        {/* Header */}
        <Header style={{ 
          background: '#fff', 
          padding: '0 24px',
          boxShadow: '0 1px 4px rgba(0,21,41,.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
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
          </div>

          {/* Right side - Notifications and Profile */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {/* Notifications */}
            <Badge count={5}>
              <Button 
                type="text" 
                shape="circle" 
                icon={<BellOutlined style={{ fontSize: '18px' }} />}
                size="large"
              />
            </Badge>

            {/* Admin Profile Dropdown */}
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
                borderRadius: '6px',
                transition: 'background-color 0.3s'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#f5f5f5'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
              >
                <Avatar 
                  size="default" 
                  icon={<UserOutlined />} 
                  style={{ marginRight: '8px' }}
                />
                <Space direction="vertical" size={0}>
                  <Text strong style={{ lineHeight: 1.2 }}>
                    Admin User
                  </Text>
                  <Text type="secondary" style={{ fontSize: '12px', lineHeight: 1.2 }}>
                    System Administrator
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
          borderRadius: '8px',
          minHeight: 280,
          boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02)'
        }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;