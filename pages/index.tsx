import React, { useEffect } from 'react';
import LoginPage from 'pages/login';
import { useRouter } from 'next/router';
import { getAccessToken } from './login/authService';
import { useAppSelector } from './redux/store';
import { AuthStatus } from './redux/auth';

export default function Index() {
  const router = useRouter();
  const authStatus = useAppSelector((state) => state.auth.status);
  useEffect(() => {
    if (
      getAccessToken() &&
      (authStatus === AuthStatus.LOGGED_IN ||
        authStatus === AuthStatus.LOGGED_IN_FETCHED)
    ) {
      router.push('./classes');
    }
  });

  return (
    <>
      <LoginPage />
    </>
  );
}
