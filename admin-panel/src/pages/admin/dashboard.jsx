import React, { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { 
  Typography, 
  Card, 
  Row, 
  Col, 
  Statistic, 
  Select,
  DatePicker,
  Progress,
  Table,
  Tag,
  Space,
  Button,
  Alert
} from 'antd';
import {
  UserOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  HomeOutlined,
  CarOutlined,
  IdcardOutlined,
  BankOutlined,
  MedicineBoxOutlined,
  BookOutlined,
  WarningOutlined,
  DashboardOutlined,
  FileTextOutlined,
  TeamOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

const AnalyticsDashboard = () => {
  const [selectedDepartment, setSelectedDepartment] = useState('all');

  // Sample analytics data
  const kpiData = {
    totalAppointments: 1247,
    totalAppointmentsChange: 12.5,
    completedAppointments: 1089,
    completedRate: 87.3,
    averageWaitTime: 18.5,
    waitTimeChange: -8.2,
    citizenSatisfaction: 4.2,
    satisfactionChange: 5.8,
    peakHours: ['10:00 AM', '11:00 AM', '2:00 PM'],
    totalRevenue: 'LKR 2,847,500',
    revenueChange: 15.3
  };

  // Department performance data
  const departmentData = [
    {
      key: '1',
      department: 'Land Registry',
      code: 'LR',
      icon: <HomeOutlined />,
      totalAppointments: 342,
      completed: 298,
      cancelled: 31,
      pending: 13,
      completionRate: 87.1,
      avgProcessingTime: 45,
      revenue: 'LKR 856,000',
      satisfaction: 4.3,
      trend: 'up'
    },
    {
      key: '2',
      department: 'Motor Traffic',
      code: 'DMT',
      icon: <CarOutlined />,
      totalAppointments: 289,
      completed: 267,
      cancelled: 18,
      pending: 4,
      completionRate: 92.4,
      avgProcessingTime: 28,
      revenue: 'LKR 423,500',
      satisfaction: 4.1,
      trend: 'up'
    },
    {
      key: '3',
      department: 'Immigration',
      code: 'DIE',
      icon: <IdcardOutlined />,
      totalAppointments: 234,
      completed: 201,
      cancelled: 25,
      pending: 8,
      completionRate: 85.9,
      avgProcessingTime: 52,
      revenue: 'LKR 634,500',
      satisfaction: 4.0,
      trend: 'down'
    },
    {
      key: '4',
      department: 'Municipal',
      code: 'MUN',
      icon: <BankOutlined />,
      totalAppointments: 156,
      completed: 134,
      cancelled: 12,
      pending: 10,
      completionRate: 85.9,
      avgProcessingTime: 67,
      revenue: 'LKR 567,800',
      satisfaction: 3.9,
      trend: 'up'
    },
    {
      key: '5',
      department: 'Health',
      code: 'MOH',
      icon: <MedicineBoxOutlined />,
      totalAppointments: 128,
      completed: 116,
      cancelled: 8,
      pending: 4,
      completionRate: 90.6,
      avgProcessingTime: 22,
      revenue: 'LKR 187,200',
      satisfaction: 4.5,
      trend: 'up'
    },
    {
      key: '6',
      department: 'Education',
      code: 'MOE',
      icon: <BookOutlined />,
      totalAppointments: 98,
      completed: 73,
      cancelled: 15,
      pending: 10,
      completionRate: 74.5,
      avgProcessingTime: 38,
      revenue: 'LKR 178,500',
      satisfaction: 4.2,
      trend: 'down'
    }
  ];

  // Time-based trends data
  const trendsData = [
    { month: 'Jan', appointments: 980, completed: 856, satisfaction: 4.1 },
    { month: 'Feb', appointments: 1120, completed: 975, satisfaction: 4.0 },
    { month: 'Mar', appointments: 1050, completed: 918, satisfaction: 4.2 },
    { month: 'Apr', appointments: 1180, completed: 1032, satisfaction: 4.1 },
    { month: 'May', appointments: 1340, completed: 1169, satisfaction: 4.3 },
    { month: 'Jun', appointments: 1247, completed: 1089, satisfaction: 4.2 },
  ];

  // Peak hours data
  const peakHoursData = [
    { time: '09:00', appointments: 45 },
    { time: '10:00', appointments: 89 },
    { time: '11:00', appointments: 92 },
    { time: '12:00', appointments: 34 },
    { time: '14:00', appointments: 78 },
    { time: '15:00', appointments: 85 },
    { time: '16:00', appointments: 67 },
    { time: '17:00', appointments: 23 }
  ];

  // Department distribution for pie chart
  const departmentDistribution = [
    { name: 'Land Registry', value: 342, color: '#52c41a' },
    { name: 'Motor Traffic', value: 289, color: '#1890ff' },
    { name: 'Immigration', value: 234, color: '#722ed1' },
    { name: 'Municipal', value: 156, color: '#faad14' },
    { name: 'Health', value: 128, color: '#f5222d' },
    { name: 'Education', value: 98, color: '#fa8c16' }
  ];

  // No-show rates by department
  const noShowData = [
    { department: 'LR', rate: 9.1 },
    { department: 'DMT', rate: 6.2 },
    { department: 'DIE', rate: 10.7 },
    { department: 'MUN', rate: 7.7 },
    { department: 'MOH', rate: 6.3 },
    { department: 'MOE', rate: 15.3 }
  ];

  // Resource optimization insights
  const optimizationInsights = [
    {
      type: 'peak_time',
      title: 'Peak Hour Optimization',
      description: 'Consider adding more staff during 10-11 AM and 2-3 PM slots',
      impact: 'Could reduce wait times by 23%',
      priority: 'high'
    },
    {
      type: 'department_load',
      title: 'Department Load Balancing',
      description: 'Land Registry showing high volume - consider additional officers',
      impact: 'Could improve completion rate by 5%',
      priority: 'medium'
    },
    {
      type: 'no_show',
      title: 'No-Show Rate Reduction',
      description: 'Education dept has 15.3% no-show rate - implement reminder system',
      impact: 'Could save 2-3 hours daily',
      priority: 'high'
    },
    {
      type: 'processing_time',
      title: 'Processing Time Improvement',
      description: 'Municipal services taking 67 min avg - review workflow',
      impact: 'Could increase daily capacity by 15%',
      priority: 'medium'
    }
  ];

  // Department performance table columns
  const departmentColumns = [
    {
      title: 'Department',
      key: 'department',
      render: (_, record) => (
        <Space>
          {record.icon}
          <div>
            <Text strong>{record.department}</Text>
            <br />
            <Text type="secondary" style={{ fontSize: '12px' }}>
              {record.code}
            </Text>
          </div>
        </Space>
      ),
    },
    {
      title: 'Total Appointments',
      dataIndex: 'totalAppointments',
      sorter: (a, b) => a.totalAppointments - b.totalAppointments,
      render: (value) => <Text strong>{value}</Text>
    },
    {
      title: 'Completion Rate',
      key: 'completionRate',
      sorter: (a, b) => a.completionRate - b.completionRate,
      render: (_, record) => (
        <div>
          <Progress 
            percent={record.completionRate} 
            size="small" 
            status={record.completionRate > 85 ? 'success' : record.completionRate > 75 ? 'normal' : 'exception'}
          />
          <Text style={{ fontSize: '12px' }}>{record.completionRate}%</Text>
        </div>
      )
    },
    {
      title: 'Avg. Processing Time',
      dataIndex: 'avgProcessingTime',
      sorter: (a, b) => a.avgProcessingTime - b.avgProcessingTime,
      render: (value) => `${value} min`
    },
    {
      title: 'Revenue',
      dataIndex: 'revenue',
      render: (value) => <Text style={{ color: '#52c41a', fontWeight: 600 }}>{value}</Text>
    },
    {
      title: 'Satisfaction',
      key: 'satisfaction',
      sorter: (a, b) => a.satisfaction - b.satisfaction,
      render: (_, record) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Text strong>{record.satisfaction}/5</Text>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {record.trend === 'up' ? (
              <ArrowUpOutlined style={{ color: '#52c41a', marginLeft: 8 }} />
            ) : (
              <ArrowDownOutlined style={{ color: '#ff4d4f', marginLeft: 8 }} />
            )}
          </div>
        </div>
      )
    }
  ];

  const getPriorityColor = (priority) => {
    return priority === 'high' ? '#ff4d4f' : priority === 'medium' ? '#faad14' : '#52c41a';
  };

  const getPriorityIcon = (type) => {
    const icons = {
      'peak_time': <ClockCircleOutlined />,
      'department_load': <TeamOutlined />,
      'no_show': <WarningOutlined />,
      'processing_time': <DashboardOutlined />
    };
    return icons[type] || <FileTextOutlined />;
  };

  return (
    <AdminLayout pageTitle="Analytics Dashboard">
      <div>
        <div style={{ marginBottom: '24px' }}>
          <Row justify="space-between" align="middle">
            <Col>
              <Title level={2} style={{ margin: 0 }}>
                Government Services Analytics
              </Title>
              <Text type="secondary">
                Real-time insights and optimization recommendations for government service delivery
              </Text>
            </Col>
            <Col>
              <Space>
                <Select
                  style={{ width: 150 }}
                  value={selectedDepartment}
                  onChange={setSelectedDepartment}
                  placeholder="Department"
                >
                  <Option value="all">All Departments</Option>
                  <Option value="LR">Land Registry</Option>
                  <Option value="DMT">Motor Traffic</Option>
                  <Option value="DIE">Immigration</Option>
                  <Option value="MUN">Municipal</Option>
                  <Option value="MOH">Health</Option>
                  <Option value="MOE">Education</Option>
                </Select>
                <RangePicker
                  format="MMM DD"
                />
              </Space>
            </Col>
          </Row>
        </div>

        {/* Key Performance Indicators */}
        <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Total Appointments"
                value={kpiData.totalAppointments}
                prefix={<CalendarOutlined />}
                suffix={
                  <span style={{ fontSize: '14px', color: '#52c41a' }}>
                    <ArrowUpOutlined /> +{kpiData.totalAppointmentsChange}%
                  </span>
                }
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Completion Rate"
                value={kpiData.completedRate}
                prefix={<CheckCircleOutlined />}
                suffix={
                  <span style={{ fontSize: '14px' }}>
                    %
                  </span>
                }
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Avg. Wait Time"
                value={kpiData.averageWaitTime}
                prefix={<ClockCircleOutlined />}
                suffix={
                  <span style={{ fontSize: '14px', color: '#52c41a' }}>
                    <ArrowDownOutlined /> {kpiData.waitTimeChange}%
                  </span>
                }
                valueStyle={{ color: '#faad14' }}
              />
              <Text type="secondary" style={{ fontSize: '12px' }}>minutes</Text>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Citizen Satisfaction"
                value={kpiData.citizenSatisfaction}
                prefix={<UserOutlined />}
                suffix={
                  <span style={{ fontSize: '14px', color: '#52c41a' }}>
                    <ArrowUpOutlined /> +{kpiData.satisfactionChange}%
                  </span>
                }
                valueStyle={{ color: '#722ed1' }}
              />
              <Text type="secondary" style={{ fontSize: '12px' }}>/5.0</Text>
            </Card>
          </Col>
        </Row>

        {/* Charts Row - Simplified without external chart library */}
        <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
          {/* Department Summary Cards */}
          <Col xs={24} lg={12}>
            <Card title="Top Performing Departments" extra={<Button size="small">View All</Button>}>
              <Space direction="vertical" style={{ width: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0' }}>
                  <Space>
                    <CarOutlined style={{ color: '#1890ff' }} />
                    <Text>Motor Traffic</Text>
                  </Space>
                  <div>
                    <Progress percent={92} size="small" style={{ width: 100 }} />
                    <Text style={{ marginLeft: 8, fontSize: '12px' }}>92.4%</Text>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0' }}>
                  <Space>
                    <MedicineBoxOutlined style={{ color: '#52c41a' }} />
                    <Text>Health Services</Text>
                  </Space>
                  <div>
                    <Progress percent={91} size="small" style={{ width: 100 }} />
                    <Text style={{ marginLeft: 8, fontSize: '12px' }}>90.6%</Text>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0' }}>
                  <Space>
                    <HomeOutlined style={{ color: '#722ed1' }} />
                    <Text>Land Registry</Text>
                  </Space>
                  <div>
                    <Progress percent={87} size="small" style={{ width: 100 }} />
                    <Text style={{ marginLeft: 8, fontSize: '12px' }}>87.1%</Text>
                  </div>
                </div>
              </Space>
            </Card>
          </Col>

          {/* Peak Hours Summary */}
          <Col xs={24} lg={12}>
            <Card title="Peak Hours Analysis" extra={<Button size="small">Optimize</Button>}>
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <Title level={3} style={{ color: '#1890ff', margin: 0 }}>10:00 - 11:00 AM</Title>
                <Text type="secondary">Busiest appointment slot</Text>
                <div style={{ marginTop: 16 }}>
                  <Statistic
                    title="Average appointments per hour"
                    value={89}
                    prefix={<ClockCircleOutlined />}
                    valueStyle={{ fontSize: '24px' }}
                  />
                </div>
                <div style={{ marginTop: 16 }}>
                  <Tag color="orange">High Demand</Tag>
                  <Tag color="blue">Needs Additional Staff</Tag>
                </div>
              </div>
            </Card>
          </Col>
        </Row>

        {/* Department Issues Analysis */}
        <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
          <Col xs={24} lg={12}>
            <Card title="Department Issues" extra={<Button size="small">View All</Button>}>
              <Space direction="vertical" style={{ width: '100%' }}>
                <Alert
                  message="Education Dept - High No-Show Rate"
                  description="15.3% no-show rate detected. Consider SMS reminders."
                  type="warning"
                  showIcon
                  action={<Button size="small">Fix</Button>}
                />
                <Alert
                  message="Municipal - Long Processing Time"
                  description="67 min average. Review workflow efficiency."
                  type="info"
                  showIcon
                  action={<Button size="small">Optimize</Button>}
                />
              </Space>
            </Card>
          </Col>

          <Col xs={24} lg={12}>
            <Card title="Resource Allocation" extra={<Button size="small">Rebalance</Button>}>
              <Space direction="vertical" style={{ width: '100%' }}>
                <div>
                  <Text strong>Land Registry</Text>
                  <div style={{ display: 'flex', alignItems: 'center', marginTop: 4 }}>
                    <Progress percent={85} status="active" style={{ flex: 1 }} />
                    <Text style={{ marginLeft: 8, fontSize: '12px' }}>342 appointments</Text>
                  </div>
                </div>
                <div>
                  <Text strong>Motor Traffic</Text>
                  <div style={{ display: 'flex', alignItems: 'center', marginTop: 4 }}>
                    <Progress percent={70} style={{ flex: 1 }} />
                    <Text style={{ marginLeft: 8, fontSize: '12px' }}>289 appointments</Text>
                  </div>
                </div>
                <div>
                  <Text strong>Immigration</Text>
                  <div style={{ display: 'flex', alignItems: 'center', marginTop: 4 }}>
                    <Progress percent={58} style={{ flex: 1 }} />
                    <Text style={{ marginLeft: 8, fontSize: '12px' }}>234 appointments</Text>
                  </div>
                </div>
              </Space>
            </Card>
          </Col>
        </Row>

        {/* Optimization Insights */}
        <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
          <Col span={24}>
            <Card title="Optimization Recommendations" extra={<Button type="primary">Implement All</Button>}>
              <Row gutter={[16, 16]}>
                {optimizationInsights.map((insight, index) => (
                  <Col xs={24} md={12} key={index}>
                    <Alert
                      message={
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          {getPriorityIcon(insight.type)}
                          <Text strong style={{ marginLeft: 8 }}>{insight.title}</Text>
                          <Tag 
                            color={getPriorityColor(insight.priority)} 
                            style={{ marginLeft: 'auto' }}
                          >
                            {insight.priority.toUpperCase()}
                          </Tag>
                        </div>
                      }
                      description={
                        <div>
                          <Text>{insight.description}</Text>
                          <br />
                          <Text type="secondary" style={{ fontSize: '12px' }}>
                            <strong>Impact:</strong> {insight.impact}
                          </Text>
                        </div>
                      }
                      type={insight.priority === 'high' ? 'warning' : 'info'}
                      showIcon
                      action={
                        <Button size="small" type="primary">
                          Apply
                        </Button>
                      }
                    />
                  </Col>
                ))}
              </Row>
            </Card>
          </Col>
        </Row>

        {/* Department Performance Table */}
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Card title="Department Performance Metrics" extra={<Button size="small">Generate Report</Button>}>
              <Table
                columns={departmentColumns}
                dataSource={departmentData}
                pagination={false}
                size="middle"
                scroll={{ x: 800 }}
              />
            </Card>
          </Col>
        </Row>
      </div>
    </AdminLayout>
  );
};

export default AnalyticsDashboard;