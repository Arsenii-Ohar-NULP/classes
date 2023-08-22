import * as React from 'react';

import {fireEvent, screen, waitFor} from '@testing-library/react';
import {sampleUser} from '__test__/data/user';
import {renderWithProviders} from '__test__/testUtils';
import EditAccountForm from 'components/account/edit/EditAccountForm';
import {logout} from 'components/login/AuthService';
import {server} from "../../api/server";
import {rest} from "msw";
import {CLASSES_API_URL} from "components/redux/utils";
import {AuthStatus} from "components/redux/auth";
import {useRouter} from "next/navigation";

jest.mock('components/login/AuthService');
jest.mock('components/account/UserService');

const navigateMock = jest.fn();
jest.mock('next/navigation', () => ({
    useRouter: () => ({
        push: navigateMock,
        replace: navigateMock
    }),
}));

window.alert = jest.fn();

describe('edit account form', () => {
    it('should match a snapshot', () => {
        const page = renderWithProviders(<EditAccountForm/>);
        expect(page.container).toMatchSnapshot();
    })
    it(
        'should send PATCH request to edit data, ' +
        'when some data has been changed and a save button has been clicked',
        async () => {
            server.use(rest.patch(`${CLASSES_API_URL}/user`,
                (req, res, ctx) =>
                    res(ctx.status(200))
            ))
            renderWithProviders(<EditAccountForm/>, {
                preloadedState: {
                    auth: {user: sampleUser, status: AuthStatus.LOGGED_IN_FETCHED},
                }
            });
            const emailInput = screen.getByTestId('Email');
            fireEvent.change(emailInput, {
                target: {value: 'senka666228@gmail.com'},
            });

            const saveButton = screen.getByText('Save');
            fireEvent.click(saveButton);

            await waitFor(() => {
                expect(jest.mocked(useRouter().replace)).toHaveBeenCalledWith("/main/account");
            });
        }
    );

    it('should logout a user, when PATCH request gives 401', async () => {
        server.use(rest.patch(`${CLASSES_API_URL}/user`, (req, res, ctx) =>
            res(ctx.status(401))
        ))
        renderWithProviders(<EditAccountForm/>, {
            preloadedState: {
                auth: {user: sampleUser},
            } as any,
        });
        const emailInput = screen.getByTestId('Email');
        fireEvent.change(emailInput, {
            target: {value: 'senka666228@gmail.com'},
        });

        const saveButton = screen.getByText('Save');
        console.log(fireEvent.click(saveButton));

        await waitFor(() => {
            expect(jest.mocked(logout)).toHaveBeenCalled();
        });
    });
});

