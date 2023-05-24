import React from 'react';
import { sampleFiveClasses } from '__test__/data/classes';
import { sampleUser } from '__test__/data/user';
import { renderWithProviders } from '__test__/testUtils';
import { findClass } from 'pages/class/ClassService';
import ClassPage from 'pages/class/[id]';
import { AuthStatus } from 'pages/redux/auth';
import { waitFor } from '@testing-library/react';

jest.mock('pages/classes/ClassThumbnail');
jest.mock('pages/utils/hooks');
jest.mock('pages/class/MessagesBar');
jest.mock('pages/class/RequestsButton');
jest.mock('pages/class/DeleteClassButton');
jest.mock('pages/class/ClassService');

jest.mock('next/router', () => ({
  useRouter: () => ({
    pathname: '/',
    push: jest.fn((url) => console.log(url)),
    query: { id: '1' },
  }),
}));

describe('class page test', () => {
  it('should match a snapshot', async () => {
    jest.mocked(findClass).mockResolvedValueOnce(sampleFiveClasses[0]);
    const page = renderWithProviders(<ClassPage />, {
      preloadedState: {
        auth: { status: AuthStatus.LOGGED_IN, user: sampleUser },
        classes: { userClasses: sampleFiveClasses, joinRequests: [] },
      },
    });
    await waitFor(() => expect(page).toMatchSnapshot());
  });
});
