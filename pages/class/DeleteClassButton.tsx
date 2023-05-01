import React from 'react';
import deleteIcon from 'icons/delete.svg';
import Image from 'next/image';
import { useAppDispatch, useAppSelector } from 'pages/redux/store';
import { Role } from 'pages/User';
import { removeClass } from './ClassService';
import { classesActions } from 'pages/redux/classes';
import { useRouter } from 'next/router';

export default function DeleteClassButton({ classId }: { classId: number }) {
  const role = useAppSelector((state) => state.auth?.user?.role);
  const dispatch = useAppDispatch();
  const router = useRouter();
  function deleteClass() {
    removeClass(classId).then(() => {
      dispatch(classesActions.deleteUserClass(classId));
      router.push('/classes');
    });
  }

  if (role !== Role.Teacher) {
    return <></>;
  }

  return (
    <div>
      <button className="btn btn-danger" onClick={deleteClass}>
        <Image src={deleteIcon} width={24} height={24} alt={'Delete'} />
      </button>
    </div>
  );
}
