"use client";
import React from 'react';
import {ClassData, createEntireClass} from 'components/class/ClassService';
import {useAppSelector} from 'components/redux/store';
import TitleInput from 'components/addClass/TitleInput';
import FileInput from 'components/addClass/FileInput';
import AddClassButton from 'components/addClass/AddClassButton';
import DescriptionInput from 'components/addClass/DescriptionInput';
import {useCreateClassMutation, usePostClassThumbnailMutation} from "components/redux/classesApi";
import {useClassForm} from "components/class/useClassForm";
import {useRouter} from "next/navigation";
import {useLogout} from "components/login/AuthService";

export default function AddClassPage() {
    const [uploadThumbnail, uploadThumbnailResponse] = usePostClassThumbnailMutation();
    const {register, handleSubmit, errors} = useClassForm();
    const userId = useAppSelector((state) => state.auth?.user?.id);
    const [createClass, createClassResponse] = useCreateClassMutation();
    const router = useRouter();
    const logout = useLogout();
    const onSubmit = async (data: ClassData) => {
        try {
            createEntireClass({
                data,
                userId,
                createClassFn: createClass,
                uploadThumbnailFn: uploadThumbnail
            }).then(
                () => router.replace("/main/classes")
            )
                .catch((error) => {
                    if ("status" in error){
                        if (error['status'] === 401){
                            logout();
                        }
                    }
                })
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={"container p-1 d-flex flex-column align-items-center"}>
            <h1 className="p-2">Add a class</h1>
            <TitleInput
                placeholder="Enter a title"
                id="Title"
                errorMessage={errors?.Title?.message?.toString()}
                registration={register('Title')}
            />
            <DescriptionInput
                errorMessage={errors?.Description?.message?.toString()}
                registration={register('Description')}
            />
            <FileInput
                id="ImageInput"
                placeholder="Upload a class thumbnail"
                registration={register('Image')}
            />
            <hr/>
            <AddClassButton disabled={createClassResponse.isLoading || uploadThumbnailResponse.isLoading}/>
        </form>
    );
}
