'use client';

import { Layout, Menu } from 'antd';
import { 
  DashboardOutlined, 
  HomeOutlined, 
  CalendarOutlined, 
  TeamOutlined,
  PlusOutlined,
  UnorderedListOutlined
} from '@ant-design/icons';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { PERMISSIONS } from '@/lib/constants';

const { Sider } = Layout;

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { hasPermission } = useAuth();

  const menuItems = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
    },
    {
      key: 'lands',
      icon: <HomeOutlined />,
      label: 'Land Management',
      children: [
        {
          key: '/dashboard/lands',
          icon: <UnorderedListOutlined />,
          label: 'View All Lands',
        },
        ...(hasPermission(PERMISSIONS.LANDS_CREATE) ? [{
          key: '/dashboard/lands/add',
          icon: <PlusOutlined />,
          label: 'Add New Land',
        }] : []),
      ],
    },
    {
      key: '/dashboard/events',
      icon: <CalendarOutlined />,
      label: 'Government Events',
    },
    ...(hasPermission(PERMISSIONS.USERS_VIEW) ? [{
      key: '/dashboard/users',
      icon: <TeamOutlined />,
      label: 'User Management',
    }] : []),
  ];

  const handleMenuClick = ({ key }: { key: string }) => {
    router.push(key);
  };

  return (
    <Sider width={250} className="bg-white shadow-lg">
      <Menu
        mode="inline"
        selectedKeys={[pathname]}
        defaultOpenKeys={['lands']}
        items={menuItems}
        onClick={handleMenuClick}
        className="h-full border-r-0"
      />
    </Sider>
  );
}