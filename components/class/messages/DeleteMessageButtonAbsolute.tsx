import React from 'react'
import Image from 'next/image';
import deleteIcon from 'icons/delete.svg';
import 'animate.css';
import styles from 'components/class/class.module.scss';

export default function DeleteMessageButtonAbsolute({
    onDelete,
    deleteModalId,
  }: {
    onDelete: () => void;
    deleteModalId: string;
  }) {
    return (
      <div className={'position-absolute animate__animated animate__bounceIn animate__faster ' + styles['delete-button']}>
        <button
          className={"btn btn-danger rounded-circle px-2"}
          data-toggle="modal"
          data-target={'#' + deleteModalId}
          onClick={onDelete}
        >
          <Image src={deleteIcon} width={24} height={24} alt={'Delete'} />
        </button>
      </div>
    );
  }