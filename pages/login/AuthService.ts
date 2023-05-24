import { useRouter } from 'next/router';
import InvalidCredentials from 'pages/errors/InvalidCredentials';
import { authActions } from 'pages/redux/auth';
import { useAppDispatch } from 'pages/redux/store';

export const accessTokenKey = 'accessToken';

export interface Credentials {
  username: string;
  password: string;
}
const getApiUrl = (): string => {
  return process.env['NEXT_PUBLIC_API_URL'];
};

const getLoginUrl = (): string => {
  return getApiUrl() + '/api/v1/user/login';
};

const getLoginHeaders = (): HeadersInit => {
  return {
    'Content-Type': 'application/json',
  };
};

const auth = async (credentials: Credentials) => {
  const url = getLoginUrl();
  const headers = getLoginHeaders();
  const response = await fetch(url, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(credentials),
  });

  return response;
};

const getErrorMessage = async (response: Response): Promise<string> => {
  const typicalMessage = 'Something is wrong, try again later';
  let message: string;
  try {
    const json = await response.json();
    message = json?.msg ? json.msg : typicalMessage;
  } catch (e) {
    message = typicalMessage;
  }
  return Promise.reject(new InvalidCredentials(message));
};

export const getAccessToken = (): string => {
  const localToken = localStorage.getItem(accessTokenKey);
  const sessionToken = sessionStorage.getItem(accessTokenKey);

  return localToken ? localToken : sessionToken;
};

export const login = async (credentials: Credentials) => {
  const response = await auth(credentials);

  if (!response.ok) {
    await getErrorMessage(response);
  }

  return (await response.json())['access_token'];
};

export const logout = (dispatch, router) => {
  removeToken();
  dispatch(authActions.logout());
  router.push('/login');
}

export const useLogout = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const adaptedLogout = () => logout(dispatch, router);

  return adaptedLogout
}

const saveInSession = (token) => {
  sessionStorage.setItem(accessTokenKey, token);
};

const saveInLocal = (token) => {
  localStorage.setItem(accessTokenKey, token);
};

export const saveToken = (token, remember) => {
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
