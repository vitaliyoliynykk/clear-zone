import {
  createAsyncThunk,
  createSelector,
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit';

import { LoadingStatus } from '@/shared/models/loading-status-model';
import { TimeseriesItemModel } from '@/shared/models/responses/timeseries-model';
import { VocIndexModel } from '@/shared/models/responses/voc-index-model';
import { SensorsTypesModel } from '@/shared/models/sensors-types-model';
import { getLatestVocIndex } from '@/shared/requests/sensors/getLatestVocIndex';
import { getSensorAgrregatedTimeseriesRequest } from '@/shared/requests/sensors/getSensorAgrregatedTimeseries';
import { getVocAgrregatedTimeseriesRequest } from '@/shared/requests/sensors/getVocAgrregatedTimeseries';

import { RootState } from '../store';

interface DeviceDashboardState {
  chartType: SensorsTypesModel | null;
  chartData: TimeseriesItemModel[];
  chartLoadingStatus: LoadingStatus;
  vocIndex: VocIndexModel | null;
}

const initialState: DeviceDashboardState = {
  chartType: null,
  chartData: [],
  chartLoadingStatus: 'empty',
  vocIndex: null,
};

const selectDeviceDashboardState = (state: RootState) => state.deviceDashboard;
const selectChartType = createSelector(
  selectDeviceDashboardState,
  (state) => state.chartType
);
const selectChartData = createSelector(
  selectDeviceDashboardState,
  (state) => state.chartData
);
const selectChartLoadingStatus = createSelector(
  selectDeviceDashboardState,
  (state) => state.chartLoadingStatus
);
const selectLatestVocIndex = createSelector(
  selectDeviceDashboardState,
  (state) => state.vocIndex
);

export const loadChart = createAsyncThunk<
  TimeseriesItemModel[],
  { chartType: SensorsTypesModel; deviceId: string; hoursLookback: number }
>('device-dashboard/load-chart', ({ chartType, deviceId, hoursLookback }) => {
  switch (chartType) {
    case 'voc':
      return getVocAgrregatedTimeseriesRequest(deviceId, hoursLookback);
    default:
      return getSensorAgrregatedTimeseriesRequest(
        deviceId,
        chartType,
        hoursLookback
      );
  }
});

export const loadLatestVocIndex = createAsyncThunk<VocIndexModel, string>(
  'device-dashboard/load-voc-latest',
  (moduleId) => getLatestVocIndex(moduleId)
);

export const deviceDashboardSlice = createSlice({
  name: 'device-dashboard',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadChart.pending, (state, action) => {
        const { chartType } = action.meta.arg;

        state.chartLoadingStatus = 'loading';
        state.chartType = chartType;
      })
      .addCase(
        loadChart.fulfilled,
        (state, action: PayloadAction<TimeseriesItemModel[]>) => {
          state.chartLoadingStatus = 'complete';
          state.chartData = action.payload;
        }
      )
      .addCase(loadChart.rejected, (state) => {
        state.chartLoadingStatus = 'error';
        state.chartType = null;
      });

    builder.addCase(
      loadLatestVocIndex.fulfilled,
      (state, action: PayloadAction<VocIndexModel>) => {
        state.vocIndex = action.payload;
      }
    );
  },
});

const deviceDashboardReducer = deviceDashboardSlice.reducer;

export {
  deviceDashboardReducer,
  selectChartData,
  selectChartLoadingStatus,
  selectChartType,
  selectLatestVocIndex,
};
