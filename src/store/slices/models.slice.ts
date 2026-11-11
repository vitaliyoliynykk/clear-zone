import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { LoadingStatus } from '@/shared/models/loading-status-model';
import { ForecastingModelMetadata } from '@/shared/models/responses/forecasting-model-metadata-model';
import { getModelsList } from '@/shared/requests/ai/getModelsList';

import { RootState } from '../store';

interface ModelsState {
  items: ForecastingModelMetadata[];
  selectedModel: string | null;
  status: LoadingStatus;
}

export const SELECTED_MODEL_STORAGE_KEY = 'selectedForecastingModel';

const getStoredSelectedModel = (): string | null => {
  try {
    return localStorage.getItem(SELECTED_MODEL_STORAGE_KEY);
  } catch {
    return null;
  }
};

const initialState: ModelsState = {
  items: [],
  selectedModel: getStoredSelectedModel(),
  status: 'empty',
};

export const loadModelsList = createAsyncThunk('models/loadList', () =>
  getModelsList()
);

const modelsSlice = createSlice({
  name: 'models',
  initialState,
  reducers: {
    setSelectedModel: (state, action: PayloadAction<string | null>) => {
      state.selectedModel = action.payload;
    },
  },
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
export const { setSelectedModel } = modelsSlice.actions;
export const selectModels = (state: RootState) => state.models.items;
export const selectModelsStatus = (state: RootState) => state.models.status;
export const selectSelectedModel = (state: RootState) =>
  state.models.selectedModel;
