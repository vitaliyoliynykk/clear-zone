import {
  createAsyncThunk,
  createSelector,
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit';

import { LoadingStatus } from '@/shared/models/loading-status-model';
import { PushSubscriptionResponseModel } from '@/shared/models/responses/push-susbscription-model';
import { getPushSubscription } from '@/shared/requests/push/get-push-subscription';

import { RootState } from '../store';

interface UserState {
  status: LoadingStatus;
  pushNotification: PushSubscriptionResponseModel | null;
}

const initialState: UserState = {
  status: 'empty',
  pushNotification: null,
};

const selectSettingsState = (state: RootState) => state.settings;

const selectPushNotificationsSettings = createSelector(
  selectSettingsState,
  (state) => state.pushNotification
);

const selectSettingIsLoading = createSelector(
  selectSettingsState,
  (state) => state.status === 'loading'
);

export const loadPushNotificationSettings = createAsyncThunk<
  PushSubscriptionResponseModel | null,
  string
>('settings/load-push-notification-settings', (endpoint) =>
  getPushSubscription(endpoint)
);

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadPushNotificationSettings.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(
        loadPushNotificationSettings.fulfilled,
        (
          state,
          action: PayloadAction<PushSubscriptionResponseModel | null>
        ) => {
          state.status = 'complete';
          state.pushNotification = action.payload;
        }
      )
      .addCase(loadPushNotificationSettings.rejected, (state) => {
        state.status = 'error';
      });
  },
});

const settingsReducer = settingsSlice.reducer;

export {
  selectPushNotificationsSettings,
  selectSettingIsLoading,
  settingsReducer,
};
