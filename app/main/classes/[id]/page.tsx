"use client";
import React from 'react';
import Head from 'next/head';
import Class from 'components/classes/Class';
import { useEffect, useState } from 'react';
import {notFound, useRouter} from 'next/navigation';
import { useLoginRedirect } from 'components/utils/hooks';
import { findClass } from 'components/class/ClassService';
import { MessagesBar } from 'components/class/MessagesBar';
import ClassThumbnail from 'components/classes/ClassThumbnail';
import { Loading } from 'components/class/Loading';
import ClassInfo from 'components/class/ClassInfo';
import ClassInfoManagement from 'components/class/ClassManagement';
import { socket } from 'components/utils/socket';

export default function ClassPage({params: {id}}: {params: {id: string}}) {
  useLoginRedirect();

  const router = useRouter();
  const [cls, setClass] = useState<Class>(null);
  const [joined, setJoined] = useState<boolean>(false);

  useEffect(() => {
    if (noIdSpecified()) {
      return;
    }

    if (!cls) {
      try {
        fetchClass();
      } catch (e) {
        redirectToUnknown();
      }
    }
  }, [cls, router]);

  useEffect(() => {
    socket.connect();

    return () => {
      socket.disconnect();
    }
  }, [])

  function fetchClass() {
    const classId = Number.parseInt(id);
    findClass(classId)
      .then((fetchedClass) => {
        setClass(fetchedClass);
      })
      .catch((e) => console.log(e));
  }

  function redirectToUnknown() {
    notFound();
  }

  function noIdSpecified(): boolean {
    return !id;
  }

  if (cls == null)
    return (
      <div className="h-100 d-flex justify-content-center align-items-center">
        <Loading />
      </div>
    );
  return (
      <div>
        <Head>
          <title>Classes - {cls?.title ? cls.title : 'loading'}</title>
        </Head>
        <div className="container">
          <div className="container card bg-secondary text-white w-auto rounded shadow mt-sm-1 py-2">
            <div className="d-flex flex-wrap justify-content-center gap-2">
              <ClassThumbnail cls={cls} />
              <ClassInfo
                cls={cls}
                joined={joined}
                saveClass={(cls: Class) => setClass(cls)}
              />
              <ClassInfoManagement cls={cls} />
            </div>
          </div>

          <MessagesBar cls={cls} onForbidden={() => setJoined(false)} />
        </div>
      </div>
  );
}
