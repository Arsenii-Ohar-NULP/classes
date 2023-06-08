/* eslint-disable no-empty-pattern */
import React from 'react';
import { useAppSelector } from 'pages/redux/store';
import RecommendedClasses from './RecommendedClasses';
import Greeting from './Greeting';
import { useLoginRedirect } from 'pages/utils/hooks';
import Head from 'next/head';
import UserClasses from './UserClasses';

export default function Classes({}): React.ReactNode {
  useLoginRedirect();
  const user = useAppSelector((state) => state.auth.user);

  return (
    <div>
      <Head>
        <title>Classes</title>
      </Head>
      {user && <Greeting firstName={user?.firstName}/>}
      <div className="p-2 m-2 text-center">
        <RecommendedClasses />
        <UserClasses />
      </div>
    </div>
  );
}
