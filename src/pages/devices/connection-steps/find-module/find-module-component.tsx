import { Button, Spinner } from '@chakra-ui/react';
import { FC, useState } from 'react';
import { PiBluetoothLight } from 'react-icons/pi';
import { useDispatch, useSelector } from 'react-redux';

import { toaster } from '@/components/ui/toaster';
import { ModalStepBody } from '@/pages/devices/connection-steps/styled-components';
import {
  connectDevice,
  disconnectDevice,
  selectConnectedDevice,
} from '@/store/slices/connect-module.slice';
import { theme } from '@/utils/theme';

const FindModuleComponent: FC = () => {
  const dispatch = useDispatch();
  const connectedDevice = useSelector(selectConnectedDevice);
  const [connectionModalIsOpen, setConnectionModalIsOpen] = useState(false);

  const connectToDevice = async () => {
    try {
      setConnectionModalIsOpen(true);

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
    } finally {
      setConnectionModalIsOpen(false);
    }
  };

  const displayConnectedDevice = () => {
    if (connectionModalIsOpen) {
      return <Spinner />;
    }

    if (connectedDevice) {
      return <>Connected: {connectedDevice.name}</>;
    }

    return <>Find a device</>;
  };

  return (
    <ModalStepBody justifyContent="center">
      <Button variant="subtle" size="lg" onClick={() => void connectToDevice()}>
        <PiBluetoothLight />
        Find a Module
      </Button>
      <div style={{ padding: theme.spacing.sm }}>
        {displayConnectedDevice()}
      </div>
    </ModalStepBody>
  );
};

export default FindModuleComponent;
