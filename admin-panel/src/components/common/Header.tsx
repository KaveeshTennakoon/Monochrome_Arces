'use client';

import { Layout, Button, Dropdown, Avatar, Space, Typography } from 'antd';
import { UserOutlined, LogoutOutlined, SettingOutlined } from '@ant-design/icons';
import { useAuth } from '@/hooks/useAuth';
import type { MenuProps } from 'antd';

const { Header: AntHeader } = Layout;
const { Text } = Typography;

export default function Header() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Profile Settings',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'System Settings',
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: handleLogout,
    },
  ];

  return (
    <AntHeader className="bg-white shadow-sm px-6 flex justify-between items-center">
      <div className="flex items-center">
        <Text className="text-xl font-semibold text-blue-800">
          Sri Lanka Land Admin
        </Text>
      </div>
      
      <Space>
        {user && (
          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
            <Button type="text" className="flex items-center">
              <Avatar size="small" icon={<UserOutlined />} className="mr-2" />
              <span className="hidden sm:inline">
                {user.firstName} {user.lastName}
              </span>
              <span className="ml-1 text-xs text-gray-500 capitalize">
                ({user.role.replace('_', ' ')})
              </span>
            </Button>
          </Dropdown>
        )}
      </Space>
    </AntHeader>
  );
}
