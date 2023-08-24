import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import {authHeaders, CLASSES_API_URL} from "./utils";
import {JoinRequest} from "../class/JoinRequest";
import {DirtyJoinRequest} from "../class/ClassService";

function toCleanRequests(requests: DirtyJoinRequest[]): JoinRequest[] {
    return requests.map((request) => ({
        userId: request.user_id,
        classId: request.class_id
    }));
}

export const requestsApi = createApi({
    reducerPath: 'requestsApi',
    baseQuery: fetchBaseQuery({
        baseUrl: CLASSES_API_URL,
        prepareHeaders: authHeaders
    }),
    tagTypes: ['JoinRequest', 'UserJoinRequest'],
    endpoints: builder => ({
        getRequests: builder.query<JoinRequest[], number>({
            query: (classId) => `/class/requests/${classId}`,
            providesTags: (result, error, id) => {
                if (error) return [];
                return [{type: 'JoinRequest' as const, id}]
            },
            transformResponse: toCleanRequests
        }),
        getCurrentUserRequests: builder.query<JoinRequest[], void>({
            query: () => `/student/requests`,
            providesTags: (result, error) => {
                if (error) return [];
                return result.map((request) => ({type: 'UserJoinRequest', id: request.classId}));
            },
            transformResponse: toCleanRequests
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

export const {
    useGetRequestsQuery,
    useGetCurrentUserRequestsQuery,
    useAcceptRequestMutation,
    useDeclineRequestMutation
} = requestsApi;