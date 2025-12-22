import { ModuleModel } from '@/shared/models/responses/module-model';
import api from '@/utils/api';

export const getAllModulesRequest = async (): Promise<ModuleModel[]> => {
  const res = await api.get<ModuleModel[]>('module/all');

  return res.data;
};
