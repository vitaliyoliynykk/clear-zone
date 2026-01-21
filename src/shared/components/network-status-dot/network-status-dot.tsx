import { FC } from 'react';

import { ModuleNetworkStatus } from '@/shared/models/module-network-status-model';

const NetworkStatusDot: FC<{
  status: ModuleNetworkStatus;
}> = ({ status }) => {
  const getStatusColor = (status: ModuleNetworkStatus) => {
    switch (status) {
      case 'offline':
        return 'red';
      case 'online':
        return 'green';
      case 'pending':
        return 'gray';
    }
  };

  return (
    <span
      style={{
        width: 12,
        height: 12,
        backgroundColor: getStatusColor(status),
        display: 'inline-block',
        borderRadius: '50%',
        animation:
          status === 'online' ? `pulse 2s ease-in-out infinite` : 'none',
      }}
    ></span>
  );
};

export default NetworkStatusDot;
