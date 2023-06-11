import { useRouter } from 'next/router';
import { Role } from 'components/account/User';
import { useAppSelector } from 'components/redux/store';
import React from 'react';
export function RequestsButton({ classId }: { classId: number }) {
  const router = useRouter();
  const role = useAppSelector((state) => state.auth.user?.role);
  function onClick() {
    router.push(`/requests/${classId}`);
  }
  if (role !== Role.Teacher){
    return <></>;
  }

  return <button onClick={onClick} className='btn btn-primary'>
    Requests
  </button>;
}
