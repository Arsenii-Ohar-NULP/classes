import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import Class from "components/classes/Class";
import {
    CreateClassData,
    CreateClassResponse,
    UploadThumbnailData
} from "components/class/ClassService";
import {authHeaders, CLASSES_API_URL} from "./utils";
import User from "../account/User";
import {ClassUserDTO} from "../class/students/ClassUserDTO";

type ThumbnailData = {
    thumbnail: string;
}

export const classesApi = createApi({
    reducerPath: "classesApi",
    baseQuery: fetchBaseQuery({
        baseUrl: CLASSES_API_URL,
        prepareHeaders: authHeaders
    }),
    tagTypes: ['Class', 'ClassThumbnail', "Student", "UserClass"],
    endpoints: builder => ({
        getClasses: builder.query<Class[], void>({
            query: () => `/class`,
            providesTags: ['Class']
        }),
        getClassById: builder.query<Class, number>({
            query: (id: number) => `/class/${id}`,
            providesTags: (result, error, arg) => {
                if (error) return [];
                return [{type: 'Class' as const, id: arg}]
            }
        }),
        getUserClasses: builder.query<Class[], number>({
            query: (id: number) => `/classes/${id}`,
            providesTags: (result, error) => error ? [] : result.map((cls) => ({type: "UserClass", id: cls.id}))
        }),
        createClass: builder.mutation<CreateClassResponse, CreateClassData>({
            query: (payload) => ({
                url: "/class",
                method: 'POST',
                body: payload
            })
        }),
        editClass: builder.mutation<void, Partial<Class>>({
            query: (cls) => ({
                url: `/class`,
                method: 'PATCH',
                body: cls
            }),
            invalidatesTags: (result, error, {id}) => {
                if (error) return [];
                return [{type: 'Class', id}]
            }
        }),
        deleteClassById: builder.mutation<void, number>({
            query: (id) => ({
                url: `/class/${id}`, method: 'DELETE'
            }),
            invalidatesTags: (result, error, id) => error ? [] : [{type: 'Class', id}]
        }),
        getClassThumbnail: builder.query<ThumbnailData, number>({
            query: (id: number) => `/class/img/${id}`,
            providesTags: (result, error, id) => ([{type: 'ClassThumbnail', id}])
        }),
        postClassThumbnail: builder.mutation<void, UploadThumbnailData>({
            query: (payload) => (
                {
                    url: '/class/img',
                    method: 'PUT',
                    body: payload
                }),
            invalidatesTags: (result, error, payload) =>
                error ? [] : ([
                    {
                        type: 'ClassThumbnail' as const, id: payload.id
                    }
                ])
        }),
        getStudentsById: builder.query<User[], number>({
            query: (id) => `/${id}/student`,
            providesTags: (result, error) =>
                error ? [] : result.map((student) => ({type: 'Student', id: student.id}))
        }),
        deleteStudentById: builder.mutation<void, ClassUserDTO>({
            query: (payload) => ({
                url: '/class/student',
                method: 'DELETE',
                body: payload
            }),
            invalidatesTags: (result, error, arg) =>
                error ? [] : ([{type: 'Student', id: arg.student}])
        })
    })
})
export const {
    useGetClassesQuery,
    useGetClassByIdQuery,
    useGetUserClassesQuery,
    useCreateClassMutation,
    useEditClassMutation,
    useDeleteClassByIdMutation,
    useGetClassThumbnailQuery,
    usePostClassThumbnailMutation,
    useGetStudentsByIdQuery,
    useDeleteStudentByIdMutation
} = classesApi;