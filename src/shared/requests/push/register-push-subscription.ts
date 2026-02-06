import { PushSubscriptionRequestModel } from '@/shared/models/requests/push-subscription-request.model';
import { MessageResponseModel } from '@/shared/models/responses/message-response-model';
import api from '@/utils/api';

export const registerPushSubscriptionRequest = async (
  body: PushSubscriptionRequestModel
): Promise<MessageResponseModel> => {
  const res = await api.post<MessageResponseModel>(
    `push-notifications/subscribe`,
    body
  );

  return res.data;
};
