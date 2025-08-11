'use client';

import { Layout } from 'antd';
import Header from '@/components/common/Header';
import Sidebar from '@/components/common/Sidebar';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

const { Content } = Layout;

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <Layout className="min-h-screen">
        <Header />
        <Layout>
          <Sidebar />
          <Content className="p-6 bg-gray-50">
            {children}
          </Content>
        </Layout>
      </Layout>
    </ProtectedRoute>
  );
}
