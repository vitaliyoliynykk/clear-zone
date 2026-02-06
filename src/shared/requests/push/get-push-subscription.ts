import { PushSubscriptionResponseModel } from '@/shared/models/responses/push-susbscription-model';
import api from '@/utils/api';

export const getPushSubscription = async (
  endpoint: string
): Promise<PushSubscriptionResponseModel | null> => {
  const res = await api.get<PushSubscriptionResponseModel>(
    `push-notifications`,
    { params: { endpoint } }
  );

  if (res.status === 204) {
    return null;
  }

  return res.data;
};
