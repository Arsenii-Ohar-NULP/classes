import React from 'react';
import { sampleFiveClasses } from '__test__/data/classes';
import { sampleUser } from '__test__/data/user';
import { renderWithProviders } from '__test__/testUtils';
import UserClasses from 'components/classes/UserClasses';
import { AuthStatus } from 'components/redux/auth';
import { ClassUI } from 'components/classes/ClassUI';
import ClassMock from './ClassMock';
import { screen } from '@testing-library/react';
import { RootState, useAppSelector } from 'components/redux/store';

jest.mock('components/classes/ClassUI');
jest.mock('components/redux/store');
describe('classes page - user classes section test', () => {
  it('when fetch returns 5 user classes, should render 5 user classes', () => {
    jest.mocked(ClassUI).mockImplementationOnce(ClassMock);
    const state: RootState = {
      auth: {
        status: AuthStatus.LOGGED_IN_FETCHED,
        user: sampleUser,
      },
      classes: {
        userClasses: sampleFiveClasses,
        joinRequests: [],
      },
      search: {
        students: null,
        classes: null
      }
    };
    jest
      .mocked(useAppSelector)
      .mockImplementationOnce((func: (state: RootState) => unknown) => func(state));
    renderWithProviders(<UserClasses />);

    for (const cls of sampleFiveClasses) {
      screen.findByTestId(`class-${cls.id}`);
    }
  });

  it('when fetch returns 0 user classes, should return empty fragment', () => {
    const state = {
      auth: {
        status: AuthStatus.LOGGED_IN_FETCHED,
        user: sampleUser,
      },
      classes: {
        userClasses: [],
        joinRequests: [],
      },
      search: {
        students: null,
        classes: null
      }
    };
    jest
      .mocked(useAppSelector)
      .mockImplementationOnce((func: (state: RootState) => unknown) => func(state));

    renderWithProviders(<UserClasses />);

    expect(screen.queryByTestId('user-classes')).not.toBeInTheDocument();
  });
});
