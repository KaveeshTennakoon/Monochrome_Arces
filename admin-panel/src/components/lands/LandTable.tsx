'use client';

import { Table, Tag, Space, Button, Input, Select, Popconfirm, message } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined, SearchOutlined } from '@ant-design/icons';
import { LandParcel, LandSearchFilters } from '@/types/land';
import { LAND_TYPES, SRI_LANKA_DISTRICTS } from '@/lib/constants';
import { formatDate } from '@/lib/utils';
import { useState } from 'react';
import type { ColumnsType } from 'antd/es/table';

const { Option } = Select;

interface LandTableProps {
  lands: LandParcel[];
  loading?: boolean;
  onView: (land: LandParcel) => void;
  onEdit: (land: LandParcel) => void;
  onDelete: (id: string) => void;
  onSearch: (filters: LandSearchFilters) => void;
}

export default function LandTable({ 
  lands, 
  loading = false, 
  onView, 
  onEdit, 
  onDelete, 
  onSearch 
}: LandTableProps) {
  const [filters, setFilters] = useState<LandSearchFilters>({});

  const handleSearch = () => {
    onSearch(filters);
  };

  const handleFilterChange = (key: keyof LandSearchFilters, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
  };

  const handleDelete = async (id: string) => {
    try {
      await onDelete(id);
      message.success('Land parcel deleted successfully');
    } catch (error) {
      message.error('Failed to delete land parcel');
    }
  };

  const columns: ColumnsType<LandParcel> = [
    {
      title: 'Deed Number',
      dataIndex: 'deedNumber',
      key: 'deedNumber',
      sorter: (a, b) => a.deedNumber.localeCompare(b.deedNumber),
    },
    {
      title: 'Survey Plan',
      dataIndex: 'surveyPlanNumber',
      key: 'surveyPlanNumber',
    },
    {
      title: 'Owner',
      dataIndex: 'ownerName',
      key: 'ownerName',
      sorter: (a, b) => a.ownerName.localeCompare(b.ownerName),
    },
    {
      title: 'Land Type',
      dataIndex: 'landType',
      key: 'landType',
      render: (type: string) => {
        const typeConfig = LAND_TYPES.find(t => t.value === type);
        return <Tag color="blue">{typeConfig?.label || type}</Tag>;
      },
    },
    {
      title: 'District',
      dataIndex: 'district',
      key: 'district',
    },
    {
      title: 'Area (m²)',
      dataIndex: 'area',
      key: 'area',
      render: (area: number) => area.toLocaleString(),
      sorter: (a, b) => a.area - b.area,
    },
    {
      title: 'Status',
      dataIndex: 'isVerified',
      key: 'isVerified',
      render: (isVerified: boolean) => (
        <Tag color={isVerified ? 'green' : 'orange'}>
          {isVerified ? 'Verified' : 'Pending'}
        </Tag>
      ),
    },
    {
      title: 'Created',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => formatDate(date),
      sorter: (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => onView(record)}
            title="View Details"
          />
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => onEdit(record)}
            title="Edit"
          />
          <Popconfirm
            title="Delete Land Parcel"
            description="Are you sure you want to delete this land parcel?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              title="Delete"
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      {/* Search Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <Input
            placeholder="Search by deed number"
            prefix={<SearchOutlined />}
            value={filters.deedNumber}
            onChange={(e) => handleFilterChange('deedNumber', e.target.value)}
          />
          <Input
            placeholder="Search by owner name"
            value={filters.ownerName}
            onChange={(e) => handleFilterChange('ownerName', e.target.value)}
          />
          <Select
            placeholder="Select land type"
            allowClear
            value={filters.landType}
            onChange={(value) => handleFilterChange('landType', value)}
          >
            {LAND_TYPES.map((type) => (
              <Option key={type.value} value={type.value}>
                {type.label}
              </Option>
            ))}
          </Select>
          <Select
            placeholder="Select district"
            allowClear
            showSearch
            value={filters.district}
            onChange={(value) => handleFilterChange('district', value)}
            filterOption={(input, option) =>
              (option?.children as string)?.toLowerCase().includes(input.toLowerCase())
            }
          >
            {SRI_LANKA_DISTRICTS.map((district) => (
              <Option key={district} value={district}>
                {district}
              </Option>
            ))}
          </Select>
        </div>
        <div className="flex justify-between items-center">
          <Select
            placeholder="Verification status"
            allowClear
            value={filters.isVerified}
            onChange={(value) => handleFilterChange('isVerified', value)}
            className="w-48"
          >
            <Option value={true}>Verified</Option>
            <Option value={false}>Pending</Option>
          </Select>
          <Space>
            <Button onClick={() => setFilters({})}>Clear Filters</Button>
            <Button type="primary" onClick={handleSearch}>
              Search
            </Button>
          </Space>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-lg shadow-sm">
        <Table
          columns={columns}
          dataSource={lands}
          loading={loading}
          rowKey="id"
          pagination={{
            total: lands.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} land parcels`,
          }}
          scroll={{ x: 1200 }}
        />
      </div>
    </div>
  );
}