import Forbidden from 'pages/errors/Forbidden';
import InvalidCredentials from 'pages/errors/InvalidCredentials';
import Message from './Message';
import { getAccessToken } from 'pages/login/authService';

const getApiUrl = () => {
  return process.env['NEXT_PUBLIC_API_URL'];
};

const getMessagesHeader = (): HeadersInit => {
  const token = getAccessToken();

  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
};

const getMessagesEndpoint = (classId: number) => {
  return getApiUrl() + `/api/v1/class/messages/${classId}`;
};

const handleErrors = (response: Response, msgs: object) => {
  if (response.status == 401) {
    throw new InvalidCredentials(msgs[InvalidCredentials.name]);
  }
  if (response.status == 403) {
    throw new Forbidden(msgs[Forbidden.name]);
  }

  throw new Error(msgs[Error.name]);
};

const fetchMessages = async (classId: number): Promise<Response> => {
  const messagesEndpoint = getMessagesEndpoint(classId);
  const messagesHeader = getMessagesHeader();

  return await fetch(messagesEndpoint, {
    method: 'GET',
    headers: messagesHeader,
  });
};

export const getMessages = async ({
  classId,
}: {
  classId: number;
}): Promise<Message[]> => {
  const response = await fetchMessages(classId);

  if (!response.ok) {
    handleErrors(response, {
      InvalidCredentials: 'Please log in to see the messages',
      Forbidden: 'Join this class to see the messages',
      Error: 'Something went wrong, try again later',
    });
  }

  return (await response.json()) as Message[];
};

const saveMessageEndpoint = () => {
  return getApiUrl() + '/api/v1/class/message';
};
const saveMessageHeader = () => {
  const token = getAccessToken();
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
};

const pushMessage = async (message: Message) => {
  const endpointUrl = saveMessageEndpoint();
  const headers = saveMessageHeader();

  return await fetch(endpointUrl, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(message),
  });
};

export const saveMessage = async ({
  message,
}: {
  message: Message;
}): Promise<void> => {
  const response = await pushMessage(message);

  if (!response.ok) {
    handleErrors(response, {
      InvalidCredentials: 'You have to be logged in to save a message.',
      Forbidden: 'You have not joined the class',
      Error: 'Something went wrong, please try agian laer.',
    });
  }
};
