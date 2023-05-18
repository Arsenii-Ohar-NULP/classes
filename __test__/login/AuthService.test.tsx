import { LocalStorageMock } from '__test__/LocalStorageMock';
import { mockFetch } from '__test__/mockFetch';
import InvalidCredentials from 'pages/errors/InvalidCredentials';
import { accessTokenKey, login, logout } from 'pages/login/authService';
import { authActions } from 'pages/redux/auth';
mockFetch();

describe('login test', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.resetAllMocks();
  });

  it('when credentials are correct, return an access token', async () => {
    const credentials = {
      username: 'senirohar',
      password: 'Senya228666',
    };
    const expectedToken = 'ABCD1234';
    jest.mocked(fetch).mockImplementationOnce(() => {
      return Promise.resolve({
        json: () => Promise.resolve({ access_token: expectedToken }),
        headers: null,
        ok: true,
      } as any);
    });
    const token = await login(credentials);
    expect(jest.mocked(fetch)).toBeCalled();
    expect(token).toBe(expectedToken);
  });

  it('when password or username wrong, throw InvalidCredentials error', async () => {
    const credentials = {
      username: 'senirohar',
      password: 'Senya228666',
    };
    const errorMessage = 'Invalid username or password';
    jest.mocked(fetch).mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve({ msg: errorMessage }),
        headers: null,
        ok: false,
        status: 400,
      } as any)
    );

    expect(login(credentials)).rejects.toThrow(InvalidCredentials);
  });
});

describe('logout test', () => {
  Object.defineProperty(window, 'localStorage', {value: new LocalStorageMock()});
  Object.defineProperty(window, 'sessionStorage', {value: new LocalStorageMock()});
  

  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    jest.clearAllMocks();
  })

  it('when log out and a session token exists, the token is removed', () => {
    sessionStorage.setItem(accessTokenKey, 'ABCD1234');
    const router = {
      push: jest.fn()
    }
    const dispatch = jest.fn();

    logout(dispatch, router);

    expect(sessionStorage.getItem(accessTokenKey)).toBeNull();
    expect(dispatch).toBeCalledWith(authActions.logout());
    expect(router.push).toBeCalledWith('/login');
  })

  it('when log out and a local storage token exists, the token is removed', () => {
      localStorage.setItem(accessTokenKey, 'ABCD1234');
      const router = {
        push: jest.fn()
      }
      const dispatch = jest.fn();
  
      logout(dispatch, router);
  
      expect(localStorage.getItem(accessTokenKey)).toBeNull();
      expect(dispatch).toBeCalledWith(authActions.logout());
      expect(router.push).toBeCalledWith('/login');
    })
});
