"use client";
import {useRouter} from 'next/navigation';
import Class from 'components/classes/Class';
import {useAppDispatch, useAppSelector} from 'components/redux/store';
import React from 'react';
import {sendRequest} from 'components/class/ClassService';
import {classesActions} from 'components/redux/classes';
import clsx from "clsx";

export default function JoinButton({
                                       userId,
                                       cls,
                                   }: {
    userId: number;
    cls: Class;
}) {
    const joinRequests = useAppSelector((state) => state.classes.joinRequests);
    const userClasses = useAppSelector((state) => state.classes.userClasses);
    const dispatch = useAppDispatch();

    function joinClass() {
        if (cls) {
            sendRequest(cls.id)
                .then(() => {
                    alert("We're good, i've sent the request");
                    dispatch(classesActions.addJoinRequest({classId: cls.id, userId}));
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    }

    return (

        <button
            className={
                clsx(
                    'btn btn-primary',
                    userClasses?.find(
                        (el) => el.id === cls?.id
                    ) && 'visually-hidden'
                )
            }
            onClick={joinClass}
            disabled={
                joinRequests?.find((request) => request.classId == cls.id) != null ||
                userId == cls.teacher_id
            }
        >
            Join
        </button>
    );
}
