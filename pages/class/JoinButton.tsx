import { useRouter } from 'next/router';
import Class from 'pages/classes/Class';
import { useAppDispatch, useAppSelector } from 'pages/redux/store';
import React from 'react';
import { sendRequest } from './ClassService';
import { classesActions } from 'pages/redux/classes';

export default function JoinButton({
  userId,
  cls,
}: {
  userId: number;
  cls: Class;
}) {
  const router = useRouter();
  const joinRequests = useAppSelector((state) => state.classes.joinRequests);
  const userClasses = useAppSelector((state) => state.classes.userClasses);
  const dispatch = useAppDispatch();

  function joinClass() {
    if (cls) {
      sendRequest(cls.id)
        .then(() => {
          alert("We're good, i've sent the request");
          dispatch(classesActions.addJoinRequest({ classId: cls.id, userId }));
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }

  return (
    
      <button
        className={
          'btn btn-primary ' +
          (userClasses?.find(
            (el) => el.id === Number.parseInt(router.query['id'] as string)
          )
            ? 'visually-hidden'
            : '')
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
