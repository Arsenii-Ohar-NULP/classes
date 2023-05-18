import React from 'react';
import { sampleFiveClasses } from '__test__/data/classes';
import { sampleUser } from '__test__/data/user';
import { renderWithProviders } from '__test__/testUtils';
import UserClasses from 'pages/classes/UserClasses';
import { AuthStatus } from 'pages/redux/auth';
import { ClassUI } from 'pages/classes/ClassUI';
import ClassMock from './ClassMock';
import { screen } from '@testing-library/react';
import { RootState, useAppSelector } from 'pages/redux/store';

jest.mock('pages/classes/ClassUI');
jest.mock('pages/redux/store');
describe('classes page - user classes section test', () => {
  it('given 5 user classes, render 5 user classes', () => {
    jest.mocked(ClassUI).mockImplementationOnce(ClassMock);
    const state = {
      auth: {
        status: AuthStatus.LOGGED_IN_FETCHED,
        user: sampleUser,
      },
      classes: {
        userClasses: sampleFiveClasses,
        joinRequests: [],
      },
    };
    jest
      .mocked(useAppSelector)
      .mockImplementationOnce((func: (state: RootState) => unknown) => func(state));
    renderWithProviders(<UserClasses />);

    for (const cls of sampleFiveClasses) {
      screen.findByTestId(`class-${cls.id}`);
    }
  });

  it('given 0 user classes, return empty fragment', () => {
    const state = {
      auth: {
        status: AuthStatus.LOGGED_IN_FETCHED,
        user: sampleUser,
      },
      classes: {
        userClasses: [],
        joinRequests: [],
      },
    };
    jest
      .mocked(useAppSelector)
      .mockImplementationOnce((func: (state: RootState) => unknown) => func(state));

    renderWithProviders(<UserClasses />);

    expect(screen.queryByTestId('user-classes')).not.toBeInTheDocument();
  });
});
