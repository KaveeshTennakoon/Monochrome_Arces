import { Card, Statistic } from 'antd';
import { ReactNode } from 'react';

interface StatsCardProps {
  title: string;
  value: number;
  icon: ReactNode;
  color?: string;
  suffix?: string;
  loading?: boolean;
}

export default function StatsCard({ 
  title, 
  value, 
  icon, 
  color = '#1890ff',
  suffix,
  loading = false 
}: StatsCardProps) {
  return (
    <Card loading={loading}>
      <Statistic
        title={title}
        value={value}
        prefix={<span style={{ color }}>{icon}</span>}
        suffix={suffix}
        valueStyle={{ color }}
      />
    </Card>
  );
}