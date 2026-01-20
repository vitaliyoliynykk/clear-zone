export const getIAQGaugeOptions = (score: number) => ({
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
          value: Math.floor(score),
        },
      ],
    },
  ],
});
