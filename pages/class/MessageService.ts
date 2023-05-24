import Forbidden from 'pages/errors/Forbidden';
import InvalidCredentials from 'pages/errors/InvalidCredentials';
import Message from './Message';
import { getAccessToken } from 'pages/login/AuthService';
import { request } from 'pages/utils/Service';

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

const postMessage = async ({ message }: {message: Message}) => {
  const endpointUrl = saveMessageEndpoint();
  const headers = saveMessageHeader();

  return await fetch(endpointUrl, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(message),
  });
};

const deleteMessage = async ({ messageId }: { messageId: number }) => {
  const endpointUrl = `${getApiUrl()}/api/v1/class/message/${messageId}`;
  const headers = saveMessageHeader();

  return await fetch(endpointUrl, {
    method: 'DELETE',
    headers,
  });
};

export const saveMessage = async ({
  message,
}: {
  message: Message;
}): Promise<any> => {
  return await request({
    fetchFunction: postMessage,
    errors: {
      Error: 'Something went wrong, try again later',
      JsonError: "Couldn't fetch JSON data.",
      InvalidCredentials: 'You should be logged in to send a message',
      Forbidden: "You don't have access to send a message",
    },
    args: { message },
  });
};

export const removeMessage = async (messageId: number) => {
  return await request({
    fetchFunction: deleteMessage,
    errors: {
      Error: 'Something went wrong, try again later',
      JsonError: "Couldn't fetch JSON data.",
      InvalidCredentials: 'You should be logged in to delete a message',
      Forbidden: "You don't have access to delete a message",
    },
    args: { messageId },
  });
};
