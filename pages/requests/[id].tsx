import { useRouter } from 'next/router';
import { getJoinRequests } from 'pages/class/ClassService';
import { JoinRequest } from 'pages/class/JoinRequest';
import React, { useEffect, useState } from 'react';
import RequestCard from 'pages/requests/RequestCard';
import InvalidCredentials from 'pages/errors/InvalidCredentials';
import { useDispatch } from 'react-redux';
import { authActions } from 'pages/redux/auth';
import { removeToken } from 'pages/login/AuthService';
import Head from 'next/head';
import { Loading } from 'pages/class/Loading';

// eslint-disable-next-line no-empty-pattern
export default function RequestsPage({}) {
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const router = useRouter();
  const [requests, setRequests] = useState<JoinRequest[]>();
  const dispatch = useDispatch();

  
  function fetchRequests() {
    const classId = router.query['id'];
    setIsFetching(true);
    getJoinRequests(classId)
      .then((data) => {
        setRequests(data);
      })
      .catch((error) => {
        if (error instanceof InvalidCredentials) {
          dispatch(authActions.logout());
          removeToken();
          router.push('/login');
        }
      })
      .finally(() => setIsFetching(false));
  }

  useEffect(() => {
    if (!requests){
      fetchRequests();
    }
  }, [requests]);
  if (!requests) {
    return <></>
  }

  if(isFetching){
    return <div className='flex justify-content-center w-100 align-items-center'>
      <Loading/>;
      </div>
  }

  return (
    <div>
      <Head>
        <title>Requests for class</title>
      </Head>
      <div>
        <h4 className="m-3">Requests</h4>
        {requests?.length !== 0 ? (
          <div className="d-flex justify-content-center">
            {requests?.map((request, index) => {
              return (
                <RequestCard
                  key={`${request.userId}-${request.classId}`}
                  userId={request.userId}
                  classId={request.classId}
                  onResolved={() =>
                    requests?.splice(index, index + 1) &&
                    setRequests([...requests])
                  }
                />
              );
            })}
          </div>
        ) : <div className='text-center fs-4 align-items-center align-middle' data-testid={'no-join-requests'}>
            There are no join requests.
            </div>}
        
      </div>
    </div>
  );
}
