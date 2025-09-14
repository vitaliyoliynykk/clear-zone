import { Button, Spinner } from '@chakra-ui/react';
import { FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import NetworkItem from '@/shared/components/network-item/network-item-component';
import { useGetWifiNetworks } from '@/shared/hooks/useGetWifiNetworks';
import { nextStep, selectNetwork } from '@/store/slices/connect-module.slice';

import { ModalStepBody } from '../styled-components';

const FindNetworkComponent: FC = () => {
  const dispatch = useDispatch();

  const { networks, isLoading, requestNetworks } = useGetWifiNetworks();

  useEffect(() => {
    void requestNetworks();
  }, [requestNetworks]);

  if (isLoading)
    return (
      <ModalStepBody justifyContent="center" alignItems="center">
        <Spinner />
      </ModalStepBody>
    );

  return (
    <ModalStepBody>
      <Button
        onClick={() => {
          void requestNetworks();
        }}
      >
        Refresh
      </Button>
      {networks.length ? (
        networks.map((network, index) => (
          <NetworkItem
            key={index}
            network={network}
            onClick={() => {
              dispatch(selectNetwork(network));
              dispatch(nextStep());
            }}
          />
        ))
      ) : (
        <p>No networks found</p>
      )}
    </ModalStepBody>
  );
};

export default FindNetworkComponent;
