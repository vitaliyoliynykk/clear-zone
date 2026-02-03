import { Box } from '@chakra-ui/react';
import ReactECharts from 'echarts-for-react';
import { FC } from 'react';

import NetworkStatusDot from '@/shared/components/network-status-dot/network-status-dot';
import { getIAQGaugeOptions } from '@/shared/e-charts/iaq-gauge-options';
import { ModuleNetworkStatus } from '@/shared/models/module-network-status-model';

import { DeviceContainer } from '../styled-components';

const DeviceTabComponent: FC<{
  name: string;
  status: ModuleNetworkStatus;
  score?: number;
  temp?: number;
  hum?: number;
  onClick?: () => void;
}> = ({ name, status, score = 0, temp = '--', hum = '--', onClick }) => {
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
            option={getIAQGaugeOptions(score)}
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
