import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { RootState } from '@/store/store';

interface UserState {
  connectedDevice: BluetoothDevice | null;
  selectedNetwork: Record<string, unknown> | null;
  currentStep: number;
}

const initialState: UserState = {
  connectedDevice: null,
  selectedNetwork: null,
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
    connectDevice: (state, action: PayloadAction<BluetoothDevice>) => {
      state.connectedDevice = action.payload;
    },
    selectNetwork: (state, network: PayloadAction<Record<string, unknown>>) => {
      state.selectedNetwork = network;
    },
    nextStep: (state) => {
      state.currentStep += 1 % 3;
    },
    disconnectDevice: (state) => {
      state.connectedDevice = null;
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
} = connectModuleSlice.actions;

export {
  connectDevice,
  connectModuleReducer,
  disconnectDevice,
  nextStep,
  resetConnectionState,
  selectConnectedDevice,
  selectCurrentNetwork,
  selectCurrentStep,
  selectNetwork,
};
