import React, { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { 
  Typography, 
  Table, 
  Tag, 
  Space, 
  Button, 
  Input, 
  Select, 
  DatePicker, 
  Modal, 
  Form, 
  Card, 
  Row, 
  Col,
  Descriptions,
  Upload,
  message,
  Popconfirm,
  Badge,
  Tooltip
} from 'antd';
import {
  SearchOutlined,
  CalendarOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  CheckOutlined,
  CloseOutlined,
  DownloadOutlined,
  FileTextOutlined,
  EnvironmentOutlined,
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  BankOutlined,
  CarOutlined,
  MedicineBoxOutlined,
  BookOutlined,
  HomeOutlined,
  IdcardOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

const AppointmentsManagement = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [serviceFilter, setServiceFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [dateRange, setDateRange] = useState(null);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [rescheduleModalVisible, setRescheduleModalVisible] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [form] = Form.useForm();

  // Enhanced government services appointment data
  const appointmentsData = [
    {
      key: '1',
      appointmentId: 'APT-LR-2025-001',
      citizenName: 'Kamal Perera',
      citizenEmail: 'kamal.perera@email.com',
      citizenPhone: '+94 71 234 5678',
      citizenNIC: '875672341V',
      department: 'Land Registry',
      departmentCode: 'LR',
      serviceType: 'Land Title Registration',
      serviceCategory: 'Registration',
      appointmentDate: '2025-08-15',
      appointmentTime: '10:00 AM',
      status: 'confirmed',
      officer: 'Ms. Nimalka Fernando',
      officerID: 'LR001',
      documents: ['Title Deed', 'Survey Plan', 'NIC Copy', 'Application Form'],
      priority: 'high',
      notes: 'First-time registration. All documents verified.',
      createdDate: '2025-08-10',
      estimatedDuration: '60 minutes',
      fee: 'LKR 5,000',
      serviceDetails: {
        type: 'land',
        referenceId: 'LAND-COL-2024-456',
        location: 'Colombo 07, Cinnamon Gardens',
        landType: 'Residential',
        extent: '15 Perches'
      }
    },
    {
      key: '2',
      appointmentId: 'APT-DMT-2025-002',
      citizenName: 'Ruwan Silva',
      citizenEmail: 'ruwan.silva@email.com',
      citizenPhone: '+94 77 987 6543',
      citizenNIC: '923456789V',
      department: 'Department of Motor Traffic',
      departmentCode: 'DMT',
      serviceType: 'Driving License Renewal',
      serviceCategory: 'License Services',
      appointmentDate: '2025-08-16',
      appointmentTime: '02:30 PM',
      status: 'pending',
      officer: 'Mr. Asanka Wijayaratne',
      officerID: 'DMT015',
      documents: ['Current License', 'Medical Certificate', 'NIC Copy'],
      priority: 'medium',
      notes: 'License expires next month. Medical test completed.',
      createdDate: '2025-08-11',
      estimatedDuration: '30 minutes',
      fee: 'LKR 2,500',
      serviceDetails: {
        type: 'license',
        referenceId: 'DL-B7834521',
        licenseClass: 'B1 (Light Vehicle)',
        expiryDate: '2025-09-15',
        issuedDate: '2020-09-15'
      }
    },
    {
      key: '3',
      appointmentId: 'APT-DIE-2025-003',
      citizenName: 'Priya Rathnayake',
      citizenEmail: 'priya.rathnayake@email.com',
      citizenPhone: '+94 70 111 2233',
      citizenNIC: '856789123V',
      department: 'Department of Immigration & Emigration',
      departmentCode: 'DIE',
      serviceType: 'Passport Application',
      serviceCategory: 'Travel Documents',
      appointmentDate: '2025-08-14',
      appointmentTime: '09:00 AM',
      status: 'completed',
      officer: 'Mr. Chandana Jayasinghe',
      officerID: 'DIE008',
      documents: ['Birth Certificate', 'NIC Copy', 'Photographs', 'Application Form'],
      priority: 'low',
      notes: 'First-time passport application. All documents verified.',
      createdDate: '2025-08-08',
      estimatedDuration: '45 minutes',
      fee: 'LKR 3,500',
      serviceDetails: {
        type: 'passport',
        referenceId: 'PASS-APP-789456',
        passportType: 'Ordinary Passport',
        processingTime: '10 working days',
        deliveryMethod: 'Postal'
      }
    },
    {
      key: '4',
      appointmentId: 'APT-MUN-2025-004',
      citizenName: 'Nilantha Gunasekara',
      citizenEmail: 'nilantha.g@email.com',
      citizenPhone: '+94 75 444 5566',
      citizenNIC: '791234567V',
      department: 'Municipal Council',
      departmentCode: 'MUN',
      serviceType: 'Business Registration',
      serviceCategory: 'Licenses & Permits',
      appointmentDate: '2025-08-17',
      appointmentTime: '11:30 AM',
      status: 'cancelled',
      officer: 'Ms. Kamani Dissanayake',
      officerID: 'MUN023',
      documents: ['Business Plan', 'Property Deed', 'NIC Copy', 'Bank Statement'],
      priority: 'medium',
      notes: 'Cancelled by citizen - rescheduling requested.',
      createdDate: '2025-08-09',
      estimatedDuration: '90 minutes',
      fee: 'LKR 7,500',
      serviceDetails: {
        type: 'business',
        referenceId: 'BIZ-REG-2025-156',
        businessType: 'Retail Store',
        location: 'Colombo 03',
        expectedEmployees: '5-10'
      }
    },
    {
      key: '5',
      appointmentId: 'APT-MOH-2025-005',
      citizenName: 'Sunil Wickramasinghe',
      citizenEmail: 'sunil.w@email.com',
      citizenPhone: '+94 72 567 8901',
      citizenNIC: '701234567V',
      department: 'Ministry of Health',
      departmentCode: 'MOH',
      serviceType: 'Medical Certificate',
      serviceCategory: 'Health Services',
      appointmentDate: '2025-08-18',
      appointmentTime: '03:00 PM',
      status: 'confirmed',
      officer: 'Dr. Amara Fernando',
      officerID: 'MOH045',
      documents: ['Previous Medical Records', 'NIC Copy', 'Employer Letter'],
      priority: 'high',
      notes: 'Employment medical certificate for overseas work.',
      createdDate: '2025-08-12',
      estimatedDuration: '30 minutes',
      fee: 'LKR 1,500',
      serviceDetails: {
        type: 'medical',
        referenceId: 'MED-CERT-789',
        certificateType: 'Employment Medical',
        purpose: 'Overseas Employment',
        validityPeriod: '6 months'
      }
    },
    {
      key: '6',
      appointmentId: 'APT-MOE-2025-006',
      citizenName: 'Malini Jayawardena',
      citizenEmail: 'malini.j@email.com',
      citizenPhone: '+94 76 789 0123',
      citizenNIC: '845678901V',
      department: 'Ministry of Education',
      departmentCode: 'MOE',
      serviceType: 'School Admission',
      serviceCategory: 'Educational Services',
      appointmentDate: '2025-08-19',
      appointmentTime: '10:00 AM',
      status: 'pending',
      officer: 'Mrs. Sandamali Perera',
      officerID: 'MOE012',
      documents: ['Birth Certificate', 'Previous School Records', 'Parent NIC', 'Address Proof'],
      priority: 'medium',
      notes: 'Grade 1 admission application for academic year 2026.',
      createdDate: '2025-08-13',
      estimatedDuration: '45 minutes',
      fee: 'LKR 500',
      serviceDetails: {
        type: 'education',
        referenceId: 'EDU-ADM-456789',
        grade: 'Grade 1',
        schoolName: 'Nalanda College',
        academicYear: '2026',
        medium: 'Sinhala'
      }
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

  const getStatusColor = (status) => {
    const colors = {
      'pending': 'orange',
      'confirmed': 'blue',
      'completed': 'green',
      'cancelled': 'red',
      'rescheduled': 'purple'
    };
    return colors[status] || 'default';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      'high': 'red',
      'medium': 'orange',
      'low': 'green'
    };
    return colors[priority] || 'default';
  };

  const handleViewDetails = (record) => {
    setSelectedAppointment(record);
    setDetailsModalVisible(true);
  };

  const handleReschedule = (record) => {
    setSelectedAppointment(record);
    setRescheduleModalVisible(true);
    form.setFieldsValue({
      appointmentDate: dayjs(record.appointmentDate),
      appointmentTime: record.appointmentTime,
    });
  };

  const handleStatusChange = (appointmentId, newStatus) => {
    message.success(`Appointment ${appointmentId} status changed to ${newStatus}`);
    // Add API call here
  };

  const handleRescheduleSubmit = (values) => {
    message.success(`Appointment ${selectedAppointment.appointmentId} rescheduled successfully`);
    setRescheduleModalVisible(false);
    form.resetFields();
    // Add API call here
  };

  const handleCancel = (appointmentId) => {
    message.success(`Appointment ${appointmentId} cancelled successfully`);
    // Add API call here
  };

  const columns = [
    {
      title: 'Appointment ID',
      dataIndex: 'appointmentId',
      key: 'appointmentId',
      render: (text) => <Text strong style={{ color: '#1890ff' }}>{text}</Text>,
    },
    {
      title: 'Citizen Details',
      key: 'citizen',
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 600 }}>{record.citizenName}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            <IdcardOutlined style={{ marginRight: 4 }} />
            {record.citizenNIC}
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            <PhoneOutlined style={{ marginRight: 4 }} />
            {record.citizenPhone}
          </div>
        </div>
      ),
    },
    {
      title: 'Department & Service',
      key: 'service',
      render: (_, record) => (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
            {getDepartmentIcon(record.departmentCode)}
            <Text strong style={{ marginLeft: 8, fontSize: '13px' }}>
              {record.department}
            </Text>
          </div>
          <Tag color="blue" size="small">{record.serviceType}</Tag>
          <div style={{ fontSize: '11px', color: '#666', marginTop: 2 }}>
            {record.serviceCategory}
          </div>
        </div>
      ),
    },
    {
      title: 'Reference Details',
      key: 'reference',
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 600, color: '#1890ff', fontSize: '12px' }}>
            {record.serviceDetails.referenceId}
          </div>
          {record.serviceDetails.type === 'land' && (
            <div style={{ fontSize: '11px', color: '#666' }}>
              <EnvironmentOutlined style={{ marginRight: 4 }} />
              {record.serviceDetails.location}
            </div>
          )}
          {record.serviceDetails.type === 'license' && (
            <div style={{ fontSize: '11px', color: '#666' }}>
              Class: {record.serviceDetails.licenseClass}
            </div>
          )}
          {record.serviceDetails.type === 'passport' && (
            <div style={{ fontSize: '11px', color: '#666' }}>
              {record.serviceDetails.passportType}
            </div>
          )}
          {record.serviceDetails.type === 'business' && (
            <div style={{ fontSize: '11px', color: '#666' }}>
              {record.serviceDetails.businessType}
            </div>
          )}
          {record.serviceDetails.type === 'medical' && (
            <div style={{ fontSize: '11px', color: '#666' }}>
              {record.serviceDetails.certificateType}
            </div>
          )}
          {record.serviceDetails.type === 'education' && (
            <div style={{ fontSize: '11px', color: '#666' }}>
              {record.serviceDetails.grade} - {record.serviceDetails.schoolName}
            </div>
          )}
        </div>
      ),
    },
    {
      title: 'Date & Time',
      key: 'datetime',
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 600 }}>
            <CalendarOutlined style={{ marginRight: 4 }} />
            {dayjs(record.appointmentDate).format('MMM DD, YYYY')}
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            {record.appointmentTime} ({record.estimatedDuration})
          </div>
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={getStatusColor(status)} style={{ textTransform: 'capitalize' }}>
          {status}
        </Tag>
      ),
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      render: (priority) => (
        <Badge 
          color={getPriorityColor(priority)} 
          text={priority.toUpperCase()} 
        />
      ),
    },
    {
      title: 'Officer',
      key: 'officer',
      render: (_, record) => (
        <div style={{ fontSize: '12px' }}>
          <UserOutlined style={{ marginRight: 4 }} />
          <div>{record.officer}</div>
          <Text type="secondary" style={{ fontSize: '11px' }}>
            ID: {record.officerID}
          </Text>
        </div>
      ),
    },
    {
      title: 'Fee',
      dataIndex: 'fee',
      key: 'fee',
      render: (fee) => (
        <Text strong style={{ color: '#52c41a' }}>{fee}</Text>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="View Details">
            <Button 
              type="text" 
              icon={<EyeOutlined />} 
              onClick={() => handleViewDetails(record)}
            />
          </Tooltip>
          
          {record.status === 'pending' && (
            <Tooltip title="Confirm Appointment">
              <Button 
                type="text" 
                icon={<CheckOutlined />} 
                style={{ color: '#52c41a' }}
                onClick={() => handleStatusChange(record.appointmentId, 'confirmed')}
              />
            </Tooltip>
          )}
          
          {(record.status === 'pending' || record.status === 'confirmed') && (
            <Tooltip title="Reschedule">
              <Button 
                type="text" 
                icon={<EditOutlined />} 
                onClick={() => handleReschedule(record)}
              />
            </Tooltip>
          )}
          
          {record.status !== 'completed' && record.status !== 'cancelled' && (
            <Popconfirm
              title="Are you sure you want to cancel this appointment?"
              onConfirm={() => handleCancel(record.appointmentId)}
              okText="Yes"
              cancelText="No"
            >
              <Tooltip title="Cancel Appointment">
                <Button 
                  type="text" 
                  icon={<CloseOutlined />} 
                  danger
                />
              </Tooltip>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  const filteredData = appointmentsData.filter(item => {
    const matchesSearch = searchText === '' || 
      item.citizenName.toLowerCase().includes(searchText.toLowerCase()) ||
      item.appointmentId.toLowerCase().includes(searchText.toLowerCase()) ||
      item.citizenNIC.toLowerCase().includes(searchText.toLowerCase()) ||
      item.serviceDetails.referenceId.toLowerCase().includes(searchText.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    const matchesService = serviceFilter === 'all' || item.serviceType === serviceFilter;
    const matchesDepartment = departmentFilter === 'all' || item.departmentCode === departmentFilter;
    
    return matchesSearch && matchesStatus && matchesService && matchesDepartment;
  });

  return (
    <AdminLayout pageTitle="Appointments Management">
      <div>
        <Title level={2} style={{ marginBottom: '8px' }}>
          Government Services Appointments
        </Title>
        <Text type="secondary" style={{ marginBottom: '24px', display: 'block' }}>
          Manage appointments across all government departments and services
        </Text>

        {/* Filters */}
        <Card style={{ marginBottom: '16px' }}>
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} sm={8} md={5}>
              <Input
                placeholder="Search appointments..."
                prefix={<SearchOutlined />}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </Col>
            <Col xs={24} sm={8} md={4}>
              <Select
                style={{ width: '100%' }}
                placeholder="Department"
                value={departmentFilter}
                onChange={setDepartmentFilter}
              >
                <Option value="all">All Departments</Option>
                <Option value="LR">Land Registry</Option>
                <Option value="DMT">Motor Traffic</Option>
                <Option value="DIE">Immigration</Option>
                <Option value="MUN">Municipal</Option>
                <Option value="MOH">Health</Option>
                <Option value="MOE">Education</Option>
              </Select>
            </Col>
            <Col xs={24} sm={8} md={3}>
              <Select
                style={{ width: '100%' }}
                placeholder="Status"
                value={statusFilter}
                onChange={setStatusFilter}
              >
                <Option value="all">All Status</Option>
                <Option value="pending">Pending</Option>
                <Option value="confirmed">Confirmed</Option>
                <Option value="completed">Completed</Option>
                <Option value="cancelled">Cancelled</Option>
              </Select>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <RangePicker
                style={{ width: '100%' }}
                value={dateRange}
                onChange={setDateRange}
                placeholder={['Start Date', 'End Date']}
              />
            </Col>
          </Row>
        </Card>

        {/* Appointments Table */}
        <Table
          columns={columns}
          dataSource={filteredData}
          rowSelection={{
            selectedRowKeys,
            onChange: setSelectedRowKeys,
          }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `Total ${total} appointments`,
          }}
          scroll={{ x: 1400 }}
          size="middle"
        />

        {/* Appointment Details Modal */}
        <Modal
          title={`Appointment Details - ${selectedAppointment?.appointmentId}`}
          open={detailsModalVisible}
          onCancel={() => setDetailsModalVisible(false)}
          footer={[
            <Button key="close" onClick={() => setDetailsModalVisible(false)}>
              Close
            </Button>,
          ]}
          width={900}
        >
          {selectedAppointment && (
            <div>
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Card title="Citizen Information" size="small">
                    <Descriptions column={1} size="small">
                      <Descriptions.Item label="Name">{selectedAppointment.citizenName}</Descriptions.Item>
                      <Descriptions.Item label="NIC">{selectedAppointment.citizenNIC}</Descriptions.Item>
                      <Descriptions.Item label="Email">{selectedAppointment.citizenEmail}</Descriptions.Item>
                      <Descriptions.Item label="Phone">{selectedAppointment.citizenPhone}</Descriptions.Item>
                    </Descriptions>
                  </Card>
                </Col>
                <Col span={12}>
                  <Card title="Appointment Details" size="small">
                    <Descriptions column={1} size="small">
                      <Descriptions.Item label="Department">{selectedAppointment.department}</Descriptions.Item>
                      <Descriptions.Item label="Service">{selectedAppointment.serviceType}</Descriptions.Item>
                      <Descriptions.Item label="Date">{dayjs(selectedAppointment.appointmentDate).format('MMMM DD, YYYY')}</Descriptions.Item>
                      <Descriptions.Item label="Time">{selectedAppointment.appointmentTime}</Descriptions.Item>
                      <Descriptions.Item label="Duration">{selectedAppointment.estimatedDuration}</Descriptions.Item>
                      <Descriptions.Item label="Fee">{selectedAppointment.fee}</Descriptions.Item>
                      <Descriptions.Item label="Status">
                        <Tag color={getStatusColor(selectedAppointment.status)}>
                          {selectedAppointment.status.toUpperCase()}
                        </Tag>
                      </Descriptions.Item>
                    </Descriptions>
                  </Card>
                </Col>
              </Row>

              <Card title="Service Details" style={{ marginTop: 16 }} size="small">
                <Descriptions column={2} size="small">
                  <Descriptions.Item label="Reference ID">{selectedAppointment.serviceDetails.referenceId}</Descriptions.Item>
                  <Descriptions.Item label="Category">{selectedAppointment.serviceCategory}</Descriptions.Item>
                  {/* Dynamic service details based on type */}
                  {Object.entries(selectedAppointment.serviceDetails)
                    .filter(([key]) => key !== 'type' && key !== 'referenceId')
                    .map(([key, value]) => (
                      <Descriptions.Item key={key} label={key.charAt(0).toUpperCase() + key.slice(1)}>
                        {value}
                      </Descriptions.Item>
                    ))
                  }
                </Descriptions>
              </Card>

              <Card title="Documents & Notes" style={{ marginTop: 16 }} size="small">
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
                <div>
                  <Text strong>Officer Notes:</Text>
                  <div style={{ marginTop: 8, padding: 12, background: '#f5f5f5', borderRadius: 4 }}>
                    {selectedAppointment.notes}
                  </div>
                </div>
                <div style={{ marginTop: 16 }}>
                  <Text strong>Assigned Officer:</Text>
                  <div style={{ marginTop: 8 }}>
                    <Text>{selectedAppointment.officer} (ID: {selectedAppointment.officerID})</Text>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </Modal>

        {/* Reschedule Modal */}
        <Modal
          title={`Reschedule Appointment - ${selectedAppointment?.appointmentId}`}
          open={rescheduleModalVisible}
          onCancel={() => setRescheduleModalVisible(false)}
          onOk={() => form.submit()}
          okText="Reschedule"
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleRescheduleSubmit}
          >
            <Form.Item
              name="appointmentDate"
              label="New Appointment Date"
              rules={[{ required: true, message: 'Please select a date' }]}
            >
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item
              name="appointmentTime"
              label="New Appointment Time"
              rules={[{ required: true, message: 'Please select a time' }]}
            >
              <Select style={{ width: '100%' }}>
                <Option value="09:00 AM">09:00 AM</Option>
                <Option value="10:00 AM">10:00 AM</Option>
                <Option value="11:00 AM">11:00 AM</Option>
                <Option value="02:00 PM">02:00 PM</Option>
                <Option value="03:00 PM">03:00 PM</Option>
                <Option value="04:00 PM">04:00 PM</Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="reason"
              label="Reason for Rescheduling"
            >
              <Input.TextArea rows={3} placeholder="Enter reason for rescheduling..." />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </AdminLayout>
  );
};

export default AppointmentsManagement;