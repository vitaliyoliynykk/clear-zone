import { Button, Input } from '@chakra-ui/react';
import { FC } from 'react';
import { PiShareNetwork } from 'react-icons/pi';
import { useSelector } from 'react-redux';

import { ModalStepBody } from '@/pages/devices/connection-steps/styled-components';
import NetworkItem from '@/shared/components/network-item/network-item-component';
import { selectCurrentNetwork } from '@/store/slices/connect-module.slice';

/* eslint-disable */
const ConnectNetworkComponent: FC = () => {
  const selectedNetwork = useSelector(selectCurrentNetwork);

  if (!selectedNetwork) {
    return (
      <ModalStepBody style={{ height: 300 }}>
        Please, select network
      </ModalStepBody>
    );
  }

  return (
    <ModalStepBody justifyContent="center">
      <NetworkItem network={selectedNetwork as any} />
      <Input type="password" placeholder="Password" size="lg" />
      <Button variant="subtle" size="lg" style={{ width: '100%' }}>
        <PiShareNetwork />
        Connect
      </Button>
    </ModalStepBody>
  );
};

export default ConnectNetworkComponent;
