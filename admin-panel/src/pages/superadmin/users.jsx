import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { 
  Typography, 
  Table, 
  Button, 
  Modal, 
  Form, 
  Input, 
  Select, 
  Checkbox, 
  Card, 
  Row, 
  Col,
  message,
  Popconfirm,
  Tag,
  Space,
  Spin,
  Alert
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
  ReloadOutlined,
  LogoutOutlined
} from '@ant-design/icons';
import { usersAPI, departmentsAPI, handleAPIError } from '../../utils/api';

const { Title, Text } = Typography;
const { Option } = Select;

const SuperAdminUsers = () => {
  const [loading, setLoading] = useState(true);
  const [tableLoading, setTableLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    departmentCount: 0
  });
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    phone: '',
    password: '',
    department: '',
    role: '',
    permissions: []
  });
  const router = useRouter();
  const [form] = Form.useForm();

  // Check authentication
  useEffect(() => {
    const token = localStorage.getItem('superAdminToken');
    if (!token) {
      router.push('/superadmin/login');
      return;
    }
    
    loadInitialData();
  }, [router]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      
      // Load departments and users in parallel
      await Promise.all([
        loadDepartments(),
        loadUsers(),
        loadUserStats()
      ]);
    } catch (error) {
      handleAPIError(error);
      message.error('Failed to load initial data');
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

  const loadUsers = async () => {
    try {
      setTableLoading(true);
      const response = await usersAPI.getUsers();
      setUsers(response.data || []);
    } catch (error) {
      handleAPIError(error);
      message.error('Failed to load users');
    } finally {
      setTableLoading(false);
    }
  };

  const loadUserStats = async () => {
    try {
      const response = await usersAPI.getUserStats();
      setStats(response.data || {
        totalUsers: 0,
        activeUsers: 0,
        departmentCount: 0
      });
    } catch (error) {
      handleAPIError(error);
    }
  };

  const roles = [
    { value: 'admin', label: 'System Administrator' },
    { value: 'manager', label: 'Department Manager' },
    { value: 'officer', label: 'Government Officer' }
  ];

  const availablePermissions = [
    'appointments',
    'services', 
    'users',
    'analytics',
    'settings'
  ];

  const handleCreateUser = () => {
    setEditingUser(null);
    setFormData({
      name: '',
      username: '',
      email: '',
      phone: '',
      password: '',
      department: '',
      role: '',
      permissions: []
    });
    form.resetFields();
    setShowCreateModal(true);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    const userData = {
      name: user.name,
      username: user.username,
      email: user.email,
      phone: user.phone,
      password: '',
      department: user.department,
      role: user.role,
      permissions: user.permissions || []
    };
    setFormData(userData);
    form.setFieldsValue(userData);
    setShowCreateModal(true);
  };

  const handleSubmit = async (values) => {
    try {
      setModalLoading(true);
      
      const userData = {
        ...values,
        permissions: formData.permissions
      };

      if (editingUser) {
        // Update existing user
        await usersAPI.updateUser(editingUser.id, userData);
        message.success('User updated successfully!');
      } else {
        // Create new user
        await usersAPI.createUser(userData);
        message.success('User created successfully!');
      }
      
      setShowCreateModal(false);
      form.resetFields();
      
      // Reload data
      await Promise.all([loadUsers(), loadUserStats()]);
      
    } catch (error) {
      handleAPIError(error);
      message.error(`Failed to ${editingUser ? 'update' : 'create'} user`);
    } finally {
      setModalLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await usersAPI.deleteUser(userId);
      message.success('User deleted successfully!');
      
      // Reload data
      await Promise.all([loadUsers(), loadUserStats()]);
    } catch (error) {
      handleAPIError(error);
      message.error('Failed to delete user');
    }
  };

  const handleStatusToggle = async (userId, currentStatus) => {
    try {
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      await usersAPI.updateUserStatus(userId, newStatus);
      message.success(`User ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully!`);
      
      // Reload data
      await loadUsers();
    } catch (error) {
      handleAPIError(error);
      message.error('Failed to update user status');
    }
  };

  const handlePermissionChange = (permission) => {
    const newPermissions = formData.permissions.includes(permission)
      ? formData.permissions.filter(p => p !== permission)
      : [...formData.permissions, permission];
    
    setFormData({ ...formData, permissions: newPermissions });
  };

  const handleRefresh = async () => {
    await loadInitialData();
    message.success('Data refreshed successfully');
  };

  const logout = () => {
    localStorage.removeItem('superAdminToken');
    localStorage.removeItem('superAdminUser');
    router.push('/superadmin/login');
  };

  const columns = [
    {
      title: 'User Info',
      key: 'userInfo',
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: '600', color: '#1890ff' }}>{record.name}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            <UserOutlined style={{ marginRight: 4 }} />
            {record.username}
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            ✉️ {record.email}
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            📞 {record.phone}
          </div>
        </div>
      ),
    },
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
      render: (department) => (
        <div style={{ fontSize: '12px' }}>{department}</div>
      ),
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role) => (
        <Tag color={
          role === 'admin' ? 'red' : 
          role === 'manager' ? 'blue' : 'green'
        }>
          {role?.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status, record) => (
        <div>
          <Tag color={status === 'active' ? 'green' : 'red'}>
            {status?.toUpperCase()}
          </Tag>
          <br />
          <Button 
            size="small"
            type="link"
            onClick={() => handleStatusToggle(record.id, status)}
            style={{ padding: 0, fontSize: '11px' }}
          >
            {status === 'active' ? 'Deactivate' : 'Activate'}
          </Button>
        </div>
      ),
    },
    {
      title: 'Permissions',
      dataIndex: 'permissions',
      key: 'permissions',
      render: (permissions) => (
        <div>
          {permissions?.slice(0, 2).map(permission => (
            <Tag key={permission} size="small" style={{ fontSize: '10px' }}>
              {permission}
            </Tag>
          ))}
          {permissions?.length > 2 && (
            <Tag size="small" style={{ fontSize: '10px' }}>
              +{permissions.length - 2} more
            </Tag>
          )}
        </div>
      ),
    },
    {
      title: 'Last Login',
      dataIndex: 'lastLogin',
      key: 'lastLogin',
      render: (lastLogin) => (
        <Text style={{ fontSize: '12px' }}>
          {lastLogin ? new Date(lastLogin).toLocaleDateString() : 'Never'}
        </Text>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="small">
          <Button
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEditUser(record)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this user?"
            onConfirm={() => handleDeleteUser(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              size="small"
              danger
              icon={<DeleteOutlined />}
            >
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>User Management - Super Admin</title>
      </Head>

      <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
        {/* Header */}
        <div style={{
          background: 'white',
          padding: '16px 24px',
          borderBottom: '1px solid #e8e8e8',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <Title level={3} style={{ margin: 0, color: '#1e3c72' }}>
              Super Admin - User Management
            </Title>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <Button 
              icon={<ReloadOutlined />} 
              onClick={handleRefresh}
              loading={tableLoading}
            >
              Refresh
            </Button>
            <Button 
              icon={<LogoutOutlined />} 
              onClick={logout} 
              danger
            >
              Logout
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div style={{ padding: '24px' }}>
          <div style={{
            background: 'white',
            borderRadius: '8px',
            padding: '24px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            {/* Page Header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '24px'
            }}>
              <div>
                <Title level={4} style={{ margin: 0 }}>Admin User Management</Title>
                <Text type="secondary" style={{ fontSize: '14px' }}>
                  Create and manage admin users for government departments
                </Text>
              </div>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleCreateUser}
                style={{
                  background: 'linear-gradient(135deg, #1e3c72, #2a5298)',
                  border: 'none'
                }}
              >
                Create New User
              </Button>
            </div>

            {/* Statistics */}
            <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
              <Col xs={24} sm={8}>
                <Card size="small" style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '24px', fontWeight: '600', color: '#1890ff' }}>
                    {stats.totalUsers}
                  </div>
                  <div style={{ fontSize: '12px', color: '#666' }}>Total Users</div>
                </Card>
              </Col>
              <Col xs={24} sm={8}>
                <Card size="small" style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '24px', fontWeight: '600', color: '#52c41a' }}>
                    {stats.activeUsers}
                  </div>
                  <div style={{ fontSize: '12px', color: '#666' }}>Active Users</div>
                </Card>
              </Col>
              <Col xs={24} sm={8}>
                <Card size="small" style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '24px', fontWeight: '600', color: '#722ed1' }}>
                    {stats.departmentCount}
                  </div>
                  <div style={{ fontSize: '12px', color: '#666' }}>Departments</div>
                </Card>
              </Col>
            </Row>

            {/* Users Table */}
            <Table
              columns={columns}
              dataSource={users}
              rowKey="id"
              loading={tableLoading}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => 
                  `${range[0]}-${range[1]} of ${total} users`,
              }}
              scroll={{ x: 800 }}
            />
          </div>
        </div>

        {/* Create/Edit User Modal */}
        <Modal
          title={editingUser ? 'Edit Admin User' : 'Create New Admin User'}
          open={showCreateModal}
          onCancel={() => setShowCreateModal(false)}
          footer={null}
          width={700}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            disabled={modalLoading}
          >
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Form.Item
                  name="name"
                  label="Full Name"
                  rules={[
                    { required: true, message: 'Please enter full name' },
                    { min: 2, message: 'Name must be at least 2 characters' }
                  ]}
                >
                  <Input placeholder="Enter full name" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="username"
                  label="Username"
                  rules={[
                    { required: true, message: 'Please enter username' },
                    { min: 3, message: 'Username must be at least 3 characters' },
                    { pattern: /^[a-zA-Z0-9_]+$/, message: 'Username can only contain letters, numbers, and underscores' }
                  ]}
                >
                  <Input placeholder="Enter username" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Form.Item
                  name="email"
                  label="Email"
                  rules={[
                    { required: true, message: 'Please enter email' },
                    { type: 'email', message: 'Please enter a valid email' }
                  ]}
                >
                  <Input placeholder="Enter email address" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="phone"
                  label="Phone"
                  rules={[
                    { required: true, message: 'Please enter phone number' },
                    { pattern: /^\+?[1-9]\d{1,14}$/, message: 'Please enter a valid phone number' }
                  ]}
                >
                  <Input placeholder="Enter phone number" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Form.Item
                  name="password"
                  label={editingUser ? 'Password (leave blank to keep current)' : 'Password'}
                  rules={[
                    { required: !editingUser, message: 'Please enter password' },
                    { min: 6, message: 'Password must be at least 6 characters' }
                  ]}
                >
                  <Input.Password placeholder="Enter password" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="role"
                  label="Role"
                  rules={[{ required: true, message: 'Please select a role' }]}
                >
                  <Select placeholder="Select role">
                    {roles.map(role => (
                      <Option key={role.value} value={role.value}>{role.label}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="department"
              label="Department"
              rules={[{ required: true, message: 'Please select a department' }]}
            >
              <Select placeholder="Select department">
                {departments.map(dept => (
                  <Option key={dept.code} value={dept.name}>{dept.name}</Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item label="Permissions" required>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
                gap: '8px',
                padding: '12px',
                border: '1px solid #d9d9d9',
                borderRadius: '6px'
              }}>
                {availablePermissions.map(permission => (
                  <Checkbox
                    key={permission}
                    checked={formData.permissions.includes(permission)}
                    onChange={() => handlePermissionChange(permission)}
                  >
                    <span style={{ textTransform: 'capitalize', fontSize: '14px' }}>
                      {permission}
                    </span>
                  </Checkbox>
                ))}
              </div>
              {formData.permissions.length === 0 && (
                <Text type="danger" style={{ fontSize: '12px' }}>
                  Please select at least one permission
                </Text>
              )}
            </Form.Item>

            <Form.Item style={{ marginBottom: 0, marginTop: '24px' }}>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <Button onClick={() => setShowCreateModal(false)}>
                  Cancel
                </Button>
                <Button 
                  type="primary" 
                  htmlType="submit"
                  loading={modalLoading}
                  disabled={formData.permissions.length === 0}
                  style={{
                    background: 'linear-gradient(135deg, #1e3c72, #2a5298)',
                    border: 'none'
                  }}
                >
                  {editingUser ? 'Update User' : 'Create User'}
                </Button>
              </div>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </>
  );
};

export default SuperAdminUsers;