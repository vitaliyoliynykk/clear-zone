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
  const [wsLastUpdated, setWsLastUpdated] = useState<number | null>(null);

  const onWsData = (wsData: WsDataModel) => {
    console.log('WS DATA', wsData);

    if (wsData.deviceId === module?.device_id) {
      setWsLastUpdated(wsData.ts);

      if (wsData.type === 'status') {
        setModuleNetworkStatus(wsData.data.status);
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
      <PageHeading>Dashboard - {module.name}</PageHeading>
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
            {wsLastUpdated !== null
              ? formatDate(new Date(wsLastUpdated).toISOString())
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
            Metrics contributing to the overall IAQ score
          </p>
          <div
            style={{
              padding: 8,
              borderRadius: theme.radius.medium,
              borderColor: theme.colors.grayDark,
              backgroundColor: theme.colors.white,
              borderWidth: 1,
              marginBottom: theme.spacing.sm,
            }}
          >
            <p style={{ fontWeight: 'bold' }}>CO2</p>
            <p>
              900 ppm <Badge colorPalette="green">Good</Badge>
            </p>
          </div>
          <div
            style={{
              padding: 8,
              borderRadius: theme.radius.medium,
              borderColor: theme.colors.grayDark,
              backgroundColor: theme.colors.white,
              borderWidth: 1,
              marginBottom: theme.spacing.sm,
            }}
          >
            <p style={{ fontWeight: 'bold' }}>PM2 Index</p>
            <p>
              18 µg/m³ <Badge colorPalette="yellow">Moderate</Badge>
            </p>
          </div>
          {/* <div>PM2.5</div>
          <div>VOC Index</div>
          <div>Humidity</div>
          <div>Temperature</div> */}
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
