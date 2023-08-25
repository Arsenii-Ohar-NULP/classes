import {useRouter} from 'next/navigation';
import {authActions} from 'components/redux/auth';
import {useAppDispatch} from 'components/redux/store';

export const accessTokenKey = 'accessToken';

export interface Credentials {
  username: string;
  password: string;
}

export const logout = (dispatch, router) => {
  removeToken();
  dispatch(authActions.logout());
  router.replace('/auth/login');
};

export const useLogout = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  return () => logout(dispatch, router);
};

const saveInSession = (token: string) => {
  sessionStorage.setItem(accessTokenKey, token);
};

const saveInLocal = (token: string) => {
  localStorage.setItem(accessTokenKey, token);
};

export const saveToken = (token: string, remember: boolean) => {
  if (!remember) {
    saveInSession(token);
    return;
  }

  saveInLocal(token);
};

export const removeToken = () => {
  if (sessionStorage.getItem(accessTokenKey)) {
    sessionStorage.removeItem(accessTokenKey);
  }

  if (localStorage.getItem(accessTokenKey)) {
    localStorage.removeItem(accessTokenKey);
  }
};
