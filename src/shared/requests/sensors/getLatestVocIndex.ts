import { VocIndexModel } from '@/shared/models/responses/voc-index-model';
import api from '@/utils/api';

export const getLatestVocIndex = async (
  moduleId: string
): Promise<VocIndexModel> => {
  const res = await api.get<VocIndexModel>(
    `measurement/voc/latest/${moduleId}`
  );

  return res.data;
};
