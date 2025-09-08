import { Button, VStack } from '@chakra-ui/react';
import { FC } from 'react';
import { PiBluetoothLight } from 'react-icons/pi';
import { useDispatch, useSelector } from 'react-redux';

import { toaster } from '@/components/ui/toaster';
import {
  connectDevice,
  disconnectDevice,
  selectConnectedDevice,
} from '@/store/slices/connect-module.slice';

const FindModuleComponent: FC = () => {
  const dispatch = useDispatch();
  const connectedDevice = useSelector(selectConnectedDevice);

  const connectToDevice = async () => {
    try {
      if (connectedDevice) {
        connectedDevice.gatt?.disconnect();
        dispatch(disconnectDevice());
      }

      const device = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: ['battery_service'],
      });

      await device.gatt?.connect();

      dispatch(connectDevice(device));
    } catch (error) {
      console.error('Bluetooth connection failed:', error);
      toaster.create({
        description: `Bluetooth connection failed. Please try again`,
        type: 'error',
        duration: 3000,
      });

      disconnectDevice();
    }
  };

  return (
    <VStack>
      <Button variant="subtle" size="lg" onClick={() => void connectToDevice()}>
        <PiBluetoothLight />
        Find a Module
      </Button>
      {connectedDevice ? (
        <div style={{ padding: 12 }}>Connected: {connectedDevice.name}</div>
      ) : (
        <div style={{ padding: 12 }}>Find a device</div>
      )}
    </VStack>
  );
};

export default FindModuleComponent;
