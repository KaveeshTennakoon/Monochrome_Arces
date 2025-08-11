'use client';

import { Row, Col, Typography, Card, List, Tag } from 'antd';
import { 
  HomeOutlined, 
  CheckCircleOutlined, 
  CalendarOutlined, 
  TeamOutlined 
} from '@ant-design/icons';
import StatsCard from '@/components/ui/StatsCard';
import { useAuth } from '@/hooks/useAuth';

const { Title, Text } = Typography;

export default function DashboardPage() {
  const { user } = useAuth();
  const stats = {
    totalLands: 320,
    pendingVerification: 12,
    upcomingEvents: 4,
    activeUsers: 8,
  };

  const recentActivity = [
    {
      id: 1,
      action: 'Land #1023 added',
      user: 'Admin1',
      time: '2 hours ago',
      type: 'land',
    },
    {
      id: 2,
      action: 'Government Event: Survey in Colombo',
      user: 'System',
      time: '4 hours ago',
      type: 'event',
    },
    {
      id: 3,
      action: 'Land #1022 verified',
      user: 'Admin2',
      time: '1 day ago',
      type: 'verification',
    },
  ];

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'land': return 'blue';
      case 'event': return 'orange';
      case 'verification': return 'green';
      default: return 'default';
    }
  };

  return (
    <div>
      <div className="mb-6">
        <Title level={2}>Dashboard</Title>
        <Text type="secondary">
          Welcome back, {user?.firstName}! Here's what's happening with your land management system.
        </Text>
      </div>

      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} lg={6}>
          <StatsCard
            title="Total Lands"
            value={stats.totalLands}
            icon={<HomeOutlined />}
            color="#1890ff"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatsCard
            title="Pending Verification"
            value={stats.pendingVerification}
            icon={<CheckCircleOutlined />}
            color="#faad14"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatsCard
            title="Upcoming Events"
            value={stats.upcomingEvents}
            icon={<CalendarOutlined />}
            color="#52c41a"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatsCard
            title="Active Users"
            value={stats.activeUsers}
            icon={<TeamOutlined />}
            color="#722ed1"
          />
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Card title="Recent Activity" className="h-96">
            <List
              dataSource={recentActivity}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    title={
                      <div className="flex justify-between items-center">
                        <span>{item.action}</span>
                        <Tag color={getActivityColor(item.type)}>
                          {item.type}
                        </Tag>
                      </div>
                    }
                    description={`by ${item.user} • ${item.time}`}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="Quick Actions" className="h-96">
            <div className="space-y-4">
              <Card size="small" className="cursor-pointer hover:shadow-md transition-shadow">
                <div className="flex items-center">
                  <HomeOutlined className="text-blue-500 mr-3" />
                  <div>
                    <div className="font-medium">Add New Land</div>
                    <div className="text-sm text-gray-500">Register a new land parcel</div>
                  </div>
                </div>
              </Card>
              <Card size="small" className="cursor-pointer hover:shadow-md transition-shadow">
                <div className="flex items-center">
                  <CalendarOutlined className="text-green-500 mr-3" />
                  <div>
                    <div className="font-medium">Schedule Event</div>
                    <div className="text-sm text-gray-500">Add government event</div>
                  </div>
                </div>
              </Card>
              <Card size="small" className="cursor-pointer hover:shadow-md transition-shadow">
                <div className="flex items-center">
                  <CheckCircleOutlined className="text-orange-500 mr-3" />
                  <div>
                    <div className="font-medium">Verify Lands</div>
                    <div className="text-sm text-gray-500">Review pending verifications</div>
                  </div>
                </div>
              </Card>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}