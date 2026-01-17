import { FC } from 'react';

import { ModuleNetworkStatus } from '@/shared/models/module-network-status-model';

const NetworkStatusDot: FC<{
  status: ModuleNetworkStatus;
}> = ({ status }) => {
  return (
    <span
      style={{
        width: 12,
        height: 12,
        backgroundColor: status === 'online' ? 'green' : 'red',
        display: 'inline-block',
        borderRadius: '50%',
        animation:
          status === 'online' ? `pulse 2s ease-in-out infinite` : 'none',
      }}
    ></span>
  );
};

export default NetworkStatusDot;
