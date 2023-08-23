import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import {Credentials} from "components/login/AuthService";
import User, {Role} from "components/account/User";
import {getAccessToken} from "../account/TokenService";
import {CLASSES_API_URL} from "./utils";

export interface EditUserData {
    id: number;
    password?: string;
    email?: string;
    phone?: string;
}

type UserResponse = {
    [K in keyof Omit<User, 'role'>]: User[K];
} & {
    role: string;
}

function transformToLocalUser(response: UserResponse): User {
    const {role} = response;
    return {
        ...response,
        role: role === 'Role.teacher' ? Role.Teacher : Role.Student
    }
}

export const userApi = createApi({
    reducerPath: 'userApi',
    baseQuery: fetchBaseQuery({
        baseUrl: CLASSES_API_URL,
        prepareHeaders: (headers) => {
            const token = getAccessToken()
            if (token) {
                headers.set("authorization", `Bearer ${token}`)
            }

            return headers;
        }
    }),
    tagTypes: ['User'],
    endpoints: (builder) => ({
        getCurrentUser: builder.query<User, void>({
            query: () => `/user`,
            providesTags: (result, error) => (error ? [] : [{type: 'User', id: result.id}]),
            transformResponse: transformToLocalUser
        }),
        getUserById: builder.query<User, number>({
            query: (id) => `/user/${id}`,
            providesTags: (result, error, id) => error ? [] : [{type: 'User', id: id}],
            transformResponse: transformToLocalUser
        }),
        editUser: builder.mutation<void, EditUserData>({
            query: (payload) => ({
                url: "/user",
                method: 'PATCH',
                body: payload
            }),
            invalidatesTags: (result, error, arg) => ([{type: "User", id: arg.id}])
        }),
        login: builder.mutation<string, Credentials>({
            query: (credentials) => ({url: "/user/login", method: 'POST', body: credentials}),
            transformResponse: (response) => {
                return response['access_token'];
            }
        }),
        signUp: builder.mutation<void, User>({
            query: (payload) => ({url: '/user', method: 'POST', body: payload})
        })
    })
});
export const {
    useGetCurrentUserQuery,
    useGetUserByIdQuery,
    useEditUserMutation,
    useLazyGetCurrentUserQuery,
    useLoginMutation,
    useSignUpMutation
} = userApi;