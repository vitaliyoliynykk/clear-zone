import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { WifiNetworkModel } from '@/shared/models/bluetooth/bt-network-model';
import { LoadingStatus } from '@/shared/models/loading-status-model';
import { MessageResponseModel } from '@/shared/models/responses/message-response-model';
import { linkModuleRequest } from '@/shared/requests/modules/linkModule';
import { RootState } from '@/store/store';

interface ConnectModuleState {
  connectedDevice: BluetoothDevice | null;
  selectedNetwork: WifiNetworkModel | null;
  connectedDeviceId: string | null;
  currentStep: number;
  linkModuleStatus: LoadingStatus;
}

const initialState: ConnectModuleState = {
  connectedDevice: null,
  selectedNetwork: null,
  connectedDeviceId: null,
  currentStep: 0,
  linkModuleStatus: 'empty',
};

const selectConnectedDevice = (state: RootState) =>
  state.connectModule.connectedDevice;
const selectConnectedDeviceId = (state: RootState) =>
  state.connectModule.connectedDeviceId;
const selectCurrentNetwork = (state: RootState) =>
  state.connectModule.selectedNetwork;
const selectCurrentStep = (state: RootState) => state.connectModule.currentStep;
const selectModuleLinkingStatus = (state: RootState) =>
  state.connectModule.linkModuleStatus;

export const linkModule = createAsyncThunk<
  MessageResponseModel,
  { moduleId: string }
>('connect-module/link', ({ moduleId }) => linkModuleRequest(moduleId));

const connectModuleSlice = createSlice({
  name: 'connect-module',
  initialState,
  reducers: {
    connectDevice: (
      state,
      action: PayloadAction<{ device: BluetoothDevice; deviceId: string }>
    ) => {
      state.connectedDevice = action.payload.device;
      state.connectedDeviceId = action.payload.deviceId;
    },
    selectNetwork: (state, action: PayloadAction<WifiNetworkModel>) => {
      state.selectedNetwork = action.payload;
    },
    nextStep: (state) => {
      state.currentStep += 1 % 3;
    },
    prevStep: (state) => {
      if (state.currentStep > 0) {
        state.currentStep -= 1;
      }
    },
    disconnectDevice: (state) => {
      state.connectedDevice = null;
      state.connectedDeviceId = null;
    },
    resetConnectionState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(linkModule.pending, (state) => {
        state.linkModuleStatus = 'loading';
      })
      .addCase(linkModule.fulfilled, (state) => {
        state.linkModuleStatus = 'complete';
      })
      .addCase(linkModule.rejected, (state) => {
        state.linkModuleStatus = 'error';
      });
  },
});

const connectModuleReducer = connectModuleSlice.reducer;

const {
  connectDevice,
  disconnectDevice,
  selectNetwork,
  nextStep,
  resetConnectionState,
  prevStep,
} = connectModuleSlice.actions;

export {
  connectDevice,
  connectModuleReducer,
  disconnectDevice,
  nextStep,
  prevStep,
  resetConnectionState,
  selectConnectedDevice,
  selectConnectedDeviceId,
  selectCurrentNetwork,
  selectCurrentStep,
  selectModuleLinkingStatus,
  selectNetwork,
};
