import React, { useState } from 'react';
import SuperAdminLayout from '../../components/superadmin/SuperAdminLayout';
import { 
  Typography, 
  Table, 
  Button, 
  Modal, 
  Form, 
  Input, 
  Select, 
  Card, 
  Row, 
  Col, 
  Tag, 
  Space, 
  Checkbox, 
  Alert,
  Popconfirm,
  message,
  Tooltip,
  Badge
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  BankOutlined,
  SecurityScanOutlined,
  KeyOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;

const SuperAdminUserManagement = () => {
  const [users, setUsers] = useState([
    {
      key: '1',
      id: 'USR001',
      username: 'admin',
      name: 'John Administrator',
      email: 'john.admin@gov.lk',
      phone: '+94 71 123 4567',
      role: 'admin',
      department: 'Land Registry Department',
      permissions: ['appointments', 'services', 'users', 'analytics', 'settings'],
      status: 'active',
      createdDate: '2025-01-15',
      lastLogin: '2025-08-14 09:30 AM'
    },
    {
      key: '2',
      id: 'USR002',
      username: 'manager',
      name: 'Sarah Manager',
      email: 'sarah.manager@gov.lk',
      phone: '+94 77 987 6543',
      role: 'manager',
      department: 'Motor Traffic Department',
      permissions: ['appointments', 'services', 'analytics'],
      status: 'active',
      createdDate: '2025-02-01',
      lastLogin: '2025-08-14 08:45 AM'
    },
    {
      key: '3',
      id: 'USR003',
      username: 'officer1',
      name: 'Mike Officer',
      email: 'mike.officer@gov.lk',
      phone: '+94 70 111 2233',
      role: 'officer',
      department: 'Immigration Department',
      permissions: ['appointments', 'services'],
      status: 'inactive',
      createdDate: '2025-03-10',
      lastLogin: '2025-08-13 04:20 PM'
    }
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form] = Form.useForm();

  // Government departments
  const departments = [
    'Land Registry Department',
    'Motor Traffic Department',
    'Immigration & Emigration Department',
    'Department of Inland Revenue',
    'Urban Development Authority',
    'Survey Department',
    'Department of Census and Statistics',
    'Department of Commerce',
    'Ministry of Health',
    'Ministry of Education'
  ];

  // User roles with descriptions
  const userRoles = [
    { value: 'admin', label: 'System Administrator', description: 'Full system access' },
    { value: 'manager', label: 'Department Manager', description: 'Department-level management' },
    { value: 'officer', label: 'Government Officer', description: 'Basic operational access' },
    { value: 'supervisor', label: 'Supervisor', description: 'Team supervision access' }
  ];

  // Available permissions
  const availablePermissions = [
    { key: 'appointments', label: 'Appointments Management', description: 'Manage citizen appointments' },
    { key: 'services', label: 'Services Management', description: 'Manage government services' },
    { key: 'users', label: 'User Management', description: 'Manage citizen accounts' },
    { key: 'analytics', label: 'Analytics & Reports', description: 'View system analytics' },
    { key: 'settings', label: 'System Settings', description: 'Configure system settings' },
    { key: 'audit', label: 'Audit Logs', description: 'View system audit trails' }
  ];

  // Role-based default permissions
  const rolePermissions = {
    admin: ['appointments', 'services', 'users', 'analytics', 'settings', 'audit'],
    manager: ['appointments', 'services', 'analytics'],
    officer: ['appointments', 'services'],
    supervisor: ['appointments', 'services', 'users']
  };

  const handleCreateUser = () => {
    setEditingUser(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    form.setFieldsValue({
      ...user,
      password: '', // Don't pre-fill password
    });
    setModalVisible(true);
  };

  const handleDeleteUser = (userId) => {
    setUsers(users.filter(user => user.key !== userId));
    message.success('User deleted successfully');
  };

  const handleModalSubmit = (values) => {
    if (editingUser) {
      // Update existing user
      setUsers(users.map(user => 
        user.key === editingUser.key 
          ? { ...user, ...values, id: user.id }
          : user
      ));
      message.success('User updated successfully');
    } else {
      // Create new user
      const newUser = {
        ...values,
        key: `${Date.now()}`,
        id: `USR${String(users.length + 1).padStart(3, '0')}`,
        status: 'active',
        createdDate: new Date().toISOString().split('T')[0],
        lastLogin: 'Never'
      };
      setUsers([...users, newUser]);
      message.success('User created successfully');
    }
    setModalVisible(false);
    form.resetFields();
  };

  const handleRoleChange = (role) => {
    // Auto-set permissions based on role
    form.setFieldsValue({
      permissions: rolePermissions[role] || []
    });
  };

  const columns = [
    {
      title: 'User Info',
      key: 'userInfo',
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 600, color: '#1890ff' }}>{record.name}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            <UserOutlined style={{ marginRight: 4 }} />
            {record.username} ({record.id})
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            <MailOutlined style={{ marginRight: 4 }} />
            {record.email}
          </div>
        </div>
      ),
    },
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
      render: (text) => (
        <div>
          <BankOutlined style={{ marginRight: 4, color: '#1890ff' }} />
          <Text style={{ fontSize: '12px' }}>{text}</Text>
        </div>
      ),
    },
    {
      title: 'Role & Permissions',
      key: 'rolePermissions',
      render: (_, record) => (
        <div>
          <Tag color={
            record.role === 'admin' ? 'red' :
            record.role === 'manager' ? 'blue' :
            record.role === 'supervisor' ? 'purple' : 'green'
          }>
            {record.role.toUpperCase()}
          </Tag>
          <div style={{ marginTop: 4 }}>
            <Text style={{ fontSize: '11px', color: '#666' }}>
              {record.permissions.length} permissions
            </Text>
          </div>
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Badge 
          status={status === 'active' ? 'success' : 'default'} 
          text={status.toUpperCase()} 
        />
      ),
    },
    {
      title: 'Last Login',
      dataIndex: 'lastLogin',
      key: 'lastLogin',
      render: (text) => <Text style={{ fontSize: '12px' }}>{text}</Text>,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="View Details">
            <Button type="text" icon={<EyeOutlined />} size="small" />
          </Tooltip>
          <Tooltip title="Edit User">
            <Button 
              type="text" 
              icon={<EditOutlined />} 
              size="small"
              onClick={() => handleEditUser(record)}
            />
          </Tooltip>
          <Popconfirm
            title="Are you sure you want to delete this user?"
            onConfirm={() => handleDeleteUser(record.key)}
            okText="Yes"
            cancelText="No"
          >
            <Tooltip title="Delete User">
              <Button 
                type="text" 
                icon={<DeleteOutlined />} 
                size="small"
                danger
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <SuperAdminLayout pageTitle="User Management">
      <div>
        <div style={{ marginBottom: '24px' }}>
          <Row justify="space-between" align="middle">
            <Col>
              <Title level={2} style={{ margin: 0 }}>
                Admin User Management
              </Title>
              <Text type="secondary">
                Create and manage admin users for government departments
              </Text>
            </Col>
            <Col>
              <Button 
                type="primary" 
                icon={<PlusOutlined />}
                onClick={handleCreateUser}
                size="large"
                style={{ background: 'linear-gradient(135deg, #1e3c72, #2a5298)' }}
              >
                Create New User
              </Button>
            </Col>
          </Row>
        </div>

        {/* Statistics Cards */}
        <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
          <Col xs={24} sm={6}>
            <Card>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '24px', fontWeight: 600, color: '#1890ff' }}>
                  {users.length}
                </div>
                <div style={{ fontSize: '12px', color: '#666' }}>Total Users</div>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={6}>
            <Card>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '24px', fontWeight: 600, color: '#52c41a' }}>
                  {users.filter(u => u.status === 'active').length}
                </div>
                <div style={{ fontSize: '12px', color: '#666' }}>Active Users</div>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={6}>
            <Card>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '24px', fontWeight: 600, color: '#722ed1' }}>
                  {new Set(users.map(u => u.department)).size}
                </div>
                <div style={{ fontSize: '12px', color: '#666' }}>Departments</div>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={6}>
            <Card>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '24px', fontWeight: 600, color: '#fa8c16' }}>
                  {new Set(users.map(u => u.role)).size}
                </div>
                <div style={{ fontSize: '12px', color: '#666' }}>User Roles</div>
              </div>
            </Card>
          </Col>
        </Row>

        {/* Users Table */}
        <Card>
          <Table
            columns={columns}
            dataSource={users}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total) => `Total ${total} users`,
            }}
            scroll={{ x: 800 }}
          />
        </Card>

        {/* Create/Edit User Modal */}
        <Modal
          title={editingUser ? 'Edit Admin User' : 'Create New Admin User'}
          open={modalVisible}
          onCancel={() => setModalVisible(false)}
          onOk={() => form.submit()}
          okText={editingUser ? 'Update User' : 'Create User'}
          width={800}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleModalSubmit}
          >
            <Alert
              message="User Credentials"
              description="These credentials will be used by the admin user to login to the system."
              type="info"
              showIcon
              style={{ marginBottom: '24px' }}
            />

            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="name"
                  label="Full Name"
                  rules={[{ required: true, message: 'Please enter full name' }]}
                >
                  <Input prefix={<UserOutlined />} placeholder="Enter full name" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name="username"
                  label="Username"
                  rules={[
                    { required: true, message: 'Please enter username' },
                    { min: 3, message: 'Username must be at least 3 characters' }
                  ]}
                >
                  <Input prefix={<UserOutlined />} placeholder="Enter username" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="email"
                  label="Email Address"
                  rules={[
                    { required: true, message: 'Please enter email' },
                    { type: 'email', message: 'Please enter valid email' }
                  ]}
                >
                  <Input prefix={<MailOutlined />} placeholder="Enter email address" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name="phone"
                  label="Phone Number"
                  rules={[{ required: true, message: 'Please enter phone number' }]}
                >
                  <Input prefix={<PhoneOutlined />} placeholder="Enter phone number" />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="password"
              label="Password"
              rules={[
                { required: !editingUser, message: 'Please enter password' },
                { min: 6, message: 'Password must be at least 6 characters' }
              ]}
            >
              <Input.Password 
                prefix={<KeyOutlined />} 
                placeholder={editingUser ? "Leave blank to keep current password" : "Enter password"} 
              />
            </Form.Item>

            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="department"
                  label="Government Department"
                  rules={[{ required: true, message: 'Please select department' }]}
                >
                  <Select placeholder="Select department">
                    {departments.map(dept => (
                      <Option key={dept} value={dept}>{dept}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name="role"
                  label="User Role"
                  rules={[{ required: true, message: 'Please select role' }]}
                >
                  <Select placeholder="Select role" onChange={handleRoleChange}>
                    {userRoles.map(role => (
                      <Option key={role.value} value={role.value}>
                        <div>
                          <div>{role.label}</div>
                          <div style={{ fontSize: '11px', color: '#666' }}>
                            {role.description}
                          </div>
                        </div>
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="permissions"
              label="System Permissions"
              rules={[{ required: true, message: 'Please select at least one permission' }]}
            >
              <Checkbox.Group style={{ width: '100%' }}>
                <Row gutter={[16, 8]}>
                  {availablePermissions.map(permission => (
                    <Col xs={24} md={12} key={permission.key}>
                      <Checkbox value={permission.key}>
                        <div>
                          <div style={{ fontWeight: 500 }}>{permission.label}</div>
                          <div style={{ fontSize: '11px', color: '#666' }}>
                            {permission.description}
                          </div>
                        </div>
                      </Checkbox>
                    </Col>
                  ))}
                </Row>
              </Checkbox.Group>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </SuperAdminLayout>
  );
};

export default SuperAdminUserManagement;