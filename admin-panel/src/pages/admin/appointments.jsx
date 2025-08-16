import React, { useState, useEffect } from 'react';
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
  message,
  Popconfirm,
  Badge,
  Tooltip,
  Spin,
  Alert
} from 'antd';
import {
  SearchOutlined,
  CalendarOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  CheckOutlined,
  CloseOutlined,
  EnvironmentOutlined,
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  BankOutlined,
  CarOutlined,
  MedicineBoxOutlined,
  BookOutlined,
  HomeOutlined,
  IdcardOutlined,
  FileTextOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { appointmentsAPI, departmentsAPI, handleAPIError } from '../../utils/api';

const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

const AppointmentsManagement = () => {
  const [appointments, setAppointments] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tableLoading, setTableLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [serviceFilter, setServiceFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [dateRange, setDateRange] = useState(null);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [rescheduleModalVisible, setRescheduleModalVisible] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [form] = Form.useForm();

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

  // Load initial data
  useEffect(() => {
    loadInitialData();
  }, []);

  // Load appointments when filters change
  useEffect(() => {
    loadAppointments();
  }, [searchText, statusFilter, serviceFilter, departmentFilter, dateRange, pagination.current, pagination.pageSize]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      
      // Load departments
      const departmentsResponse = await departmentsAPI.getDepartments();
      setDepartments(departmentsResponse.data || []);
      
      await loadAppointments();
    } catch (error) {
      handleAPIError(error);
      message.error('Failed to load initial data');
    } finally {
      setLoading(false);
    }
  };

  const loadAppointments = async () => {
    try {
      setTableLoading(true);

      const filters = {
        page: pagination.current,
        limit: pagination.pageSize,
        search: searchText || undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        department: departmentFilter !== 'all' ? departmentFilter : undefined,
        service: serviceFilter !== 'all' ? serviceFilter : undefined,
        startDate: dateRange?.[0]?.format('YYYY-MM-DD'),
        endDate: dateRange?.[1]?.format('YYYY-MM-DD'),
      };

      const response = await appointmentsAPI.getAppointments(filters);
      
      setAppointments(response.data || []);
      setPagination(prev => ({
        ...prev,
        total: response.meta?.total || 0,
      }));

    } catch (error) {
      handleAPIError(error);
      message.error('Failed to load appointments');
    } finally {
      setTableLoading(false);
    }
  };

  const handleViewDetails = async (record) => {
    try {
      // Get full appointment details
      const response = await appointmentsAPI.getAppointment(record.id);
      setSelectedAppointment(response.data);
      setDetailsModalVisible(true);
    } catch (error) {
      handleAPIError(error);
      message.error('Failed to load appointment details');
    }
  };

  const handleReschedule = (record) => {
    setSelectedAppointment(record);
    setRescheduleModalVisible(true);
    form.setFieldsValue({
      appointmentDate: dayjs(record.appointmentDate),
      appointmentTime: record.appointmentTime,
    });
  };

  const handleStatusChange = async (appointmentId, newStatus) => {
    try {
      await appointmentsAPI.updateStatus(appointmentId, newStatus);
      message.success(`Appointment status changed to ${newStatus}`);
      loadAppointments(); // Reload data
    } catch (error) {
      handleAPIError(error);
      message.error('Failed to update appointment status');
    }
  };

  const handleRescheduleSubmit = async (values) => {
    try {
      const rescheduleData = {
        appointmentDate: values.appointmentDate.format('YYYY-MM-DD'),
        appointmentTime: values.appointmentTime,
        reason: values.reason,
      };

      await appointmentsAPI.reschedule(selectedAppointment.id, rescheduleData);
      message.success('Appointment rescheduled successfully');
      setRescheduleModalVisible(false);
      form.resetFields();
      loadAppointments(); // Reload data
    } catch (error) {
      handleAPIError(error);
      message.error('Failed to reschedule appointment');
    }
  };

  const handleCancel = async (appointmentId) => {
    try {
      await appointmentsAPI.updateStatus(appointmentId, 'cancelled', 'Cancelled by admin');
      message.success('Appointment cancelled successfully');
      loadAppointments(); // Reload data
    } catch (error) {
      handleAPIError(error);
      message.error('Failed to cancel appointment');
    }
  };

  const handleTableChange = (paginationData, filters, sorter) => {
    setPagination(prev => ({
      ...prev,
      current: paginationData.current,
      pageSize: paginationData.pageSize,
    }));
  };

  const handleRefresh = () => {
    loadAppointments();
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
            {record.serviceDetails?.referenceId}
          </div>
          {record.serviceDetails?.location && (
            <div style={{ fontSize: '11px', color: '#666' }}>
              <EnvironmentOutlined style={{ marginRight: 4 }} />
              {record.serviceDetails.location}
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
          text={priority?.toUpperCase()} 
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
                onClick={() => handleStatusChange(record.id, 'confirmed')}
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
              onConfirm={() => handleCancel(record.id)}
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

  if (loading) {
    return (
      <AdminLayout pageTitle="Appointments Management">
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
          <Spin size="large" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout pageTitle="Appointments Management">
      <div>
        <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <Title level={2} style={{ marginBottom: '8px' }}>
              Government Services Appointments
            </Title>
            <Text type="secondary">
              Manage appointments across all government departments and services
            </Text>
          </div>
          <Button 
            icon={<ReloadOutlined />} 
            onClick={handleRefresh}
            loading={tableLoading}
          >
            Refresh
          </Button>
        </div>

        {/* Filters */}
        <Card style={{ marginBottom: '16px' }}>
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} sm={8} md={5}>
              <Input
                placeholder="Search appointments..."
                prefix={<SearchOutlined />}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                allowClear
              />
            </Col>
            <Col xs={24} sm={8} md={4}>
              <Select
                style={{ width: '100%' }}
                placeholder="Department"
                value={departmentFilter}
                onChange={setDepartmentFilter}
                allowClear
              >
                <Option value="all">All Departments</Option>
                {departments.map(dept => (
                  <Option key={dept.code} value={dept.code}>
                    {dept.name}
                  </Option>
                ))}
              </Select>
            </Col>
            <Col xs={24} sm={8} md={3}>
              <Select
                style={{ width: '100%' }}
                placeholder="Status"
                value={statusFilter}
                onChange={setStatusFilter}
                allowClear
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
                allowClear
              />
            </Col>
          </Row>
        </Card>

        {/* Appointments Table */}
        <Table
          columns={columns}
          dataSource={appointments}
          rowKey="id"
          loading={tableLoading}
          rowSelection={{
            selectedRowKeys,
            onChange: setSelectedRowKeys,
          }}
          pagination={{
            ...pagination,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `${range[0]}-${range[1]} of ${total} appointments`,
          }}
          onChange={handleTableChange}
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

              {selectedAppointment.serviceDetails && (
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
              )}

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