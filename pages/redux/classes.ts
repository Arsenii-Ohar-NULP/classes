import { createSlice } from '@reduxjs/toolkit';
import { JoinRequest } from 'pages/class/JoinRequest';
import Class from 'pages/classes/Class';


export interface IClassesState {
    userClasses: Class[],
    joinRequests: JoinRequest[]
}

const initialState: IClassesState = { userClasses: null, joinRequests: null }

export const classSlice = createSlice(
    {
        name: 'auth',
        initialState,
        reducers: {
            putUserClasses(state, { payload }){
                state.userClasses = payload;
            },
            putJoinRequests(state, { payload }){
                state.joinRequests = payload;
            },
            addJoinRequest(state, { payload }){
                if (!state.joinRequests){
                    state.joinRequests = [];
                }
                state.joinRequests.push(payload);
            },
            deleteUserClass(state, { payload }){
                state.userClasses = state.userClasses.filter((cls) => cls.id !== payload);
            }
        }
    }
) 

export const classesActions = classSlice.actions;