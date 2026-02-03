import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';

import { connectModuleReducer } from './slices/connect-module.slice';
import { deviceDashboardReducer } from './slices/device-dashboard.slice';
import { devicesReducer } from './slices/devices';
import { iaqScoreReducer } from './slices/iaq-score.slice';
import { userReducer } from './slices/user-slice';

const rootRedcuer = combineReducers({
  user: userReducer,
  connectModule: connectModuleReducer,
  devices: devicesReducer,
  deviceDashboard: deviceDashboardReducer,
  iaqScore: iaqScoreReducer,
});

export const setupStore = (preloadedState?: Partial<RootState>) =>
  configureStore({
    reducer: rootRedcuer,
    preloadedState,
  });

export type RootState = ReturnType<typeof rootRedcuer>;
export type AppStore = ReturnType<typeof setupStore>;

export const useAppDispatch = useDispatch.withTypes<AppStore['dispatch']>();
export const useAppSelector = useSelector.withTypes<RootState>();
