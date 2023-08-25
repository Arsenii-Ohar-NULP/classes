import {
    BaseQueryFn,
    FetchArgs,
    FetchBaseQueryError,
    FetchBaseQueryMeta,
    MutationDefinition
} from "@reduxjs/toolkit/query";
import {MutationTrigger} from "@reduxjs/toolkit/dist/query/react/buildHooks";


export type DirtyJoinRequest = {
    class_id: number;
    user_id: number;
};

export type UploadThumbnailData = {
    image: string;
    id: number;
};

export type CreateClassData = {
    title: string;
    description: string;
    teacher_id: number;
};

export type CreateClassResponse = {
    msg: string;
    id: number;
};

export type ClassData = {
    Title: string;
    Description: string;
    Image: File[];
};


// eslint-disable-next-line @typescript-eslint/ban-types
type CreateClassFunction =  MutationTrigger<MutationDefinition<CreateClassData, BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError, {}, FetchBaseQueryMeta>, "Class" | "ClassThumbnail", CreateClassResponse, "classesApi">>;
// eslint-disable-next-line @typescript-eslint/ban-types
type UploadThumbnailFunction =  MutationTrigger<MutationDefinition<UploadThumbnailData, BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError, {}, FetchBaseQueryMeta>, "Class" | "ClassThumbnail", void, "classesApi">>

interface CreateEntireClassData {
    data: ClassData;
    userId: number;
    createClassFn: CreateClassFunction,
    uploadThumbnailFn: UploadThumbnailFunction
}

export const createEntireClass = async ({data, userId, createClassFn, uploadThumbnailFn}: CreateEntireClassData) => {
    return await new Promise((resolve, reject) => {
        const file = data.Image[0];
        const reader = new FileReader();
        reader.onload = async () => {
            try {
                const base64String = (reader.result as string).split(',')[1];
                const classResponse = await createClassFn({
                    title: data.Title,
                    description: data.Description,
                    teacher_id: userId,
                }).unwrap();
                await uploadThumbnailFn({image: base64String, id: classResponse.id});
                resolve(null);
            } catch (error) {
                reject(error);
            }
        };
        reader.readAsDataURL(file);
    })
}