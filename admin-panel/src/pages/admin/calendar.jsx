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
  EditOutlined,
  CarOutlined,
  MedicineBoxOutlined,
  BookOutlined,
  HomeOutlined,
  IdcardOutlined,
  DollarOutlined
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
  const [filterDepartment, setFilterDepartment] = useState('all');

  // Enhanced government services appointment data with calendar-specific formatting
  const appointmentsData = [
    {
      id: '1',
      appointmentId: 'APT-LR-2025-001',
      title: 'Land Title Registration',
      citizenName: 'Kamal Perera',
      citizenEmail: 'kamal.perera@email.com',
      citizenPhone: '+94 71 234 5678',
      citizenNIC: '875672341V',
      date: '2025-08-15',
      time: '10:00 AM',
      duration: '60 minutes',
      status: 'confirmed',
      priority: 'high',
      officer: 'Ms. Nimalka Fernando',
      officerID: 'LR001',
      department: 'Land Registry',
      departmentCode: 'LR',
      serviceCategory: 'Registration',
      fee: 'LKR 5,000',
      serviceDetails: {
        type: 'land',
        referenceId: 'LAND-COL-2024-456',
        location: 'Colombo 07, Cinnamon Gardens',
        landType: 'Residential',
        extent: '15 Perches'
      },
      color: '#52c41a',
      statusColor: 'blue'
    },
    {
      id: '2',
      appointmentId: 'APT-DMT-2025-002',
      title: 'Driving License Renewal',
      citizenName: 'Ruwan Silva',
      citizenEmail: 'ruwan.silva@email.com',
      citizenPhone: '+94 77 987 6543',
      citizenNIC: '923456789V',
      date: '2025-08-15',
      time: '02:30 PM',
      duration: '30 minutes',
      status: 'pending',
      priority: 'medium',
      officer: 'Mr. Asanka Wijayaratne',
      officerID: 'DMT015',
      department: 'Department of Motor Traffic',
      departmentCode: 'DMT',
      serviceCategory: 'License Services',
      fee: 'LKR 2,500',
      serviceDetails: {
        type: 'license',
        referenceId: 'DL-B7834521',
        licenseClass: 'B1 (Light Vehicle)',
        expiryDate: '2025-09-15'
      },
      color: '#faad14',
      statusColor: 'orange'
    },
    {
      id: '3',
      appointmentId: 'APT-DIE-2025-003',
      title: 'Passport Application',
      citizenName: 'Priya Rathnayake',
      citizenEmail: 'priya.rathnayake@email.com',
      citizenPhone: '+94 70 111 2233',
      citizenNIC: '856789123V',
      date: '2025-08-16',
      time: '09:00 AM',
      duration: '45 minutes',
      status: 'completed',
      priority: 'low',
      officer: 'Mr. Chandana Jayasinghe',
      officerID: 'DIE008',
      department: 'Department of Immigration & Emigration',
      departmentCode: 'DIE',
      serviceCategory: 'Travel Documents',
      fee: 'LKR 3,500',
      serviceDetails: {
        type: 'passport',
        referenceId: 'PASS-APP-789456',
        passportType: 'Ordinary Passport',
        processingTime: '10 working days'
      },
      color: '#52c41a',
      statusColor: 'green'
    },
    {
      id: '4',
      appointmentId: 'APT-MUN-2025-004',
      title: 'Business Registration',
      citizenName: 'Nilantha Gunasekara',
      citizenEmail: 'nilantha.g@email.com',
      citizenPhone: '+94 75 444 5566',
      citizenNIC: '791234567V',
      date: '2025-08-16',
      time: '11:30 AM',
      duration: '90 minutes',
      status: 'cancelled',
      priority: 'medium',
      officer: 'Ms. Kamani Dissanayake',
      officerID: 'MUN023',
      department: 'Municipal Council',
      departmentCode: 'MUN',
      serviceCategory: 'Licenses & Permits',
      fee: 'LKR 7,500',
      serviceDetails: {
        type: 'business',
        referenceId: 'BIZ-REG-2025-156',
        businessType: 'Retail Store',
        location: 'Colombo 03'
      },
      color: '#ff4d4f',
      statusColor: 'red'
    },
    {
      id: '5',
      appointmentId: 'APT-MOH-2025-005',
      title: 'Medical Certificate',
      citizenName: 'Sunil Wickramasinghe',
      citizenEmail: 'sunil.w@email.com',
      citizenPhone: '+94 72 567 8901',
      citizenNIC: '701234567V',
      date: '2025-08-17',
      time: '03:00 PM',
      duration: '30 minutes',
      status: 'confirmed',
      priority: 'high',
      officer: 'Dr. Amara Fernando',
      officerID: 'MOH045',
      department: 'Ministry of Health',
      departmentCode: 'MOH',
      serviceCategory: 'Health Services',
      fee: 'LKR 1,500',
      serviceDetails: {
        type: 'medical',
        referenceId: 'MED-CERT-789',
        certificateType: 'Employment Medical',
        purpose: 'Overseas Employment'
      },
      color: '#1890ff',
      statusColor: 'blue'
    },
    {
      id: '6',
      appointmentId: 'APT-MOE-2025-006',
      title: 'School Admission',
      citizenName: 'Malini Jayawardena',
      citizenEmail: 'malini.j@email.com',
      citizenPhone: '+94 76 789 0123',
      citizenNIC: '845678901V',
      date: '2025-08-17',
      time: '10:00 AM',
      duration: '45 minutes',
      status: 'pending',
      priority: 'medium',
      officer: 'Mrs. Sandamali Perera',
      officerID: 'MOE012',
      department: 'Ministry of Education',
      departmentCode: 'MOE',
      serviceCategory: 'Educational Services',
      fee: 'LKR 500',
      serviceDetails: {
        type: 'education',
        referenceId: 'EDU-ADM-456789',
        grade: 'Grade 1',
        schoolName: 'Nalanda College'
      },
      color: '#722ed1',
      statusColor: 'purple'
    }
  ];

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

  // Get appointments for a specific date
  const getAppointmentsForDate = (date) => {
    const dateStr = date.format('YYYY-MM-DD');
    return appointmentsData.filter(apt => 
      apt.date === dateStr && 
      (filterStatus === 'all' || apt.status === filterStatus) &&
      (filterDepartment === 'all' || apt.departmentCode === filterDepartment)
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
              {appointment.departmentCode}: {appointment.title}
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

  // Department legend data
  const departmentLegend = [
    { code: 'LR', name: 'Land Registry', color: '#52c41a', icon: <HomeOutlined /> },
    { code: 'DMT', name: 'Motor Traffic', color: '#faad14', icon: <CarOutlined /> },
    { code: 'DIE', name: 'Immigration', color: '#1890ff', icon: <IdcardOutlined /> },
    { code: 'MUN', name: 'Municipal', color: '#ff4d4f', icon: <BankOutlined /> },
    { code: 'MOH', name: 'Health', color: '#722ed1', icon: <MedicineBoxOutlined /> },
    { code: 'MOE', name: 'Education', color: '#eb2f96', icon: <BookOutlined /> }
  ];

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
                >
                  <Option value="all">All Departments</Option>
                  <Option value="LR">Land Registry</Option>
                  <Option value="DMT">Motor Traffic</Option>
                  <Option value="DIE">Immigration</Option>
                  <Option value="MUN">Municipal</Option>
                  <Option value="MOH">Health</Option>
                  <Option value="MOE">Education</Option>
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
                {/* Department Legend */}
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
                            border: `1px solid ${appointment.color}`,
                            borderLeft: `4px solid ${appointment.color}`,
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
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Text style={{ fontSize: '12px' }}>Departments:</Text>
                      <Badge 
                        count={new Set(appointmentsData.map(apt => apt.departmentCode)).size}
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
                      {selectedAppointment.title}
                    </Title>
                  </div>
                  <Text type="secondary">{selectedAppointment.serviceDetails.referenceId}</Text>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <Tag color={selectedAppointment.statusColor} style={{ textTransform: 'capitalize', marginBottom: 4 }}>
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
            </div>
          )}
        </Modal>
      </div>
    </AdminLayout>
  );
};

export default AppointmentCalendar;