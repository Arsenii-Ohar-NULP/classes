import React from 'react';
import { fireEvent, screen, waitFor } from '@testing-library/react';

import LoginPage from 'app/auth/login/page';
import { renderWithProviders } from '../testUtils';
import { LocalStorageMock } from '__test__/LocalStorageMock';
import { login, getAccessToken, saveToken } from 'components/login/AuthService';
import { getUserInfo } from 'components/account/UserService';
import { sampleUser } from '__test__/data/user';
import InvalidCredentials from 'components/errors/InvalidCredentials';
import { useRouter } from 'next/navigation';

jest.mock('components/account/UserService');
jest.mock('components/login/AuthService');
Object.defineProperty(window, 'localStorage', {
  value: new LocalStorageMock(),
});

jest.mock('next/navigation', () => ({ useRouter: jest.fn() }));

describe('Login Page', () => {
  jest.mocked(useRouter).mockReturnValue({ push: jest.fn() } as never);
  beforeEach(() => {
    window.localStorage.clear();
    jest.clearAllMocks();
  });

  const fillUsername = (username: string) => {
    const usernameInput = screen.getByTestId('Username');
    fireEvent.change(usernameInput, { target: { value: username } });
  };

  const fillPassword = (password: string) => {
    const passwordInput = screen.getByTestId('Password');
    fireEvent.change(passwordInput, { target: { value: password } });
  };

  const fillUpForm = () => {
    const sampleUsername = 'senirohar';
    const samplePassword = 'qwerty1234';

    fillUsername(sampleUsername);
    fillPassword(samplePassword);
  };

  it('should match a snapshot', async () => {
    const page = renderWithProviders(<LoginPage />);
    expect(page.container).toMatchSnapshot();
  });

  it('when token exists, should push to /main/classes', async () => {
    const token = 'Q2312312321311225';
    jest.mocked(getAccessToken).mockImplementationOnce(() => token);
    jest
      .mocked(getUserInfo)
      .mockImplementationOnce(() => Promise.resolve(sampleUser));
    renderWithProviders(<LoginPage />);
    await waitFor(() => {
      expect(jest.mocked(useRouter().push)).toBeCalledWith('/main/classes');
      expect(jest.mocked(getAccessToken)).toBeCalled();
      expect(jest.mocked(getUserInfo)).toBeCalled();
    });
  });

  it('when signup button is clicked, should push to sign up page', async () => {
    renderWithProviders(<LoginPage />);
    
    const signUpButton = screen.getByText('Sign up');
    fireEvent.click(signUpButton);

    await waitFor(() =>
      expect(jest.mocked(useRouter().push)).toBeCalledWith('/auth/signUp')
    );
  });

  it('when validation error occurs, shows fail message', async () => {
    const mockedLogin = jest.fn();
    const sampleUsername = 'hell';
    mockedLogin.mockReturnValueOnce('ABCD123');
    jest.mock('components/login/AuthService', () => ({
      login: mockedLogin,
    }));

    renderWithProviders(<LoginPage />);
    fillUsername(sampleUsername);
    const login = screen.getByText('Log in');
    fireEvent.click(login);

    await waitFor(() => expect(mockedLogin).not.toBeCalled());
    const error = screen.getByTestId('Username-Error');
    expect(error).toHaveTextContent('');
  });

  it('when backend error, show server error', async () => {
    jest
      .mocked(login)
      .mockRejectedValueOnce(() => new InvalidCredentials('error'));

    renderWithProviders(<LoginPage />);
    fillUpForm();
    const loginButton = screen.getByText('Log in');
    fireEvent.click(loginButton);
    await waitFor(() => {
      expect(jest.mocked(login)).toBeCalled();
      const error = screen.getByTestId('error');
      expect(error).toBeInTheDocument();
    });
  });

  it('when username set and sign up is clicked, should push to /signUp/?username=', async () => {
    jest
      .mocked(getUserInfo)
      .mockImplementationOnce(() => Promise.resolve(sampleUser));
    renderWithProviders(<LoginPage />);
    const usernameInput = screen.getByTestId('Username');
    const username = 'seniorohar';
    fireEvent.change(usernameInput, { target: { value: username } });
    const signUpButton = screen.getByText('Sign up');
    fireEvent.click(signUpButton);

    await waitFor(() =>
      expect(jest.mocked(useRouter().push)).toBeCalledWith(
        `/auth/signUp/?username=${username}`
      )
    );
  });

  it('when rememberMe is unchecked and clicked log in with valid data, should call save token with remember me to false', async () => {
    const tickCheckbox = () => {
      const checkbox = screen.getByTestId('remember-me');
      fireEvent.click(checkbox);
    };
    const token = 'ABCD1234';
    const rememberMe = false;
    jest.mocked(login).mockResolvedValueOnce(token);

    renderWithProviders(<LoginPage />);
    fillUpForm();
    tickCheckbox();
    const loginButton = screen.getByText('Log in');
    fireEvent.click(loginButton);
    await waitFor(() => {
      expect(jest.mocked(login)).toBeCalled();
      expect(jest.mocked(saveToken)).toBeCalledWith(token, rememberMe);
    });
  });

  it('when tries to log in on valid data, should fetch access token and no error should occur', async () => {
    renderWithProviders(<LoginPage />);
    const usernameInput = screen.getByTestId('Username');
    fireEvent.change(usernameInput, { target: { value: 'seniorohar' } });
    const passwordInput = screen.getByTestId('Password');
    fireEvent.change(passwordInput, { target: { value: 'gjasgjasjg1234' } });
    const loginButton = screen.getByText('Log in');
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(jest.mocked(login)).toBeCalled();
      expect(screen.getByTestId('Username-Error')).toBeEmptyDOMElement();
      expect(screen.getByTestId('Password-Error')).toBeEmptyDOMElement();
    });
  });
});
