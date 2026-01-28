import { IAQComponentConfigModel } from '@/shared/models/iaq/iaq-component-config-model';
import { SensorsTypesModel } from '@/shared/models/sensors-types-model';

import { IAQ_THRESHOLDS } from './iaq-thresholds-config';

export const IAQComponentsConfig: Record<
  SensorsTypesModel,
  IAQComponentConfigModel
> = {
  co2: {
    padding: 100,
    unit: 'ppm',
    name: 'CO2',
    visualMap: IAQ_THRESHOLDS.co2.map((item) => ({
      lte: item.max,
      gt: item.min,
      color: item.color,
    })),
  },
  temp: {
    padding: 2,
    unit: '°C',
    name: 'Temperature',
    visualMap: IAQ_THRESHOLDS.temp.map((item) => ({
      lte: item.max,
      gt: item.min,
      color: item.color,
    })),
  },
  hum: {
    padding: 2,
    unit: '%',
    name: 'Relative Humidity',
    visualMap: IAQ_THRESHOLDS.hum.map((item) => ({
      lte: item.max,
      gt: item.min,
      color: item.color,
    })),
  },
  pm25: {
    padding: 2,
    unit: 'µg/m³',
    name: 'PM2.5',
    visualMap: IAQ_THRESHOLDS.pm25.map((item) => ({
      lte: item.max,
      gt: item.min,
      color: item.color,
    })),
  },
  pm10: {
    padding: 2,
    unit: 'µg/m³',
    name: 'PM10.0',
    visualMap: IAQ_THRESHOLDS.pm25.map((item) => ({
      lte: item.max,
      gt: item.min,
      color: item.color,
    })),
  },
  pm100: {
    padding: 2,
    unit: 'µg/m³',
    name: 'PM1.0',
    visualMap: IAQ_THRESHOLDS.pm25.map((item) => ({
      lte: item.max,
      gt: item.min,
      color: item.color,
    })),
  },
};
