import { IAQComponentConfigModel } from '@/shared/models/iaq-component-config-model';
import { SensorsTypesModel } from '@/shared/models/sensors-types-model';

export const IAQComponentsConfig: Record<
  SensorsTypesModel,
  IAQComponentConfigModel
> = {
  co2: {
    padding: 100,
    unit: 'ppm',
    name: 'CO2',
  },
  temp: {
    padding: 2,
    unit: '°C',
    name: 'Temperature',
  },
  hum: {
    padding: 2,
    unit: '%',
    name: 'Relative Humidity',
  },
};
