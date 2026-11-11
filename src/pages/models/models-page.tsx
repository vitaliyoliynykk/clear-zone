import { Box, Container, Skeleton, Table, Text } from '@chakra-ui/react';
import { type FC, useEffect } from 'react';

import { PageHeading } from '@/shared/components/page-heading/page-heading-component';
import {
  loadModelsList,
  selectModels,
  selectModelsStatus,
} from '@/store/slices/models.slice';
import { useAppDispatch, useAppSelector } from '@/store/store';

const ModelsPage: FC = () => {
  const dispatch = useAppDispatch();
  const models = useAppSelector(selectModels);
  const status = useAppSelector(selectModelsStatus);

  useEffect(() => {
    void dispatch(loadModelsList());
  }, [dispatch]);

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
            {status === 'loading'
              ? Array.from({ length: 3 }, (_, rowIndex) => (
                  <Table.Row key={rowIndex}>
                    {Array.from({ length: 8 }, (_, cellIndex) => (
                      <Table.Cell key={cellIndex}>
                        <Skeleton height="20px" />
                      </Table.Cell>
                    ))}
                  </Table.Row>
                ))
              : models.map((model) => (
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
                            `${target}: MSE ${Math.round(metrics.mse).toString()}, MAE ${Math.round(metrics.mae).toString()}, RMSE ${Math.round(metrics.rmse).toString()} (${model.unit})`
                        )
                        .join('; ')}
                    </Table.Cell>
                  </Table.Row>
                ))}
          </Table.Body>
        </Table.Root>
      </Box>
      {status === 'error' && (
        <Text role="alert" mt={3}>
          Unable to load forecasting models.
        </Text>
      )}
    </Container>
  );
};

export default ModelsPage;
