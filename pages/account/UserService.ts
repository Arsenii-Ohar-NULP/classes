import { request } from '../utils/Service';
import User, { Role } from './User';
import InvalidCredentials from '../errors/InvalidCredentials';
import { getAccessToken } from '../login/AuthService';
import Forbidden from 'pages/errors/Forbidden';

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
  if (!token){
    throw new InvalidCredentials('Token should be present to fetch user info');
  }
  const response = await fetchUserInfo(token, userId);

  if (!response.ok) {
    if (response.status == 401) {
      throw new InvalidCredentials(
        "Couldn't get user info due to invalid credentials"
      );
    }
    if (response.status == 403){
      throw new Forbidden("Forbidden to fetch user info");
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
      InvalidCredentials: `You have to be logged in to edit a user.`,
      Forbidden: `You are not allowed to edit a user`,
      Error: `Something went wrong while editing a user. Check the fields and try again later.`,
      JsonError: `Couldn't get JSON from edting a user`,
    },
    args: { changedData }
  });
};
