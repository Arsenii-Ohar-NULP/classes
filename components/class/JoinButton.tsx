"use client";
import Class from 'components/classes/Class';
import React from 'react';
import clsx from "clsx";
import {useGetCurrentUserRequestsQuery} from "../redux/requestsApi";
import {useGetUserClassesQuery} from "../redux/classesApi";

export default function JoinButton({
                                       userId,
                                       cls,
                                   }: {
    userId: number;
    cls: Class;
}) {
    const {data: requests,
        error: joinRequestsError,
        isLoading: isLoadingJoinRequests} = useGetCurrentUserRequestsQuery();
    const {data: classes, error: classesError, isLoading: isLoadingUserClasses} = useGetUserClassesQuery(userId);

    function joinClass() {
        // if (cls) {
        //     sendRequest(cls.id)
        //         .then(() => {
        //             alert("We're good, i've sent the request");
        //             dispatch(classesActions.addJoinRequest({classId: cls.id, userId}));
        //         })
        //         .catch((error) => {
        //             console.error(error);
        //         });
        // }
    }

    if (isLoadingUserClasses || isLoadingJoinRequests || joinRequestsError || classesError) {
        return <></>;
    }

    return (
        <button
            className={
                clsx(
                    'btn btn-primary',
                    classes.find(
                        (el) => el.id === cls.id
                    ) && 'visually-hidden'
                )
            }
            onClick={joinClass}
            disabled={
                requests?.find((request) => request.classId == cls?.id) != null ||
                userId === cls?.teacher_id
            }
        >
            Join
        </button>
    );
}
