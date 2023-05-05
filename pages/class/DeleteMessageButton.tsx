import React from 'react';
import deleteIcon from 'icons/delete.svg';
import Image from 'next/image';

export default function DeleteMessageButton({
    onDelete,
    deleteModalId,
  }: {
    onDelete: () => void;
    deleteModalId: string;
  }) {
    return (
      <div>
        <button
          className="btn btn-danger"
          data-toggle="modal"
          data-target={'#' + deleteModalId}
          onClick={onDelete}
        >
          <Image src={deleteIcon} width={24} height={24} alt={'Delete'} />
        </button>
      </div>
    );
  }