"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import { Role } from 'components/account/User';
import { useAppSelector } from 'components/redux/store';
export function RequestsButton({ classId }: { classId: number }) {
  const router = useRouter();
  const role = useAppSelector((state) => state?.auth?.user?.role);

  function onClick() {
    router.replace(`/main/classes/requests/${classId}`);
  }

  if (role !== Role.Teacher){
    return <></>;
  }

  return <button onClick={onClick} className='btn btn-primary'>
    Requests
  </button>;
}
