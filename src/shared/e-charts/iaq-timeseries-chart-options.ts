import { theme } from '@/utils/theme';

import { IAQComponentConfigModel } from '../models/iaq/iaq-component-config-model';
import { ForecastResponseModel } from '../models/responses/forecast-response-model';
import { TimeseriesItemModel } from '../models/responses/timeseries-model';

type MissingDataArea = [{ xAxis: Date }, { xAxis: Date }];

export const getIAQTimeseriosOptions = (
  data: TimeseriesItemModel[],
  config: IAQComponentConfigModel,
  forecast: ForecastResponseModel = [],
  forecastFetchedAt: number | null = null
): unknown => {
  const values = data.map(({ date, value }) => [new Date(date), value]);

  const numericValues = data
    .map(({ value }) => value)
    .filter((value): value is number => value !== null);

  // TODO: Move forecast logic out of this method. It should care only about timeseries
  let forecastValues: (number | Date | null)[][] = [];

  if (forecast.length && forecastFetchedAt) {
    forecastValues = [
      values[values.length - 1],
      ...forecast.map(({ horizonMinutes, value }) => [
        new Date(forecastFetchedAt + horizonMinutes * 60_000),
        value,
      ]),
    ];
  }

  const minValue = numericValues.length ? Math.min(...numericValues) : 0;
  const missingDataAreas = getMissingDataAreas(data);

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
        {
          name: `${config.name} - forecast`,
        },
      ],
    },
    xAxis: {
      type: 'time',
    },
    yAxis: {
      type: 'value',
      min: Math.floor(minValue - config.padding),
      tooltip: {
        show: true,
      },
    },
    visualMap: {
      seriesIndex: 0,
      show: false,
      pieces: config.visualMap,
    },
    series: [
      {
        name: `${config.name} - historical`,
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
      {
        name: `${config.name} - forecast`,
        type: 'line',
        smooth: true,
        data: forecastValues,
        color: theme.colors.darkBlue,
        symbolSize: 4,
        lineStyle: {
          opacity: 0.7,
          width: 4,
        },
      },
    ],
  };
};

const getMissingDataAreas = (
  data: TimeseriesItemModel[]
): MissingDataArea[] => {
  const areas: MissingDataArea[] = [];

  for (let index = 0; index < data.length; index += 1) {
    if (data[index].value !== null) continue;

    const gapStart = index;

    while (index + 1 < data.length && data[index + 1].value === null) {
      index += 1;
    }

    const beforeIndex = Math.max(0, gapStart - 1);
    const afterIndex = Math.min(data.length - 1, index + 1);

    areas.push([
      { xAxis: new Date(data[beforeIndex].date) },
      { xAxis: new Date(data[afterIndex].date) },
    ]);
  }

  return areas;
};
