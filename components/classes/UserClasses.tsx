import React, { useMemo } from 'react';
import styles from 'components/classes/classes.module.scss';
import Link from 'next/link';
import { ClassUI } from 'components/classes/ClassUI';
import { useAppSelector } from 'components/redux/store';
import { searchClasses } from './ClassSearch';

export default function UserClasses() {
  const user = useAppSelector((state) => state.auth.user);
  const loadedClasses = useAppSelector((state) => state.classes.userClasses);
  const search = useAppSelector((state) => state?.search?.classes);

  const classes = useMemo(() => {
    return searchClasses(loadedClasses, search);
  }, [loadedClasses, search]);

  if (!user || !classes || classes?.length === 0) {
    return <></>;
  }

  return (
    <div data-testid={'user-classes'} className={'my-2'}>
      <h2>Your classes</h2>
      <div className={'d-flex flex-wrap justify-content-center'}>
        {classes?.map((cls) => (
          <Link
            className={
              'text-decoration-none text-dark ' +
              styles['class-block'] +
              ` ${styles['class-flex']}`
            }
            key={cls.id}
            href={`class/${cls.id}`}
          >
            <ClassUI key={cls.id} cls={cls} />
          </Link>
        ))}
      </div>
    </div>
  );
}
