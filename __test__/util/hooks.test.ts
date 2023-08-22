import { getUserInfo } from 'components/account/UserService';
import { sampleUser } from '__test__/data/user';
import { useMainPageRedirect, useLoginRedirect } from 'components/utils/hooks';
import { waitFor } from '@testing-library/react';
import { renderHookWithProviders } from '__test__/testUtils';
import { useRouter } from 'next/navigation';
import {getAccessToken} from "components/account/TokenService";

const navigateMock = jest.fn((url) => console.log(url));
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: navigateMock,
      replace: navigateMock
  }),
}));

jest.mock('components/login/AuthService');
jest.mock('components/account/UserService');
jest.mock("components/account/TokenService");

describe('useMainPageRedirect hook test', () => {
  it('when access token is given, redirects to main page', async () => {
    jest.mocked(getAccessToken).mockReturnValueOnce('ABCD1234');
    jest.mocked(getUserInfo).mockResolvedValueOnce(sampleUser);
    await waitFor(() => {
      renderHookWithProviders(useMainPageRedirect);
      expect(jest.mocked(useRouter().push)).toBeCalledWith('/main/classes');
    });
  });
});

describe('useLoginRedirect hook test', () => {
    it('when no access token is given, redirects to login page', async () => {
        jest.mocked(getAccessToken).mockReturnValueOnce(null);
        await waitFor(() => {
            renderHookWithProviders(useLoginRedirect);
            expect(jest.mocked(useRouter().push)).toBeCalledWith('/auth/login');
        })  
    })
})
