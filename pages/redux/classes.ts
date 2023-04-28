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
            fetchUserClasses(state, { payload }){
                state.userClasses = payload;
            },
            fetchJoinRequests(state, { payload }){
                state.joinRequests = payload;
            },
            addJoinRequest(state, { payload }){
                if (!state.joinRequests){
                    state.joinRequests = [];
                }
                state.joinRequests.push(payload);
            }
        }
    }
) 

export const classesActions = classSlice.actions;