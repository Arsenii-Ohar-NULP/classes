import Forbidden from 'components/errors/Forbidden';
import InvalidCredentials from 'components/errors/InvalidCredentials';
import Message from 'components/class/messages/Message';
import { request } from 'components/utils/Service';
import {getAccessToken} from "components/account/TokenService";

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

const saveMessageHeader = () => {
  const token = getAccessToken();
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
};


const deleteMessage = async ({ messageId }: { messageId: number }) => {
  const endpointUrl = `${getApiUrl()}/api/v1/class/message/${messageId}`;
  const headers = saveMessageHeader();

  return await fetch(endpointUrl, {
    method: 'DELETE',
    headers,
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
