import { useRouter } from 'next/router';
import { getJoinRequests } from 'components/class/ClassService';
import { JoinRequest } from 'components/class/JoinRequest';
import React, { useEffect, useState } from 'react';
import RequestCard from 'components/requests/RequestCard';
import InvalidCredentials from 'components/errors/InvalidCredentials';
import { useDispatch } from 'react-redux';
import { authActions } from 'components/redux/auth';
import { removeToken } from 'components/login/AuthService';
import Head from 'next/head';
import { Loading } from 'components/class/Loading';
import { useAppSelector } from 'components/redux/store';
import { Role } from 'components/account/User';
import NotFound from "../../components/errors/NotFound";

// eslint-disable-next-line no-empty-pattern
export default function RequestsPage({}) {
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const role = useAppSelector((state) => state?.auth?.user?.role);
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

        if (error instanceof NotFound){
          router.push('/404');
        }
      })
      .finally(() => setIsFetching(false));
  }

  useEffect(() => {
    if (!router.isReady) return;

    if (role !== Role.Teacher){
      router.push('/404')
    }

    if (!requests){
      fetchRequests();
    }
  }, [requests, role, router]);
  

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
        <h4 className="m-3 fs-2 text-center">Requests</h4>
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
