import * as React from 'react';

import {renderWithProviders} from '__test__/testUtils';
import AddClassPage from 'app/main/addClass/page';
import {sampleUser} from '__test__/data/user';
import {AuthStatus} from 'components/redux/auth';
import {fireEvent, screen, waitFor} from '@testing-library/react';
import {createClass, uploadThumbnail} from 'components/class/ClassService';
import InvalidCredentials from 'components/errors/InvalidCredentials';
import {useLogout} from 'components/login/AuthService';


const pushMock = jest.fn();
jest.mock('next/navigation', () => ({
    useRouter: () => ({
        push: pushMock,
        replace: pushMock
    })
}))

jest.mock('components/class/ClassService')
jest.mock('components/login/AuthService')

describe('add class page', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    })

    it('should match a snapshot', () => {
        const page = renderWithProviders(<AddClassPage/>, {
            preloadedState: {
                auth: {
                    status: AuthStatus.LOGGED_IN_FETCHED,
                    user: sampleUser
                },
                classes: {
                    userClasses: [],
                    joinRequests: []
                },
                search: {
                    students: null,
                    classes: null
                }
            }
        })

        expect(page).toMatchSnapshot();
    })

    it('should create class and upload a thumbnail, when user typed in valid data', async () => {
        const user = sampleUser;
        const testFile = new File(['hello'], 'hello.png', {type: 'image/png'})
        jest.mocked(createClass).mockResolvedValueOnce({id: 1, msg: 'success'})
        renderWithProviders(<AddClassPage/>, {
            preloadedState: {
                auth: {
                    status: AuthStatus.LOGGED_IN_FETCHED,
                    user
                },
                classes: {
                    userClasses: [],
                    joinRequests: []
                },
                search: {
                    students: null,
                    classes: null
                }
            }
        })
        const titleInput = screen.getByPlaceholderText('Enter a title');
        fireEvent.change(titleInput, {target: {value: 'React.js in a year'}})

        const descriptionInput = screen.getByPlaceholderText('Enter a description');
        fireEvent.change(descriptionInput, {target: {value: 'Here you can learn React.js in a year'}});

        const fileInput = screen.getByTestId('file-input');
        fireEvent.change(fileInput, {target: {files: [testFile]}});

        const createButton = screen.getByText('Add');
        fireEvent.click(createButton);

        await waitFor(() => {
            expect(jest.mocked(createClass)).toHaveBeenCalled();
            expect(jest.mocked(uploadThumbnail)).toHaveBeenCalled();
        })
    })

    it('should logout a user, when one of API requests returns 401', async () => {
        const user = sampleUser;
        const testFile = new File(['hello'], 'hello.png', {type: 'image/png'})
        const mockedLogout = jest.fn();
        jest.mocked(createClass).mockRejectedValueOnce(new InvalidCredentials('You should be logged in to do this'))
        jest.mocked(useLogout).mockReturnValue(mockedLogout);
        renderWithProviders(<AddClassPage/>, {
            preloadedState: {
                auth: {
                    status: AuthStatus.LOGGED_IN_FETCHED,
                    user
                },
                classes: {
                    userClasses: [],
                    joinRequests: []
                },
                search: {
                    students: null,
                    classes: null
                }
            }
        })
        const titleInput = screen.getByPlaceholderText('Enter a title');
        fireEvent.change(titleInput, {target: {value: 'React.js in a year'}})

        const descriptionInput = screen.getByPlaceholderText('Enter a description');
        fireEvent.change(descriptionInput, {target: {value: 'Here you can learn React.js in a year'}});

        const fileInput = screen.getByTestId('file-input');
        fireEvent.change(fileInput, {target: {files: [testFile]}});

        const createButton = screen.getByText('Add');
        fireEvent.click(createButton);

        await waitFor(() => {
            expect(jest.mocked(createClass)).toHaveBeenCalled();
            expect(jest.mocked(uploadThumbnail)).not.toHaveBeenCalled();
            expect(mockedLogout).toHaveBeenCalled();
        })

    })
})