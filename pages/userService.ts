import { request } from './Service';
import User, { Role } from './User';
import InvalidCredentials from './errors/InvalidCredentials';
import { getAccessToken } from './login/authService';

const getEndpointUrl = (id?: number) => {
  return (
    process.env['NEXT_PUBLIC_API_URL'] + '/api/v1/user' + (id ? `/${id}` : '')
  );
};

const getEndpointHeaders = (token: string): HeadersInit => {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
};

const fetchUserInfo = async (token: string, userId: number) => {
  const endpointUrl = getEndpointUrl(userId);
  const headers = getEndpointHeaders(token);

  return await fetch(endpointUrl, {
    method: 'GET',
    headers: headers,
  });
};

export const getUserInfo = async (
  token: string,
  userId?: number
): Promise<User> => {
  const response = await fetchUserInfo(token, userId);

  if (!response.ok) {
    if (response.status == 401) {
      throw new InvalidCredentials(
        "Couldn't get user info due to invalid credentials"
      );
    }

    throw new Error("Couldn't get user info");
  }
  const user = await response.json();
  return {
    ...user,
    role: user.role === 'Role.student' ? Role.Student : Role.Teacher,
  };
};

const putUser = async ({ changedData }) => {
  const endpointUrl = `${process.env['NEXT_PUBLIC_API_URL']}/api/v1/user`;
  const headers = getEndpointHeaders(getAccessToken());

  return await fetch(endpointUrl, {
    method: 'PUT',
    headers,
    body: JSON.stringify(changedData),
  });
};

export const editUser = async (changedData) => {
  return await request({
    fetchFunction: putUser,
    errors: {
      InvalidCredentials: `Couldn't fetch join requests.`,
      Forbidden: `You are not allowed to fetch join requests`,
      Error: `Something went wrong while fetching classes`,
      JsonError: `Couldn't get JSON from send requests`,
    },
    args: { changedData }
  });
};
