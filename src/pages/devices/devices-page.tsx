import { Box, Container, Spinner } from '@chakra-ui/react';
import { FC, useCallback, useEffect, useState } from 'react';
import { IoAdd } from 'react-icons/io5';

import { PageHeading } from '@/shared/components/page-heading/page-heading-component';
import { useIsPWA } from '@/shared/hooks/useIsPWA';
import { useWebSocket } from '@/shared/hooks/useWebSocket';
import { WsDataModel } from '@/shared/models/ws-data-model';
import {
  loadModulesList,
  moduleSelectors,
  selectModulesStatus,
} from '@/store/slices/devices';
import { useAppDispatch, useAppSelector } from '@/store/store';

import { ConnectModuleDialog } from './connect-module-dialog/connect-module-dialog';
import DeviceTabComponent from './device-tab/device-tab-component';
import { DeviceContainer } from './styled-components';

const DevicesPage: FC = () => {
  const dispatch = useAppDispatch();
  const modules = useAppSelector(moduleSelectors.selectAll);
  const status = useAppSelector(selectModulesStatus);
  const isPWA = useIsPWA();
  const [modulesStatuses, setModulesStatuses] = useState<
    Record<string, 'online' | 'offline'>
  >({});
  const [co2, setModulesCo2] = useState<Record<string, number>>({});
  const [temp, setModulesTemp] = useState<
    Record<string, { temp: number; hum: number } | undefined>
  >({});

  const onWsData = (wsData: WsDataModel) => {
    console.log('WS DATA', wsData);

    if (wsData.type === 'status') {
      if (modules.find((module) => module.device_id === wsData.deviceId)) {
        setModulesStatuses((prev) => ({
          ...prev,
          [wsData.deviceId]: wsData.data.status,
        }));
      }
    } else if (wsData.type === 'co2') {
      if (modules.find((module) => module.device_id === wsData.deviceId)) {
        setModulesCo2((prev) => ({
          ...prev,
          [wsData.deviceId]: wsData.data.co2,
        }));
      }
    } else {
      if (modules.find((module) => module.device_id === wsData.deviceId)) {
        setModulesTemp((prev) => ({
          ...prev,
          [wsData.deviceId]: wsData.data,
        }));
      }
    }
  };

  const onWsClosed = () => {
    setModulesStatuses(() => ({}));
  };

  const onWsDataMemo = useCallback(onWsData, [modules]);
  const onWsClosedMemo = useCallback(onWsClosed, []);

  useWebSocket(onWsDataMemo, onWsClosedMemo);

  useEffect(() => {
    void dispatch(loadModulesList());
  }, [dispatch]);

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
        {modules.map((module) => (
          <DeviceTabComponent
            key={module.device_id}
            name={module.name}
            status={modulesStatuses[module.device_id]}
            co2={co2[module.device_id]}
            temp={temp[module.device_id]?.temp}
            hum={temp[module.device_id]?.hum}
          />
        ))}
        {!isPWA && (
          <ConnectModuleDialog>
            <DeviceContainer>
              <Box display="flex" flexDirection="column" alignItems="center">
                <IoAdd style={{ height: 50, width: 50, marginBottom: 4 }} />
                <div>Connect Module</div>
              </Box>
            </DeviceContainer>
          </ConnectModuleDialog>
        )}
      </Box>
    </Container>
  );
};

export default DevicesPage;
