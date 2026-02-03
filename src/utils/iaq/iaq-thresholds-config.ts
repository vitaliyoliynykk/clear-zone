import { Threshold } from '@/shared/models/iaq/iaq-threshold-model';
import { SensorsTypesModel } from '@/shared/models/sensors-types-model';

import { theme } from '../theme';

export const IAQ_THRESHOLDS = {
  temp: [
    { max: 18, color: theme.colors.green, label: 'Cool', badgeColor: 'green' },
    {
      min: 18,
      max: 22,
      color: theme.colors.greenLight,
      badgeColor: 'green',
      label: 'Optimal',
    },
    {
      min: 22,
      max: 26,
      color: theme.colors.orange,
      badgeColor: 'orange',
      label: 'Warm',
    },
    { min: 26, color: theme.colors.red, badgeColor: 'red', label: 'Hot' },
  ],
  hum: [
    {
      max: 30,
      color: theme.colors.red,
      badgeColor: 'red',
      label: 'Too dry',
    },
    {
      min: 30,
      max: 40,
      color: theme.colors.orange,
      badgeColor: 'orange',
      label: 'Dry',
    },
    {
      min: 40,
      max: 60,
      color: theme.colors.green,
      badgeColor: 'green',
      label: 'Optimal',
    },
    {
      min: 60,
      max: 70,
      color: theme.colors.orange,
      badgeColor: 'orange',
      label: 'Humid',
    },
    {
      min: 70,
      color: theme.colors.red,
      badgeColor: 'red',
      label: 'Too humid',
    },
  ],
  co2: [
    {
      max: 600,
      color: theme.colors.green,
      badgeColor: 'green',
      label: 'Excelent',
    },
    {
      min: 600,
      max: 800,
      color: theme.colors.greenLight,
      badgeColor: 'green',
      label: 'Good',
    },
    {
      min: 800,
      max: 1000,
      color: theme.colors.orange,
      badgeColor: 'orange',
      label: 'Moderate',
    },
    {
      min: 1000,
      max: 10000,
      color: theme.colors.red,
      badgeColor: 'red',
      label: 'Bad',
    },
  ],
  pm25: [
    {
      max: 5,
      color: theme.colors.green,
      badgeColor: 'green',
      label: 'Excellent',
    },
    {
      min: 5,
      max: 10,
      color: theme.colors.greenLight,
      badgeColor: 'green',
      label: 'Good',
    },
    {
      min: 10,
      max: 15,
      color: theme.colors.orange,
      badgeColor: 'orange',
      label: 'Moderate',
    },
    {
      min: 15,
      max: 25,
      color: theme.colors.red,
      badgeColor: 'red',
      label: 'Poor',
    },
    {
      min: 25,
      color: theme.colors.red,
      badgeColor: 'red',
      label: 'Very poor',
    },
  ],
  pm10: [
    {
      max: 10,
      color: theme.colors.green,
      badgeColor: 'green',
      label: 'Excellent',
    },
    {
      min: 10,
      max: 20,
      color: theme.colors.greenLight,
      badgeColor: 'green',
      label: 'Good',
    },
    {
      min: 20,
      max: 35,
      color: theme.colors.orange,
      badgeColor: 'orange',
      label: 'Moderate',
    },
    {
      min: 35,
      max: 50,
      color: theme.colors.red,
      badgeColor: 'red',
      label: 'Poor',
    },
    {
      min: 50,
      color: theme.colors.red,
      badgeColor: 'red',
      label: 'Very poor',
    },
  ],
  pm100: [
    {
      max: 5,
      color: theme.colors.green,
      badgeColor: 'green',
      label: 'Excellent',
    },
    {
      min: 5,
      max: 10,
      color: theme.colors.greenLight,
      badgeColor: 'green',
      label: 'Good',
    },
    {
      min: 10,
      max: 20,
      color: theme.colors.orange,
      badgeColor: 'orange',
      label: 'Moderate',
    },
    {
      min: 20,
      max: 35,
      color: theme.colors.red,
      badgeColor: 'red',
      label: 'Poor',
    },
    {
      min: 35,
      color: theme.colors.red,
      badgeColor: 'red',
      label: 'Very poor',
    },
  ],
  voc: [
    {
      max: 50,
      color: theme.colors.green,
      badgeColor: 'green',
      label: 'Excellent',
    },
    {
      min: 50,
      max: 100,
      color: theme.colors.greenLight,
      badgeColor: 'green',
      label: 'Good',
    },
    {
      min: 100,
      max: 150,
      color: theme.colors.orange,
      badgeColor: 'orange',
      label: 'Moderate',
    },
    {
      min: 150,
      max: 250,
      color: theme.colors.red,
      badgeColor: 'red',
      label: 'Poor',
    },
    {
      min: 250,
      color: theme.colors.red,
      badgeColor: 'red',
      label: 'Very poor',
    },
  ],
} satisfies Record<SensorsTypesModel, Threshold[]>;
const DEFAULT_IAQ: Threshold = {
  color: theme.colors.gray,
  label: '--',
  badgeColor: 'gray',
};

export function resolveIAQ(
  type: keyof typeof IAQ_THRESHOLDS,
  value: number | null
): Threshold {
  if (value === null) {
    return DEFAULT_IAQ;
  }

  return (
    IAQ_THRESHOLDS[type].find(
      (t) =>
        (t.min === undefined || value >= t.min) &&
        (t.max === undefined || value < t.max)
    ) ?? { color: theme.colors.gray, label: '--', badgeColor: 'gray' }
  );
}
