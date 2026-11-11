import { Box, Container, Table } from '@chakra-ui/react';
import type { FC } from 'react';

import { PageHeading } from '@/shared/components/page-heading/page-heading-component';
import type { ForecastingModelMetadata } from '@/shared/models/responses/forecasting-model-metadata-model';

const mockModels: ForecastingModelMetadata[] = [
  {
    model_name: 'iaq_temperature_v1',
    window_size: 144,
    forecast_horizons_minutes: [15, 30, 60],
    features: ['temperature', 'humidity', 'co2'],
    num_params: 128_450,
    test_metrics: {
      temperature: { mse: 0.42, mae: 0.51, rmse: 0.65 },
    },
    unit: '°C',
    target_value: 'temperature',
  },
  {
    model_name: 'iaq_co2_v2',
    window_size: 288,
    forecast_horizons_minutes: [30, 60, 120],
    features: ['co2', 'temperature', 'occupancy'],
    num_params: 256_900,
    test_metrics: {
      co2: { mse: 84.2, mae: 6.7, rmse: 9.18 },
    },
    unit: 'ppm',
    target_value: 'co2',
  },
];

const ModelsPage: FC = () => {
  return (
    <Container style={{ height: '100%' }}>
      <PageHeading>Forecasting Models</PageHeading>
      <Box w="100%" minW={0} overflowX="auto">
        <Table.Root size="sm" variant="outline" striped minW="max-content">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader>Model</Table.ColumnHeader>
              <Table.ColumnHeader>Target</Table.ColumnHeader>
              <Table.ColumnHeader>Unit</Table.ColumnHeader>
              <Table.ColumnHeader>Window size (min)</Table.ColumnHeader>
              <Table.ColumnHeader>Forecast horizons (min)</Table.ColumnHeader>
              <Table.ColumnHeader>Features</Table.ColumnHeader>
              <Table.ColumnHeader>Parameters</Table.ColumnHeader>
              <Table.ColumnHeader>Test metrics</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {mockModels.map((model) => (
              <Table.Row key={model.model_name}>
                <Table.Cell>{model.model_name}</Table.Cell>
                <Table.Cell>{model.target_value}</Table.Cell>
                <Table.Cell>{model.unit}</Table.Cell>
                <Table.Cell>{model.window_size}</Table.Cell>
                <Table.Cell>
                  {model.forecast_horizons_minutes.join(', ')}
                </Table.Cell>
                <Table.Cell>{model.features.join(', ')}</Table.Cell>
                <Table.Cell>{model.num_params.toLocaleString()}</Table.Cell>
                <Table.Cell>
                  {Object.entries(model.test_metrics)
                    .map(
                      ([target, metrics]) =>
                        `${target}: MSE ${metrics.mse.toString()}, MAE ${metrics.mae.toString()}, RMSE ${metrics.rmse.toString()} (${model.unit})`
                    )
                    .join('; ')}
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Box>
    </Container>
  );
};

export default ModelsPage;
