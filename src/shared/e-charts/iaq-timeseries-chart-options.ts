import { formatDate } from '@/utils/time';

import { IAQComponentConfigModel } from '../models/iaq-component-config-model';
import { TimeseriesItemModel } from '../models/responses/timeseries-model';

export const getIAQTimeseriosOptions = (
  data: TimeseriesItemModel[],
  config: IAQComponentConfigModel
): unknown => {
  const values = data.map(({ value }) => value);
  const minValue = Math.min(...values);

  return {
    title: {
      text: `${config.name} (${config.unit})`,
    },
    xAxis: {
      type: 'category',
      data: data.map(({ date }) => formatDate(date)),
    },
    yAxis: {
      type: 'value',
      min: Math.floor(minValue - config.padding),
    },
    visualMap: {
      show: false,
      pieces: [
        {
          lte: 600,
          color: '#2b8e00ff',
        },
        {
          gt: 600,
          lte: 800,
          color: '#8da300ff',
        },
        {
          gt: 800,
          lte: 1000,
          color: '#d89f00ff',
        },
        {
          gt: 1000,
          lte: 2000,
          color: '#d80e00ff',
        },
      ],
    },
    series: [
      {
        data: values,
        type: 'line',
        smooth: true,
      },
    ],
  };
};
