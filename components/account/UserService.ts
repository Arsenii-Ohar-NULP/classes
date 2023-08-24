import User, { Role } from 'components/account/User';
import InvalidCredentials from 'components/errors/InvalidCredentials';
import Forbidden from 'components/errors/Forbidden';

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
