// src/pages/admin/calendar.jsx
import React, { useState } from 'react';
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
  Divider
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
  EditOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Option } = Select;

const AppointmentCalendar = () => {
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [viewMode, setViewMode] = useState('month'); // month, week, day
  const [showLegend, setShowLegend] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');

  // Sample appointment data with calendar-specific formatting
  const appointmentsData = [
    {
      id: '1',
      appointmentId: 'APT-2025-001',
      title: 'Land Title Registration',
      citizenName: 'Kamal Perera',
      citizenEmail: 'kamal.perera@email.com',
      citizenPhone: '+94 71 234 5678',
      date: '2025-08-15',
      time: '10:00 AM',
      duration: '1 hour',
      status: 'confirmed',
      priority: 'high',
      officer: 'Ms. Nimalka Fernando',
      landDetails: {
        landId: 'LAND-COL-2024-456',
        location: 'Colombo 07, Cinnamon Gardens',
        landType: 'Residential',
        extent: '15 Perches'
      },
      color: '#1890ff',
      statusColor: 'blue'
    },
    {
      id: '2',
      appointmentId: 'APT-2025-002',
      title: 'Property Transfer',
      citizenName: 'Ruwan Silva',
      citizenEmail: 'ruwan.silva@email.com',
      citizenPhone: '+94 77 987 6543',
      date: '2025-08-15',
      time: '02:30 PM',
      duration: '45 minutes',
      status: 'pending',
      priority: 'medium',
      officer: 'Mr. Asanka Wijayaratne',
      landDetails: {
        landId: 'LAND-GAL-2024-789',
        location: 'Galle, Unawatuna Beach Road',
        landType: 'Commercial',
        extent: '25 Perches'
      },
      color: '#faad14',
      statusColor: 'orange'
    },
    {
      id: '3',
      appointmentId: 'APT-2025-003',
      title: 'Land Survey Verification',
      citizenName: 'Priya Rathnayake',
      citizenEmail: 'priya.rathnayake@email.com',
      citizenPhone: '+94 70 111 2233',
      date: '2025-08-16',
      time: '09:00 AM',
      duration: '2 hours',
      status: 'completed',
      priority: 'low',
      officer: 'Mr. Chandana Jayasinghe',
      landDetails: {
        landId: 'LAND-KAN-2024-123',
        location: 'Kandy, Peradeniya Road',
        landType: 'Agricultural',
        extent: '2 Acres 15 Perches'
      },
      color: '#52c41a',
      statusColor: 'green'
    },
    {
      id: '4',
      appointmentId: 'APT-2025-004',
      title: 'Deed Verification',
      citizenName: 'Nilantha Gunasekara',
      citizenEmail: 'nilantha.g@email.com',
      citizenPhone: '+94 75 444 5566',
      date: '2025-08-16',
      time: '11:30 AM',
      duration: '30 minutes',
      status: 'cancelled',
      priority: 'medium',
      officer: 'Ms. Kamani Dissanayake',
      landDetails: {
        landId: 'LAND-JA-2024-987',
        location: 'Jaffna, Nallur Road',
        landType: 'Residential',
        extent: '8 Perches'
      },
      color: '#ff4d4f',
      statusColor: 'red'
    },
    {
      id: '5',
      appointmentId: 'APT-2025-005',
      title: 'Land Registration',
      citizenName: 'Saman Kumara',
      citizenEmail: 'saman.kumara@email.com',
      citizenPhone: '+94 76 555 7788',
      date: '2025-08-17',
      time: '10:30 AM',
      duration: '1.5 hours',
      status: 'confirmed',
      priority: 'high',
      officer: 'Ms. Nimalka Fernando',
      landDetails: {
        landId: 'LAND-MTR-2024-555',
        location: 'Matara, Beach Road',
        landType: 'Commercial',
        extent: '12 Perches'
      },
      color: '#722ed1',
      statusColor: 'purple'
    }
  ];

  // Get appointments for a specific date
  const getAppointmentsForDate = (date) => {
    const dateStr = date.format('YYYY-MM-DD');
    return appointmentsData.filter(apt => 
      apt.date === dateStr && 
      (filterStatus === 'all' || apt.status === filterStatus)
    );
  };

  // Calendar cell render function
  const dateCellRender = (value) => {
    const appointments = getAppointmentsForDate(value);
    
    return (
      <div style={{ minHeight: 80 }}>
        {appointments.map((appointment, index) => (
          <div
            key={appointment.id}
            style={{
              background: appointment.color,
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
              {appointment.title}
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Handle appointment click
  const handleAppointmentClick = (appointment) => {
    setSelectedAppointment(appointment);
    setModalVisible(true);
  };

  // Handle date select
  const onDateSelect = (date) => {
    setSelectedDate(date);
  };

  // Status legend data
  const statusLegend = [
    { status: 'confirmed', color: '#1890ff', label: 'Confirmed' },
    { status: 'pending', color: '#faad14', label: 'Pending' },
    { status: 'completed', color: '#52c41a', label: 'Completed' },
    { status: 'cancelled', color: '#ff4d4f', label: 'Cancelled' },
    { status: 'rescheduled', color: '#722ed1', label: 'Rescheduled' }
  ];

  return (
    <AdminLayout pageTitle="Appointment Calendar">
      <div>
        <div style={{ marginBottom: '24px' }}>
          <Row justify="space-between" align="middle">
            <Col>
              <Title level={2} style={{ margin: 0 }}>
                Appointment Calendar
              </Title>
              <Text type="secondary">
                View and manage land service appointments in calendar format
              </Text>
            </Col>
            <Col>
              <Space>
                <Select
                  style={{ width: 150 }}
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
              </Space>
            </Col>
          </Row>
        </div>

        <Row gutter={[16, 16]}>
          {/* Calendar */}
          <Col xs={24} lg={showLegend ? 18 : 24}>
            <Card>
              <Calendar
                value={selectedDate}
                onSelect={onDateSelect}
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
                          onClick={() => onChange(value.clone().subtract(1, 'month'))}
                        />
                        <Select
                          size="small"
                          value={month}
                          onChange={(selectedMonth) => {
                            const newValue = value.clone().month(selectedMonth);
                            onChange(newValue);
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
                          }}
                        >
                          {options}
                        </Select>
                        <Button 
                          type="text" 
                          icon={<RightOutlined />} 
                          onClick={() => onChange(value.clone().add(1, 'month'))}
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

                {/* Today's Appointments */}
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
                            border: `1px solid ${appointment.color}`,
                            borderLeft: `4px solid ${appointment.color}`,
                            borderRadius: '4px',
                            cursor: 'pointer',
                            background: '#fafafa'
                          }}
                          onClick={() => handleAppointmentClick(appointment)}
                        >
                          <div style={{ fontWeight: 600, fontSize: '12px' }}>
                            {appointment.time} - {appointment.citizenName}
                          </div>
                          <div style={{ fontSize: '11px', color: '#666' }}>
                            {appointment.title}
                          </div>
                          <div style={{ fontSize: '10px', color: '#888' }}>
                            {appointment.landDetails.location}
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
                      <Badge count={getAppointmentsForDate(dayjs()).length} showZero />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Text style={{ fontSize: '12px' }}>This Month:</Text>
                      <Badge count={appointmentsData.length} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Text style={{ fontSize: '12px' }}>Pending:</Text>
                      <Badge 
                        count={appointmentsData.filter(apt => apt.status === 'pending').length} 
                        style={{ backgroundColor: '#faad14' }}
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
          width={700}
        >
          {selectedAppointment && (
            <div>
              {/* Header with status */}
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
                  <Title level={4} style={{ margin: 0 }}>
                    {selectedAppointment.title}
                  </Title>
                  <Text type="secondary">{selectedAppointment.landDetails.landId}</Text>
                </div>
                <Tag color={selectedAppointment.statusColor} style={{ textTransform: 'capitalize' }}>
                  {selectedAppointment.status}
                </Tag>
              </div>

              <Row gutter={[16, 16]}>
                {/* Appointment Info */}
                <Col span={12}>
                  <Card title="Appointment Information" size="small">
                    <Descriptions column={1} size="small" colon={false}>
                      <Descriptions.Item 
                        label={<span><CalendarOutlined /> Date</span>}
                      >
                        {dayjs(selectedAppointment.date).format('MMMM DD, YYYY')}
                      </Descriptions.Item>
                      <Descriptions.Item 
                        label={<span><ClockCircleOutlined /> Time</span>}
                      >
                        {selectedAppointment.time} ({selectedAppointment.duration})
                      </Descriptions.Item>
                      <Descriptions.Item 
                        label={<span><UserOutlined /> Officer</span>}
                      >
                        {selectedAppointment.officer}
                      </Descriptions.Item>
                      <Descriptions.Item 
                        label={<span><BankOutlined /> Service</span>}
                      >
                        {selectedAppointment.title}
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

              {/* Land Details */}
              <Card title="Land Information" style={{ marginTop: 16 }} size="small">
                <Descriptions column={2} size="small" colon={false}>
                  <Descriptions.Item 
                    label={<span><FileTextOutlined /> Land ID</span>}
                  >
                    {selectedAppointment.landDetails.landId}
                  </Descriptions.Item>
                  <Descriptions.Item 
                    label={<span><BankOutlined /> Type</span>}
                  >
                    <Tag>{selectedAppointment.landDetails.landType}</Tag>
                  </Descriptions.Item>
                  <Descriptions.Item 
                    label={<span><EnvironmentOutlined /> Location</span>}
                    span={2}
                  >
                    {selectedAppointment.landDetails.location}
                  </Descriptions.Item>
                  <Descriptions.Item 
                    label="Extent"
                  >
                    {selectedAppointment.landDetails.extent}
                  </Descriptions.Item>
                </Descriptions>
              </Card>
            </div>
          )}
        </Modal>
      </div>
    </AdminLayout>
  );
};

export default AppointmentCalendar;