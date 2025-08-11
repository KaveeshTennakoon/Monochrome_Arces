'use client';

import { Form, Input, Select, InputNumber, Button, Row, Col, Card, message } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import { AddLandRequest, LandParcel } from '@/types/land';
import { LAND_TYPES, SRI_LANKA_DISTRICTS } from '@/lib/constants';
import LandMap from './LandMap';
import { useState } from 'react';

const { Option } = Select;
const { TextArea } = Input;

interface LandFormProps {
  initialValues?: Partial<LandParcel>;
  onSubmit: (data: AddLandRequest) => Promise<void>;
  loading?: boolean;
  mode?: 'create' | 'edit';
}

export default function LandForm({ 
  initialValues, 
  onSubmit, 
  loading = false, 
  mode = 'create' 
}: LandFormProps) {
  const [form] = Form.useForm();
  const [coordinates, setCoordinates] = useState<[number, number][]>(
    initialValues?.coordinates || []
  );

  const handlePolygonCreate = (newCoordinates: [number, number][]) => {
    setCoordinates(newCoordinates);
    form.setFieldsValue({ coordinates: newCoordinates });
    message.success('Land boundary drawn successfully!');
  };

  const handleSubmit = async (values: any) => {
    try {
      if (!coordinates.length) {
        message.error('Please draw the land boundary on the map');
        return;
      }

      const formData: AddLandRequest = {
        ...values,
        coordinates,
        area: coordinates.length > 0 ? calculatePolygonArea(coordinates) : 0,
      };

      await onSubmit(formData);
      
      if (mode === 'create') {
        form.resetFields();
        setCoordinates([]);
        message.success('Land parcel added successfully!');
      } else {
        message.success('Land parcel updated successfully!');
      }
    } catch (error) {
      message.error('Failed to save land parcel');
    }
  };

  const calculatePolygonArea = (coords: [number, number][]): number => {
    if (coords.length < 3) return 0;
    
    let area = 0;
    const n = coords.length;
    
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n;
      area += coords[i][0] * coords[j][1];
      area -= coords[j][0] * coords[i][1];
    }
    
    return Math.abs(area) / 2 * 111320 * 111320; // Approximate conversion to square meters
  };

  return (
    <div>
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={12}>
          <Card title="Land Details" className="h-full">
            <Form
              form={form}
              layout="vertical"
              initialValues={initialValues}
              onFinish={handleSubmit}
            >
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="deedNumber"
                    label="Deed Number"
                    rules={[
                      { required: true, message: 'Deed number is required' },
                      { pattern: /^[A-Z0-9-]+$/, message: 'Invalid deed number format' }
                    ]}
                  >
                    <Input placeholder="e.g., DN-12345" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="surveyPlanNumber"
                    label="Survey Plan Number"
                    rules={[{ required: true, message: 'Survey plan number is required' }]}
                  >
                    <Input placeholder="e.g., SP-67890" />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                name="ownerName"
                label="Owner Name"
                rules={[{ required: true, message: 'Owner name is required' }]}
              >
                <Input placeholder="Enter owner's full name" />
              </Form.Item>

              <Form.Item
                name="ownerAddress"
                label="Owner Address"
                rules={[{ required: true, message: 'Owner address is required' }]}
              >
                <TextArea 
                  rows={3} 
                  placeholder="Enter owner's complete address"
                />
              </Form.Item>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="landType"
                    label="Land Type"
                    rules={[{ required: true, message: 'Land type is required' }]}
                  >
                    <Select placeholder="Select land type">
                      {LAND_TYPES.map((type) => (
                        <Option key={type.value} value={type.value}>
                          {type.label}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="district"
                    label="District"
                    rules={[{ required: true, message: 'District is required' }]}
                  >
                    <Select 
                      placeholder="Select district"
                      showSearch
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
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                name="address"
                label="Land Address"
                rules={[{ required: true, message: 'Land address is required' }]}
              >
                <TextArea 
                  rows={2} 
                  placeholder="Enter the land location address"
                />
              </Form.Item>

              <Form.Item
                name="province"
                label="Province"
                rules={[{ required: true, message: 'Province is required' }]}
              >
                <Select placeholder="Select province">
                  <Option value="Western">Western Province</Option>
                  <Option value="Central">Central Province</Option>
                  <Option value="Southern">Southern Province</Option>
                  <Option value="Northern">Northern Province</Option>
                  <Option value="Eastern">Eastern Province</Option>
                  <Option value="North Western">North Western Province</Option>
                  <Option value="North Central">North Central Province</Option>
                  <Option value="Uva">Uva Province</Option>
                  <Option value="Sabaragamuwa">Sabaragamuwa Province</Option>
                </Select>
              </Form.Item>

              {coordinates.length > 0 && (
                <Form.Item label="Calculated Area">
                  <Input 
                    value={`${calculatePolygonArea(coordinates).toLocaleString()} m²`}
                    disabled
                  />
                </Form.Item>
              )}

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  icon={<SaveOutlined />}
                  size="large"
                  className="w-full"
                >
                  {mode === 'create' ? 'Save Land Parcel' : 'Update Land Parcel'}
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title="Draw Land Boundary" className="h-full">
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">
                Use the polygon tool on the map to draw the land boundary. 
                Click on the map to add points and complete the shape.
              </p>
              {coordinates.length > 0 && (
                <div className="bg-green-50 p-2 rounded text-sm text-green-700">
                  ✓ Boundary drawn with {coordinates.length} points
                </div>
              )}
            </div>
            <LandMap
              editable
              onPolygonCreate={handlePolygonCreate}
              center={[7.8731, 80.7718]}
              zoom={10}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
