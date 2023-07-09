import * as React from 'react';

import { sampleUser } from '__test__/data/user'
import { renderWithProviders } from '__test__/testUtils';
import { Role } from 'components/account/User';
import DeleteClassButton from 'components/class/DeleteClassButton';
import { AuthStatus } from 'components/redux/auth';
import { fireEvent, screen, waitFor } from '@testing-library/react';

describe('delete class button', () => {
    it('should return nothing, when user is a student', async () => {
        const user = { ...sampleUser};
        user.role = Role.Student;

        const page = renderWithProviders(<DeleteClassButton onDelete={jest.fn()}/>, {preloadedState: {
            auth: {
                status: AuthStatus.LOGGED_IN_FETCHED, 
                user
            },
            classes: {
                userClasses: [],
                joinRequests: []
            }
        }})

        const button = screen.queryAllByRole('button');
        expect(button).toStrictEqual([]);
    })

    it('should call onDelete, when clicked',async () => {
        const user = { ...sampleUser};
        const callback = jest.fn();
         renderWithProviders(<DeleteClassButton onDelete={callback}/>, {preloadedState: {
            auth: {
                status: AuthStatus.LOGGED_IN_FETCHED, 
                user
            },
            classes: {
                userClasses: [],
                joinRequests: []
            }
        }})

        const button = screen.getByRole('button');
        fireEvent.click(button);

        await waitFor(() => {
            expect(callback).toHaveBeenCalled();
        })
    })
})