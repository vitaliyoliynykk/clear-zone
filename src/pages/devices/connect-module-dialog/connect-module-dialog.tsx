import {
  Button,
  ButtonGroup,
  Dialog,
  Heading,
  Portal,
  Steps,
} from '@chakra-ui/react';
import { FC, ReactNode } from 'react';

import FindModuleComponent from '../connection-steps/find-module/find-module-component';

const steps = [
  {
    title: 'Connect to a Module',
    Component: FindModuleComponent,
  },
  {
    title: 'Find a Wi-Fi network',
    Component: FindModuleComponent,
  },
  {
    title: 'Connect a Module',
    Component: FindModuleComponent,
  },
];

export const ConnectModuleDialog: FC<{ children: ReactNode }> = ({
  children,
}) => {
  return (
    <Dialog.Root placement="center" size="xl">
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>

      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content p={6} borderRadius="md">
            <Dialog.Header>
              <Heading>Connect New Module</Heading>
            </Dialog.Header>

            <Dialog.Body>
              <Steps.Root defaultStep={0} count={steps.length} variant="subtle">
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
                  <Steps.PrevTrigger asChild>
                    <Button>Prev</Button>
                  </Steps.PrevTrigger>
                  <Steps.NextTrigger asChild>
                    <Button>Next</Button>
                  </Steps.NextTrigger>
                </ButtonGroup>
              </Steps.Root>
            </Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};
