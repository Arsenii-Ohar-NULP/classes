import { sampleUser } from '__test__/data/user';
import { renderWithProviders } from '__test__/testUtils';
import AccountPage from 'pages/account';
import { useUserData } from 'pages/utils/hooks';
import React from 'react';

jest.mock('pages/utils/hooks');

describe('account page test', () => {
    it('matches snapshot', () => {
        jest.mocked(useUserData).mockReturnValueOnce(sampleUser);
        const page = renderWithProviders(<AccountPage/>);
        expect(page).toMatchSnapshot();
    })

    it('matches snapshot on no user provided', () => {
        jest.mocked(useUserData).mockReturnValueOnce(null);
        const page = renderWithProviders(<AccountPage/>);
        expect(page).toMatchSnapshot();
    })
})