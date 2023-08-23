import React from 'react';
import {fireEvent, screen, waitFor} from '@testing-library/react';

import LoginPage from 'app/auth/login/page';
import {renderWithProviders} from '../testUtils';
import {LocalStorageMock} from '__test__/LocalStorageMock';
import {saveToken} from 'components/login/AuthService';
import {sampleUser} from '__test__/data/user';
import {useRouter} from 'next/navigation';
import {getAccessToken} from "components/account/TokenService";
import {server} from "../api/server";
import {CLASSES_API_URL} from "components/redux/utils";
import {rest} from "msw";

jest.mock('components/account/TokenService')
jest.mock('components/login/AuthService', () => ({
    useLogout: () => jest.fn(),
    saveToken: jest.fn(),

}))
const mockNavigate = jest.fn();
jest.mock('next/navigation', () => ({
    useRouter: () => ({
        replace: mockNavigate,
        push: mockNavigate
    })
}));

Object.defineProperty(window, 'localStorage', {
    value: new LocalStorageMock(),
});


describe('Login Page', () => {
    beforeEach(() => {
        window.localStorage.clear();
        jest.clearAllMocks();
    });

    const fillUsername = (username: string) => {
        const usernameInput = screen.getByTestId('Username');
        fireEvent.change(usernameInput, {target: {value: username}});
    };

    const fillPassword = (password: string) => {
        const passwordInput = screen.getByTestId('Password');
        fireEvent.change(passwordInput, {target: {value: password}});
    };

    const fillUpForm = () => {
        const sampleUsername = 'senirohar';
        const samplePassword = 'qwerty1234';

        fillUsername(sampleUsername);
        fillPassword(samplePassword);
    };

    const mockValidUser = (token: string) => {
        const user = sampleUser;
        server.use(rest.post(`${CLASSES_API_URL}/user/login`, (req, res, ctx) => {
            return res(ctx.status(200), ctx.json({access_token: token}))
        }), rest.get(`${CLASSES_API_URL}/user`, (req, res, ctx) => {
            return res(ctx.status(200), ctx.json(user))
        }));

        return user;
    }

    it('should match a snapshot', async () => {
        const page = renderWithProviders(<LoginPage/>);
        expect(page.container).toMatchSnapshot();
    });

    it('when token exists, should push to /main/classes', async () => {
        const token = 'Q2312312321311225';
        jest.mocked(getAccessToken).mockImplementationOnce(() => token);
        server.use(rest.get(`${CLASSES_API_URL}/user`, (req, res, ctx) => {
            return res(ctx.status(200), ctx.json(sampleUser));
        }))
        renderWithProviders(<LoginPage/>);
        await waitFor(() => {
            expect(jest.mocked(useRouter().push)).toBeCalledWith('/main/classes');
            expect(jest.mocked(getAccessToken)).toBeCalled();
        });
    });

    it('when signup button is clicked, should push to sign up page', async () => {
        renderWithProviders(<LoginPage/>);

        const signUpButton = screen.getByText('Sign up');
        fireEvent.click(signUpButton);

        await waitFor(() =>
            expect(jest.mocked(useRouter().push)).toBeCalledWith('/auth/signUp')
        );
    });

    it('when validation error occurs, shows fail message', async () => {
        const mockedLogin = jest.fn();
        const sampleUsername = 'hell';
        mockedLogin.mockReturnValueOnce('ABCD123');
        jest.mock('components/login/AuthService', () => ({
            login: mockedLogin,
        }));

        renderWithProviders(<LoginPage/>);
        fillUsername(sampleUsername);
        const login = screen.getByText('Log in');
        fireEvent.click(login);

        await waitFor(() => expect(mockedLogin).not.toBeCalled());
        const error = screen.getByTestId('Username-Error');
        expect(error).toHaveTextContent('');
    });

    it('when backend error, show server error', async () => {
        const errorMessage = "Something stupid happened";
        server.use(rest.post(`${CLASSES_API_URL}/user/login`, (req, res, ctx) => {
            return res(ctx.status(401), ctx.json({msg: errorMessage}));
        }))

        renderWithProviders(<LoginPage/>);
        fillUpForm();
        const loginButton = screen.getByText('Log in');
        fireEvent.click(loginButton);
        await waitFor(() => {
            const error = screen.getByTestId('error');
            expect(error).toBeInTheDocument();
            screen.getByText(errorMessage);
        });
    });

    it('when username set and sign up is clicked, should push to /signUp/?username=', async () => {
        renderWithProviders(<LoginPage/>);
        const usernameInput = screen.getByTestId('Username');
        const username = 'seniorohar';
        fireEvent.change(usernameInput, {target: {value: username}});
        const signUpButton = screen.getByText('Sign up');
        fireEvent.click(signUpButton);

        await waitFor(() =>
            expect(jest.mocked(useRouter().push)).toBeCalledWith(
                `/auth/signUp/?username=${username}`
            )
        );
    });

    it('when rememberMe is unchecked and clicked log in with valid data, should call save token with remember me to false', async () => {
        const tickCheckbox = () => {
            const checkbox = screen.getByTestId('remember-me');
            fireEvent.click(checkbox);
        };
        const token = 'ABCD1234';
        const rememberMe = false;

        mockValidUser(token);

        renderWithProviders(<LoginPage/>);
        fillUpForm();
        tickCheckbox();
        const loginButton = screen.getByText('Log in');
        fireEvent.click(loginButton);
        await waitFor(() => {
            expect(jest.mocked(saveToken)).toBeCalledWith(token, rememberMe);
        });
    });

    it('when tries to log in on valid data, should fetch the access token and no error should occur', async () => {
        const token = 'ABCD1234';
        mockValidUser(token);
        renderWithProviders(<LoginPage/>);
        const usernameInput = screen.getByTestId('Username');
        fireEvent.change(usernameInput, {target: {value: 'seniorohar'}});
        const passwordInput = screen.getByTestId('Password');
        fireEvent.change(passwordInput, {target: {value: 'gjasgjasjg1234'}});
        const loginButton = screen.getByText('Log in');
        fireEvent.click(loginButton);

        await waitFor(() => {
            expect(screen.getByTestId('Username-Error')).toBeEmptyDOMElement();
            expect(screen.getByTestId('Password-Error')).toBeEmptyDOMElement();
            expect(useRouter().replace).toHaveBeenCalledWith("/main/classes");
        });
    });
});
