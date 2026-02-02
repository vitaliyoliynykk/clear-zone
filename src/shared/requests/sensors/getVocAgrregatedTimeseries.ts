import { TimeseriesItemModel } from '@/shared/models/responses/timeseries-model';
import api from '@/utils/api';

export const getVocAgrregatedTimeseriesRequest = async (
  moduleId: string,

  hoursLookback: number
): Promise<TimeseriesItemModel[]> => {
  const res = await api.get<TimeseriesItemModel[]>(
    `measurement/aggregated/voc/${moduleId}`,
    { params: { hoursLookback } }
  );

  return res.data;
};
