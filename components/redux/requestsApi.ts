import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import {authHeaders, CLASSES_API_URL} from "./utils";
import {JoinRequest} from "../class/JoinRequest";
import {DirtyJoinRequest} from "../class/ClassService";

export const requestsApi = createApi({
    reducerPath: 'requestsApi',
    baseQuery: fetchBaseQuery({
        baseUrl: CLASSES_API_URL,
        prepareHeaders: authHeaders
    }),
    tagTypes: ['JoinRequest'],
    endpoints: builder => ({
        getRequests: builder.query<JoinRequest[], number>({
            query: (classId) => `/class/requests/${classId}`,
            providesTags: (result, error, id) => {
                if (error) return [];
                return [{type: 'JoinRequest' as const, id}]
            },
            transformResponse: (response: DirtyJoinRequest[]) => response.map((dirtyJoinRequest) => ({
                userId: dirtyJoinRequest.user_id,
                classId: dirtyJoinRequest.class_id
            }))
        }),
        acceptRequest: builder.mutation<void, JoinRequest>({
            query: (request) => ({
                url: "/teacher/accept",
                method: 'POST',
                body: {
                    class_id: request.classId,
                    user_id: request.userId
                }
            }),
            invalidatesTags: (result, error, request) =>
                [{type: 'JoinRequest', id: request.classId}]
        }),
        declineRequest: builder.mutation<void, JoinRequest>({
            query: (request) => ({
                url: "/teacher/decline",
                method: 'POST',
                body: {
                    class_id: request.classId,
                    user_id: request.userId
                }
            }),
            invalidatesTags: (result, error, request) =>
                [{type: 'JoinRequest', id: request.classId}]
        }),
    })
})

export const {useGetRequestsQuery, useAcceptRequestMutation, useDeclineRequestMutation} = requestsApi;