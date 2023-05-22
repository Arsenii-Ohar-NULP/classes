import { getAccessToken } from 'pages/login/AuthService';
import { getUserInfo } from 'pages/account/UserService';
import { sampleUser } from '__test__/data/user';
import { useMainPageRedirect, useLoginRedirect } from 'pages/utils/hooks';
import { waitFor } from '@testing-library/react';
import { renderHookWithProviders } from '__test__/testUtils';
import { useRouter } from 'next/router';

const pushMock = jest.fn((url) => console.log(url));
jest.mock('next/router', () => ({
  useRouter: () => ({
    pathname: '/',
    push: pushMock,
  }),
}));

jest.mock('pages/login/authService');
jest.mock('pages/account/UserService');

describe('useMainPageRedirect hook test', () => {
  it('when access token is given, redirects to main page', async () => {
    jest.mocked(getAccessToken).mockReturnValueOnce('ABCD1234');
    jest.mocked(getUserInfo).mockResolvedValueOnce(sampleUser);
    await waitFor(() => {
      renderHookWithProviders(useMainPageRedirect);
      expect(jest.mocked(useRouter().push)).toBeCalledWith('/classes');
    });
  });
});

describe('useLoginRedirect hook test', () => {
    it('when no access token is given, redirects to login page', async () => {
        jest.mocked(getAccessToken).mockReturnValueOnce(null);
        await waitFor(() => {
            renderHookWithProviders(useLoginRedirect);
            expect(jest.mocked(useRouter().push)).toBeCalledWith('/login');
        })  
    })
})
