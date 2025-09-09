import { Spinner } from '@chakra-ui/react';
import { FC, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import NetworkItem from '@/shared/components/network-item/network-item-component';
import {
  nextStep,
  selectConnectedDevice,
  selectNetwork,
} from '@/store/slices/connect-module.slice';

import { ModalStepBody } from '../styled-components';

const networks: Record<string, string>[] = [
  { name: 'HomeNetwork_5G', signal: 'strong' },
  { name: 'Tenda 2.4G', signal: 'medium' },
  { name: 'SomeNetwork', signal: 'low' },
  { name: 'HomeNetwork_5G', signal: 'medium' },
  { name: 'Tenda 2.4G', signal: 'medium' },
  { name: 'SomeNetwork', signal: 'strong' },
  { name: 'SomeNetwork', signal: 'low' },
  { name: 'HomeNetwork_5G', signal: 'strong' },
  { name: 'Tenda 2.4G', signal: 'medium' },
  { name: 'SomeNetwork', signal: 'low' },
  { name: 'HomeNetwork_5G', signal: 'medium' },
  { name: 'Tenda 2.4G', signal: 'medium' },
  { name: 'SomeNetwork', signal: 'strong' },
  { name: 'SomeNetwork', signal: 'low' },
];

const getNetworks = async (): Promise<Record<string, string>[]> => {
  return new Promise((res) =>
    setTimeout(() => {
      res(networks);
    }, 1000)
  );
};

const FindNetworkComponent: FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [networks, setNetworks] = useState<Record<string, string>[]>([]);
  const dispatch = useDispatch();
  const connectedDevice = useSelector(selectConnectedDevice);

  useEffect(() => {
    if (connectedDevice) {
      void getNetworks().then((networks) => {
        setNetworks(networks);
        setIsLoading(false);
      });
    }
  }, [connectedDevice]);

  if (isLoading)
    return (
      <ModalStepBody>
        <Spinner />
      </ModalStepBody>
    );

  return (
    <ModalStepBody>
      {networks.map((network, index) => (
        <NetworkItem
          key={index}
          network={network}
          onClick={() => {
            dispatch(selectNetwork(network));
            dispatch(nextStep());
          }}
        />
      ))}
    </ModalStepBody>
  );
};

export default FindNetworkComponent;
