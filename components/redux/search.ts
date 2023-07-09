import { createSlice } from '@reduxjs/toolkit';

interface SearchState {
  classes: string;
}

const initialState: SearchState = { classes: null };

export const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    searchClasses(state, action) {
      return {
        ...state,
        classes:
          !action.payload || (action.payload as string).trim() === ''
            ? null
            : action.payload,
      };
    },
  },
});

export const searchInitialState = initialState;
export const searchActions = searchSlice.actions;
