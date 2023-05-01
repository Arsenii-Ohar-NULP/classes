import React from 'react';
import Image from 'next/image';
import addIcon from 'icons/add.svg';
import Link from 'next/link';
export default function AddClassButton() {
  return (
    <Link href={'/addClass'}>
      <button className='btn btn-primary rounded-3'>
        <Image src={addIcon} alt={'Add icon button'} width={32} height={32}/>
      </button>
    </Link>
  );
}
