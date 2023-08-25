import {renderWithProviders} from '__test__/testUtils';
import React from 'react';
import RecommendedClasses from 'components/classes/RecommendedClasses';
import {ClassUI} from 'components/classes/ClassUI';
import {screen, waitFor} from '@testing-library/react';
import {sampleFiveClasses} from '__test__/data/classes';
import ClassMock from './ClassMock';
import {server} from "../api/server";
import {rest} from "msw";
import {CLASSES_API_URL} from "components/redux/utils";
import Class from "components/classes/Class";
import {sampleUser} from "../data/user";
import {AuthStatus} from "components/redux/auth";

jest.mock('components/class/ClassService');
jest.mock('components/classes/ClassUI');

describe('recommended classes tests', () => {
    const mockAllClasses = (classes: Class[]) => {
        server.use(rest.get(`${CLASSES_API_URL}/class`, (req, res, ctx) =>
            res(ctx.json(classes), ctx.status(200))
        ));
    }

    const mockUserClasses = (classes: Class[], userId: number) => {
        server.use(rest.get(`${CLASSES_API_URL}/classes/${userId}`, (req, res, ctx) =>
            res(ctx.status(200), ctx.json([]))
        ))
    }
    it('when findAllClasses returns 5 classes, render 5 classes', () => {
        const classes = [...sampleFiveClasses];
        mockAllClasses(classes);

        jest.mocked(ClassUI).mockImplementationOnce(ClassMock);
        renderWithProviders(<RecommendedClasses/>);
        for (const cls of classes) {
            screen.findByText(cls.title);
        }
    });

    it("when findAllClasses returns 0 classes, don't render any", async () => {
        const classes = [];
        const user = sampleUser;
        mockAllClasses(classes);
        mockUserClasses([], user.id);

        jest.mocked(ClassUI).mockImplementationOnce(ClassMock);
        renderWithProviders(<RecommendedClasses/>, {
            preloadedState: {
                auth: {user: sampleUser, status: AuthStatus.LOGGED_IN_FETCHED}
            }
        });
        await waitFor(() =>
            expect(screen.queryByTestId('recommended-classes-empty')).toBeInTheDocument()
        );
    });
});
