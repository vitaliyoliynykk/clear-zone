import { theme } from '@/utils/theme';

export const getIAQGaugeOptions = (score: number, lineWidth = 18) => ({
  series: [
    {
      type: 'gauge',
      min: 0,
      max: 100,
      axisLine: {
        lineStyle: {
          width: lineWidth,
          color: [
            [0.2, theme.colors.red],
            [0.4, theme.colors.redOrange],
            [0.6, theme.colors.yellow],
            [0.8, theme.colors.yellowGreen],
            [1, theme.colors.green],
          ],

          shadowColor: 'rgba(0, 0, 0, 0.2)',
          shadowBlur: 4,
          shadowOffsetX: 0,
          shadowOffsetY: 3,
        },
      },
      pointer: {
        itemStyle: {
          color: 'auto',
          shadowColor: 'rgba(0, 0, 0, 0.2)',
          shadowBlur: 4,
          shadowOffsetX: 0,
          shadowOffsetY: 3,
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
        color: 'inherit',
        distance: -22,
        fontSize: 14,
        fontWeight: 'bold',
      },
      detail: {
        valueAnimation: true,
        formatter: '{value}',
        color: 'black',
        fontSize: 24,
      },
      data: [
        {
          value: Math.floor(score),
        },
      ],
    },
  ],
});
