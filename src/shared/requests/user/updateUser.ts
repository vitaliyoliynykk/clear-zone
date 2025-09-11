import { UpdateUserRequestModel } from '@/shared/models/requests/update-user-request-model';
import { UserResponseModel } from '@/shared/models/responses/user-response-model';
import api from '@/utils/api';

export const updateUserRequest = async (
  body: UpdateUserRequestModel
): Promise<UserResponseModel> => {
  const res = await api.put<UserResponseModel>('user', body);

  return res.data;
};
