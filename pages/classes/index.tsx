/* eslint-disable no-empty-pattern */
import React, { useState, useEffect } from 'react';
import Class from 'pages/classes/Class';
import { useLoginRedirect, useUserData } from 'pages/utils/hooks';
import Head from 'next/head';
import styles from 'pages/classes/classes.module.scss';
import Link from 'next/link';
import { findAllClasses, findUserClasses } from 'pages/class/ClassService';
import { ClassUI } from './ClassUI';
import { useAppSelector } from 'pages/redux/store';
import { Role } from 'pages/User';

function Greeting({ firstName, role }: { firstName: string, role: Role}) {
  function getGreetingText(): string {
    const date = new Date(Date.now());
    const hours = date.getHours();

    if (hours < 12 && hours >= 4) {
      return `Good morning, ${firstName}`;
    }

    if (hours >= 12 && hours < 18) {
      return `Good afternoon, ${firstName}`;
    }

    if (hours >= 18 && hours < 23) {
      return `Good evening, ${firstName}`;
    }

    if (hours >= 23 || hours <= 4) {
      return `Good night, ${firstName}`;
    }

    return `Good afternoon, ${firstName}`;
  }
  return (
    <div className="p-3 bg-secondary text-light">
      <h2 className="ms-3">{getGreetingText()} - {Role[role]}</h2>
    </div>
  );
}

function RecommendedClasses() {
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
      <div className={'row justify-content-center'}>
        {isLoaded &&
          classes.map((cls) => (
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

function UserClasses() {
  const user = useAppSelector((state) => state.auth.user);
  const [classes, initClasses] = useState<Class[]>([]);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  const loadClasses = async () => {
    if (user) {
      const loadedClasses = await findUserClasses(user.id);
      initClasses(loadedClasses);
      setIsLoaded(true);
    }
  };

  useEffect(() => {
    if (!isLoaded) {
      loadClasses();
    }
  });
  if (!isLoaded || classes.length === 0) {
    return <></>;
  }
  return (
    <div>
      <h2>Your classes</h2>
      <div className={'row justify-content-center'}>
        {isLoaded &&
          classes.length !== 0 &&
          classes.map((cls) => (
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

export default function Classes({}): React.ReactNode {
  useLoginRedirect();
  const user = useUserData();

  return (
    <div>
      <Head>
        <title>Classes</title>
      </Head>
      {user && <Greeting firstName={user?.firstName} role={user.role}/>}
      <div className="p-2 m-2 text-center">
        <RecommendedClasses />
        <UserClasses />
      </div>
    </div>
  );
}
