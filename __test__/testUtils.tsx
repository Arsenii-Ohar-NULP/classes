import React, { PropsWithChildren } from 'react';
import { render, renderHook } from '@testing-library/react';
import type { RenderOptions } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import type { PreloadedState } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';

import type { RootState, AppStore } from 'pages/redux/store';
// As a basic setup, import your same slice reducers
import { authInitialState, authSlice } from 'pages/redux/auth';
import { classSlice, classesInitialState } from 'pages/redux/classes';

// This type interface extends the default options for render from RTL, as well
// as allows the user to specify other things such as initialState, store.
interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
  preloadedState?: PreloadedState<RootState>;
  store?: AppStore;
}

export function renderWithProviders(
  ui: React.ReactElement,
  {
    preloadedState = { auth: authInitialState, classes: classesInitialState },
    // Automatically create a store instance if no store was passed in
    store = configureStore({
      reducer: { auth: authSlice.reducer, classes: classSlice.reducer },
      preloadedState,
    }),
    ...renderOptions
  }: ExtendedRenderOptions = {}
) {
  function Wrapper({ children }: PropsWithChildren<object>): JSX.Element {
    return <Provider store={store}>{children}</Provider>;
  }

  // Return an object with the store and all of RTL's query functions
  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}

export function renderHookWithProviders(
  ui,
  {
    preloadedState = { auth: authInitialState, classes: classesInitialState },
    // Automatically create a store instance if no store was passed in
    store = configureStore({
      reducer: { auth: authSlice.reducer, classes: classSlice.reducer },
      preloadedState,
    }),
    ...renderOptions
  }: ExtendedRenderOptions = {}
) {
  function Wrapper({ children }: PropsWithChildren<object>): JSX.Element {
    return <Provider store={store}>{children}</Provider>;
  }

  // Return an object with the store and all of RTL's query functions
  return { store, ...renderHook(() => ui(), { wrapper: Wrapper, ...renderOptions }) };
}
