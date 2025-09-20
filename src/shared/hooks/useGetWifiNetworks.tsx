import { useCallback, useState } from 'react';

import { toaster } from '@/components/ui/toaster';
import { WIFI_NETWORKS_CHARACTERISTIC_ID } from '@/shared/constants/bt-characteristics';
import { CLEAR_ZONE_MODULE_SERVICE_ID } from '@/shared/constants/bt-services';
import { WifiNetworkModel } from '@/shared/models/bluetooth/bt-network-model';
import { selectConnectedDevice } from '@/store/slices/connect-module.slice';
import { useAppSelector } from '@/store/store';
import { mapBluetoothNetworks } from '@/utils/bluetooth/map-bluetooth-networks';

export const useGetWifiNetworks = () => {
  const connectedDevice = useAppSelector(selectConnectedDevice);
  const [networks, setNetworks] = useState<WifiNetworkModel[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const requestNetworks = useCallback(async () => {
    if (connectedDevice) {
      setIsLoading(true);

      try {
        const server = await connectedDevice.gatt?.connect();

        if (server) {
          const service = await server.getPrimaryService(
            CLEAR_ZONE_MODULE_SERVICE_ID
          );

          const characteristic = await service.getCharacteristic(
            WIFI_NETWORKS_CHARACTERISTIC_ID
          );

          const rawValue = await characteristic.readValue();

          const networks = mapBluetoothNetworks(rawValue);

          setNetworks(networks);
        }
      } catch (error) {
        toaster.create({
          description: `Error getting WiFi networks. Please try again`,
          type: 'error',
          duration: 3000,
        });

        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
  }, [connectedDevice]);

  return { networks, isLoading, requestNetworks };
};
