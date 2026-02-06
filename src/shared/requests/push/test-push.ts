import api from '@/utils/api';

export const testPushRequest = async (endpoint: string): Promise<void> => {
  await api.get(`push-notifications/test`, { params: { endpoint } });
};
