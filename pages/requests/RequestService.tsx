import { request } from 'pages/utils/Service';
import { JoinRequest } from 'pages/class/JoinRequest';
import { getAccessToken } from 'pages/login/authService';

const getApiUrl = () => {
  return process.env['NEXT_PUBLIC_API_URL'];
};

const getAuthHeaders = () => {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${getAccessToken()}`,
  };
};

const processJoinRequest = async (
  endpointUrl: string,
  joinRequest: JoinRequest
) => {
  const headers = getAuthHeaders();

  return await fetch(endpointUrl, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      class_id: joinRequest.classId,
      user_id: joinRequest.userId,
    }),
  });
};

const postAccept = async ({ joinRequest }: { joinRequest: JoinRequest }) => {
  const endpointUrl = `${getApiUrl()}/api/v1/teacher/accept`;
  return await processJoinRequest(endpointUrl, joinRequest);
};

const postDecline = async ({ joinRequest }: { joinRequest: JoinRequest }) => {
  const endpointUrl = `${getApiUrl()}/api/v1/teacher/decline`;
  return await processJoinRequest(endpointUrl, joinRequest);
};

export const acceptRequest = async (joinRequest: JoinRequest) => {
  return await request({
    fetchFunction: postAccept,
    errors: {
      JsonError: "Couldn't fetch JSON data from response",
      Forbidden: "You're not allowed to accept join request",
      InvalidCredentials: "You're not logged in to accept a join request",
      Error: 'Something went wrong, try again later or contact support team',
    },
    args: { joinRequest },
  });
};

export const declineRequest = async (joinRequest: JoinRequest) => {
  return await request({
    fetchFunction: postDecline,
    errors: {
      JsonError: "Couldn't fetch JSON data from response",
      Forbidden: "You're not allowed to decline join request",
      InvalidCredentials: "You're not logged in to decline a join request",
      Error: 'Something went wrong, please try again later',
    },
    args: {joinRequest}
  });
};
