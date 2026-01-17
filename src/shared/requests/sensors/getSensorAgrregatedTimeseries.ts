import { TimeseriesItemModel } from '@/shared/models/responses/timeseries-model';
import { SensorsTypesModel } from '@/shared/models/sensors-types-model';
import api from '@/utils/api';

export const getSensorAgrregatedTimeseriesRequest = async (
  moduleId: string,
  sensorType: SensorsTypesModel
): Promise<TimeseriesItemModel[]> => {
  const res = await api.get<TimeseriesItemModel[]>(
    `measurement/aggregated/${moduleId}/${sensorType}`
  );

  return res.data;
};
