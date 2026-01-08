import { Button, ButtonGroup, Dialog, Heading, Portal } from '@chakra-ui/react';
import { FC, ReactNode } from 'react';

import { ModuleModel } from '@/shared/models/responses/module-model';
import { deleteModule, selectModulesStatus } from '@/store/slices/devices';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { formatDate } from '@/utils/time';

const ModuleDialog: FC<{ children: ReactNode; module: ModuleModel }> = ({
  children,
  module,
}) => {
  const status = useAppSelector(selectModulesStatus);
  const dispatch = useAppDispatch();

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
              <p>Module ID: {module.device_id}</p>
            </Dialog.Body>

            <ButtonGroup size="sm" variant="outline" marginLeft="auto">
              <Button
                colorPalette="red"
                disabled={status === 'loading'}
                onClick={() => {
                  void dispatch(deleteModule({ moduleId: module.device_id }));
                }}
              >
                Remove from account
              </Button>
            </ButtonGroup>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

export default ModuleDialog;
