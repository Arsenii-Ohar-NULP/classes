import * as React from 'react';
import Button from 'react-bootstrap/Button';
import editIcon from 'icons/edit.svg';
import Image from 'next/image';
import styles from 'components/class/class.module.scss';

export default function EditClassButton({
  handleClick,
}: {
  handleClick: VoidFunction;
}) {
  return (
    <Button variant="primary" onClick={handleClick} className={styles['edit-button']}>
      <Image src={editIcon} width={24} height={24} alt={'Edit'}/>
    </Button>
  );
}
