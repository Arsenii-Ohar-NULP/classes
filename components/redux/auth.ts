import { createSlice } from '@reduxjs/toolkit';
import User from 'components/account/User';

export enum AuthStatus {
  LOGGED_IN_FETCHED,
  LOGGED_IN,
  LOGGED_OUT
}

export interface IAuthState {
  status: AuthStatus;
  user: User;
}

const initialState: IAuthState = { status: AuthStatus.LOGGED_OUT, user: null };

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    fetch(state){
      state.status = AuthStatus.LOGGED_IN_FETCHED;
    },
    login(state, action) {
      return {
        ...state,
        status: AuthStatus.LOGGED_IN,
        user: action.payload,
      };
    },
    logout(state) {
      return {
        ...state,
        status: AuthStatus.LOGGED_OUT,
        user: null,
      };
    },

    updateUser(state, action) {
      return {
        ...state,
        user: { ...state.user, ...action.payload },
      };
    },
  },
});

export const authInitialState = initialState; 
export const authActions = authSlice.actions;
