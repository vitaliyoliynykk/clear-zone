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
import { FC, useCallback, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router';

import NetworkStatusDot from '@/shared/components/network-status-dot/network-status-dot';
import { PageHeading } from '@/shared/components/page-heading/page-heading-component';
import { getIAQGaugeOptions } from '@/shared/e-charts/iaq-gauge-options';
import { getIAQTimeseriosOptions } from '@/shared/e-charts/iaq-timeseries-chart-options';
import { useWebSocket } from '@/shared/hooks/useWebSocket';
import { ModuleNetworkStatus } from '@/shared/models/module-network-status-model';
import { WsDataModel } from '@/shared/models/ws-data-model';
import {
  loadChart,
  selectChartData,
  selectChartLoadingStatus,
  selectChartType,
} from '@/store/slices/device-dashboard.slice';
import { moduleSelectors, selectModulesStatus } from '@/store/slices/devices';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { IAQComponentsConfig } from '@/utils/iaq/iaq-components-config';
import { theme } from '@/utils/theme';
import { formatDate } from '@/utils/time';

import { IAQComponents } from './iaq-components/iaq-components';
import { CardContainer, DashboardCard } from './styled-component';

const TIME_FILTER = [
  { label: '2h', value: '8' },
  { label: '8h', value: '8' },
  { label: '24h', value: '24' },
  { label: '2d', value: '48' },
  { label: '1w', value: '168' },
];

const DeviceDashboardPage: FC = () => {
  const dispatch = useAppDispatch();
  const containerRef = useRef<HTMLDivElement>(null);
  const modulesStatus = useAppSelector(selectModulesStatus);
  const chartType = useAppSelector(selectChartType);
  const chartData = useAppSelector(selectChartData);
  const chartLoadingStatus = useAppSelector(selectChartLoadingStatus);

  const { deviceId } = useParams<{ deviceId: string }>();
  const module = useAppSelector((state) =>
    deviceId ? moduleSelectors.selectById(state, deviceId) : null
  );

  const [moduleNetworkStatus, setModuleNetworkStatus] =
    useState<ModuleNetworkStatus>('pending');
  const [wsMetricsLastUpdated, setWsMetricsLastUpdated] = useState<
    number | null
  >(null);
  const [wsStatusLastUpdated, setWsStatusLastUpdate] = useState<number | null>(
    null
  );
  const [co2, setCo2] = useState<number | null>(null);
  const [temp, setTemperature] = useState<number | null>(null);
  const [hum, setHumidity] = useState<number | null>(null);
  const [pm25, setPm25] = useState<number | null>(null);
  const [pm10, setPm10] = useState<number | null>(null);
  const [pm100, setPm100] = useState<number | null>(null);
  const [chartTimeFilter, setChartTimeFilter] = useState('24');

  const onWsData = (wsData: WsDataModel) => {
    if (wsData.deviceId === module?.device_id) {
      if (wsData.type === 'status') {
        setModuleNetworkStatus(wsData.data.status);
        setWsStatusLastUpdate(wsData.ts);
      } else {
        setWsMetricsLastUpdated(wsData.ts);
      }

      switch (wsData.type) {
        case 'co2':
          setCo2(wsData.data.co2);
          break;
        case 'temp':
          setTemperature(wsData.data.temp);
          setHumidity(wsData.data.hum);
          break;
        case 'pms':
          setPm25(wsData.data.pm25);
          setPm10(wsData.data.pm10);
          setPm100(wsData.data.pm100);
      }
    }
  };

  const onWsDataMemo = useCallback(onWsData, [module]);

  useWebSocket(onWsDataMemo);

  useEffect(() => {
    if (module) {
      void dispatch(
        loadChart({
          chartType: 'co2',
          deviceId: module.device_id,
          hoursLookback: 8,
        })
      );
    }
  }, [module, dispatch]);

  const getChart = () => {
    if (chartLoadingStatus === 'loading') {
      return (
        <CardContainer style={{ height: 300 }}>
          <Flex justify="center" align="center" height="100%">
            <Spinner />
          </Flex>
        </CardContainer>
      );
    }
    if (!chartType) {
      return <div>Select metric</div>;
    }

    return (
      <CardContainer>
        <ReactECharts
          style={{ flex: 1 }}
          option={getIAQTimeseriosOptions(
            chartData,
            IAQComponentsConfig[chartType]
          )}
        />
      </CardContainer>
    );
  };

  const getLastUpdatedTime = (): string => {
    if (moduleNetworkStatus === 'offline' && wsStatusLastUpdated) {
      return formatDate(wsStatusLastUpdated, 'time');
    }

    if (wsMetricsLastUpdated) {
      return formatDate(wsMetricsLastUpdated, 'time');
    }

    return '--';
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
    <Container>
      <PageHeading>Air Quality Overview - {module.name}</PageHeading>
      <Flex style={{ marginBottom: theme.spacing.sm }}>
        <Badge
          style={{ marginRight: theme.spacing.xs }}
          colorPalette={moduleNetworkStatus === 'online' ? 'green' : 'red'}
        >
          <NetworkStatusDot status={moduleNetworkStatus} />
          {moduleNetworkStatus}
        </Badge>
        Updated: {getLastUpdatedTime()}
      </Flex>
      <Flex wrap="wrap" gap={4} style={{ marginBottom: theme.spacing.sm }}>
        <DashboardCard style={{ flex: 1 }}>
          <Heading>IAQ Score</Heading>
          <p style={{ marginBottom: theme.spacing.sm }}>Score description</p>
          <CardContainer>
            <ReactECharts option={getIAQGaugeOptions(80)} />
          </CardContainer>
        </DashboardCard>
        <DashboardCard style={{ flex: 1 }}>
          <Heading>IAQ Components</Heading>
          <p style={{ marginBottom: theme.spacing.sm }}>
            Metrics contributing to the overall IAQ score
          </p>
          <IAQComponents
            wsMetricsLastUpdated={wsMetricsLastUpdated}
            moduleNetworkStatus={moduleNetworkStatus}
            metrics={{ co2, hum, temp, pm25, pm10, pm100 }}
            deviceId={module.device_id}
            hoursLookback={+chartTimeFilter}
            onMetricClick={() => {
              containerRef.current?.scrollIntoView({ behavior: 'smooth' });
            }}
          />
        </DashboardCard>
      </Flex>
      <DashboardCard
        ref={containerRef}
        style={{ marginBottom: theme.spacing.sm }}
      >
        <Heading>Trend</Heading>
        <p style={{ marginBottom: theme.spacing.sm }}>
          How air quality metrics change over time
        </p>

        <SegmentGroup.Root
          value={chartTimeFilter.toString()}
          style={{ boxShadow: theme.boxShadow.elevation }}
          onValueChange={(value) => {
            setChartTimeFilter(value.value);
          }}
          disabled={!chartType}
        >
          <SegmentGroup.Indicator />
          {TIME_FILTER.map(({ value, label }, index) => (
            <SegmentGroup.Item
              key={index}
              value={value.toString()}
              style={{ cursor: 'pointer' }}
              onClick={() => {
                if (chartType) {
                  void dispatch(
                    loadChart({
                      chartType,
                      deviceId: module.device_id,
                      hoursLookback: Number(value),
                    })
                  );
                }
              }}
            >
              <SegmentGroup.ItemText>{label}</SegmentGroup.ItemText>
              <SegmentGroup.ItemHiddenInput />
            </SegmentGroup.Item>
          ))}
        </SegmentGroup.Root>

        {getChart()}
      </DashboardCard>
    </Container>
  );
};

export default DeviceDashboardPage;
