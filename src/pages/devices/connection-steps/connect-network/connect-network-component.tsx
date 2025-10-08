import { Alert, Button, Input } from '@chakra-ui/react';
import { FC } from 'react';
import { useForm } from 'react-hook-form';
import { PiShareNetwork } from 'react-icons/pi';
import { useSelector } from 'react-redux';

import { toaster } from '@/components/ui/toaster';
import { ModalStepBody } from '@/pages/devices/connection-steps/styled-components';
import NetworkItem from '@/shared/components/network-item/network-item-component';
import { WIFI_CREDS_CHARACTERISTIC_ID } from '@/shared/constants/bt-characteristics';
import { CLEAR_ZONE_MODULE_SERVICE_ID } from '@/shared/constants/bt-services';
import {
  selectConnectedDevice,
  selectCurrentNetwork,
} from '@/store/slices/connect-module.slice';

/* eslint-disable */
const ConnectNetworkComponent: FC = () => {
  const selectedNetwork = useSelector(selectCurrentNetwork);
  const connectedDevice = useSelector(selectConnectedDevice);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isValid },
  } = useForm<{
    password: string;
  }>({
    defaultValues: { password: '' },
  });

  if (!selectedNetwork) {
    return (
      <ModalStepBody style={{ height: 300 }}>
        Please, select network
      </ModalStepBody>
    );
  }

  const onSubmit = handleSubmit(async ({ password }) => {
    try {
      if (connectedDevice) {
        const server = await connectedDevice.gatt?.connect();
        if (!server) return;

        const service = await server.getPrimaryService(
          CLEAR_ZONE_MODULE_SERVICE_ID
        );
        const characteristic = await service.getCharacteristic(
          WIFI_CREDS_CHARACTERISTIC_ID
        );

        const encoder = new TextEncoder();
        const data = encoder.encode(`${selectedNetwork.name}:${password}`);

        await characteristic.writeValue(data);

        const result = await characteristic.readValue();

        const decoder = new TextDecoder();
        const response = decoder.decode(result);

        if (+response !== 3) {
          toaster.create({
            description: `Error connecting to ${selectedNetwork.name} network`,
            type: 'error',
            duration: 3000,
          });
        } else {
          toaster.create({
            description: `Module connected to ${selectedNetwork.name} network`,
            type: 'success',
            duration: 3000,
          });
        }

        reset();

        return;
      }
    } catch (error) {
      console.error('Error connecting to network:', error);
    }
  });

  return (
    <ModalStepBody justifyContent="center">
      <NetworkItem network={selectedNetwork as any} />
      <Input
        type="password"
        placeholder="Password"
        size="lg"
        {...register('password', {
          required: 'Password is required',
        })}
      />
      <Button
        variant="subtle"
        size="lg"
        style={{ width: '100%' }}
        loading={isSubmitting}
        disabled={isSubmitting || !isValid}
        onClick={() => {
          void onSubmit();
        }}
      >
        <PiShareNetwork />
        Connect
      </Button>

      {errors.root && (
        <Alert.Root status="error" marginTop={2}>
          <Alert.Indicator />
          <Alert.Title>{errors.root.message}</Alert.Title>
        </Alert.Root>
      )}
    </ModalStepBody>
  );
};

export default ConnectNetworkComponent;
