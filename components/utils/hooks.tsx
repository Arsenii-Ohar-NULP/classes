"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthStatus, authActions } from 'components/redux/auth';
import { useAppSelector, useAppDispatch } from 'components/redux/store';
import InvalidCredentials from 'components/errors/InvalidCredentials';
import { getUserInfo } from 'components/account/UserService';
import { removeToken } from 'components/login/AuthService';
import { socket } from './socket';
import {useGetCurrentUserQuery} from "components/redux/userApi";
import {getAccessToken} from "../account/TokenService";

function useLoginRedirect() {
  const router = useRouter();
  const authStatus = useAppSelector((state) => state.auth.status);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!getAccessToken()) {
      if (authStatus !== AuthStatus.LOGGED_OUT) {
        dispatch(authActions.logout());
      }

      router.replace('/auth/login');
    }
  }, [authStatus]);
}

function useUserData() {
  const router = useRouter();
  const {data: user, error} = useGetCurrentUserQuery();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!user) {
      if (error){
            removeToken();
            dispatch(authActions.logout());
            router.push('/main/login');
      }
    }
  }, [user, error]);

  return user;
}

function useMainPageRedirect(mainPageUrl?: string) {
  const mainPagePath = mainPageUrl === undefined ? '/main/classes' : mainPageUrl;
  const router = useRouter();
  const authStatus = useAppSelector((state) => state.auth.status);
  const dispatch = useAppDispatch();
  useEffect(() => {
    const token = getAccessToken();
    if (authStatus !== AuthStatus.LOGGED_IN_FETCHED){
      router.push(mainPagePath);
    }
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

function useSocket(){
  useEffect(() => {
    socket.connect();

    return () => {
      socket.disconnect();
    }
  }, [])
}

export {
  useLoginRedirect,
  useUserData,
  useMainPageRedirect,
  useMessageReplacer,
  useSocket
};
