import { configureStore } from '@reduxjs/toolkit';
import { authSlice } from 'components/redux/auth';
import { classSlice } from 'components/redux/classes';
import { TypedUseSelectorHook, useSelector, useDispatch } from 'react-redux';
import { searchSlice } from './search';

const reducer = {
  auth: authSlice.reducer,
  classes: classSlice.reducer,
  search: searchSlice.reducer
};

const store = configureStore({
  reducer
});

export type RootState = ReturnType<typeof store.getState>;
export type AppStore = typeof store;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export default store;
