import React, { useEffect } from 'react';
import Header from 'pages/header/header';
import { useAppDispatch, useAppSelector } from './redux/store';
import { AuthStatus, authActions } from 'pages/redux/auth';
import { fetchUserData } from 'pages/redux/classesActions';
import { getUserInfo } from './account/UserService';
import { getAccessToken, logout } from './login/authService';
import InvalidCredentials from './errors/InvalidCredentials';
import { useRouter } from 'next/router';

type AppParams = {
  component: JSX.Element;
};

export default function App({ component }: AppParams) {
  const authStatus = useAppSelector((state) => state.auth.status);
  const userId = useAppSelector((state) => state.auth.user?.id);
  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    if (authStatus == AuthStatus.LOGGED_IN){
        dispatch(fetchUserData(userId));
    }

    if (authStatus == AuthStatus.LOGGED_OUT){
      const token = getAccessToken();
      if (token){
        getUserInfo(token).then((user) => 
          dispatch(authActions.login(user))
        ).catch(error => {
          if (error instanceof InvalidCredentials){
            logout(dispatch, router);
          }
        })
      }
    }

  });

  return (
    <div>
      <Header currentComponent={component} />
      {component}
    </div>
  );
}
