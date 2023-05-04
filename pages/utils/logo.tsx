import React from 'react';
import Image from 'next/image';
import pen from 'icons/pen.svg';

export default function Logo() {
  return (
    <div className='d-flex justify-content-center align-items-center gap-1 bg-dark p-2 rounded'>
      <Image
        width={32}
        height={32}
        src={pen}
        alt={'Classes Logo'}
        className={
          'border rounded-3 p-1 m-0 fill-light classes-pic'
        }
      />
      <h3 className="m-0 align-middle text-primary">Classes</h3>
    </div>
  );
}
