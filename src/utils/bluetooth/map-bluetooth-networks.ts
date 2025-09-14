import { WifiNetworkModel } from '@/shared/models/bluetooth/bt-network-model';

import { getSignalStrength } from './get-signal-strength';

export const mapBluetoothNetworks = ({
  buffer,
}: DataView): WifiNetworkModel[] => {
  const decoder = new TextDecoder('utf-8');
  const str = decoder.decode(buffer);

  if (str === 'NO_NETWORKS') {
    return [];
  }

  const networks = str.split(';').map<WifiNetworkModel>((network) => {
    const [name, rssi, isSecure] = network.split(',');
    const signal = getSignalStrength(+rssi);

    return { name, signal, isSecure: Boolean(isSecure) };
  });

  return networks;
};
