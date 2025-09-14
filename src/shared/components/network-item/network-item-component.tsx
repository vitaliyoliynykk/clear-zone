import { HStack } from '@chakra-ui/react';
import { FC, JSX } from 'react';
import { GrSecure } from 'react-icons/gr';
import {
  MdSignalWifi1Bar,
  MdSignalWifi2Bar,
  MdSignalWifi4Bar,
} from 'react-icons/md';

import { NetworkContainer } from '@/shared/components/network-item/styled-components';
import { WifiNetworkModel } from '@/shared/models/bluetooth/bt-network-model';
import { SignalStrengthModel } from '@/shared/models/bluetooth/signal-strength-model';

const NetworkItem: FC<{
  network: WifiNetworkModel;
  onClick?: () => void;
}> = ({ network, onClick }) => {
  const getNetworkIcon = (signal: SignalStrengthModel): JSX.Element => {
    switch (signal) {
      case 'strong':
        return <MdSignalWifi4Bar />;

      case 'medium':
        return <MdSignalWifi2Bar />;

      case 'low':
        return <MdSignalWifi1Bar />;
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
      <HStack>
        {network.isSecure && <GrSecure />}
        {getNetworkIcon(network.signal)}
      </HStack>
    </NetworkContainer>
  );
};

export default NetworkItem;
