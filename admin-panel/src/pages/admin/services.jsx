import React from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { Typography } from 'antd';

const { Title } = Typography;

const ServicesPage = () => {
  return (
    <AdminLayout>
      <div>
        <Title level={2}>Services Management</Title>
        <p>Services content will go here...</p>
      </div>
    </AdminLayout>
  );
};

export default ServicesPage;