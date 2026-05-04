import { AiSummaryResponseModel } from '@/shared/models/responses/ai-summary-model';
import api from '@/utils/api';

export const getAiSummaryRequest = async (
  deviceId: string,
  hoursAgo: number
): Promise<AiSummaryResponseModel> => {
  const res = await api.get<AiSummaryResponseModel>('ai', {
    params: { deviceId, hoursAgo },
  });

  return res.data;
};
