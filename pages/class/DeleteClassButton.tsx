import React from 'react';
import deleteIcon from 'icons/delete.svg';
import Image from 'next/image';
import { useAppSelector } from 'pages/redux/store';
import { Role } from 'pages/account/User';

export default function DeleteClassButton({ onDelete }: { onDelete: () => void }) {
  const role = useAppSelector((state) => state.auth?.user?.role);

  if (role !== Role.Teacher) {
    return null;
  }

  return (
    <div>
      <button className="btn btn-danger" onClick={onDelete}>
        <Image src={deleteIcon} width={24} height={24} alt={'Delete'} />
      </button>
    </div>
  );
}
