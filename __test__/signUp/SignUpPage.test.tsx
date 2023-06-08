import * as React from 'react';

import { renderWithProviders } from '__test__/testUtils';
import SignUp from 'pages/signUp';

const pushMock = jest.fn();
jest.mock('next/router', () => (
    {
    useRouter: () => ({
        pathname: '/',
        push: pushMock,
        query: { username: 'arseniiohar' },
      }),
    }
));
describe('sign up page', () => {
    it('should match a snapshot', () => {
        const page = renderWithProviders(<SignUp/>);   
        expect(page).toMatchSnapshot();
    })


})