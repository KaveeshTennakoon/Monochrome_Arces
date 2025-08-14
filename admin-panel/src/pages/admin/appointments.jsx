// src/pages/admin/appointments.jsx
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
  MailOutlined
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
  const [dateRange, setDateRange] = useState(null);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [rescheduleModalVisible, setRescheduleModalVisible] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [form] = Form.useForm();

  // Sample land appointment data
  const appointmentsData = [
    {
      key: '1',
      appointmentId: 'APT-2025-001',
      citizenName: 'Kamal Perera',
      citizenEmail: 'kamal.perera@email.com',
      citizenPhone: '+94 71 234 5678',
      landDetails: {
        landId: 'LAND-COL-2024-456',
        location: 'Colombo 07, Cinnamon Gardens',
        landType: 'Residential',
        extent: '15 Perches',
        coordinates: '6.9147° N, 79.8757° E',
        surveyPlan: 'SP-789/2024'
      },
      serviceType: 'Land Title Registration',
      appointmentDate: '2025-08-15',
      appointmentTime: '10:00 AM',
      status: 'confirmed',
      officer: 'Ms. Nimalka Fernando',
      documents: ['Title Deed', 'Survey Plan', 'ID Copy'],
      priority: 'high',
      notes: 'First-time registration. All documents verified.',
      createdDate: '2025-08-10'
    },
    {
      key: '2',
      appointmentId: 'APT-2025-002',
      citizenName: 'Ruwan Silva',
      citizenEmail: 'ruwan.silva@email.com',
      citizenPhone: '+94 77 987 6543',
      landDetails: {
        landId: 'LAND-GAL-2024-789',
        location: 'Galle, Unawatuna Beach Road',
        landType: 'Commercial',
        extent: '25 Perches',
        coordinates: '6.0535° N, 80.2210° E',
        surveyPlan: 'SP-456/2024'
      },
      serviceType: 'Property Transfer',
      appointmentDate: '2025-08-16',
      appointmentTime: '02:30 PM',
      status: 'pending',
      officer: 'Mr. Asanka Wijayaratne',
      documents: ['Transfer Deed', 'Tax Receipts', 'Survey Plan'],
      priority: 'medium',
      notes: 'Property transfer pending verification.',
      createdDate: '2025-08-11'
    },
    {
      key: '3',
      appointmentId: 'APT-2025-003',
      citizenName: 'Priya Rathnayake',
      citizenEmail: 'priya.rathnayake@email.com',
      citizenPhone: '+94 70 111 2233',
      landDetails: {
        landId: 'LAND-KAN-2024-123',
        location: 'Kandy, Peradeniya Road',
        landType: 'Agricultural',
        extent: '2 Acres 15 Perches',
        coordinates: '7.2906° N, 80.6337° E',
        surveyPlan: 'SP-321/2024'
      },
      serviceType: 'Land Survey Verification',
      appointmentDate: '2025-08-14',
      appointmentTime: '09:00 AM',
      status: 'completed',
      officer: 'Mr. Chandana Jayasinghe',
      documents: ['Survey Plan', 'Boundary Certificate'],
      priority: 'low',
      notes: 'Survey completed successfully.',
      createdDate: '2025-08-08'
    },
    {
      key: '4',
      appointmentId: 'APT-2025-004',
      citizenName: 'Nilantha Gunasekara',
      citizenEmail: 'nilantha.g@email.com',
      citizenPhone: '+94 75 444 5566',
      landDetails: {
        landId: 'LAND-JA-2024-987',
        location: 'Jaffna, Nallur Road',
        landType: 'Residential',
        extent: '8 Perches',
        coordinates: '9.6615° N, 80.0255° E',
        surveyPlan: 'SP-654/2024'
      },
      serviceType: 'Deed Verification',
      appointmentDate: '2025-08-17',
      appointmentTime: '11:30 AM',
      status: 'cancelled',
      officer: 'Ms. Kamani Dissanayake',
      documents: ['Original Deed', 'ID Copy'],
      priority: 'medium',
      notes: 'Cancelled by citizen - rescheduling requested.',
      createdDate: '2025-08-09'
    }
  ];

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
            <MailOutlined style={{ marginRight: 4 }} />
            {record.citizenEmail}
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            <PhoneOutlined style={{ marginRight: 4 }} />
            {record.citizenPhone}
          </div>
        </div>
      ),
    },
    {
      title: 'Land Information',
      key: 'landInfo',
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 600, color: '#1890ff' }}>{record.landDetails.landId}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            <EnvironmentOutlined style={{ marginRight: 4 }} />
            {record.landDetails.location}
          </div>
          <div style={{ fontSize: '12px' }}>
            <Tag size="small">{record.landDetails.landType}</Tag>
            <span style={{ marginLeft: 8 }}>{record.landDetails.extent}</span>
          </div>
        </div>
      ),
    },
    {
      title: 'Service Type',
      dataIndex: 'serviceType',
      key: 'serviceType',
      render: (text) => <Tag color="blue">{text}</Tag>,
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
          <div style={{ fontSize: '12px', color: '#666' }}>{record.appointmentTime}</div>
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
      title: 'Assigned Officer',
      dataIndex: 'officer',
      key: 'officer',
      render: (text) => (
        <div style={{ fontSize: '12px' }}>
          <UserOutlined style={{ marginRight: 4 }} />
          {text}
        </div>
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
      item.landDetails.landId.toLowerCase().includes(searchText.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    const matchesService = serviceFilter === 'all' || item.serviceType === serviceFilter;
    
    return matchesSearch && matchesStatus && matchesService;
  });

  return (
    <AdminLayout pageTitle="Appointments Management">
      <div>
        <Title level={2} style={{ marginBottom: '8px' }}>
          Appointments Management
        </Title>
        <Text type="secondary" style={{ marginBottom: '24px', display: 'block' }}>
          Manage land service appointments, reschedule, and track appointment status
        </Text>

        {/* Filters */}
        <Card style={{ marginBottom: '16px' }}>
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} sm={8} md={6}>
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
                placeholder="Filter by status"
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
            <Col xs={24} sm={8} md={6}>
              <Select
                style={{ width: '100%' }}
                placeholder="Filter by service"
                value={serviceFilter}
                onChange={setServiceFilter}
              >
                <Option value="all">All Services</Option>
                <Option value="Land Title Registration">Land Title Registration</Option>
                <Option value="Property Transfer">Property Transfer</Option>
                <Option value="Land Survey Verification">Land Survey Verification</Option>
                <Option value="Deed Verification">Deed Verification</Option>
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
            <Col xs={24} sm={12} md={2}>
              <Button type="primary" block>
                Export
              </Button>
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
          scroll={{ x: 1200 }}
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
          width={800}
        >
          {selectedAppointment && (
            <div>
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Card title="Citizen Information" size="small">
                    <Descriptions column={1} size="small">
                      <Descriptions.Item label="Name">{selectedAppointment.citizenName}</Descriptions.Item>
                      <Descriptions.Item label="Email">{selectedAppointment.citizenEmail}</Descriptions.Item>
                      <Descriptions.Item label="Phone">{selectedAppointment.citizenPhone}</Descriptions.Item>
                    </Descriptions>
                  </Card>
                </Col>
                <Col span={12}>
                  <Card title="Appointment Details" size="small">
                    <Descriptions column={1} size="small">
                      <Descriptions.Item label="Service">{selectedAppointment.serviceType}</Descriptions.Item>
                      <Descriptions.Item label="Date">{dayjs(selectedAppointment.appointmentDate).format('MMMM DD, YYYY')}</Descriptions.Item>
                      <Descriptions.Item label="Time">{selectedAppointment.appointmentTime}</Descriptions.Item>
                      <Descriptions.Item label="Status">
                        <Tag color={getStatusColor(selectedAppointment.status)}>
                          {selectedAppointment.status.toUpperCase()}
                        </Tag>
                      </Descriptions.Item>
                    </Descriptions>
                  </Card>
                </Col>
              </Row>

              <Card title="Land Information" style={{ marginTop: 16 }} size="small">
                <Descriptions column={2} size="small">
                  <Descriptions.Item label="Land ID">{selectedAppointment.landDetails.landId}</Descriptions.Item>
                  <Descriptions.Item label="Land Type">{selectedAppointment.landDetails.landType}</Descriptions.Item>
                  <Descriptions.Item label="Location">{selectedAppointment.landDetails.location}</Descriptions.Item>
                  <Descriptions.Item label="Extent">{selectedAppointment.landDetails.extent}</Descriptions.Item>
                  <Descriptions.Item label="Coordinates">{selectedAppointment.landDetails.coordinates}</Descriptions.Item>
                  <Descriptions.Item label="Survey Plan">{selectedAppointment.landDetails.surveyPlan}</Descriptions.Item>
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
                  <Text strong>Notes:</Text>
                  <div style={{ marginTop: 8, padding: 12, background: '#f5f5f5', borderRadius: 4 }}>
                    {selectedAppointment.notes}
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