import { ModuleModel } from '@/shared/models/responses/module-model';
import api from '@/utils/api';

export const deleteModuleRequest = async (
  moduleId: string
): Promise<ModuleModel> => {
  const res = await api.delete<ModuleModel>(`module/${moduleId}`);

  return res.data;
};
