'use client';

import { useState } from 'react';
import { Typography, Button, Row, Col, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { useLands } from '@/hooks/useLands';
import { useAuth } from '@/hooks/useAuth';
import { PERMISSIONS } from '@/lib/constants';
import LandTable from '@/components/lands/LandTable';
import LandMap from '@/components/lands/LandMap';
import { LandParcel, LandSearchFilters } from '@/types/land';

const { Title } = Typography;

export default function LandsPage() {
  const router = useRouter();
  const { hasPermission } = useAuth();
  const { lands, loading, fetchLands, deleteLand } = useLands();
  const [selectedLand, setSelectedLand] = useState<LandParcel | null>(null);
  const [mapVisible, setMapVisible] = useState(false);

  const handleView = (land: LandParcel) => {
    setSelectedLand(land);
    setMapVisible(true);
  };

  const handleEdit = (land: LandParcel) => {
    router.push(`/dashboard/lands/${land.id}`);
  };

  const handleDelete = async (id: string) => {
    await deleteLand(id);
  };

  const handleSearch = (filters: LandSearchFilters) => {
    fetchLands(filters);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <Title level={2}>Land Management</Title>
          <p className="text-gray-600">
            Manage and view all registered land parcels in the system
          </p>
        </div>
        {hasPermission(PERMISSIONS.LANDS_CREATE) && (
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => router.push('/dashboard/lands/add')}
            size="large"
          >
            Add New Land
          </Button>
        )}
      </div>

      <LandTable
        lands={lands}
        loading={loading}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onSearch={handleSearch}
      />

      {/* Map Modal */}
      <Modal
        title={`Land Details - ${selectedLand?.deedNumber}`}
        open={mapVisible}
        onCancel={() => setMapVisible(false)}
        footer={null}
        width={800}
      >
        {selectedLand && (
          <div>
            <Row gutter={[16, 16]} className="mb-4">
              <Col span={12}>
                <div>
                  <strong>Owner:</strong> {selectedLand.ownerName}
                </div>
                <div>
                  <strong>Survey Plan:</strong> {selectedLand.surveyPlanNumber}
                </div>
                <div>
                  <strong>Land Type:</strong> {selectedLand.landType}
                </div>
              </Col>
              <Col span={12}>
                <div>
                  <strong>District:</strong> {selectedLand.district}
                </div>
                <div>
                  <strong>Area:</strong> {selectedLand.area.toLocaleString()} m²
                </div>
                <div>
                  <strong>Status:</strong> 
                  <span className={selectedLand.isVerified ? 'text-green-600' : 'text-orange-600'}>
                    {selectedLand.isVerified ? ' Verified' : ' Pending'}
                  </span>
                </div>
              </Col>
            </Row>
            <LandMap
              lands={[selectedLand]}
              selectedLand={selectedLand}
              center={selectedLand.coordinates[0]}
              zoom={15}
            />
          </div>
        )}
      </Modal>
    </div>
  );
}