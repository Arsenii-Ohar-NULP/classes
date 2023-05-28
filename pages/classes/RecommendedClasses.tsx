import React from 'react';
import { useState, useEffect } from 'react';
import { findAllClasses } from 'pages/class/ClassService';
import Link from 'next/link';
import styles from 'pages/classes/classes.module.scss';
import Class from 'pages/classes/Class';
import { ClassUI } from 'pages/classes/ClassUI';

export default function RecommendedClasses() {
  const [classes, initClasses] = useState<Class[]>([]);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  const loadClasses = async () => {
    const loadedClasses = await findAllClasses();
    initClasses(loadedClasses);
    setIsLoaded(true);
  };

  useEffect(() => {
    if (!isLoaded) {
      loadClasses();
    }
  });

  return (
    <div>
      <div className={'d-flex flex-wrap justify-content-center'} data-testid={'recommended-div'}>
        {isLoaded &&
          classes.map((cls) => (
            <Link
              className={
                'text-decoration-none text-dark ' + `${styles['class-block']} ` + styles['class-flex']
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
