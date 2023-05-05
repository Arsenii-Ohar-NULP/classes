import User from 'pages/account/User';

const getHeaders = (): HeadersInit => {
  return {
    'Content-Type': 'application/json',
  };
};

const getEndpointUrl = (): string => {
  return process.env['NEXT_PUBLIC_API_URL'] + '/api/v1/user';
};

const getErrorMessage = async (response) => {
  const typicalMessage = 'Something is wrong, try again later';
  let message: string;
  try {
    const json = await response.json();
    message = json?.msg ? json.msg : typicalMessage;
  } catch (e) {
    message = typicalMessage;
  }

  throw new Error(message);
};

export const signUp = async (user: User) => {
  const endpointUrl = getEndpointUrl();
  const headers = getHeaders();

  const response = await fetch(endpointUrl, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(user),
  });

  if (!response.ok) {
    await getErrorMessage(response);
  }
};
