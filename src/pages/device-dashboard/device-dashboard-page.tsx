import {
  Badge,
  Box,
  Button,
  Container,
  Flex,
  Heading,
  IconButton,
  SegmentGroup,
  Spinner,
} from '@chakra-ui/react';
import ReactECharts from 'echarts-for-react';
import { FC, useCallback, useEffect, useRef, useState } from 'react';
import { GoArrowLeft, GoGear } from 'react-icons/go';
import { useNavigate, useParams } from 'react-router';

import { Tooltip } from '@/components/ui/tooltip';
import NetworkStatusDot from '@/shared/components/network-status-dot/network-status-dot';
import { PageHeading } from '@/shared/components/page-heading/page-heading-component';
import { getIAQGaugeOptions } from '@/shared/e-charts/iaq-gauge-options';
import { getIAQTimeseriosOptions } from '@/shared/e-charts/iaq-timeseries-chart-options';
import { useWebSocket } from '@/shared/hooks/useWebSocket';
import { ModuleNetworkStatus } from '@/shared/models/module-network-status-model';
import { WsDataModel } from '@/shared/models/ws-data-model';
import {
  loadChart,
  loadLatestVocIndex,
  selectChartData,
  selectChartLoadingStatus,
  selectChartType,
  selectLatestVocIndex,
} from '@/store/slices/device-dashboard.slice';
import { moduleSelectors, selectModulesStatus } from '@/store/slices/devices';
import {
  loadIaqScoresForModules,
  selectScores,
} from '@/store/slices/iaq-score.slice';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { IAQComponentsConfig } from '@/utils/iaq/iaq-components-config';
import { theme } from '@/utils/theme';
import { formatDate } from '@/utils/time';

import { AISummary } from './ai-summary/ai-summary';
import { IAQComponents } from './iaq-components/iaq-components';
import { CardContainer, DashboardCard } from './styled-component';

const TIME_FILTER = [
  { label: '2h.', value: '2' },
  { label: '12h.', value: '12' },
  { label: 'day', value: '24' },
  { label: '2 days', value: '48' },
  { label: 'week', value: '168' },
];

const DeviceDashboardPage: FC = () => {
  const dispatch = useAppDispatch();
  const containerRef = useRef<HTMLDivElement>(null);
  const modulesStatus = useAppSelector(selectModulesStatus);
  const chartType = useAppSelector(selectChartType);
  const chartData = useAppSelector(selectChartData);
  const chartLoadingStatus = useAppSelector(selectChartLoadingStatus);
  const vocIndex = useAppSelector(selectLatestVocIndex);
  const scores = useAppSelector(selectScores);

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

  const navigate = useNavigate();

  const onWsData = (wsData: WsDataModel) => {
    if (wsData.deviceId === module?.device_id) {
      void dispatch(loadLatestVocIndex(module._id));

      if (wsData.type === 'status') {
        setModuleNetworkStatus(wsData.data.status);
        setWsStatusLastUpdate(wsData.ts);
      } else {
        setWsMetricsLastUpdated(wsData.ts);
        void dispatch(loadIaqScoresForModules([module.device_id]));
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

  const onWsDataMemo = useCallback(onWsData, [module, dispatch]);

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

      void dispatch(loadIaqScoresForModules([module.device_id]));
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
      <Flex justifyContent="flex-end">
        <PageHeading>Air Quality Overview - {module.name}</PageHeading>
      </Flex>

      <Flex
        justifyContent="space-between"
        alignItems="center"
        style={{ marginBottom: theme.spacing.sm }}
      >
        <Flex gap={2}>
          <Button
            variant="outline"
            size="sm"
            colorPalette="gray"
            onClick={() => {
              void navigate('..');
            }}
          >
            <GoArrowLeft />
            Back
          </Button>
          <IconButton
            aria-label="Device settings"
            title="Device settings"
            variant="outline"
            size="sm"
            colorPalette="gray"
            onClick={() => {
              void navigate(
                `/device-settings/${encodeURIComponent(module.device_id)}`
              );
            }}
          >
            <GoGear />
          </IconButton>
        </Flex>
        <Flex>
          <Badge
            style={{ marginRight: theme.spacing.xs }}
            colorPalette={moduleNetworkStatus === 'online' ? 'green' : 'red'}
          >
            <NetworkStatusDot status={moduleNetworkStatus} />
            {moduleNetworkStatus}
          </Badge>
          <Tooltip
            content={`Uptime: ${String(Math.floor(vocIndex?.uptimeSeconds ? vocIndex.uptimeSeconds / 60 : 0))} minutes`}
          >
            <p style={{ cursor: 'pointer' }}>
              {' '}
              Updated: {getLastUpdatedTime()}
            </p>
          </Tooltip>
        </Flex>
      </Flex>
      <Flex wrap="wrap" gap={4} style={{ marginBottom: theme.spacing.sm }}>
        <DashboardCard style={{ flex: 1 }}>
          <Heading>IAQ Score</Heading>
          <p style={{ marginBottom: theme.spacing.sm }}>
            Overall air quality score
          </p>
          <CardContainer>
            <ReactECharts
              option={getIAQGaugeOptions(scores[module._id]?.score ?? 0)}
            />
          </CardContainer>

          <Heading paddingTop={theme.spacing.md}>AI Analysis</Heading>
          <p style={{ marginBottom: theme.spacing.sm }}>
            AI-powered aiq quality insights
          </p>
          <CardContainer>
            <AISummary deviceId={module.device_id} />
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
            metrics={{
              co2,
              hum,
              temp,
              pm25,
              pm10,
              pm100,
              voc: vocIndex?.index ?? null,
            }}
            sensorsState={{ voc: vocIndex?.state ?? 'offline' }}
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
          value={chartTimeFilter}
          style={{ boxShadow: theme.boxShadow.elevation }}
          onValueChange={({ value }) => {
            if (value) {
              setChartTimeFilter(value);
            }
          }}
          disabled={!chartType}
        >
          <SegmentGroup.Indicator />
          {TIME_FILTER.map(({ value, label }, index) => (
            <SegmentGroup.Item
              key={index}
              value={value}
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
