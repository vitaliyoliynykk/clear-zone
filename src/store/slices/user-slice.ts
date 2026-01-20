import {
  createAsyncThunk,
  createSelector,
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit';

import { LoadingStatus } from '@/shared/models/loading-status-model';
import { UpdateUserRequestModel } from '@/shared/models/requests/update-user-request-model';
import { MessageResponseModel } from '@/shared/models/responses/message-response-model';
import { SignInResponseModel } from '@/shared/models/responses/sign-in-response-model';
import { UserResponseModel } from '@/shared/models/responses/user-response-model';
import { getUserRequest } from '@/shared/requests/auth/getUserRequest';
import { logOutRequest } from '@/shared/requests/auth/logOutRequest';
import { registerRequest } from '@/shared/requests/auth/registerRequest';
import { signInRequest } from '@/shared/requests/auth/signInRequest';
import { updateUserRequest } from '@/shared/requests/user/updateUser';

import { RootState } from '../store';

interface UserState {
  status: LoadingStatus;
  user: UserResponseModel | null;
}

const initialState: UserState = {
  status: 'empty',
  user: null,
};

const selectUserState = (state: RootState) => state.user;

const selectUser = createSelector(selectUserState, (state) => state.user);
const selectUserIsLoading = createSelector(
  selectUserState,
  (state) => state.status === 'loading'
);

export const signIn = createAsyncThunk<
  SignInResponseModel,
  { email: string; password: string }
>('user/signIn', ({ email, password }) => signInRequest(email, password));
export const logOut = createAsyncThunk('user/logOut', () => logOutRequest());
export const getUser = createAsyncThunk('user/get', () => getUserRequest());
export const updateUser = createAsyncThunk<
  UserResponseModel,
  UpdateUserRequestModel
>('user', (body) => updateUserRequest(body));
export const registerUser = createAsyncThunk<
  MessageResponseModel,
  { email: string; password: string }
>('user/register', ({ email, password }) => registerRequest(email, password));

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(signIn.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(
        signIn.fulfilled,
        (state, action: PayloadAction<SignInResponseModel>) => {
          state.status = 'complete';
          state.user = action.payload.user;
        }
      )
      .addCase(signIn.rejected, (state) => {
        state.status = 'error';
      });

    builder
      .addCase(getUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(
        getUser.fulfilled,
        (state, action: PayloadAction<UserResponseModel>) => {
          state.status = 'complete';
          state.user = action.payload;
        }
      )
      .addCase(getUser.rejected, (state) => {
        state.status = 'error';
      });

    builder
      .addCase(logOut.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(logOut.fulfilled, (state) => {
        state.status = 'empty';
        state.user = null;
      })
      .addCase(logOut.rejected, (state) => {
        state.status = 'error';
      });

    builder
      .addCase(updateUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(
        updateUser.fulfilled,
        (state, action: PayloadAction<UserResponseModel>) => {
          state.status = 'complete';
          state.user = action.payload;
        }
      )
      .addCase(updateUser.rejected, (state) => {
        state.status = 'error';
      });
  },
});

const userReducer = userSlice.reducer;

export { selectUser, selectUserIsLoading, userReducer };
