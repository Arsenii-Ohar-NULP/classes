/* eslint-disable no-empty-pattern */
import React from 'react';
import { useAppSelector } from 'components/redux/store';
import RecommendedClasses from '../../components/classes/RecommendedClasses';
import Greeting from 'components/classes/Greeting';
import { useLoginRedirect } from 'components/utils/hooks';
import Head from 'next/head';
import UserClasses from 'components/classes/UserClasses';

export default function Classes({}): React.ReactNode {
  useLoginRedirect();
  const user = useAppSelector((state) => state.auth.user);

  return (
    <div> 
      <Head>
        <title>Classes</title>
      </Head>
      {/* {user && <Greeting firstName={user?.firstName}/>} */}
      <div className="p-2 m-2 text-center">
        <RecommendedClasses />
        <UserClasses />
      </div>
    </div>
  );
}
