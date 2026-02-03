import { IaqScoreModel } from '@/shared/models/responses/iaq-score-model';
import api from '@/utils/api';

export const getIaqScores = async (
  deviceIds: string[]
): Promise<IaqScoreModel[]> => {
  const res = await api.get<IaqScoreModel[]>('iaq', { params: { deviceIds } });

  return res.data;
};
