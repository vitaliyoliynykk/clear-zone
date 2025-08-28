import { Button, Dialog, Heading, Portal } from '@chakra-ui/react';
import { FC, ReactNode } from 'react';

export const ConnectModuleDialog: FC<{ children: ReactNode }> = ({
  children,
}) => {
  return (
    <Dialog.Root placement="center">
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>

      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content p={6} borderRadius="md">
            <Dialog.Header>
              <Heading>Connect New Module</Heading>
            </Dialog.Header>

            <Dialog.Body>
              <p>1. Connect via bluetooth to the module</p>
              <p>2. Connect the module to Wi-Fi</p>
            </Dialog.Body>

            <Dialog.Footer display="flex" justifyContent="flex-end" gap="4">
              <Dialog.ActionTrigger asChild>
                <Button variant="outline">Cancel</Button>
              </Dialog.ActionTrigger>

              <Button type="submit" colorScheme="blue">
                Connect
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};
