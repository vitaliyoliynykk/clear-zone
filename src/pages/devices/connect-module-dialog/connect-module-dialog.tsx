import {
  Button,
  ButtonGroup,
  Dialog,
  Heading,
  Portal,
  Steps,
} from '@chakra-ui/react';
import { FC, ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { toaster } from '@/components/ui/toaster';
import ConnectNetworkComponent from '@/pages/devices/connection-steps/connect-network/connect-network-component';
import FindModuleComponent from '@/pages/devices/connection-steps/find-module/find-module-component';
import FindNetworkComponent from '@/pages/devices/connection-steps/find-network/find-network-component';
import { STATUS_CHARACTERISTIC_ID } from '@/shared/constants/bt-characteristics';
import { CLEAR_ZONE_MODULE_SERVICE_ID } from '@/shared/constants/bt-services';
import { DeviceRegistrationResponseModel } from '@/shared/models/bluetooth/device-registration-response-model';
import {
  nextStep,
  prevStep,
  resetConnectionState,
  selectConnectedDevice,
  selectCurrentStep,
} from '@/store/slices/connect-module.slice';

import ModuleRegistrationComponent from '../connection-steps/module-registration/module-registration';

const steps = [
  {
    title: 'Connect to a Module',
    Component: FindModuleComponent,
  },
  {
    title: 'Find a Wi-Fi network',
    Component: FindNetworkComponent,
  },
  {
    title: 'Connect to a network',
    Component: ConnectNetworkComponent,
  },
  {
    title: 'Module registration',
    Component: ModuleRegistrationComponent,
  },
];

export const ConnectModuleDialog: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const dispatch = useDispatch();
  const currentStep = useSelector(selectCurrentStep);
  const connectedDevice = useSelector(selectConnectedDevice);
  const registrationStatusCharacteristic =
    useRef<BluetoothRemoteGATTCharacteristic | null>(null);
  const [open, setOpen] = useState(false);

  const onRegistrationStatusNotify = (e: Event) => {
    const value = (e.target as BluetoothRemoteGATTCharacteristic).value;
    if (!value) return;

    const registrationStatus = new TextDecoder().decode(
      value
    ) as DeviceRegistrationResponseModel;

    if (registrationStatus === 'REGISTERED') {
      toaster.create({
        description: `Device successfully registered`,
        type: 'success',
        duration: 3000,
      });
    } else {
      toaster.create({
        description: `Registration error. Please repeat the process`,
        type: 'error',
        duration: 3000,
      });
    }

    setOpen(false);
  };

  const subscribeRegistrationStatus = async (
    connectedDevice: BluetoothDevice
  ) => {
    let characteristic: BluetoothRemoteGATTCharacteristic | null = null;

    const subscribe =
      async (): Promise<BluetoothRemoteGATTCharacteristic | null> => {
        const server = connectedDevice.gatt?.connected
          ? connectedDevice.gatt
          : await connectedDevice.gatt?.connect();

        if (!server) return null;

        const service = await server.getPrimaryService(
          CLEAR_ZONE_MODULE_SERVICE_ID
        );
        characteristic = await service.getCharacteristic(
          STATUS_CHARACTERISTIC_ID
        );

        await characteristic.startNotifications();

        characteristic.addEventListener(
          'characteristicvaluechanged',
          onRegistrationStatusNotifyCached
        );

        return characteristic;
      };

    await subscribe();
  };

  const onRegistrationStatusNotifyCached = useCallback(
    onRegistrationStatusNotify,
    []
  );

  const subscribeRegistrationStatusCached = useCallback(
    subscribeRegistrationStatus,
    [onRegistrationStatusNotifyCached]
  );

  useEffect(() => {
    if (!connectedDevice) return;

    void subscribeRegistrationStatusCached(connectedDevice);

    const characteristic = registrationStatusCharacteristic.current;

    return () => {
      if (characteristic) {
        characteristic.removeEventListener(
          'characteristicvaluechanged',
          onRegistrationStatusNotifyCached
        );

        void characteristic.stopNotifications();
      }
    };
  }, [
    connectedDevice,
    subscribeRegistrationStatusCached,
    onRegistrationStatusNotifyCached,
  ]);

  const onDialogClose = () => {
    if (connectedDevice) {
      connectedDevice.gatt?.disconnect();
    }

    dispatch(resetConnectionState());
  };

  return (
    <Dialog.Root
      placement="center"
      size="xl"
      unmountOnExit={true}
      open={open}
      onOpenChange={(e) => {
        setOpen(e.open);
      }}
      onExitComplete={() => {
        onDialogClose();
      }}
    >
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>

      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content p={6} borderRadius="md">
            <Dialog.Header>
              <Heading>Connect New Module</Heading>
            </Dialog.Header>

            <Dialog.Body>
              <Steps.Root
                step={currentStep}
                defaultStep={0}
                count={steps.length}
                variant="subtle"
              >
                <Steps.List>
                  {steps.map((step, index) => (
                    <Steps.Item
                      style={{ gap: 12 }}
                      key={index}
                      index={index}
                      title={step.title}
                    >
                      <Steps.Indicator />
                      <Steps.Title>{step.title}</Steps.Title>
                      <Steps.Separator />
                    </Steps.Item>
                  ))}
                </Steps.List>

                {steps.map((step, index) => (
                  <Steps.Content key={index} index={index}>
                    <step.Component />
                  </Steps.Content>
                ))}

                <ButtonGroup size="sm" variant="outline">
                  <Button
                    onClick={() => dispatch(prevStep())}
                    disabled={currentStep === 0}
                  >
                    Prev
                  </Button>

                  <Button
                    onClick={() => dispatch(nextStep())}
                    disabled={!connectedDevice}
                  >
                    Next
                  </Button>
                </ButtonGroup>
              </Steps.Root>
            </Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};
