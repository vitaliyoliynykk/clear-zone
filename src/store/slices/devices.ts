import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { LoadingStatus } from '@/shared/models/loading-status-model';
import { ModuleModel } from '@/shared/models/responses/module-model';
import { getAllModulesRequest } from '@/shared/requests/modules/getAllModules';

import { RootState } from '../store';

interface DevicesState {
  status: LoadingStatus;
  modules: ModuleModel[] | null;
}

export const loadModulesList = createAsyncThunk(
  'dashboard/loadModulesList',
  () => getAllModulesRequest()
);

const initialState: DevicesState = {
  status: 'empty',
  modules: null,
};

const selectModules = (state: RootState) => state.devices.modules;
const selectModulesStatus = (state: RootState) => state.devices.status;

const devicesSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadModulesList.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(
        loadModulesList.fulfilled,
        (state, action: PayloadAction<ModuleModel[]>) => {
          state.status = 'complete';
          state.modules = action.payload;
        }
      )
      .addCase(loadModulesList.rejected, (state) => {
        state.status = 'error';
      });
  },
});

const devicesReducer = devicesSlice.reducer;

export { devicesReducer, selectModules, selectModulesStatus };
