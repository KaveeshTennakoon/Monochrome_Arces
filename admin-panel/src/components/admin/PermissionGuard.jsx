import React from 'react';
import { Result, Button } from 'antd';
import { hasPermission, hasRole } from '../../utils/auth';

const PermissionGuard = ({ 
  children, 
  permission, 
  role, 
  fallback 
}) => {
  const hasAccess = permission ? hasPermission(permission) : 
                   role ? hasRole(role) : true;

  if (!hasAccess) {
    if (fallback) {
      return fallback;
    }

    return (
      <Result
        status="403"
        title="403"
        subTitle="Sorry, you are not authorized to access this page."
        extra={
          <Button type="primary" onClick={() => window.history.back()}>
            Go Back
          </Button>
        }
      />
    );
  }

  return <>{children}</>;
};

export default PermissionGuard;