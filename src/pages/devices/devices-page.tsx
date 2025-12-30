import { Box, Container, Spinner } from '@chakra-ui/react';
import { FC, useCallback, useEffect, useState } from 'react';
import { IoAdd } from 'react-icons/io5';

import { PageHeading } from '@/shared/components/page-heading/page-heading-component';
import { useWebSocket } from '@/shared/hooks/useWebSocket';
import { WsDataModel } from '@/shared/models/ws-data-model';
import {
  loadModulesList,
  selectModules,
  selectModulesStatus,
} from '@/store/slices/devices';
import { useAppDispatch, useAppSelector } from '@/store/store';

import { ConnectModuleDialog } from './connect-module-dialog/connect-module-dialog';
import ModuleDialog from './module-dialog/module-dialog';
import { DeviceContainer } from './styled-components';

const DevicesPage: FC = () => {
  const dispatch = useAppDispatch();
  const modules = useAppSelector(selectModules);
  const status = useAppSelector(selectModulesStatus);
  const [modulesStatuses, setModulesStatuses] = useState<
    Record<string, 'online' | 'offline'>
  >({});

  const onWsData = (wsData: WsDataModel<{ status: 'online' | 'offline' }>) => {
    if (modules?.find((module) => module.device_id === wsData.deviceId)) {
      setModulesStatuses((prev) => ({
        ...prev,
        [wsData.deviceId]: wsData.data.status,
      }));
    }
  };

  const onWsDataMemo = useCallback(onWsData, [modules]);

  useWebSocket(onWsDataMemo);

  useEffect(() => {
    void dispatch(loadModulesList());
  }, [dispatch]);

  const getStatusIcon = (status: 'online' | 'offline') => (
    <span
      style={{
        width: 10,
        height: 10,
        backgroundColor: status === 'online' ? 'green' : 'red',
        display: 'inline-block',
        borderRadius: '50%',
      }}
    ></span>
  );

  if (status === 'loading') {
    return (
      <Container style={{ height: '100%' }}>
        <PageHeading>My Devices</PageHeading>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          style={{ height: '100%' }}
        >
          <Spinner />
        </Box>
      </Container>
    );
  }

  return (
    <Container style={{ height: '100%' }}>
      <PageHeading>My Devices</PageHeading>
      <Box display="flex" style={{ gap: '12px', flexWrap: 'wrap' }}>
        {!!modules &&
          modules.map((module) => (
            <ModuleDialog key={module.device_id} module={module}>
              <DeviceContainer>
                <Box display="flex" flexDirection="column" alignItems="center">
                  <div>{module.name}</div>
                  <div>
                    Status:
                    {getStatusIcon(modulesStatuses[module.device_id])}
                  </div>
                </Box>
              </DeviceContainer>
            </ModuleDialog>
          ))}

        <ConnectModuleDialog>
          <DeviceContainer>
            <Box display="flex" flexDirection="column" alignItems="center">
              <IoAdd style={{ height: 50, width: 50, marginBottom: 4 }} />
              <div>Connect Module</div>
            </Box>
          </DeviceContainer>
        </ConnectModuleDialog>
      </Box>
    </Container>
  );
};

export default DevicesPage;
