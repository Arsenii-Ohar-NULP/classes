import { sampleFiveClasses } from '__test__/data/classes';
import { mockFetch } from '__test__/mockFetch';
import {
  DirtyJoinRequest,
  findAllClasses,
  getUserJoinRequests,
} from 'pages/class/ClassService';
import Class from 'pages/classes/Class';
import Forbidden from 'pages/errors/Forbidden';
import InvalidCredentials from 'pages/errors/InvalidCredentials';
import { getAccessToken } from 'pages/login/authService';

jest.mock('pages/login/AuthService');

describe('findAllClasses test', () => {
  mockFetch();

  it('given 5 classes in fetch, findAllClasses returns 5 classes', async () => {
    const expectedClasses: Class[] = [...sampleFiveClasses];
    jest.mocked(fetch).mockResolvedValueOnce({
      json: () => Promise.resolve(expectedClasses),
      ok: true,
      status: 200,
    } as any);

    const actualClasses = await findAllClasses();
    expect(actualClasses).toBe(expectedClasses);
  });

  it('given error, throw Error', async () => {
    jest.mocked(fetch).mockResolvedValueOnce({
      json: () => Promise.resolve({ msg: 'Something went wrong' }),
      status: 500,
      ok: false,
    } as any);

    expect(findAllClasses).rejects.toThrow(Error);
  });

  it('when fetching, throw Forbidden', () => {
    jest.mocked(fetch).mockResolvedValueOnce({
      json: () =>
        Promise.resolve({
          msg: 'An access to this resource has been Forbidden',
        }),
      ok: false,
      status: 403,
    } as any);

    expect(findAllClasses).rejects.toThrow(Forbidden);
  });
});

describe('getUserJoinRequests test', () => {
  mockFetch();

  it('given join requests, run successfully', async () => {
    const joinRequests: DirtyJoinRequest[] = [
      {
        class_id: 1,
        user_id: 2,
      },
      {
        class_id: 2,
        user_id: 2,
      },
    ];

    jest.mocked(fetch).mockResolvedValueOnce({
      json: () => Promise.resolve(joinRequests),
      ok: true,
      status: 200,
    } as any);
    jest.mocked(getAccessToken).mockReturnValueOnce('ABCD1234');

    const actualUserJoinRequests = await getUserJoinRequests();
    expect(actualUserJoinRequests).toEqual(
      joinRequests.map((jr) => ({ userId: jr.user_id, classId: jr.class_id }))
    );
  });

  it('given no user auth, when fetching, throw InvalidCredentials', async () => {
    jest.mocked(getAccessToken).mockReturnValueOnce(null);
    jest.mocked(fetch).mockResolvedValueOnce({
      json: () => Promise.resolve({ msg: 'No authentication provided' }),
      ok: false,
      status: 401,
    } as any);
    

    expect(getUserJoinRequests).rejects.toThrow(InvalidCredentials);
  });
});
