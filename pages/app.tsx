import React, { useEffect } from 'react';
import Header from 'pages/header/header';
import { useAppDispatch, useAppSelector } from './redux/store';
import { AuthStatus } from 'pages/redux/auth';
import { fetchUserData } from 'pages/redux/classesActions';

type AppParams = {
  component: JSX.Element;
};

let isInitial = true;

export default function App({ component }: AppParams) {
  const authStatus = useAppSelector((state) => state.auth.status);
  const userId = useAppSelector((state) => state.auth.user?.id);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (authStatus == AuthStatus.LOGGED_IN){
      if (isInitial){
        dispatch(fetchUserData(userId));
        isInitial = false;
      }
    }

    if (authStatus == AuthStatus.LOGGED_OUT){
      isInitial = true;
    }
  }, [authStatus]);

  return (
    <div>
      <Header currentComponent={component} />
      {component}
    </div>
  );
}
