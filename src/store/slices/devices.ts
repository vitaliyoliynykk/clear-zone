import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit';

import { LoadingStatus } from '@/shared/models/loading-status-model';
import { ModuleModel } from '@/shared/models/responses/module-model';
import { deleteModuleRequest } from '@/shared/requests/modules/deleteModule';
import { getAllModulesRequest } from '@/shared/requests/modules/getAllModules';

import { RootState } from '../store';

const moduleAdapter = createEntityAdapter<ModuleModel, string>({
  selectId: (u) => u.device_id,
});

const initialState2 = moduleAdapter.getInitialState<{ status: LoadingStatus }>({
  status: 'empty',
});

export const loadModulesList = createAsyncThunk<ModuleModel[]>(
  'dashboard/loadModulesList',
  () => getAllModulesRequest()
);

export const deleteModule = createAsyncThunk<ModuleModel, { moduleId: string }>(
  'dashboard/deleteModule',
  ({ moduleId }) => deleteModuleRequest(moduleId)
);

const moduleSelectors = moduleAdapter.getSelectors(
  (state: RootState) => state.devices
);
const selectModulesStatus = (state: RootState) => state.devices.status;

const devicesSlice = createSlice({
  name: 'dashboard',
  initialState: initialState2,
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
          moduleAdapter.setAll(state, action.payload);
        }
      )
      .addCase(loadModulesList.rejected, (state) => {
        state.status = 'error';
      });

    builder
      .addCase(deleteModule.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(
        deleteModule.fulfilled,
        (state, action: PayloadAction<ModuleModel>) => {
          state.status = 'complete';
          moduleAdapter.removeOne(state, action.payload.device_id);
        }
      )
      .addCase(deleteModule.rejected, (state) => {
        state.status = 'error';
      });
  },
});

const devicesReducer = devicesSlice.reducer;

export { devicesReducer, moduleSelectors, selectModulesStatus };
