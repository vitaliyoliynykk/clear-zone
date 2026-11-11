import { ForecastingModelMetadata } from '@/shared/models/responses/forecasting-model-metadata-model';
import api from '@/utils/api';

export const getModelsList = async (): Promise<ForecastingModelMetadata[]> => {
  const res = await api.get<ForecastingModelMetadata[]>('forecast/models');

  return res.data;
};
