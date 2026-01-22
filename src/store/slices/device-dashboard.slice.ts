import {
  createAsyncThunk,
  createSelector,
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit';

import { LoadingStatus } from '@/shared/models/loading-status-model';
import { TimeseriesItemModel } from '@/shared/models/responses/timeseries-model';
import { SensorsTypesModel } from '@/shared/models/sensors-types-model';
import { getSensorAgrregatedTimeseriesRequest } from '@/shared/requests/sensors/getSensorAgrregatedTimeseries';

import { RootState } from '../store';

interface DeviceDashboardState {
  chartType: SensorsTypesModel | null;
  chartData: TimeseriesItemModel[];
  chartLoadingStatus: LoadingStatus;
}

const initialState: DeviceDashboardState = {
  chartType: null,
  chartData: [],
  chartLoadingStatus: 'empty',
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

export const loadChart = createAsyncThunk<
  TimeseriesItemModel[],
  { chartType: SensorsTypesModel; deviceId: string; hoursLookback: number }
>('device-dashboard/load-chart', ({ chartType, deviceId, hoursLookback }) =>
  getSensorAgrregatedTimeseriesRequest(deviceId, chartType, hoursLookback)
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
  },
});

const deviceDashboardReducer = deviceDashboardSlice.reducer;

export {
  deviceDashboardReducer,
  selectChartData,
  selectChartLoadingStatus,
  selectChartType,
};
