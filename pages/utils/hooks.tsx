import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { AuthStatus, authActions } from 'pages/redux/auth';
import { useAppSelector, useAppDispatch } from 'pages/redux/store';
import User from 'pages/account/User';
import InvalidCredentials from 'pages/errors/InvalidCredentials';
import { getUserInfo } from 'pages/account/UserService';
import { getAccessToken, removeToken } from 'pages/login/AuthService';

function useLoginRedirect() {
  const router = useRouter();
  const authStatus = useAppSelector((state) => state.auth.status);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!getAccessToken()) {
      if (authStatus !== AuthStatus.LOGGED_OUT) {
        dispatch(authActions.logout());
      }

      router.push('/login');
    }
  }, [authStatus]);
}

function useUserData() {
  const router = useRouter();
  const [user, setUser] = useState<User>(null);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!user) {
      const token = getAccessToken();
      getUserInfo(token)
        .then((fetchedUser) => setUser(fetchedUser))
        .catch((e) => {
          if (e instanceof InvalidCredentials) {
            removeToken();
            dispatch(authActions.logout());
            router.push('/login');
          }
        });
    }
  });

  return user;
}

function useMainPageRedirect() {
  const mainPagePath = '/classes';
  const router = useRouter();
  const authStatus = useAppSelector((state) => state.auth.status);
  const dispatch = useAppDispatch();
  useEffect(() => {
    const token = getAccessToken();
    if (token) {
      getUserInfo(token)
      .then((user) => {
        if (authStatus === AuthStatus.LOGGED_OUT){
          dispatch(authActions.login(user))
        }
        router.push(mainPagePath)
      })
      .catch(error => {
        if (error instanceof InvalidCredentials){
          return;
        }
      })
    }
  }, [authStatus]);
}

function useMessageReplacer(replacers: object) {
  function normalize(message: string) {
    for (const replacer of Object.keys(replacers)) {
      message = message.replace(
        replacer.toString(),
        replacers[replacer.toString()].toString()
      );
    }

    return message;
  }

  return normalize;
}

function useBootstrap() {
  useEffect(() => {
    require('bootstrap/dist/js/bootstrap.bundle.js');
  });
}

export {
  useLoginRedirect,
  useUserData,
  useMainPageRedirect,
  useMessageReplacer,
  useBootstrap,
};
