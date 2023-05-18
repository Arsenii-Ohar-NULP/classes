import React from 'react';
import { fireEvent, screen, waitFor } from '@testing-library/react';

import LoginPage from 'pages/login/index';
import { renderWithProviders } from '../testUtils';
import { LocalStorageMock } from '__test__/LocalStorageMock';
import { login, getAccessToken } from 'pages/login/authService';
import { useRouter } from 'next/router';
import { getUserInfo } from 'pages/account/UserService';
import { sampleUser } from '__test__/data/user';

jest.mock('pages/account/UserService');

// TODO: mock getUserInfo
jest.mock('pages/login/authService', () => ({
  login: jest.fn(() => 'ABCD123'),
  getAccessToken: jest.fn(() => undefined),
  saveToken: jest.fn()
}));

Object.defineProperty(window, 'localStorage', {
  value: new LocalStorageMock(),
});
const pushMock = jest.fn((url) => console.log(url));
jest.mock('next/router', () => ({
  useRouter: () => ({
    pathname: '/',
    push: pushMock,
  }),
}));
describe('this is a Login Page test', () => {
  beforeEach(() => {
    window.localStorage.clear();
    jest.clearAllMocks();
  });

  it('matches a snapshot', async () => {
    const page = renderWithProviders(<LoginPage />);
    expect(page).toMatchSnapshot();
  });

  it('pushes if a token exists', async () => {
    const token = 'Q2312312321311225';
    jest.mocked(getAccessToken).mockImplementationOnce(() => token);
    jest.mocked(getUserInfo).mockImplementationOnce(() => Promise.resolve(sampleUser));
    renderWithProviders(<LoginPage />);
    await waitFor(() => {
      expect(jest.mocked(useRouter().push)).toBeCalledWith('/classes');
      expect(getUserInfo).toBeCalled();
    });
  });

  it('pushes to sign up page if signup button is clicked', async () => {
    renderWithProviders(<LoginPage />);
    const signUpButton = screen.getByText('Sign up');
    fireEvent.click(signUpButton);
    await waitFor(() =>
      expect(jest.mocked(useRouter().push)).toBeCalledWith('/signUp')
    );
  });

  it('shows fail message if validation error', async () => {
    const mockedLogin = jest.fn();
    mockedLogin.mockReturnValue('ABCD123');
    jest.mock('pages/login/authService', () => ({
      login: mockedLogin,
    }));

    renderWithProviders(<LoginPage />);
    const usernameInput = screen.getByTestId('Username');
    fireEvent.change(usernameInput, { target: { value: 'hell' } });
    const login = screen.getByText('Log in');
    fireEvent.click(login);

    await waitFor(() => expect(mockedLogin).not.toBeCalled());
    const error = screen.getByTestId('Username-Error');
    expect(error).toHaveTextContent('');
  });

  it('pushes to /signUp/?username= on click, if username is set', async () => {
    jest.mocked(getUserInfo).mockImplementationOnce(() => Promise.resolve(sampleUser));
    renderWithProviders(<LoginPage />);
    const usernameInput = screen.getByTestId('Username');
    const mockUsername = 'seniorohar';
    fireEvent.change(usernameInput, { target: { value: mockUsername } });
    const signUpButton = screen.getByText('Sign up');
    fireEvent.click(signUpButton);

    await waitFor(() =>
      expect(jest.mocked(useRouter().push)).toBeCalledWith(
        `signUp/?username=${mockUsername}`
      )
    );
  });

  it('tries to log in on valid data', async () => {
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
