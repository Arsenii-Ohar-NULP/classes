import { createSlice } from '@reduxjs/toolkit';

export enum AuthStatus{
    LOGGED_IN,
    LOGGED_OUT
}

export interface IAuthState {
    status: AuthStatus;
}

const initialState: IAuthState = { status: AuthStatus.LOGGED_OUT }

export const authSlice = createSlice(
    {
        name: 'auth',
        initialState,
        reducers: {
            login(state){
                return {
                    ...state,
                    status: AuthStatus.LOGGED_IN
                }
            },
            logout(state){
                return {
                    ...state,
                    status: AuthStatus.LOGGED_OUT
                };
            }
        }
    }
) 

export const authActions = authSlice.actions;