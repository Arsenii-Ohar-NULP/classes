import React from 'react';
import { sampleFiveClasses } from '__test__/data/classes';
import { sampleUser } from '__test__/data/user';
import { renderWithProviders } from '__test__/testUtils';
import { findClass } from 'pages/class/ClassService';
import ClassPage from 'pages/class/[id]';
import { AuthStatus } from 'pages/redux/auth';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import { useRouter } from 'next/router';
import { act } from 'react-dom/test-utils';

jest.mock('pages/classes/ClassThumbnail');
jest.mock('pages/utils/hooks');
jest.mock('pages/class/MessagesBar');
jest.mock('pages/class/DeleteClassButton');
jest.mock('pages/class/ClassService');

const pushMock = jest.fn((url) => console.log(url));
jest.mock('next/router', () => ({
  useRouter: () => ({
    pathname: '/',
    push: pushMock,
    query: { id: '1' },
  }),
}));

describe('class page test', () => {
  it('should match a snapshot and show class info', async () => {
    const cls = sampleFiveClasses[0];
    jest.mocked(findClass).mockResolvedValueOnce(cls);
    const page = renderWithProviders(<ClassPage />, {
      preloadedState: {
        auth: { status: AuthStatus.LOGGED_IN, user: sampleUser },
        classes: {
          userClasses: sampleFiveClasses,
          joinRequests: [{ classId: cls.id, userId: 2 }],
        },
      },
    });
    await waitFor(() => {
      expect(page).toMatchSnapshot();
      screen.findByText(cls.description);
      screen.findByText(cls.title);
    });
  });

  it('should navigate to /requests, when a user is a teacher and requests button has been clicked', async () => {
    const cls = sampleFiveClasses[0];
    jest.mocked(findClass).mockResolvedValueOnce(cls);
    await act(() => {
      renderWithProviders(<ClassPage />, {
        preloadedState: {
          auth: { status: AuthStatus.LOGGED_IN, user: sampleUser },
          classes: { userClasses: sampleFiveClasses, joinRequests: [] },
        },
      });
    });
    act(() => {
      const requestsButton = screen.getByRole('button', {
        name: 'Requests',
      });
      fireEvent.click(requestsButton);
    })
    
    await waitFor(() => {
      expect(useRouter().push).toHaveBeenCalledWith(`/requests/${cls.id}`);
    });
  });
});
