import {
  Badge,
  Box,
  Container,
  Flex,
  Heading,
  Spinner,
} from '@chakra-ui/react';
import ReactECharts from 'echarts-for-react';
import { FC, useCallback, useState } from 'react';
import { useParams } from 'react-router';

import NetworkStatusDot from '@/shared/components/network-status-dot/network-status-dot';
import { PageHeading } from '@/shared/components/page-heading/page-heading-component';
import { useWebSocket } from '@/shared/hooks/useWebSocket';
import { ModuleNetworkStatus } from '@/shared/models/module-network-status-model';
import { WsDataModel } from '@/shared/models/ws-data-model';
import { moduleSelectors, selectModulesStatus } from '@/store/slices/devices';
import { useAppSelector } from '@/store/store';
import { theme } from '@/utils/theme';
import { formatDate } from '@/utils/time';

import MetricTabComponent from './metric-tab/metric-tab-component';
import { DashboardCard } from './styled-component';

const getGaugeOptions = (value: number) => ({
  series: [
    {
      type: 'gauge',
      min: 0,
      max: 100,
      axisLine: {
        lineStyle: {
          width: 18,
          color: [
            [0.33, '#d80e00ff'],
            [0.66, '#8da300ff'],
            [1, '#2b8e00ff'],
          ],
        },
      },
      pointer: {
        itemStyle: {
          color: 'black',
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
        fontSize: 14,
      },
      detail: {
        valueAnimation: true,
        formatter: '{value}',
        color: 'black',
        fontSize: 24,
      },
      data: [
        {
          value: Math.floor(value),
        },
      ],
    },
  ],
});

// const getChartOption = (data) => {
//   const values = data.map((v) => v.value);
//   console.log(values);
//   const minValue = Math.min(...values);

//   console.log(minValue);

//   return {
//     title: {
//       text: 'CO2 (PPM)',
//     },
//     xAxis: {
//       type: 'category',
//       data: data.map((v) => formatDate(v.date)),
//     },
//     yAxis: {
//       type: 'value',
//       min: Math.floor(minValue - 100),
//     },
//     series: [
//       {
//         data: values,
//         type: 'line',
//         smooth: true,
//       },
//     ],
//   };
// };

const DeviceDashboardPage: FC = () => {
  const modulesStatus = useAppSelector(selectModulesStatus);
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
  // const [data, setData] = useState([]);

  // useEffect(() => {
  //   if (module) {
  //     void getSensorAgrregatedTimeseriesRequest(module.device_id, 'co2').then(
  //       (res) => {
  //         setData(res);
  //       }
  //     );
  //   }
  // }, []);

  const getIAQComponents = () => {
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
            />
          )}
          {temperature !== null && (
            <MetricTabComponent
              status="Good"
              metric="Temperature"
              value={`${temperature.toString()} °C`}
              badgeColor="green"
            />
          )}
          {humidity !== null && (
            <MetricTabComponent
              status="Good"
              metric="Humidity"
              value={`${humidity.toString()} %`}
              badgeColor="green"
            />
          )}
        </>
      );
    }
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
      <Flex wrap="wrap" gap={4}>
        <DashboardCard style={{ flex: 1 }}>
          <Heading>IAQ Score</Heading>
          <ReactECharts option={getGaugeOptions(80)} />
          <div>Summary text</div>
        </DashboardCard>
        <DashboardCard style={{ flex: 1 }}>
          <Heading>IAQ Components</Heading>
          <p style={{ marginBottom: theme.spacing.sm }}>
            Metrics contributing to the overall IAQ score{' '}
          </p>

          {getIAQComponents()}
        </DashboardCard>
      </Flex>
      <Flex direction="column">
        <Heading>Trend</Heading>
        {/* <ReactECharts style={{ flex: 1 }} option={getChartOption(data)} /> */}
      </Flex>
    </Container>
  );
};

export default DeviceDashboardPage;
