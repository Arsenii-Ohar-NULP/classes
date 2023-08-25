import * as React from 'react';

import {renderWithProviders} from '__test__/testUtils';
import SignUp from 'app/auth/signUp/page';

const navigateMock = jest.fn();
jest.mock('next/navigation', () => (
    {
        useRouter: () => ({
            push: navigateMock,
            replace: navigateMock
        }),
        useSearchParams: () => ({
            username: "arseniiohar"
        })
    }
));
describe('sign up page', () => {
    it('should match a snapshot', () => {
        const page = renderWithProviders(<SignUp/>);
        expect(page.container).toMatchSnapshot();
    })
})