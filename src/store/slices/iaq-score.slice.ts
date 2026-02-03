import {
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice,
  EntityState,
  PayloadAction,
} from '@reduxjs/toolkit';

import { LoadingStatus } from '@/shared/models/loading-status-model';
import { IaqScoreModel } from '@/shared/models/responses/iaq-score-model';
import { getIaqScores } from '@/shared/requests/iaq/getIaqScores';

import { RootState } from '../store';

const scoreAdapter = createEntityAdapter<IaqScoreModel, string>({
  selectId: (u) => u.module_id,
});

const initialState = scoreAdapter.getInitialState<{ status: LoadingStatus }>({
  status: 'empty',
});

const selectScoreState = (state: RootState) => state.iaqScore;
const selectScores = createSelector(
  selectScoreState,
  (state): EntityState<IaqScoreModel | undefined, string>['entities'] =>
    state.entities
);

export const loadIaqScoresForModules = createAsyncThunk<
  IaqScoreModel[],
  string[]
>('dashboard/loadIaqScores', (deviceIds) => getIaqScores(deviceIds), {
  condition: (_, { getState }) => {
    const state = getState() as RootState;

    if (state.iaqScore.status === 'loading') {
      return false;
    }

    return true;
  },
});

const iaqScoreSlice = createSlice({
  name: 'iaq',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadIaqScoresForModules.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(
        loadIaqScoresForModules.fulfilled,
        (state, action: PayloadAction<IaqScoreModel[]>) => {
          state.status = 'complete';
          console.log('payload', action.payload);
          scoreAdapter.setMany(state, action.payload);
        }
      )
      .addCase(loadIaqScoresForModules.rejected, (state) => {
        state.status = 'error';
      });
  },
});

const iaqScoreReducer = iaqScoreSlice.reducer;

export { iaqScoreReducer, selectScores };
