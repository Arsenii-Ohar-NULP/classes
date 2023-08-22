import * as React from 'react';

import {
    renderWithProviders,
} from '__test__/testUtils';
import RequestsPage from 'app/main/classes/requests/[id]/page';
import {getJoinRequests} from 'components/class/ClassService';
import {getRequestsWithClassId} from '__test__/data/requests';
import {screen, waitFor} from '@testing-library/react';
import {MockRequestCard} from './MockRequestCard';
import RequestCard from 'components/requests/RequestCard';
import {server} from "../api/server";
import {rest} from "msw";
import {CLASSES_API_URL} from "../../components/redux/utils";
import {sampleUser} from "../data/user";
import {AuthStatus} from "../../components/redux/auth";

const navigateMock = jest.fn();
const CLASS_ID = 1;


jest.mock('next/navigation', () => ({
    useRouter: () => ({
        push: navigateMock,
        replace: navigateMock,
    }),
}));
jest.mock('components/requests/RequestCard');
jest.mock('components/class/ClassService', () => ({
    getJoinRequests: jest.fn()
}));

describe('requests page', () => {
        jest.mocked(RequestCard).mockImplementation(MockRequestCard);
    it('should show requests', async () => {
        const requests = getRequestsWithClassId(CLASS_ID, 10);
        server.use(rest.get(`${CLASSES_API_URL}/class/requests/${CLASS_ID}`, (req, res, ctx) =>
            res(ctx.status(200), ctx.json(requests.map((request) => ({
                class_id: request.classId,
                user_id: request.userId
            }))))
        ))
        renderWithProviders(<RequestsPage params={{id: CLASS_ID.toString()}}/>, {
            preloadedState: {
                auth: {user: sampleUser, status: AuthStatus.LOGGED_IN_FETCHED}
            }
        });

        await waitFor(() => {
            for (const request of requests) {
                screen.getByText(`${request.userId}-${request.classId}`);
            }
        });
    });

    it('should show message, when there are no requests', async () => {
        const requests = [];
        server.use(rest.get(`${CLASSES_API_URL}/class/requests/${CLASS_ID}`, (req, res, ctx) =>
            res(ctx.status(200), ctx.json(requests))
        ))
        renderWithProviders(<RequestsPage params={{id: CLASS_ID.toString()}}/>, {
            preloadedState: {
                auth: {user: sampleUser, status: AuthStatus.LOGGED_IN_FETCHED}
            }
        });

        await waitFor(() => {
            screen.getByTestId('no-join-requests');
        });
    });
});
