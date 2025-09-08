import {
  Button,
  ButtonGroup,
  Dialog,
  Heading,
  Portal,
  Steps,
} from '@chakra-ui/react';
import { FC, ReactNode } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import FindModuleComponent from '@/pages/devices/connection-steps/find-module/find-module-component';
import FindNetworkComponent from '@/pages/devices/connection-steps/find-network/find-network-component';
import {
  nextStep,
  resetConnectionState,
  selectCurrentStep,
} from '@/store/slices/connect-module.slice';

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
    title: 'Connect a Module',
    Component: FindModuleComponent,
  },
];

export const ConnectModuleDialog: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const dispatch = useDispatch();
  const currentStep = useSelector(selectCurrentStep);

  return (
    <Dialog.Root
      placement="center"
      size="xl"
      unmountOnExit={true}
      onExitComplete={() => dispatch(resetConnectionState())}
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
                  <Button>Prev</Button>

                  <Button onClick={() => dispatch(nextStep())}>Next</Button>
                </ButtonGroup>
              </Steps.Root>
            </Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};
