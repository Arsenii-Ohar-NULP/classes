import User from './User';
import InvalidCredentials from './errors/InvalidCredentials';

const getEndpointUrl = () => {
  return process.env['NEXT_PUBLIC_API_URL'] + '/api/v1/user';
};

const getEndpointHeaders = (token: string): HeadersInit => {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
};

const fetchUserInfo = async (token: string) => {
  const endpointUrl = getEndpointUrl();
  const headers = getEndpointHeaders(token);

  return await fetch(endpointUrl, {
    method: 'GET',
    headers: headers,
  });
};

export const getUserInfo = async (token: string): Promise<User> => {
  const response = await fetchUserInfo(token);

  if (!response.ok) {
    if (response.status == 401) {
      throw new InvalidCredentials("Couldn't get user info due to invalid credentials");
    }

    throw new Error("Couldn't get user info");
  }

  return await response.json();
};
