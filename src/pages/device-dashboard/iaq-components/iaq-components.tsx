import { Flex, Spinner } from '@chakra-ui/react';
import { FC } from 'react';

import { ModuleNetworkStatus } from '@/shared/models/module-network-status-model';
import { SensorsTypesModel } from '@/shared/models/sensors-types-model';
import { loadChart } from '@/store/slices/device-dashboard.slice';
import { useAppDispatch } from '@/store/store';
import { resolveIAQ } from '@/utils/iaq/iaq-thresholds-config';
import { theme } from '@/utils/theme';

import MetricTabComponent from '../metric-tab/metric-tab-component';

export const IAQComponents: FC<{
  wsMetricsLastUpdated: number | null;
  moduleNetworkStatus: ModuleNetworkStatus;
  metrics: Record<SensorsTypesModel, number | null>;
  deviceId: string;
  hoursLookback: number;
  onMetricClick: () => void;
}> = ({
  wsMetricsLastUpdated,
  metrics,
  deviceId,
  hoursLookback,
  moduleNetworkStatus,
  onMetricClick,
}) => {
  const dispatch = useAppDispatch();

  const { hum, temp, co2, pm25, pm10, pm100 } = metrics;

  const co2State = resolveIAQ('co2', co2);
  const tempState = resolveIAQ('temp', temp);
  const humState = resolveIAQ('hum', hum);
  const pm25State = resolveIAQ('pm25', pm25);
  const pm10State = resolveIAQ('pm10', pm10);
  const pm100State = resolveIAQ('pm100', pm100);

  if (wsMetricsLastUpdated === null && moduleNetworkStatus === 'online') {
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
      <MetricTabComponent
        status={co2State.label}
        metric="CO2"
        value={`${co2 ? co2.toString() : '--'} ppm`}
        badgeColor={co2State.badgeColor}
        onClick={() => {
          void dispatch(
            loadChart({ chartType: 'co2', deviceId, hoursLookback })
          );
          onMetricClick();
        }}
      />

      <MetricTabComponent
        status={tempState.label}
        metric="Temperature"
        value={`${temp ? temp.toString() : '--'} °C`}
        badgeColor={tempState.badgeColor}
        onClick={() => {
          void dispatch(
            loadChart({ chartType: 'temp', deviceId, hoursLookback })
          );
          onMetricClick();
        }}
      />

      <MetricTabComponent
        status={humState.label}
        metric="Relative Humidity"
        value={`${hum ? hum.toString() : '--'} %`}
        badgeColor={humState.badgeColor}
        onClick={() => {
          void dispatch(
            loadChart({ chartType: 'hum', deviceId, hoursLookback })
          );
          onMetricClick();
        }}
      />

      <MetricTabComponent
        status={pm100State.label}
        metric="PM1.0"
        value={`${pm100 ? pm100.toString() : '--'} µg/m³`}
        badgeColor={pm100State.badgeColor}
        onClick={() => {
          void dispatch(
            loadChart({ chartType: 'pm100', deviceId, hoursLookback })
          );
          onMetricClick();
        }}
      />

      <MetricTabComponent
        status={pm25State.label}
        metric="PM2.5"
        value={`${pm25 ? pm25.toString() : '--'} µg/m³`}
        badgeColor={pm25State.badgeColor}
        onClick={() => {
          void dispatch(
            loadChart({ chartType: 'pm25', deviceId, hoursLookback })
          );
          onMetricClick();
        }}
      />

      <MetricTabComponent
        status={pm10State.label}
        metric="PM10.0"
        value={`${pm10 ? pm10.toString() : '--'} µg/m³`}
        badgeColor={pm10State.badgeColor}
        onClick={() => {
          void dispatch(
            loadChart({ chartType: 'pm10', deviceId, hoursLookback })
          );
          onMetricClick();
        }}
      />
    </>
  );
};
