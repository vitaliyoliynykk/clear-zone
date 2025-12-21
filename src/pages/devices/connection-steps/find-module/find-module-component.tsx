import { Button, Spinner } from '@chakra-ui/react';
import { FC, useState } from 'react';
import { PiBluetoothLight } from 'react-icons/pi';
import { useDispatch, useSelector } from 'react-redux';

import { toaster } from '@/components/ui/toaster';
import { ModalStepBody } from '@/pages/devices/connection-steps/styled-components';
import { DEVICE_ID_CHARACTERISTIC_ID } from '@/shared/constants/bt-characteristics';
import { CLEAR_ZONE_MODULE_SERVICE_ID } from '@/shared/constants/bt-services';
import {
  connectDevice,
  disconnectDevice,
  selectConnectedDevice,
} from '@/store/slices/connect-module.slice';
import { decodeTextBTCharacteristic } from '@/utils/bluetooth/decode-characteristic';
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
        filters: [{ services: [CLEAR_ZONE_MODULE_SERVICE_ID] }],
      });

      const server = await device.gatt?.connect();

      if (server) {
        const service = await server.getPrimaryService(
          CLEAR_ZONE_MODULE_SERVICE_ID
        );

        const deviceIdCharateristic = await service.getCharacteristic(
          DEVICE_ID_CHARACTERISTIC_ID
        );

        const deviceId = await decodeTextBTCharacteristic(
          deviceIdCharateristic
        );

        dispatch(connectDevice({ device, deviceId }));
      }
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

    return <>No connected device</>;
  };

  return (
    <ModalStepBody justifyContent="center">
      <Button
        variant="subtle"
        size="lg"
        width="100%"
        onClick={() => void connectToDevice()}
      >
        <PiBluetoothLight />
        Find a Module
      </Button>
      <div
        style={{
          padding: theme.spacing.sm,
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          fontSize: theme.fontSize.base,
        }}
      >
        {displayConnectedDevice()}
      </div>
    </ModalStepBody>
  );
};

export default FindModuleComponent;
