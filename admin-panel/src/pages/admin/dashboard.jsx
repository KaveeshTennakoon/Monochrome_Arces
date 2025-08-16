import React, { useState, useEffect } from 'react';
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
  Alert,
  Spin,
  message
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
  TeamOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import { analyticsAPI, departmentsAPI, handleAPIError } from '../../utils/api';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

const AnalyticsDashboard = () => {
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedDateRange, setSelectedDateRange] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  // Data states
  const [kpiData, setKpiData] = useState({});
  const [departmentData, setDepartmentData] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [optimizationInsights, setOptimizationInsights] = useState([]);
  const [trendsData, setTrendsData] = useState([]);
  const [peakHoursData, setPeakHoursData] = useState([]);

  // Load all dashboard data
  useEffect(() => {
    loadDashboardData();
  }, []);

  // Reload data when filters change
  useEffect(() => {
    if (!loading) {
      loadAnalyticsData();
    }
  }, [selectedDepartment, selectedDateRange]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load initial data in parallel
      await Promise.all([
        loadDepartments(),
        loadAnalyticsData(),
      ]);
    } catch (error) {
      handleAPIError(error);
      message.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const loadDepartments = async () => {
    try {
      const response = await departmentsAPI.getDepartments();
      setDepartments(response.data || []);
    } catch (error) {
      handleAPIError(error);
    }
  };

  const loadAnalyticsData = async () => {
    try {
      const filters = {
        department: selectedDepartment !== 'all' ? selectedDepartment : undefined,
        startDate: selectedDateRange?.[0]?.format('YYYY-MM-DD'),
        endDate: selectedDateRange?.[1]?.format('YYYY-MM-DD'),
      };

      // Load analytics data in parallel
      const [
        kpiResponse,
        departmentResponse,
        insightsResponse,
        trendsResponse,
        peakHoursResponse
      ] = await Promise.all([
        analyticsAPI.getKPIs(filters),
        analyticsAPI.getDepartmentPerformance(filters.startDate && filters.endDate ? {
          start: filters.startDate,
          end: filters.endDate
        } : null),
        analyticsAPI.getOptimizationInsights(),
        analyticsAPI.getAppointmentTrends('6months'),
        analyticsAPI.getPeakHours(filters.department)
      ]);

      setKpiData(kpiResponse.data || {});
      setDepartmentData(departmentResponse.data || []);
      setOptimizationInsights(insightsResponse.data || []);
      setTrendsData(trendsResponse.data || []);
      setPeakHoursData(peakHoursResponse.data || []);

    } catch (error) {
      handleAPIError(error);
      message.error('Failed to load analytics data');
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadAnalyticsData();
    setRefreshing(false);
    message.success('Dashboard data refreshed');
  };

  const getDepartmentIcon = (departmentCode) => {
    const icons = {
      'LR': <HomeOutlined />,
      'DMT': <CarOutlined />,
      'DIE': <IdcardOutlined />,
      'MUN': <BankOutlined />,
      'MOH': <MedicineBoxOutlined />,
      'MOE': <BookOutlined />
    };
    return icons[departmentCode] || <BankOutlined />;
  };

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

  // Department performance table columns
  const departmentColumns = [
    {
      title: 'Department',
      key: 'department',
      render: (_, record) => (
        <Space>
          {getDepartmentIcon(record.departmentCode)}
          <div>
            <Text strong>{record.departmentName}</Text>
            <br />
            <Text type="secondary" style={{ fontSize: '12px' }}>
              {record.departmentCode}
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

  if (loading) {
    return (
      <AdminLayout pageTitle="Analytics Dashboard">
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
          <Spin size="large" />
        </div>
      </AdminLayout>
    );
  }

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
                  {departments.map(dept => (
                    <Option key={dept.code} value={dept.code}>
                      {dept.name}
                    </Option>
                  ))}
                </Select>
                <RangePicker
                  format="MMM DD"
                  value={selectedDateRange}
                  onChange={setSelectedDateRange}
                  allowClear
                />
                <Button 
                  icon={<ReloadOutlined />} 
                  onClick={handleRefresh}
                  loading={refreshing}
                >
                  Refresh
                </Button>
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
                value={kpiData.totalAppointments || 0}
                prefix={<CalendarOutlined />}
                suffix={
                  kpiData.totalAppointmentsChange ? (
                    <span style={{ fontSize: '14px', color: kpiData.totalAppointmentsChange > 0 ? '#52c41a' : '#ff4d4f' }}>
                      {kpiData.totalAppointmentsChange > 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />} {Math.abs(kpiData.totalAppointmentsChange)}%
                    </span>
                  ) : null
                }
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Completion Rate"
                value={kpiData.completedRate || 0}
                prefix={<CheckCircleOutlined />}
                suffix="%"
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Avg. Wait Time"
                value={kpiData.averageWaitTime || 0}
                prefix={<ClockCircleOutlined />}
                suffix={
                  kpiData.waitTimeChange ? (
                    <span style={{ fontSize: '14px', color: kpiData.waitTimeChange < 0 ? '#52c41a' : '#ff4d4f' }}>
                      {kpiData.waitTimeChange < 0 ? <ArrowDownOutlined /> : <ArrowUpOutlined />} {Math.abs(kpiData.waitTimeChange)}%
                    </span>
                  ) : null
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
                value={kpiData.citizenSatisfaction || 0}
                prefix={<UserOutlined />}
                suffix={
                  kpiData.satisfactionChange ? (
                    <span style={{ fontSize: '14px', color: kpiData.satisfactionChange > 0 ? '#52c41a' : '#ff4d4f' }}>
                      {kpiData.satisfactionChange > 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />} {Math.abs(kpiData.satisfactionChange)}%
                    </span>
                  ) : null
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
                {departmentData.slice(0, 3).map((dept, index) => (
                  <div key={dept.departmentCode} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0' }}>
                    <Space>
                      {getDepartmentIcon(dept.departmentCode)}
                      <Text>{dept.departmentName}</Text>
                    </Space>
                    <div>
                      <Progress percent={dept.completionRate} size="small" style={{ width: 100 }} />
                      <Text style={{ marginLeft: 8, fontSize: '12px' }}>{dept.completionRate}%</Text>
                    </div>
                  </div>
                ))}
              </Space>
            </Card>
          </Col>

          {/* Peak Hours Summary */}
          <Col xs={24} lg={12}>
            <Card title="Peak Hours Analysis" extra={<Button size="small">Optimize</Button>}>
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <Title level={3} style={{ color: '#1890ff', margin: 0 }}>
                  {peakHoursData.length > 0 ? peakHoursData[0]?.time || '10:00 - 11:00 AM' : '10:00 - 11:00 AM'}
                </Title>
                <Text type="secondary">Busiest appointment slot</Text>
                <div style={{ marginTop: 16 }}>
                  <Statistic
                    title="Average appointments per hour"
                    value={peakHoursData.length > 0 ? peakHoursData[0]?.appointments || 89 : 89}
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
                {departmentData.filter(dept => dept.completionRate < 80 || dept.avgProcessingTime > 60).slice(0, 2).map((dept, index) => (
                  <Alert
                    key={dept.departmentCode}
                    message={`${dept.departmentName} - ${dept.completionRate < 80 ? 'Low Completion Rate' : 'Long Processing Time'}`}
                    description={dept.completionRate < 80 ? 
                      `${dept.completionRate}% completion rate detected. Review workflow.` :
                      `${dept.avgProcessingTime} min average. Optimize processes.`
                    }
                    type="warning"
                    showIcon
                    action={<Button size="small">Fix</Button>}
                  />
                ))}
                {departmentData.filter(dept => dept.completionRate < 80 || dept.avgProcessingTime > 60).length === 0 && (
                  <Text type="secondary">No critical issues detected</Text>
                )}
              </Space>
            </Card>
          </Col>

          <Col xs={24} lg={12}>
            <Card title="Resource Allocation" extra={<Button size="small">Rebalance</Button>}>
              <Space direction="vertical" style={{ width: '100%' }}>
                {departmentData.slice(0, 3).map((dept, index) => (
                  <div key={dept.departmentCode}>
                    <Text strong>{dept.departmentName}</Text>
                    <div style={{ display: 'flex', alignItems: 'center', marginTop: 4 }}>
                      <Progress percent={Math.min((dept.totalAppointments / Math.max(...departmentData.map(d => d.totalAppointments))) * 100, 100)} 
                               status={dept.totalAppointments > 300 ? "active" : "normal"} 
                               style={{ flex: 1 }} />
                      <Text style={{ marginLeft: 8, fontSize: '12px' }}>{dept.totalAppointments} appointments</Text>
                    </div>
                  </div>
                ))}
              </Space>
            </Card>
          </Col>
        </Row>

        {/* Optimization Insights */}
        {optimizationInsights.length > 0 && (
          <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
            <Col span={24}>
              <Card title="Optimization Recommendations" extra={<Button type="primary">Implement All</Button>}>
                <Row gutter={[16, 16]}>
                  {optimizationInsights.slice(0, 4).map((insight, index) => (
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
                              {insight.priority?.toUpperCase()}
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
        )}

        {/* Department Performance Table */}
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Card title="Department Performance Metrics" extra={<Button size="small">Generate Report</Button>}>
              <Table
                columns={departmentColumns}
                dataSource={departmentData}
                rowKey="departmentCode"
                pagination={false}
                size="middle"
                scroll={{ x: 800 }}
                loading={refreshing}
              />
            </Card>
          </Col>
        </Row>
      </div>
    </AdminLayout>
  );
};

export default AnalyticsDashboard;