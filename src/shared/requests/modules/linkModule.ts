import { MessageResponseModel } from '@/shared/models/responses/message-response-model';
import api from '@/utils/api';

export const linkModuleRequest = async (
  moduleId: string
): Promise<MessageResponseModel> => {
  const res = await api.post<MessageResponseModel>(`module/link/${moduleId}`);

  return res.data;
};
