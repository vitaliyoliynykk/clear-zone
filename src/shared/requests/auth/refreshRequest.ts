import { AxiosResponse } from 'axios';

import api from '@/utils/api';

export const refreshRequest = async (): Promise<
  AxiosResponse<{ accessToken: string }>
> => api.post<{ accessToken: string }>('auth/refresh');
