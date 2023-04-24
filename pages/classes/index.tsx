/* eslint-disable no-empty-pattern */
import React, { useState, useEffect } from 'react';
import Class from 'pages/classes/Class';
import {
  useClassRepository,
  useLoginRedirect,
  useThumbnailRepository,
  useUserData,
} from 'pages/utils/hooks';
import Head from 'next/head';
import styles from 'pages/classes/classes.module.scss';
import Link from 'next/link';

function ImageLoading() {
  return (
    <div className="spinner-border text-primary" role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
  );
}

function ClassUI({ cls }: { cls: Class }) {
  const thumbnailRepository = useThumbnailRepository();
  const [image, setImage] = useState(null);

  useEffect(() => {
    thumbnailRepository.findClassThumbnail(cls.id).then((data) => {
      setImage(data);
    });
  }, [image]);

  return (
    <div className={'text-center m-2 p-4'} title={cls.title}>
      {image ? (
        <img
          className={
            'rounded text-center border border-dark ' + styles['thumbnail']
          }
          alt={cls.title}
          src={`data:image/png; base64, ${image}`}
        />
      ) : (
        <ImageLoading />
      )}
      <h5 className="text-wrap mt-3">{cls.title}</h5>
    </div>
  );
}

function Greeting({ firstName }: { firstName: string }) {
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
      <h2 className="ms-3">{getGreetingText()}</h2>
    </div>
  );
}

export default function Classes({}): React.ReactNode {
  useLoginRedirect();
  const user = useUserData();

  const classRepository = useClassRepository();
  const [classes, initClasses] = useState<Class[]>([]);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  const loadClasses = async () => {
    const loadedClasses = await classRepository.findAll();
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
      <Head>
        <title>Classes</title>
      </Head>
      {user ? <Greeting firstName={user?.firstName} /> : ''}
      {isLoaded ? (
        <div className="p-2 m-2 text-center">
          <h2>Classes that you might be interested in</h2>
          <div className={'row justify-content-center'}>
            {classes.map((cls) => (
              <Link
                className={
                  'col-md text-decoration-none text-dark ' +
                  styles['class-block']
                }
                key={cls.id}
                href={`/class/${cls.id}`}
              >
                <ClassUI key={cls.id} cls={cls} />
              </Link>
            ))}
          </div>
        </div>
      ) : (
        ''
      )}
    </div>
  );
}
