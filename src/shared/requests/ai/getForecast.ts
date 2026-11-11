import { ForecastResponseModel } from '@/shared/models/responses/forecast-response-model';
import api from '@/utils/api';

export const getForecastRequest = async (
  deviceId: string,
  model: string
): Promise<ForecastResponseModel> => {
  const res = await api.get<{ forecasts: ForecastResponseModel }>('forecast', {
    params: { deviceId, model },
  });

  return res.data.forecasts;
};
