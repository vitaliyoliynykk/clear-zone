import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';

import { userReducer } from './slices/user-slice';

const rootRedcuer = combineReducers({
  user: userReducer,
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
