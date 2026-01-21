import { Box } from '@chakra-ui/react';
import ReactECharts from 'echarts-for-react';
import { FC } from 'react';

import NetworkStatusDot from '@/shared/components/network-status-dot/network-status-dot';
import { ModuleNetworkStatus } from '@/shared/models/module-network-status-model';

import { DeviceContainer } from '../styled-components';

const DeviceTabComponent: FC<{
  name: string;
  status: ModuleNetworkStatus;
  co2?: number;
  temp?: number;
  hum?: number;
  onClick?: () => void;
}> = ({ name, status, co2 = 0, temp = '--', hum = '--', onClick }) => {
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
              [0.25, '#8da300ff'],
              [0.42, '#d89f00ff'],
              [1, '#d80e00ff'],
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
          fontSize: 10,
        },
        detail: {
          valueAnimation: true,
          formatter: '{value} ppm',
          color: 'black',
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

  return (
    <DeviceContainer
      onClick={() => {
        if (onClick) {
          onClick();
        }
      }}
    >
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="space-between"
        height="100%"
      >
        <div>
          <NetworkStatusDot status={status} /> {name}
        </div>

        <div>
          <ReactECharts
            option={getGaugeOptions(co2)}
            style={{ height: 170, width: 180 }}
          />
        </div>

        {
          <div>
            🌡️: {temp} C, 💧: {hum} %
          </div>
        }
      </Box>
    </DeviceContainer>
  );
};

export default DeviceTabComponent;
