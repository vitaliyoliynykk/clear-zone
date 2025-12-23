import { Dialog, Heading, Portal } from '@chakra-ui/react';
import { FC, ReactNode } from 'react';

import { ModuleModel } from '@/shared/models/responses/module-model';
import { formatDate } from '@/utils/time';

const ModuleDialog: FC<{ children: ReactNode; module: ModuleModel }> = ({
  children,
  module,
}) => {
  return (
    <Dialog.Root placement="center" size="xl" unmountOnExit={true}>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>

      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content p={6} borderRadius="md">
            <Dialog.Header>
              <Heading>{module.name}</Heading>
            </Dialog.Header>

            <Dialog.Body>
              <p>Status: Online</p>
              <p>Registration date: {formatDate(module.registration_date)}</p>
            </Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

export default ModuleDialog;
