import {
  Badge,
  Box,
  Container,
  Flex,
  Heading,
  SegmentGroup,
  Spinner,
} from '@chakra-ui/react';
import ReactECharts from 'echarts-for-react';
import { FC, useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router';

import NetworkStatusDot from '@/shared/components/network-status-dot/network-status-dot';
import { PageHeading } from '@/shared/components/page-heading/page-heading-component';
import { getIAQGaugeOptions } from '@/shared/e-charts/iaq-gauge-options';
import { getIAQTimeseriosOptions } from '@/shared/e-charts/iaq-timeseries-chart-options';
import { useWebSocket } from '@/shared/hooks/useWebSocket';
import { ModuleNetworkStatus } from '@/shared/models/module-network-status-model';
import { ModuleModel } from '@/shared/models/responses/module-model';
import { WsDataModel } from '@/shared/models/ws-data-model';
import {
  loadChart,
  selectChartData,
  selectChartLoadingStatus,
  selectChartType,
} from '@/store/slices/device-dashboard.slice';
import { moduleSelectors, selectModulesStatus } from '@/store/slices/devices';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { IAQComponentsConfig } from '@/utils/iaq-components-config';
import { theme } from '@/utils/theme';
import { formatDate } from '@/utils/time';

import MetricTabComponent from './metric-tab/metric-tab-component';
import { DashboardCard } from './styled-component';

const timeframes = [
  { label: '4h' },
  { label: '8h' },
  { label: '12h' },
  { label: '24h' },
  { label: '48h' },
];

const DeviceDashboardPage: FC = () => {
  const dispatch = useAppDispatch();
  const modulesStatus = useAppSelector(selectModulesStatus);
  const chartType = useAppSelector(selectChartType);
  const chartData = useAppSelector(selectChartData);
  const chartLoadingStatus = useAppSelector(selectChartLoadingStatus);

  const { deviceId } = useParams<{ deviceId: string }>();
  const module = useAppSelector((state) =>
    deviceId ? moduleSelectors.selectById(state, deviceId) : null
  );
  const [moduleNetworkStatus, setModuleNetworkStatus] =
    useState<ModuleNetworkStatus>('offline');
  const [wsStatusLastUpdated, setWsStatusLastUpdated] = useState<number | null>(
    null
  );
  const [wsMetricsLastUpdated, setWsMetricsLastUpdated] = useState<
    number | null
  >(null);
  const [co2, setCo2] = useState<number | null>(null);
  const [temperature, setTemperature] = useState<number | null>(null);
  const [humidity, setHumidity] = useState<number | null>(null);

  const onWsData = (wsData: WsDataModel) => {
    console.log('WS DATA', wsData);

    if (wsData.deviceId === module?.device_id) {
      if (wsData.type === 'status') {
        setWsStatusLastUpdated(new Date().getTime());
        setModuleNetworkStatus(wsData.data.status);
      } else {
        setWsMetricsLastUpdated(wsData.ts);
      }

      if (wsData.type === 'co2') {
        setCo2(wsData.data.co2);
      }
      if (wsData.type === 'temp') {
        setTemperature(wsData.data.temp);
        setHumidity(wsData.data.hum);
      }
    }
  };

  const onWsDataMemo = useCallback(onWsData, [module]);

  useWebSocket(onWsDataMemo);

  useEffect(() => {
    if (module) {
      void dispatch(
        loadChart({ chartType: 'co2', deviceId: module.device_id })
      );
    }
  }, [module, dispatch]);

  const getIAQComponents = (module: ModuleModel) => {
    if (moduleNetworkStatus === 'offline') {
      return (
        <Flex justify="center" align="center" flex={1}>
          Module is offline. No current data
        </Flex>
      );
    } else {
      if (wsMetricsLastUpdated === null) {
        return (
          <Flex justify="center" align="center" direction="column" flex={1}>
            <p>Current metrics are loading.</p>
            <p>It can take up to a minute</p>
            <Spinner style={{ marginTop: theme.spacing.sm }} />
          </Flex>
        );
      }

      return (
        <>
          {co2 !== null && (
            <MetricTabComponent
              status="Good"
              metric="CO2"
              value={`${co2.toString()} ppm`}
              badgeColor="green"
              onClick={() =>
                void dispatch(
                  loadChart({ chartType: 'co2', deviceId: module.device_id })
                )
              }
            />
          )}
          {temperature !== null && (
            <MetricTabComponent
              status="Good"
              metric="Temperature"
              value={`${temperature.toString()} °C`}
              badgeColor="green"
              onClick={() =>
                void dispatch(
                  loadChart({ chartType: 'temp', deviceId: module.device_id })
                )
              }
            />
          )}
          {humidity !== null && (
            <MetricTabComponent
              status="Good"
              metric="Humidity"
              value={`${humidity.toString()} %`}
              badgeColor="green"
              onClick={() =>
                void dispatch(
                  loadChart({ chartType: 'hum', deviceId: module.device_id })
                )
              }
            />
          )}
        </>
      );
    }
  };

  const getChart = () => {
    if (chartLoadingStatus === 'loading') {
      return (
        <Flex justify="center" align="center" height={300}>
          <Spinner />
        </Flex>
      );
    }
    if (!chartType) {
      return <div>Select metric</div>;
    }

    return (
      <div>
        <SegmentGroup.Root
          defaultValue="4h"
          colorPalette="red"
          bg="colorPalette.50"
        >
          <SegmentGroup.Indicator />
          {timeframes.map((value, index) => (
            <SegmentGroup.Item key={index} value={value.label}>
              <SegmentGroup.ItemText
                _checked={{ color: 'colorPalette.fg', fontWeight: 'medium' }}
              >
                {value.label}
              </SegmentGroup.ItemText>
              <SegmentGroup.ItemHiddenInput />
            </SegmentGroup.Item>
          ))}
        </SegmentGroup.Root>

        <ReactECharts
          style={{ flex: 1 }}
          option={getIAQTimeseriosOptions(
            chartData,
            IAQComponentsConfig[chartType]
          )}
        />
      </div>
    );
  };

  if (modulesStatus === 'loading') {
    return (
      <Container style={{ height: '100%' }}>
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

  if (!module) {
    return (
      <Container style={{ height: '100%' }}>
        <PageHeading>Module not found. Please try again...</PageHeading>
      </Container>
    );
  }

  return (
    <Container style={{ height: '100%', overflow: 'auto' }}>
      <PageHeading>Air Quality Overview - {module.name}</PageHeading>
      <Flex style={{ marginBottom: theme.spacing.sm }}>
        <Badge
          style={{ marginRight: theme.spacing.xs }}
          colorPalette={moduleNetworkStatus === 'online' ? 'green' : 'red'}
        >
          <NetworkStatusDot status={moduleNetworkStatus} />
          {moduleNetworkStatus}
        </Badge>
        <p>
          Last Updated:
          <span>
            {' '}
            {wsStatusLastUpdated !== null
              ? formatDate(new Date(wsStatusLastUpdated).toISOString())
              : 'pending...'}
          </span>
        </p>
      </Flex>
      <Flex wrap="wrap" gap={4} style={{ marginBottom: theme.spacing.sm }}>
        <DashboardCard style={{ flex: 1 }}>
          <Heading>IAQ Score</Heading>
          <ReactECharts option={getIAQGaugeOptions(80)} />
          <div>Summary text</div>
        </DashboardCard>
        <DashboardCard style={{ flex: 1 }}>
          <Heading>IAQ Components</Heading>
          <p style={{ marginBottom: theme.spacing.sm }}>
            Metrics contributing to the overall IAQ score
          </p>

          {getIAQComponents(module)}
        </DashboardCard>
      </Flex>
      <Flex direction="column">
        <Heading style={{ marginBottom: theme.spacing.sm }}>Trend</Heading>
        {getChart()}
      </Flex>
    </Container>
  );
};

export default DeviceDashboardPage;
