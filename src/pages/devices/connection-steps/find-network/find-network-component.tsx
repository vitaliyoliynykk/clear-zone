import { Spinner, VStack } from '@chakra-ui/react';
import { FC, useEffect, useState } from 'react';
import { JSX } from 'react/jsx-runtime';
import {
  MdSignalWifi1Bar,
  MdSignalWifi2Bar,
  MdSignalWifi4Bar,
} from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';

import {
  nextStep,
  selectConnectedDevice,
  selectNetwork,
} from '@/store/slices/connect-module.slice';

import { NetworkItem } from './styled-components';

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
      <VStack>
        <Spinner />
      </VStack>
    );

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
    <VStack>
      {networks.map((network, index) => (
        <NetworkItem
          key={index}
          onClick={() => {
            dispatch(selectNetwork(network));
            dispatch(nextStep());
          }}
        >
          <p>{network.name}</p>
          {getNetworkIcon(network.signal)}
        </NetworkItem>
      ))}
    </VStack>
  );
};

export default FindNetworkComponent;
