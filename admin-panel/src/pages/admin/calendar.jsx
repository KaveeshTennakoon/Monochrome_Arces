import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { 
  Typography, 
  Calendar, 
  Badge, 
  Card, 
  Row, 
  Col, 
  Modal, 
  Tag, 
  Space, 
  Button, 
  Tooltip, 
  Avatar,
  Descriptions,
  Select,
  Switch,
  Divider,
  Spin,
  message,
  Alert
} from 'antd';
import {
  CalendarOutlined,
  ClockCircleOutlined,
  UserOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
  MailOutlined,
  BankOutlined,
  FileTextOutlined,
  LeftOutlined,
  RightOutlined,
  EyeOutlined,
  EditOutlined,
  CarOutlined,
  MedicineBoxOutlined,
  BookOutlined,
  HomeOutlined,
  IdcardOutlined,
  DollarOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { appointmentsAPI, departmentsAPI, handleAPIError } from '../../utils/api';

const { Title, Text } = Typography;
const { Option } = Select;

const AppointmentCalendar = () => {
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [calendarLoading, setCalendarLoading] = useState(false);
  const [showLegend, setShowLegend] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [currentMonth, setCurrentMonth] = useState(dayjs().month());
  const [currentYear, setCurrentYear] = useState(dayjs().year());
  const [stats, setStats] = useState({
    totalToday: 0,
    totalMonth: 0,
    pendingCount: 0,
    departmentCount: 0
  });

  // Department icons mapping
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

  // Load initial data
  useEffect(() => {
    loadInitialData();
  }, []);

  // Load calendar appointments when month/year or filters change
  useEffect(() => {
    loadCalendarAppointments();
  }, [currentMonth, currentYear, filterStatus, filterDepartment]);

  // Update stats when appointments change
  useEffect(() => {
    updateStats();
  }, [appointments]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      
      // Load departments
      const departmentsResponse = await departmentsAPI.getDepartments();
      setDepartments(departmentsResponse.data || []);
      
      await loadCalendarAppointments();
    } catch (error) {
      handleAPIError(error);
      message.error('Failed to load initial data');
    } finally {
      setLoading(false);
    }
  };

  const loadCalendarAppointments = async () => {
    try {
      setCalendarLoading(true);

      const filters = {
        status: filterStatus !== 'all' ? filterStatus : undefined,
        department: filterDepartment !== 'all' ? filterDepartment : undefined,
      };

      const response = await appointmentsAPI.getCalendarAppointments(
        currentMonth + 1, // API expects 1-based month
        currentYear,
        filters
      );

      setAppointments(response.data || []);
    } catch (error) {
      handleAPIError(error);
      message.error('Failed to load calendar appointments');
    } finally {
      setCalendarLoading(false);
    }
  };

  const updateStats = () => {
    const today = dayjs().format('YYYY-MM-DD');
    const thisMonth = dayjs().format('YYYY-MM');

    const todayAppointments = appointments.filter(apt => 
      dayjs(apt.date).format('YYYY-MM-DD') === today
    );

    const monthAppointments = appointments.filter(apt => 
      dayjs(apt.date).format('YYYY-MM') === thisMonth
    );

    const pendingAppointments = appointments.filter(apt => apt.status === 'pending');
    const uniqueDepartments = new Set(appointments.map(apt => apt.departmentCode));

    setStats({
      totalToday: todayAppointments.length,
      totalMonth: monthAppointments.length,
      pendingCount: pendingAppointments.length,
      departmentCount: uniqueDepartments.size
    });
  };

  // Get appointments for a specific date
  const getAppointmentsForDate = (date) => {
    const dateStr = date.format('YYYY-MM-DD');
    return appointments.filter(apt => 
      dayjs(apt.date).format('YYYY-MM-DD') === dateStr
    );
  };

  // Calendar cell render function
  const dateCellRender = (value) => {
    const dayAppointments = getAppointmentsForDate(value);
    
    return (
      <div style={{ minHeight: 80 }}>
        {dayAppointments.map((appointment, index) => (
          <div
            key={appointment.id}
            style={{
              background: appointment.color || getStatusColor(appointment.status),
              color: 'white',
              padding: '2px 4px',
              margin: '1px 0',
              borderRadius: '3px',
              fontSize: '10px',
              cursor: 'pointer',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}
            onClick={(e) => {
              e.stopPropagation();
              handleAppointmentClick(appointment);
            }}
          >
            <div style={{ fontWeight: 600 }}>
              {appointment.time} - {appointment.citizenName}
            </div>
            <div style={{ opacity: 0.9 }}>
              {appointment.departmentCode}: {appointment.title}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const getStatusColor = (status) => {
    const colors = {
      'pending': '#faad14',
      'confirmed': '#1890ff',
      'completed': '#52c41a',
      'cancelled': '#ff4d4f',
      'rescheduled': '#722ed1'
    };
    return colors[status] || '#1890ff';
  };

  // Handle appointment click
  const handleAppointmentClick = async (appointment) => {
    try {
      // Get full appointment details
      const response = await appointmentsAPI.getAppointment(appointment.id);
      setSelectedAppointment(response.data);
      setModalVisible(true);
    } catch (error) {
      handleAPIError(error);
      message.error('Failed to load appointment details');
    }
  };

  // Handle date select
  const onDateSelect = (date) => {
    setSelectedDate(date);
  };

  // Handle month/year change
  const onPanelChange = (value, mode) => {
    setCurrentMonth(value.month());
    setCurrentYear(value.year());
  };

  const handleRefresh = () => {
    loadCalendarAppointments();
  };

  // Department legend data
  const departmentLegend = departments.map(dept => ({
    code: dept.code,
    name: dept.name,
    color: dept.color || '#1890ff',
    icon: getDepartmentIcon(dept.code)
  }));

  // Status legend data
  const statusLegend = [
    { status: 'confirmed', color: '#1890ff', label: 'Confirmed' },
    { status: 'pending', color: '#faad14', label: 'Pending' },
    { status: 'completed', color: '#52c41a', label: 'Completed' },
    { status: 'cancelled', color: '#ff4d4f', label: 'Cancelled' },
    { status: 'rescheduled', color: '#722ed1', label: 'Rescheduled' }
  ];

  if (loading) {
    return (
      <AdminLayout pageTitle="Appointment Calendar">
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
          <Spin size="large" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout pageTitle="Appointment Calendar">
      <div>
        <div style={{ marginBottom: '24px' }}>
          <Row justify="space-between" align="middle">
            <Col>
              <Title level={2} style={{ margin: 0 }}>
                Government Services Calendar
              </Title>
              <Text type="secondary">
                View and manage appointments across all government departments
              </Text>
            </Col>
            <Col>
              <Space>
                <Select
                  style={{ width: 150 }}
                  value={filterDepartment}
                  onChange={setFilterDepartment}
                  placeholder="Filter Department"
                  loading={calendarLoading}
                >
                  <Option value="all">All Departments</Option>
                  {departments.map(dept => (
                    <Option key={dept.code} value={dept.code}>
                      {dept.name}
                    </Option>
                  ))}
                </Select>
                <Select
                  style={{ width: 120 }}
                  value={filterStatus}
                  onChange={setFilterStatus}
                  placeholder="Filter Status"
                >
                  <Option value="all">All Status</Option>
                  <Option value="confirmed">Confirmed</Option>
                  <Option value="pending">Pending</Option>
                  <Option value="completed">Completed</Option>
                  <Option value="cancelled">Cancelled</Option>
                </Select>
                <Switch
                  checked={showLegend}
                  onChange={setShowLegend}
                  checkedChildren="Legend"
                  unCheckedChildren="Legend"
                />
                <Button 
                  icon={<ReloadOutlined />} 
                  onClick={handleRefresh}
                  loading={calendarLoading}
                >
                  Refresh
                </Button>
              </Space>
            </Col>
          </Row>
        </div>

        <Row gutter={[16, 16]}>
          {/* Calendar */}
          <Col xs={24} lg={showLegend ? 18 : 24}>
            <Card loading={calendarLoading}>
              <Calendar
                value={selectedDate}
                onSelect={onDateSelect}
                onPanelChange={onPanelChange}
                dateCellRender={dateCellRender}
                headerRender={({ value, type, onChange, onTypeChange }) => {
                  const start = 0;
                  const end = 12;
                  const monthOptions = [];

                  const current = value.clone();
                  const localeData = value.localeData();
                  const months = [];
                  for (let i = 0; i < 12; i++) {
                    current.month(i);
                    months.push(localeData.monthsShort(current));
                  }

                  for (let i = start; i < end; i++) {
                    monthOptions.push(
                      <Option key={i} value={i}>
                        {months[i]}
                      </Option>
                    );
                  }

                  const year = value.year();
                  const month = value.month();
                  const options = [];
                  for (let i = year - 10; i < year + 10; i += 1) {
                    options.push(
                      <Option key={i} value={i}>
                        {i}
                      </Option>
                    );
                  }

                  return (
                    <div style={{ padding: '0 8px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Button 
                          type="text" 
                          icon={<LeftOutlined />} 
                          onClick={() => {
                            const newValue = value.clone().subtract(1, 'month');
                            onChange(newValue);
                            setCurrentMonth(newValue.month());
                            setCurrentYear(newValue.year());
                          }}
                        />
                        <Select
                          size="small"
                          value={month}
                          onChange={(selectedMonth) => {
                            const newValue = value.clone().month(selectedMonth);
                            onChange(newValue);
                            setCurrentMonth(selectedMonth);
                          }}
                        >
                          {monthOptions}
                        </Select>
                        <Select
                          size="small"
                          value={year}
                          onChange={(selectedYear) => {
                            const newValue = value.clone().year(selectedYear);
                            onChange(newValue);
                            setCurrentYear(selectedYear);
                          }}
                        >
                          {options}
                        </Select>
                        <Button 
                          type="text" 
                          icon={<RightOutlined />} 
                          onClick={() => {
                            const newValue = value.clone().add(1, 'month');
                            onChange(newValue);
                            setCurrentMonth(newValue.month());
                            setCurrentYear(newValue.year());
                          }}
                        />
                      </div>
                      
                      <div>
                        <Button.Group size="small">
                          <Button 
                            type={type === 'month' ? 'primary' : 'default'}
                            onClick={() => onTypeChange('month')}
                          >
                            Month
                          </Button>
                          <Button 
                            type={type === 'year' ? 'primary' : 'default'}
                            onClick={() => onTypeChange('year')}
                          >
                            Year
                          </Button>
                        </Button.Group>
                      </div>
                    </div>
                  );
                }}
              />
            </Card>
          </Col>

          {/* Legend and Today's Appointments */}
          {showLegend && (
            <Col xs={24} lg={6}>
              <Space direction="vertical" style={{ width: '100%' }} size="middle">
                {/* Department Legend */}
                {departmentLegend.length > 0 && (
                  <Card title="Departments" size="small">
                    <Space direction="vertical" style={{ width: '100%' }}>
                      {departmentLegend.map(item => (
                        <div key={item.code} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          {item.icon}
                          <Text style={{ fontSize: '12px' }}>{item.name}</Text>
                        </div>
                      ))}
                    </Space>
                  </Card>
                )}

                {/* Status Legend */}
                <Card title="Status Legend" size="small">
                  <Space direction="vertical" style={{ width: '100%' }}>
                    {statusLegend.map(item => (
                      <div key={item.status} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div 
                          style={{ 
                            width: 12, 
                            height: 12, 
                            backgroundColor: item.color, 
                            borderRadius: '2px' 
                          }} 
                        />
                        <Text style={{ fontSize: '12px' }}>{item.label}</Text>
                      </div>
                    ))}
                  </Space>
                </Card>

                {/* Selected Date Appointments */}
                <Card 
                  title={`Appointments - ${selectedDate.format('MMM DD, YYYY')}`} 
                  size="small"
                >
                  {getAppointmentsForDate(selectedDate).length === 0 ? (
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      No appointments for this date
                    </Text>
                  ) : (
                    <Space direction="vertical" style={{ width: '100%' }} size="small">
                      {getAppointmentsForDate(selectedDate).map(appointment => (
                        <div 
                          key={appointment.id}
                          style={{ 
                            padding: '8px',
                            border: `1px solid ${appointment.color || getStatusColor(appointment.status)}`,
                            borderLeft: `4px solid ${appointment.color || getStatusColor(appointment.status)}`,
                            borderRadius: '4px',
                            cursor: 'pointer',
                            background: '#fafafa'
                          }}
                          onClick={() => handleAppointmentClick(appointment)}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
                            {getDepartmentIcon(appointment.departmentCode)}
                            <Text strong style={{ marginLeft: 8, fontSize: '12px' }}>
                              {appointment.time} - {appointment.citizenName}
                            </Text>
                          </div>
                          <div style={{ fontSize: '11px', color: '#666' }}>
                            {appointment.title}
                          </div>
                          <div style={{ fontSize: '10px', color: '#888' }}>
                            {appointment.department} • {appointment.fee}
                          </div>
                        </div>
                      ))}
                    </Space>
                  )}
                </Card>

                {/* Quick Stats */}
                <Card title="Quick Stats" size="small">
                  <Space direction="vertical" style={{ width: '100%' }} size="small">
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Text style={{ fontSize: '12px' }}>Today's Total:</Text>
                      <Badge count={stats.totalToday} showZero />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Text style={{ fontSize: '12px' }}>This Month:</Text>
                      <Badge count={stats.totalMonth} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Text style={{ fontSize: '12px' }}>Pending:</Text>
                      <Badge 
                        count={stats.pendingCount} 
                        style={{ backgroundColor: '#faad14' }}
                      />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Text style={{ fontSize: '12px' }}>Departments:</Text>
                      <Badge 
                        count={stats.departmentCount}
                        style={{ backgroundColor: '#52c41a' }}
                      />
                    </div>
                  </Space>
                </Card>
              </Space>
            </Col>
          )}
        </Row>

        {/* Appointment Details Modal */}
        <Modal
          title={
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CalendarOutlined />
              Appointment Details - {selectedAppointment?.appointmentId}
            </div>
          }
          open={modalVisible}
          onCancel={() => setModalVisible(false)}
          footer={[
            <Button key="close" onClick={() => setModalVisible(false)}>
              Close
            </Button>,
            <Button key="edit" type="primary" icon={<EditOutlined />}>
              Edit Appointment
            </Button>
          ]}
          width={800}
        >
          {selectedAppointment && (
            <div>
              {/* Header with status and department */}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: '16px',
                padding: '12px',
                background: '#f5f5f5',
                borderRadius: '6px'
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
                    {getDepartmentIcon(selectedAppointment.departmentCode)}
                    <Title level={4} style={{ margin: 0, marginLeft: 8 }}>
                      {selectedAppointment.title || selectedAppointment.serviceType}
                    </Title>
                  </div>
                  <Text type="secondary">{selectedAppointment.serviceDetails?.referenceId}</Text>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <Tag color={getStatusColor(selectedAppointment.status)} style={{ textTransform: 'capitalize', marginBottom: 4 }}>
                    {selectedAppointment.status}
                  </Tag>
                  <div>
                    <Text strong style={{ color: '#52c41a' }}>{selectedAppointment.fee}</Text>
                  </div>
                </div>
              </div>

              <Row gutter={[16, 16]}>
                {/* Appointment Info */}
                <Col span={12}>
                  <Card title="Appointment Information" size="small">
                    <Descriptions column={1} size="small" colon={false}>
                      <Descriptions.Item 
                        label={<span><CalendarOutlined /> Date</span>}
                      >
                        {dayjs(selectedAppointment.date || selectedAppointment.appointmentDate).format('MMMM DD, YYYY')}
                      </Descriptions.Item>
                      <Descriptions.Item 
                        label={<span><ClockCircleOutlined /> Time</span>}
                      >
                        {selectedAppointment.time || selectedAppointment.appointmentTime} ({selectedAppointment.duration || selectedAppointment.estimatedDuration})
                      </Descriptions.Item>
                      <Descriptions.Item 
                        label={<span><UserOutlined /> Officer</span>}
                      >
                        {selectedAppointment.officer} ({selectedAppointment.officerID})
                      </Descriptions.Item>
                      <Descriptions.Item 
                        label={<span><BankOutlined /> Department</span>}
                      >
                        {selectedAppointment.department}
                      </Descriptions.Item>
                      <Descriptions.Item 
                        label={<span><DollarOutlined /> Fee</span>}
                      >
                        {selectedAppointment.fee}
                      </Descriptions.Item>
                    </Descriptions>
                  </Card>
                </Col>

                {/* Citizen Info */}
                <Col span={12}>
                  <Card title="Citizen Information" size="small">
                    <Descriptions column={1} size="small" colon={false}>
                      <Descriptions.Item 
                        label={<span><UserOutlined /> Name</span>}
                      >
                        {selectedAppointment.citizenName}
                      </Descriptions.Item>
                      <Descriptions.Item 
                        label={<span><IdcardOutlined /> NIC</span>}
                      >
                        {selectedAppointment.citizenNIC}
                      </Descriptions.Item>
                      <Descriptions.Item 
                        label={<span><MailOutlined /> Email</span>}
                      >
                        {selectedAppointment.citizenEmail}
                      </Descriptions.Item>
                      <Descriptions.Item 
                        label={<span><PhoneOutlined /> Phone</span>}
                      >
                        {selectedAppointment.citizenPhone}
                      </Descriptions.Item>
                    </Descriptions>
                  </Card>
                </Col>
              </Row>

              {/* Service Details */}
              {selectedAppointment.serviceDetails && (
                <Card title="Service Details" style={{ marginTop: 16 }} size="small">
                  <Descriptions column={2} size="small" colon={false}>
                    <Descriptions.Item 
                      label={<span><FileTextOutlined /> Reference ID</span>}
                    >
                      {selectedAppointment.serviceDetails.referenceId}
                    </Descriptions.Item>
                    <Descriptions.Item 
                      label="Category"
                    >
                      <Tag>{selectedAppointment.serviceCategory}</Tag>
                    </Descriptions.Item>
                    
                    {/* Dynamic service details based on type */}
                    {selectedAppointment.serviceDetails.type === 'land' && (
                      <>
                        <Descriptions.Item label="Location">
                          {selectedAppointment.serviceDetails.location}
                        </Descriptions.Item>
                        <Descriptions.Item label="Land Type">
                          {selectedAppointment.serviceDetails.landType}
                        </Descriptions.Item>
                        <Descriptions.Item label="Extent">
                          {selectedAppointment.serviceDetails.extent}
                        </Descriptions.Item>
                      </>
                    )}
                    
                    {selectedAppointment.serviceDetails.type === 'license' && (
                      <>
                        <Descriptions.Item label="License Class">
                          {selectedAppointment.serviceDetails.licenseClass}
                        </Descriptions.Item>
                        <Descriptions.Item label="Expiry Date">
                          {selectedAppointment.serviceDetails.expiryDate}
                        </Descriptions.Item>
                      </>
                    )}
                    
                    {selectedAppointment.serviceDetails.type === 'passport' && (
                      <>
                        <Descriptions.Item label="Passport Type">
                          {selectedAppointment.serviceDetails.passportType}
                        </Descriptions.Item>
                        <Descriptions.Item label="Processing Time">
                          {selectedAppointment.serviceDetails.processingTime}
                        </Descriptions.Item>
                      </>
                    )}
                    
                    {selectedAppointment.serviceDetails.type === 'business' && (
                      <>
                        <Descriptions.Item label="Business Type">
                          {selectedAppointment.serviceDetails.businessType}
                        </Descriptions.Item>
                        <Descriptions.Item label="Location">
                          {selectedAppointment.serviceDetails.location}
                        </Descriptions.Item>
                      </>
                    )}
                    
                    {selectedAppointment.serviceDetails.type === 'medical' && (
                      <>
                        <Descriptions.Item label="Certificate Type">
                          {selectedAppointment.serviceDetails.certificateType}
                        </Descriptions.Item>
                        <Descriptions.Item label="Purpose">
                          {selectedAppointment.serviceDetails.purpose}
                        </Descriptions.Item>
                      </>
                    )}
                    
                    {selectedAppointment.serviceDetails.type === 'education' && (
                      <>
                        <Descriptions.Item label="Grade">
                          {selectedAppointment.serviceDetails.grade}
                        </Descriptions.Item>
                        <Descriptions.Item label="School">
                          {selectedAppointment.serviceDetails.schoolName}
                        </Descriptions.Item>
                      </>
                    )}
                  </Descriptions>
                </Card>
              )}

              {/* Documents & Notes */}
              {(selectedAppointment.documents || selectedAppointment.notes) && (
                <Card title="Documents & Notes" style={{ marginTop: 16 }} size="small">
                  {selectedAppointment.documents && (
                    <div style={{ marginBottom: 16 }}>
                      <Text strong>Required Documents:</Text>
                      <div style={{ marginTop: 8 }}>
                        {selectedAppointment.documents.map((doc, index) => (
                          <Tag key={index} icon={<FileTextOutlined />} style={{ margin: 4 }}>
                            {doc}
                          </Tag>
                        ))}
                      </div>
                    </div>
                  )}
                  {selectedAppointment.notes && (
                    <div>
                      <Text strong>Officer Notes:</Text>
                      <div style={{ marginTop: 8, padding: 12, background: '#f5f5f5', borderRadius: 4 }}>
                        {selectedAppointment.notes}
                      </div>
                    </div>
                  )}
                </Card>
              )}
            </div>
          )}
        </Modal>
      </div>
    </AdminLayout>
  );
};

export default AppointmentCalendar;