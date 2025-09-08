import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { RootState } from '@/store/store';

interface UserState {
  connectedDevice: BluetoothDevice | null;
}

const initialState: UserState = {
  connectedDevice: null,
};

const selectConnectedDevice = (state: RootState) =>
  state.connectModule.connectedDevice;

const connectModuleSlice = createSlice({
  name: 'connect-module',
  initialState,
  reducers: {
    connectDevice: (state, action: PayloadAction<BluetoothDevice>) => {
      state.connectedDevice = action.payload;
    },
    disconnectDevice: (state) => {
      state.connectedDevice = null;
    },
  },
});

const connectModuleReducer = connectModuleSlice.reducer;

const { connectDevice, disconnectDevice } = connectModuleSlice.actions;

export {
  connectDevice,
  connectModuleReducer,
  disconnectDevice,
  selectConnectedDevice,
};
