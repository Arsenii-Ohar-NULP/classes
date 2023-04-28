import Class from 'pages/classes/Class';
import InvalidCredentials from './errors/InvalidCredentials';
import Forbidden from './errors/Forbidden';
import { getAccessToken } from './login/authService';

const classesEndpoint = '/api/v1/class';

const getApiUrl = () => {
  return process.env['NEXT_PUBLIC_API_URL'];
};

const getJsonHeaders = (): HeadersInit => {
  return {
    'Content-Type': 'application/json',
  };
};

const getClassesUrl = (): string => {
  return getApiUrl() + classesEndpoint;
};

const getAllClasses = async (): Promise<Response> => {
  const getClassesEndpoint = getClassesUrl();
  const getClassesHeader = getJsonHeaders();

  return await fetch(getClassesEndpoint, {
    method: 'GET',
    headers: getClassesHeader,
  });
};
const getClassEndpoint = (id: number): string => {
  return getApiUrl() + classesEndpoint + `/${id}`;
};

const getClass = async ({ id }: { id: number }): Promise<Response> => {
  const endpoint = getClassEndpoint(id);
  const getClassHeader = getJsonHeaders();

  return await fetch(endpoint, {
    method: 'GET',
    headers: getClassHeader,
  });
};

const getAuthHeaders = (): HeadersInit => {
  const token = getAccessToken();

  if (!token) {
    throw new InvalidCredentials(
      'You should be signed in to access user classes.'
    );
  }

  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
};

const fetchUserClasses = async ({
  userId,
}: {
  userId: number;
}): Promise<Response> => {
  const endpointUrl = `${getApiUrl()}/api/v1/classes/${userId}`;
  const headers = getAuthHeaders();

  return await fetch(endpointUrl, {
    method: 'GET',
    headers: headers,
  });
};

const postRequest = async ({ classId }: {classId: number}): Promise<Response> => {
  const endpointUrl = `${getApiUrl()}/api/v1/student/request/${classId}`;
  const headers = getAuthHeaders();

  return await fetch(
    endpointUrl, 
    {
      method: 'POST',
      headers: headers
    }
  );
}

const fetchJoinRequests = async (): Promise<Response> =>{
  const endpointUrl = `${getApiUrl()}/api/v1/student/requests`;
  const headers = getAuthHeaders();

  return await fetch(
    endpointUrl,
    {
      method: 'GET',
      headers
    }
  )
}

interface IErrors {
  InvalidCredentials: string;
  Forbidden: string;
  Error: string;
  JsonError: string;
}
const request = async ({
  fetchFunction,
  errors,
  args,
}: {
  fetchFunction: (() => Promise<Response>) | ((o: object) => Promise<Response>);
  errors: IErrors;
  args?: object;
}) => {
  const response = args
    ? await fetchFunction(args)
    : await (fetchFunction as () => Promise<Response>)();

  if (!response.ok) {
    // TODO: You better change this to a custom one
    if (response.status == 401) {
      throw new InvalidCredentials(errors[InvalidCredentials.name]);
    }

    if (response.status == 403) {
      throw new Forbidden(errors[Forbidden.name]);
    }

    throw new Error(errors[Error.name]);
  }

  try {
    return await response.json();
  } catch (e) {
    // TODO: Change this to a custom Error if possible
    throw new Error(errors['JsonError']);
  }
};



export const findAllClasses = async (): Promise<Class[]> => {
  return await request({
    fetchFunction: getAllClasses,
    errors: {
      InvalidCredentials: "Couldn't get any classes. Try again later",
      Forbidden: 'You are not allowed to fetch classes',
      Error: "Couldn't get classes. Please try again later",
      JsonError: "Couldn't get json from classes response.",
    },
  });
};

export const findClass = async (id: number): Promise<Class> => {
  return await request({
    fetchFunction: getClass,
    errors: {
      InvalidCredentials: `Couldn't get a class id=${id}. Try again later`,
      Forbidden: `You are not allowed to fetch class id=${id}`,
      Error: `Couldn't get a class id=${id}. Please try again later`,
      JsonError: `Couldn't get json from a class response id=${id}.`,
    },
    args: { id },
  });
};

export const findUserClasses = async (userId: number): Promise<Class[]> => {
  return await request({
    fetchFunction: fetchUserClasses,
    errors: {
      InvalidCredentials:
        "Couldn't fetch user classes due to invalid credentials. Try again later",
      Forbidden: 'You are not allowed to fetch user classes.',
      Error: "Couldn't get user classes. Please try again later",
      JsonError: "Couldn't get JSON from user classes response.",
    },
    args: { userId },
  });
};

export const sendRequest = async (classId: number): Promise<void> => {
  return await request({
    fetchFunction: postRequest,
    errors: {
      InvalidCredentials: 
        `Couldn't send a request to join ${classId}`,
        Forbidden: `You are not allowed to join this class`,
        Error: `Something went wrong while requesting to join class id=${classId}`,
        JsonError: `Couldn't get JSON from send request response; class id=${classId}`
    },
    args: {classId}
  })
}

export const getJoinRequests = async (): Promise<void> => {
  return await request({
    fetchFunction: fetchJoinRequests,
    errors: {
      InvalidCredentials: `Couldn't fetch join requests.`,
      Forbidden: `You are not allowed to fetch join requests`,
      Error: `Something went wrong while fetching classes`,
      JsonError: `Couldn't get JSON from send requests`
    }
  })
}