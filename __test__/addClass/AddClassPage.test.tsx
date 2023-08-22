import * as React from 'react';

import {renderWithProviders} from '__test__/testUtils';
import AddClassPage from 'app/main/classes/addClass/page';
import {sampleUser} from '__test__/data/user';
import {AuthStatus} from 'components/redux/auth';
import {fireEvent, screen, waitFor} from '@testing-library/react';
import {useLogout} from 'components/login/AuthService';
import {server} from "../api/server";
import {rest} from "msw";
import {CLASSES_API_URL} from "../../components/redux/utils";
import {useRouter} from "next/navigation";


const pushMock = jest.fn();
jest.mock('next/navigation', () => ({
    useRouter: () => ({
        push: pushMock,
        replace: pushMock
    })
}))

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

        expect(page.container).toMatchSnapshot();
    })

    it('should navigate to the main page, when user typed in valid data and clicked the button', async () => {
        server.use(rest.post(`${CLASSES_API_URL}/class`, (req, res, clx) =>
            res(clx.status(200), clx.json(200))
        ))
        server.use(rest.post(`${CLASSES_API_URL}/class/img`, (req, res, ctx) =>
            res(ctx.status(201))
        ))
        const user = sampleUser;
        const testFile = new File(['hello'], 'hello.png', {type: 'image/png'})
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
            expect(useRouter().replace).toHaveBeenCalledWith("/main/classes");
        })
    })

    it('should logout a user, when one of the API requests returns 401', async () => {
        server.use(rest.post(`${CLASSES_API_URL}/class`, (req, res, clx) =>
            res(clx.status(401))
        ))
        const user = sampleUser;
        const testFile = new File(['hello'], 'hello.png', {type: 'image/png'})
        const mockedLogout = jest.fn();
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
            expect(mockedLogout).toHaveBeenCalled();
        })

    })
})