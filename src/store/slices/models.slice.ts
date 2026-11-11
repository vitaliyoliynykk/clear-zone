import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { LoadingStatus } from '@/shared/models/loading-status-model';
import { ForecastingModelMetadata } from '@/shared/models/responses/forecasting-model-metadata-model';
import { getModelsList } from '@/shared/requests/ai/getModelsList';

import { RootState } from '../store';

interface ModelsState {
  items: ForecastingModelMetadata[];
  status: LoadingStatus;
}

const initialState: ModelsState = {
  items: [],
  status: 'empty',
};

export const loadModelsList = createAsyncThunk('models/loadList', () =>
  getModelsList()
);

const modelsSlice = createSlice({
  name: 'models',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadModelsList.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(loadModelsList.fulfilled, (state, action) => {
        state.status = 'complete';
        state.items = action.payload;
      })
      .addCase(loadModelsList.rejected, (state) => {
        state.status = 'error';
      });
  },
});

export const modelsReducer = modelsSlice.reducer;
export const selectModels = (state: RootState) => state.models.items;
export const selectModelsStatus = (state: RootState) => state.models.status;
