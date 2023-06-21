const getEndpointUrl = (id: number) => {
  const apiUrl = process.env['NEXT_PUBLIC_API_URL'];
  return `${apiUrl}/api/v1/class/img/${id}`;
};

const getHeaders = (): HeadersInit => {
  return {
    'Content-Type': 'application/json',
  };
};

const fetchThumbnail = async (id: number) => {
  const url = getEndpointUrl(id);
  const headers = getHeaders();
  const response = await fetch(url, {
    method: 'GET',
    headers: headers,
  });

  return response;
};

export const findClassThumbnail = async (id: number): Promise<string> => {
  const response = await fetchThumbnail(id);

  if (!response.ok) {
    throw new Error(`Couldn't get image of a class ${id}`);
  }

  try {
    const json = await response.json();

    return json['thumbnail'];
  } catch (e) {
    throw new Error(
      `Couldn't get JSON data from the response of thumbnail request of class ${id}`
    );
  }
};
