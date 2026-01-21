import { formatDate } from '@/utils/time';

import { IAQComponentConfigModel } from '../models/iaq/iaq-component-config-model';
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
      pieces: config.visualMap,
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
