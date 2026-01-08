import { Box, Container, Spinner } from '@chakra-ui/react';
import ReactECharts from 'echarts-for-react';
import { FC, useCallback, useEffect, useState } from 'react';
import { IoAdd } from 'react-icons/io5';

import { PageHeading } from '@/shared/components/page-heading/page-heading-component';
import { useWebSocket } from '@/shared/hooks/useWebSocket';
import { WsDataModel } from '@/shared/models/ws-data-model';
import {
  loadModulesList,
  moduleSelectors,
  selectModulesStatus,
} from '@/store/slices/devices';
import { useAppDispatch, useAppSelector } from '@/store/store';

import { ConnectModuleDialog } from './connect-module-dialog/connect-module-dialog';
import ModuleDialog from './module-dialog/module-dialog';
import { DeviceContainer } from './styled-components';

const getGaugeOptions = (value: number) => ({
  series: [
    {
      type: 'gauge',
      min: 400,
      max: 2000,
      axisLine: {
        lineStyle: {
          width: 8,
          color: [
            [0.15, '#2b8e00ff'],
            [0.23, '#dcd400ff'],
            [0.42, '#d89f00ff'],
            [1, '#d80e00ff'],
          ],
        },
      },
      pointer: {
        itemStyle: {
          color: 'auto',
        },
      },
      axisTick: {
        distance: 0,
        length: 0,
      },
      splitLine: {
        distance: 0,
        length: 0,
      },
      axisLabel: {
        color: 'black',
        distance: -22,
        fontSize: 10,
      },
      detail: {
        valueAnimation: true,
        formatter: '{value} ppm',
        color: 'inherit',
        fontSize: 14,
      },
      data: [
        {
          value: Math.floor(value),
        },
      ],
    },
  ],
});

const DevicesPage: FC = () => {
  const dispatch = useAppDispatch();
  const modules = useAppSelector(moduleSelectors.selectAll);
  const status = useAppSelector(selectModulesStatus);
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

  const onWsDataMemo = useCallback(onWsData, [modules]);

  useWebSocket(onWsDataMemo);

  useEffect(() => {
    void dispatch(loadModulesList());
  }, [dispatch]);

  useEffect(() => {
    console.log(modulesStatuses);
  }, [modulesStatuses]);

  const getStatusIcon = (status: 'online' | 'offline') => (
    <span
      style={{
        width: 12,
        height: 12,
        backgroundColor: status === 'online' ? 'green' : 'red',
        display: 'inline-block',
        borderRadius: '50%',
        animation:
          status === 'online' ? `pulse 2s ease-in-out infinite` : 'none',
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
        {modules.map((module) => (
          <ModuleDialog key={module.device_id} module={module}>
            <DeviceContainer>
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="space-between"
                height="100%"
              >
                <div>
                  {getStatusIcon(modulesStatuses[module.device_id])}{' '}
                  {module.name}
                </div>

                <div>
                  <ReactECharts
                    option={getGaugeOptions(co2[module.device_id])}
                    style={{ height: 170, width: 180 }}
                  />
                </div>

                {
                  <div>
                    🌡️: {temp[module.device_id]?.temp ?? '--'} C, 💧:{' '}
                    {temp[module.device_id]?.hum ?? '--'} %
                  </div>
                }
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
