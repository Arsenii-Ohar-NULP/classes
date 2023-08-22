import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import Class from "components/classes/Class";
import {
    CreateClassData,
    CreateClassResponse,
    UploadThumbnailData
} from "components/class/ClassService";
import {authHeaders, CLASSES_API_URL} from "./utils";
import User from "../account/User";

type ThumbnailData = {
    thumbnail: string;
}

export const classesApi = createApi({
        reducerPath: "classesApi",
        baseQuery: fetchBaseQuery({
            baseUrl: CLASSES_API_URL,
            prepareHeaders: authHeaders
        }),
        tagTypes: ['Class', 'ClassThumbnail', "Student"],
        endpoints: builder => ({
            getClasses: builder.query<Class[], void>({
                query: () => `/class`,
                providesTags: ['Class']
            }),
            getClassById: builder.query<Class, number>({
                query: (id: number) => `/class/${id}`,
                providesTags: (result, error, arg) => {
                    if (error) return null;
                    return [{type: 'Class' as const, id: arg}]
                }
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
                    if (error) return null;
                    return [{type: 'Class', id}]
                }
            }),
            getClassThumbnail: builder.query<ThumbnailData, number>({
                query: (id: number) => `/class/img/${id}`,
                providesTags: (result, error, id) => ([{type: 'ClassThumbnail' as const, id}])
            }),
            postClassThumbnail: builder.mutation<void, UploadThumbnailData>({
                query: (payload) => (
                    {
                        url: '/class/img',
                        method: 'PUT',
                        body: payload
                    }),
                invalidatesTags: (result, error, payload) =>
                    ([
                        {
                            type: 'ClassThumbnail' as const, id: payload.id
                        }
                    ])
            }),
            getStudentsById: builder.query<User[], number>({
                query: (id) => `/${id}/student`,
                providesTags: ["Student"]
            })
        })
    })
export const {
    useGetClassesQuery,
    useGetClassByIdQuery,
    useCreateClassMutation,
    useEditClassMutation,
    useGetClassThumbnailQuery,
    usePostClassThumbnailMutation,
    useGetStudentsByIdQuery
} = classesApi;