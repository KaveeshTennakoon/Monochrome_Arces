import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

const SuperAdminUsers = () => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
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

  // Check authentication
  useEffect(() => {
    const token = localStorage.getItem('superAdminToken');
    if (!token) {
      router.push('/superadmin/login');
      return;
    }
    
    // Load initial data
    loadUsers();
    setLoading(false);
  }, [router]);

  // Mock data - replace with API calls
  const loadUsers = () => {
    const mockUsers = [
      {
        id: 1,
        name: 'John Administrator',
        username: 'admin1',
        email: 'john.admin@gov.lk',
        phone: '+94 71 123 4567',
        role: 'admin',
        department: 'Land Registry Department',
        permissions: ['appointments', 'services', 'users', 'analytics'],
        status: 'active',
        createdDate: '2025-01-15',
        lastLogin: '2025-08-14 09:30 AM'
      },
      {
        id: 2,
        name: 'Sarah Manager',
        username: 'manager1',
        email: 'sarah.manager@gov.lk',
        phone: '+94 77 987 6543',
        role: 'manager',
        department: 'Motor Traffic Department',
        permissions: ['appointments', 'services'],
        status: 'active',
        createdDate: '2025-02-01',
        lastLogin: '2025-08-14 08:45 AM'
      }
    ];
    setUsers(mockUsers);
  };

  const departments = [
    'Land Registry Department',
    'Motor Traffic Department', 
    'Immigration & Emigration Department',
    'Department of Inland Revenue',
    'Urban Development Authority'
  ];

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
    setShowCreateModal(true);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      username: user.username,
      email: user.email,
      phone: user.phone,
      password: '',
      department: user.department,
      role: user.role,
      permissions: user.permissions
    });
    setShowCreateModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingUser) {
      // Update existing user
      setUsers(users.map(user => 
        user.id === editingUser.id 
          ? { ...user, ...formData, id: user.id }
          : user
      ));
      alert('User updated successfully!');
    } else {
      // Create new user
      const newUser = {
        ...formData,
        id: Date.now(),
        status: 'active',
        createdDate: new Date().toISOString().split('T')[0],
        lastLogin: 'Never'
      };
      setUsers([...users, newUser]);
      alert('User created successfully!');
    }
    
    setShowCreateModal(false);
  };

  const handleDeleteUser = (userId) => {
    if (confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(user => user.id !== userId));
      alert('User deleted successfully!');
    }
  };

  const handlePermissionChange = (permission) => {
    const newPermissions = formData.permissions.includes(permission)
      ? formData.permissions.filter(p => p !== permission)
      : [...formData.permissions, permission];
    
    setFormData({ ...formData, permissions: newPermissions });
  };

  const logout = () => {
    localStorage.removeItem('superAdminToken');
    localStorage.removeItem('superAdminUser');
    router.push('/superadmin/login');
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div>Loading...</div>
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
            <h1 style={{ margin: 0, color: '#1e3c72' }}>Super Admin - Book Appointment</h1>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button onClick={logout} style={{
              padding: '8px 16px',
              border: '1px solid #ff4d4f',
              borderRadius: '6px',
              background: '#ff4d4f',
              color: 'white',
              cursor: 'pointer'
            }}>
              Logout
            </button>
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
                <h2 style={{ margin: 0 }}>Admin User Management</h2>
                <p style={{ color: '#666', margin: '4px 0 0' }}>
                  Create and manage admin users for government departments
                </p>
              </div>
              <button
                onClick={handleCreateUser}
                style={{
                  padding: '12px 24px',
                  background: 'linear-gradient(135deg, #1e3c72, #2a5298)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                + Create New User
              </button>
            </div>

            {/* Statistics */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '16px',
              marginBottom: '24px'
            }}>
              <div style={{
                background: '#f8f9fa',
                padding: '16px',
                borderRadius: '6px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '24px', fontWeight: '600', color: '#1890ff' }}>
                  {users.length}
                </div>
                <div style={{ fontSize: '12px', color: '#666' }}>Total Users</div>
              </div>
              <div style={{
                background: '#f8f9fa',
                padding: '16px',
                borderRadius: '6px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '24px', fontWeight: '600', color: '#52c41a' }}>
                  {users.filter(u => u.status === 'active').length}
                </div>
                <div style={{ fontSize: '12px', color: '#666' }}>Active Users</div>
              </div>
              <div style={{
                background: '#f8f9fa',
                padding: '16px',
                borderRadius: '6px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '24px', fontWeight: '600', color: '#722ed1' }}>
                  {new Set(users.map(u => u.department)).size}
                </div>
                <div style={{ fontSize: '12px', color: '#666' }}>Departments</div>
              </div>
            </div>

            {/* Users Table */}
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#fafafa' }}>
                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e8e8e8' }}>
                      User Info
                    </th>
                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e8e8e8' }}>
                      Department
                    </th>
                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e8e8e8' }}>
                      Role
                    </th>
                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e8e8e8' }}>
                      Status
                    </th>
                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e8e8e8' }}>
                      Last Login
                    </th>
                    <th style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #e8e8e8' }}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.id}>
                      <td style={{ padding: '12px', borderBottom: '1px solid #f0f0f0' }}>
                        <div>
                          <div style={{ fontWeight: '600', color: '#1890ff' }}>{user.name}</div>
                          <div style={{ fontSize: '12px', color: '#666' }}>
                            👤 {user.username}
                          </div>
                          <div style={{ fontSize: '12px', color: '#666' }}>
                            ✉️ {user.email}
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '12px', borderBottom: '1px solid #f0f0f0' }}>
                        <div style={{ fontSize: '12px' }}>{user.department}</div>
                      </td>
                      <td style={{ padding: '12px', borderBottom: '1px solid #f0f0f0' }}>
                        <span style={{
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '11px',
                          fontWeight: '500',
                          background: user.role === 'admin' ? '#fff2f0' : user.role === 'manager' ? '#e6f7ff' : '#f6ffed',
                          color: user.role === 'admin' ? '#a8071a' : user.role === 'manager' ? '#0050b3' : '#389e0d'
                        }}>
                          {user.role.toUpperCase()}
                        </span>
                      </td>
                      <td style={{ padding: '12px', borderBottom: '1px solid #f0f0f0' }}>
                        <span style={{
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '11px',
                          background: user.status === 'active' ? '#f6ffed' : '#fff1f0',
                          color: user.status === 'active' ? '#389e0d' : '#cf1322'
                        }}>
                          {user.status.toUpperCase()}
                        </span>
                      </td>
                      <td style={{ padding: '12px', borderBottom: '1px solid #f0f0f0', fontSize: '12px' }}>
                        {user.lastLogin}
                      </td>
                      <td style={{ padding: '12px', borderBottom: '1px solid #f0f0f0', textAlign: 'center' }}>
                        <button
                          onClick={() => handleEditUser(user)}
                          style={{
                            padding: '4px 8px',
                            margin: '0 4px',
                            border: '1px solid #1890ff',
                            borderRadius: '4px',
                            background: 'white',
                            color: '#1890ff',
                            cursor: 'pointer',
                            fontSize: '12px'
                          }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          style={{
                            padding: '4px 8px',
                            margin: '0 4px',
                            border: '1px solid #ff4d4f',
                            borderRadius: '4px',
                            background: 'white',
                            color: '#ff4d4f',
                            cursor: 'pointer',
                            fontSize: '12px'
                          }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Create/Edit User Modal */}
        {showCreateModal && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}>
            <div style={{
              background: 'white',
              borderRadius: '8px',
              padding: '24px',
              width: '90%',
              maxWidth: '600px',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}>
              <h3 style={{ margin: '0 0 24px' }}>
                {editingUser ? 'Edit Admin User' : 'Create New Admin User'}
              </h3>

              <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      style={{
                        width: '100%',
                        padding: '8px',
                        border: '1px solid #ddd',
                        borderRadius: '4px'
                      }}
                      required
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>
                      Username *
                    </label>
                    <input
                      type="text"
                      value={formData.username}
                      onChange={(e) => setFormData({...formData, username: e.target.value})}
                      style={{
                        width: '100%',
                        padding: '8px',
                        border: '1px solid #ddd',
                        borderRadius: '4px'
                      }}
                      required
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>
                      Email *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      style={{
                        width: '100%',
                        padding: '8px',
                        border: '1px solid #ddd',
                        borderRadius: '4px'
                      }}
                      required
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>
                      Phone *
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      style={{
                        width: '100%',
                        padding: '8px',
                        border: '1px solid #ddd',
                        borderRadius: '4px'
                      }}
                      required
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>
                    Password {editingUser ? '(leave blank to keep current)' : '*'}
                  </label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '8px',
                      border: '1px solid #ddd',
                      borderRadius: '4px'
                    }}
                    required={!editingUser}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>
                      Department *
                    </label>
                    <select
                      value={formData.department}
                      onChange={(e) => setFormData({...formData, department: e.target.value})}
                      style={{
                        width: '100%',
                        padding: '8px',
                        border: '1px solid #ddd',
                        borderRadius: '4px'
                      }}
                      required
                    >
                      <option value="">Select Department</option>
                      {departments.map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>
                      Role *
                    </label>
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData({...formData, role: e.target.value})}
                      style={{
                        width: '100%',
                        padding: '8px',
                        border: '1px solid #ddd',
                        borderRadius: '4px'
                      }}
                      required
                    >
                      <option value="">Select Role</option>
                      {roles.map(role => (
                        <option key={role.value} value={role.value}>{role.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                    Permissions *
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '8px' }}>
                    {availablePermissions.map(permission => (
                      <label key={permission} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={formData.permissions.includes(permission)}
                          onChange={() => handlePermissionChange(permission)}
                          style={{ marginRight: '8px' }}
                        />
                        <span style={{ fontSize: '14px', textTransform: 'capitalize' }}>
                          {permission}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    style={{
                      padding: '10px 20px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      background: 'white',
                      cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={{
                      padding: '10px 20px',
                      border: 'none',
                      borderRadius: '4px',
                      background: 'linear-gradient(135deg, #1e3c72, #2a5298)',
                      color: 'white',
                      cursor: 'pointer'
                    }}
                  >
                    {editingUser ? 'Update User' : 'Create User'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default SuperAdminUsers;