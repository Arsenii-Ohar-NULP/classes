import React from 'react'
import { renderWithProviders } from '__test__/testUtils'
import EditAccountForm from 'pages/account/edit/EditAccountForm';
jest.mock('pages/login/AuthService');
jest.mock('pages/account/UserService');
jest.mock('next/router', () => ({ useRouter: jest.fn() }));

describe('edit account form', () => {
    it('should match a snapshot', () => {
        const page = renderWithProviders(<EditAccountForm/>);
        expect(page).toMatchSnapshot();
    })
})