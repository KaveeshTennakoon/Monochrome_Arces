import React from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { Typography, Card, Row, Col, Statistic, Button } from 'antd';
import { 
  UserOutlined, 
  CalendarOutlined, 
  CheckCircleOutlined, 
  ClockCircleOutlined 
} from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const AdminDashboard = () => {
  return (
    <AdminLayout pageTitle="Dashboard">
      <div>
        <Title level={2} style={{ marginBottom: '8px' }}>
          Dashboard Overview
        </Title>
        <Paragraph style={{ marginBottom: '24px', color: '#666' }}>
          Welcome to the Government Services Admin Portal. Here's your system overview.
        </Paragraph>
        
        <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Total Users"
                value={1128}
                prefix={<UserOutlined />}
                valueStyle={{ color: '#3f8600' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Today's Appointments"
                value={48}
                prefix={<CalendarOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Completed"
                value={32}
                prefix={<CheckCircleOutlined />}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Pending"
                value={16}
                prefix={<ClockCircleOutlined />}
                valueStyle={{ color: '#faad14' }}
              />
            </Card>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col xs={24} lg={12}>
            <Card title="Quick Actions">
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <Button type="primary">View Appointments</Button>
                <Button>Manage Services</Button>
                <Button>User Reports</Button>
              </div>
            </Card>
          </Col>
          <Col xs={24} lg={12}>
            <Card title="System Status">
              <p>✅ All systems operational</p>
              <p>📊 Database: Connected</p>
              <p>🔔 Notifications: Active</p>
            </Card>
          </Col>
        </Row>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;