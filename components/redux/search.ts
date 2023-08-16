import { createSlice } from '@reduxjs/toolkit';
import {string} from "yup";

interface SearchState {
  classes: string;
  students: string;
}

const initialState: SearchState = { classes: null, students: null };

const changeSearchText = (state: SearchState, field: keyof SearchState, value: any) => {
  const nextState = {...state};
  nextState[field] = !value || (value as string).trim() === ''
            ? null
            : value;

  return nextState;
}



export const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    searchClasses(state, action) {
      return changeSearchText(state, 'classes', action.payload);
    },
    searchStudents(state, action) {
      return changeSearchText(state, 'students', action.payload);
    }
  },
});

export const searchInitialState = initialState;
export const searchActions = searchSlice.actions;
