import React from 'react';
import styles from 'pages/classes/classes.module.scss';
import Link from 'next/link';
import { ClassUI } from './ClassUI';
import { useAppSelector } from 'pages/redux/store';

export default function UserClasses() {
  const user = useAppSelector((state) => state.auth.user);
  const classes = useAppSelector((state) => state.classes.userClasses);

  if (!user || !classes || classes?.length === 0) {
    return <></>;
  }
  return (
    <div>
      <h2>Your classes</h2>
      <div className={'row justify-content-center'}>
        {classes?.map((cls) => (
          <Link
            className={
              'col-md text-decoration-none text-dark ' + styles['class-block']
            }
            key={cls.id}
            href={`/class/${cls.id}`}
          >
            <ClassUI key={cls.id} cls={cls} />
          </Link>
        ))}
      </div>
    </div>
  );
}
