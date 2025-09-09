import { FC, JSX } from 'react';
import {
  MdSignalWifi1Bar,
  MdSignalWifi2Bar,
  MdSignalWifi4Bar,
} from 'react-icons/md';

import { NetworkContainer } from '@/shared/components/network-item/styled-components';

const NetworkItem: FC<{
  network: Record<string, string>;
  onClick?: () => void;
}> = ({ network, onClick }) => {
  const getNetworkIcon = (signal: string): JSX.Element => {
    switch (signal) {
      case 'strong':
        return <MdSignalWifi4Bar />;

      case 'medium':
        return <MdSignalWifi2Bar />;

      case 'low':
        return <MdSignalWifi1Bar />;

      default:
        return <MdSignalWifi4Bar />;
    }
  };

  return (
    <NetworkContainer
      type="button"
      onClick={() => {
        if (onClick) {
          onClick();
        }
      }}
    >
      <p>{network.name}</p>
      {getNetworkIcon(network.signal)}
    </NetworkContainer>
  );
};

export default NetworkItem;
