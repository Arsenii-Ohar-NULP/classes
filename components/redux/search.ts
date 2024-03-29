import { createSlice } from '@reduxjs/toolkit';

export interface ISearchState {
  classes: string;
  students: string;
}

const initialState: ISearchState = { classes: null, students: null };

function changeSearchText(state: ISearchState, field: keyof ISearchState, value: string){
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

export const searchActions = searchSlice.actions;
