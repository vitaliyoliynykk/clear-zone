import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { WifiNetworkModel } from '@/shared/models/bluetooth/bt-network-model';
import { RootState } from '@/store/store';

interface ConnectModuleState {
  connectedDevice: BluetoothDevice | null;
  selectedNetwork: WifiNetworkModel | null;
  connectedDeviceId: string | null;
  currentStep: number;
}

const initialState: ConnectModuleState = {
  connectedDevice: null,
  selectedNetwork: null,
  connectedDeviceId: null,
  currentStep: 0,
};

const selectConnectedDevice = (state: RootState) =>
  state.connectModule.connectedDevice;
const selectCurrentNetwork = (state: RootState) =>
  state.connectModule.selectedNetwork;
const selectCurrentStep = (state: RootState) => state.connectModule.currentStep;

const connectModuleSlice = createSlice({
  name: 'connect-module',
  initialState,
  reducers: {
    connectDevice: (state, action: PayloadAction<{device: BluetoothDevice, deviceId: string}>) => {
      state.connectedDevice = action.payload.device;
      state.connectedDeviceId = action.payload.deviceId
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
  selectCurrentNetwork,
  selectCurrentStep,
  selectNetwork,
};
