import { Box, Container, Spinner } from '@chakra-ui/react';
import { FC, useCallback, useEffect, useState } from 'react';
import { IoAdd } from 'react-icons/io5';
import { useNavigate } from 'react-router';

import { PageHeading } from '@/shared/components/page-heading/page-heading-component';
import { useIsPWA } from '@/shared/hooks/useIsPWA';
import { useWebSocket } from '@/shared/hooks/useWebSocket';
import { ModuleNetworkStatus } from '@/shared/models/module-network-status-model';
import { WsDataModel } from '@/shared/models/ws-data-model';
import {
  loadModulesList,
  moduleSelectors,
  selectModulesStatus,
} from '@/store/slices/devices';
import {
  loadIaqScoresForModules,
  selectScores,
} from '@/store/slices/iaq-score.slice';
import { useAppDispatch, useAppSelector } from '@/store/store';

import { ConnectModuleDialog } from './connect-module-dialog/connect-module-dialog';
import DeviceTabComponent from './device-tab/device-tab-component';
import { DeviceContainer } from './styled-components';

const DevicesPage: FC = () => {
  const dispatch = useAppDispatch();
  const modules = useAppSelector(moduleSelectors.selectAll);
  const status = useAppSelector(selectModulesStatus);
  const scores = useAppSelector(selectScores);
  const isPWA = useIsPWA();
  const navigate = useNavigate();
  const [modulesStatuses, setModulesStatuses] = useState<
    Record<string, ModuleNetworkStatus | undefined>
  >({});
  const [temp, setModulesTemp] = useState<
    Record<string, { temp: number; hum: number } | undefined>
  >({});

  useEffect(() => {
    if (modules.length) {
      void dispatch(loadIaqScoresForModules(modules.map((m) => m.device_id)));
    }
  }, [modules, dispatch]);

  const onWsData = (wsData: WsDataModel) => {
    const module = modules.find(
      (module) => module.device_id === wsData.deviceId
    );

    if (module) {
      switch (wsData.type) {
        case 'status':
          setModulesStatuses((prev) => ({
            ...prev,
            [wsData.deviceId]: wsData.data.status,
          }));
          break;
        case 'temp':
          setModulesTemp((prev) => ({
            ...prev,
            [wsData.deviceId]: wsData.data,
          }));
      }

      if (wsData.type !== 'status') {
        void dispatch(loadIaqScoresForModules([module.device_id]));
      }
    }
  };

  const onWsClosed = () => {
    setModulesStatuses(() => ({}));
  };

  const onWsDataMemo = useCallback(onWsData, [modules, dispatch]);
  const onWsClosedMemo = useCallback(onWsClosed, []);

  useWebSocket(onWsDataMemo, onWsClosedMemo);

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
    <Container>
      <PageHeading>My Devices</PageHeading>
      <Box display="flex" style={{ gap: '12px', flexWrap: 'wrap' }}>
        {modules.map((module) => (
          <DeviceTabComponent
            key={module.device_id}
            name={module.name}
            status={modulesStatuses[module.device_id] ?? 'pending'}
            score={scores[module._id]?.score}
            temp={temp[module.device_id]?.temp}
            hum={temp[module.device_id]?.hum}
            onClick={() => {
              void navigate(`dashboard/${module.device_id}`);
            }}
          />
        ))}
        {!isPWA && (
          <ConnectModuleDialog
            onClose={() => {
              void dispatch(loadModulesList());
            }}
          >
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
