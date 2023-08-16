import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import styles from 'components/classes/classes.module.scss';
import Class from 'components/classes/Class';
import { ClassUI } from 'components/classes/ClassUI';
import { findAllClasses } from 'components/class/ClassService';
import { useAppSelector } from 'components/redux/store';
import clsx from 'clsx';
import { searchClasses } from './ClassSearch';

export default function RecommendedClasses() {
  const [loadedClasses, initLoadedClasses] = useState<Class[]>([]);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const userClasses = useAppSelector((state) => state.classes.userClasses);
  const search = useAppSelector((state) => state?.search?.classes);

  const classes = useMemo<Class[]>(() => {
    const currentClasses = loadedClasses.filter(
      (cls) => !userClasses?.some((userCls) => userCls.id === cls.id)
    );
    return searchClasses(currentClasses, search);
  }, [loadedClasses, search, userClasses]);

  const loadClasses = async () => {
    const loadedClasses = await findAllClasses();
    initLoadedClasses(loadedClasses);
    setIsLoaded(true);
  };

  useEffect(() => {
    if (!isLoaded) {
      loadClasses();
    }
  });

  if (classes.length === 0){
    return <div data-testid={'recommended-classes-empty'}>
      There are no classes available for you! Wait for new ones, please. 
    </div>
  }

  return (
    <div>
      <div
        className={'d-flex flex-wrap justify-content-center'}
        data-testid={'recommended-div'}
      >
        {isLoaded &&
          classes.map((cls) => (
            <Link
              className={clsx(
                'text-decoration-none text-dark',
                styles['class-block'],
                styles['class-flex']
              )}
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
