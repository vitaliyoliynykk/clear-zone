import { Box, Container, Flex, Heading, Spinner } from '@chakra-ui/react';
import ReactECharts from 'echarts-for-react';
import { FC } from 'react';
import { useParams } from 'react-router';

import { PageHeading } from '@/shared/components/page-heading/page-heading-component';
import { moduleSelectors, selectModulesStatus } from '@/store/slices/devices';
import { useAppSelector } from '@/store/store';

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
    <Container style={{ height: '100%' }}>
      <PageHeading>Dashboard - {module.name}</PageHeading>
      <Flex wrap="wrap" gap={4}>
        <DashboardCard style={{ flex: 1 }}>
          <Heading>IAQ Score</Heading>
          <ReactECharts option={getGaugeOptions(80)} />
          <div>Summary text</div>
        </DashboardCard>
        <DashboardCard style={{ flex: 1 }}>
          <Heading>IAQ Components</Heading>
          <p>Metrics contributing to the overall IAQ score</p>
          <div>CO2</div>
          <div>PM2.5</div>
          <div>VOC Index</div>
          <div>Humidity</div>
          <div>Temperature</div>
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
