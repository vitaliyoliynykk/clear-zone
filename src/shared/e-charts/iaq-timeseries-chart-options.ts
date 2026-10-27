import { theme } from '@/utils/theme';
import { formatDate } from '@/utils/time';

import { IAQComponentConfigModel } from '../models/iaq/iaq-component-config-model';
import { TimeseriesItemModel } from '../models/responses/timeseries-model';

export const getIAQTimeseriosOptions = (
  data: TimeseriesItemModel[],
  config: IAQComponentConfigModel
): unknown => {
  const values = data.map(({ value }) => value);
  const dates = data.map(({ date }) => formatDate(date));
  const numericValues = values.filter(
    (value): value is number => value !== null
  );

  const minValue = numericValues.length ? Math.min(...numericValues) : 0;
  const missingDataAreas = getMissingDataAreas(data, dates);

  return {
    mode: 'dark',
    title: {
      text: `${config.name} (${config.unit})`,
    },
    tooltip: {
      trigger: 'axis',
    },
    legend: {
      data: [
        {
          name: 'Missing data',
          icon: 'rect',
        },
      ],
    },
    xAxis: {
      type: 'category',
      data: dates,
    },
    yAxis: {
      type: 'value',
      min: Math.floor(minValue - config.padding),
      tooltip: {
        show: true,
      },
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
        symbolSize: 8,
        lineStyle: {
          width: 4,
        },
        markLine: {
          data: [{ type: 'average', name: 'Avg' }],
        },
        markArea: {
          silent: true,
          itemStyle: {
            color: theme.colors.grayTransparent,
          },
          label: {
            show: false,
          },
          data: missingDataAreas,
        },
      },
    ],
  };
};

const getMissingDataAreas = (data: TimeseriesItemModel[], dates: string[]) => {
  const missingDataAreas: [{ xAxis: string }, { xAxis: string }][] = [];

  for (let index = 0; index < data.length; index += 1) {
    if (data[index].value !== null) {
      continue;
    }

    const gapStart = index;

    while (index + 1 < data.length && data[index + 1].value === null) {
      index += 1;
    }

    missingDataAreas.push([
      { xAxis: dates[Math.max(0, gapStart - 1)] },
      { xAxis: dates[Math.min(data.length - 1, index + 1)] },
    ]);
  }

  return missingDataAreas;
};
