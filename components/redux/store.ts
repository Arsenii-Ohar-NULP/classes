import {configureStore, combineReducers, PreloadedState} from '@reduxjs/toolkit';
import {authSlice} from 'components/redux/auth';
import {classSlice} from 'components/redux/classes';
import { TypedUseSelectorHook, useSelector, useDispatch } from 'react-redux';
import { searchSlice} from './search';
import { setupListeners } from '@reduxjs/toolkit/query';
import { requestsApi } from './requestsApi';
import { userApi } from './userApi';
import { classesApi } from './classesApi';

const rootReducer = combineReducers({
  auth: authSlice.reducer,
  classes: classSlice.reducer,
  search: searchSlice.reducer,
  [classesApi.reducerPath]: classesApi.reducer,
  [userApi.reducerPath]: userApi.reducer,
  [requestsApi.reducerPath]: requestsApi.reducer,
});
export type RootState = ReturnType<typeof rootReducer>;
export const setupStore = (preloadedState?: PreloadedState<RootState>) => {
  const store = configureStore({
    reducer: rootReducer,
    preloadedState,
    middleware: getDefaultMiddleware =>
      getDefaultMiddleware()
        .concat(classesApi.middleware)
        .concat(userApi.middleware)
        .concat(requestsApi.middleware),
  });

  setupListeners(store.dispatch);

  return store;
};


export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore['dispatch'];

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
