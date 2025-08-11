'use client';

import { Typography, Card } from 'antd';
import { useRouter } from 'next/navigation';
import { useLands } from '@/hooks/useLands';
import { useAuth } from '@/hooks/useAuth';
import { PERMISSIONS } from '@/lib/constants';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import LandForm from '@/components/lands/LandForm';
import { AddLandRequest } from '@/types/land';

const { Title } = Typography;

export default function AddLandPage() {
  const router = useRouter();
  const { createLand } = useLands();

  const handleSubmit = async (data: AddLandRequest) => {
    await createLand(data);
    router.push('/dashboard/lands');
  };

  return (
    <ProtectedRoute requiredPermissions={[PERMISSIONS.LANDS_CREATE]}>
      <div>
        <div className="mb-6">
          <Title level={2}>Add New Land Parcel</Title>
          <p className="text-gray-600">
            Register a new land parcel in the system with boundary mapping
          </p>
        </div>

        <LandForm 
          onSubmit={handleSubmit}
          mode="create"
        />
      </div>
    </ProtectedRoute>
  );
}