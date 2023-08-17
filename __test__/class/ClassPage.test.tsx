import React from 'react';
import {sampleFiveClasses} from '__test__/data/classes';
import {sampleUser} from '__test__/data/user';
import {renderWithProviders} from '__test__/testUtils';
import {findClass} from 'components/class/ClassService';
import ClassPage from 'app/main/classes/[id]/page';
import {AuthStatus} from 'components/redux/auth';
import {fireEvent, screen, waitFor} from '@testing-library/react';
import {useRouter} from 'next/navigation';

jest.mock('components/classes/ClassThumbnail');
jest.mock('components/utils/hooks');
jest.mock('components/class/MessagesBar');
jest.mock('components/class/DeleteClassButton');
jest.mock('components/class/ClassService');
jest.mock('components/utils/socket')

const pushMock = jest.fn((url) => console.log(url));
jest.mock('next/navigation', () => ({
    useRouter: () => ({
        pathname: '/',
        push: pushMock,
        replace: pushMock,
        query: {id: '1'},
    }),
}));

describe('class page test', () => {
    it('should match a snapshot and show class info', async () => {
        const cls = sampleFiveClasses[0];
        jest.mocked(findClass).mockResolvedValueOnce(cls);
        const page = renderWithProviders(<ClassPage params={{id: '1'}}/>, {
            preloadedState: {
                auth: {status: AuthStatus.LOGGED_IN, user: sampleUser},
                classes: {
                    userClasses: sampleFiveClasses,
                    joinRequests: [{classId: cls.id, userId: 2}],
                },
                search: {classes: null, students: null},
            },
        });
        await waitFor(() => {
            expect(page.container).toMatchSnapshot();
            screen.findByText(cls.description);
            screen.findByText(cls.title);
        });
    });

    it('should navigate to /requests, when a user is a teacher and requests button has been clicked', async () => {
        const cls = sampleFiveClasses[0];
        jest.mocked(findClass).mockResolvedValueOnce(cls);
        renderWithProviders(<ClassPage params={{id: '1'}}/>, {
            preloadedState: {
                auth: {status: AuthStatus.LOGGED_IN_FETCHED, user: sampleUser},
                classes: {userClasses: sampleFiveClasses, joinRequests: []},
                search: {classes: null, students: null},
            },
        });
        await waitFor(() => {
            const requestsButton = screen.getByRole('button', {
                name: 'Requests',
            });
            fireEvent.click(requestsButton);
        })

        await waitFor(() => {
            expect(useRouter().replace).toHaveBeenCalledWith(`/main/classes/requests/${cls.id}`);
        });
    });
});
