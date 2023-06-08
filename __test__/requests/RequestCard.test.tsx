import * as React from 'react';

import { renderWithProviders } from '__test__/testUtils';
import { getAccessToken, logout } from 'pages/login/AuthService';
import RequestCard from 'pages/requests/RequestCard';
import { getUserInfo } from 'pages/account/UserService';
import { sampleUser } from '__test__/data/user';
import { screen, waitFor } from '@testing-library/react';
import InvalidCredentials from 'pages/errors/InvalidCredentials';

jest.mock('pages/account/UserService');
jest.mock('pages/login/AuthService');
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn((url) => console.log(url)),
  }),
}));
window.alert = (msg: string) => console.log(msg);


describe('request card', () => {
  it('should show user fullname', async () => {
    const mockUser = sampleUser;
    jest.mocked(getAccessToken).mockReturnValueOnce('ABCD1234');
    jest.mocked(getUserInfo).mockResolvedValue(mockUser);
    const userId = 1;
    const classId = 1;
    const onResolved = () => console.log('resolved');
    renderWithProviders(
      <RequestCard userId={userId} classId={classId} onResolved={onResolved} />
    );

    await waitFor(() => {
      screen.findByText(`${mockUser.firstName} ${mockUser.lastName}`);
    });
  });

  it('should logout when user has not enough rights or token is expired', async () => {
    jest.mocked(getAccessToken).mockReturnValueOnce('ABCD1234');
    jest
      .mocked(getUserInfo)
      .mockRejectedValue(
        new InvalidCredentials('You have to be logged in to do this')
      );
    const userId = 1;
    const classId = 1;
    const onResolved = () => console.log('resolved');
    renderWithProviders(
      <RequestCard userId={userId} classId={classId} onResolved={onResolved} />
    );

    await waitFor(() => {
        expect(jest.mocked(logout)).toHaveBeenCalled();
    });
  });
});
