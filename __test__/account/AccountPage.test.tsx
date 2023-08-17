import { sampleUser } from '__test__/data/user';
import { renderWithProviders } from '__test__/testUtils';
import AccountPage from 'app/main/account/page';
import { useUserData } from 'components/utils/hooks';
import React from 'react';

jest.mock('components/utils/hooks');

describe('account page test', () => {
  it('should match a snapshot', () => {
    jest.mocked(useUserData).mockReturnValueOnce(sampleUser);
    const page = renderWithProviders(<AccountPage />);
    expect(page.container).toMatchSnapshot();
  });

  it('given no user auth, should match a snapshot', () => {
    jest.mocked(useUserData).mockReturnValueOnce(null);
    const page = renderWithProviders(<AccountPage />);
    expect(page.container).toMatchSnapshot();
  });
});
