import * as React from 'react';

import {renderWithProviders} from '__test__/testUtils';
import RequestCard from 'components/requests/RequestCard';
import {sampleUser} from '__test__/data/user';
import {screen, waitFor} from '@testing-library/react';
import {server} from "../api/server";
import {rest} from "msw";
import {CLASSES_API_URL} from "components/redux/utils";

jest.mock('components/account/UserService');
const logoutMock = jest.fn();
jest.mock('components/login/AuthService', () => ({
    useLogout: () => logoutMock
}));
jest.mock('next/navigation', () => ({
    useRouter: () => ({
        push: jest.fn((url) => console.log(url)),
    }),
}));
window.alert = (msg: string) => console.log(msg);


describe('request card', () => {
    it('should show user fullname', async () => {
        const mockUser = sampleUser;
        server.use(rest.get(`${CLASSES_API_URL}/user/${mockUser.id}`, (req, res, ctx) =>
            res(ctx.json(mockUser), ctx.status(200))
        ))
        const userId = 1;
        const classId = 1;
        renderWithProviders(
            <RequestCard request={{userId, classId}}/>
        );

        await waitFor(() => {
            screen.findByText(`${mockUser.firstName} ${mockUser.lastName}`);
        });
    });

    it('should logout when user has not enough rights or token is expired', async () => {
        const request = {userId: 1, classId: 1};
        server.use(rest.get(`${CLASSES_API_URL}/user/${request.userId}`, (req, res, ctx) =>
            res(ctx.json({msg: "Not enough rights to get user info"}), ctx.status(403))
        ))

        renderWithProviders(
            <RequestCard request={request}/>
        );

        await waitFor(() => {
            expect(jest.mocked(logoutMock)).toHaveBeenCalled();
        });
    });
});
