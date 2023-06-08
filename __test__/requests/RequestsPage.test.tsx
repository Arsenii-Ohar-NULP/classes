import * as React from 'react';

import {
  renderWithProviders,
} from '__test__/testUtils';
import RequestsPage from 'pages/requests/[id]';
import { getJoinRequests } from 'pages/class/ClassService';
import { getRequestsWithClassId } from '__test__/data/requests';
import { screen, waitFor } from '@testing-library/react';
import { MockRequestCard } from './MockRequestCard';
import RequestCard from 'pages/requests/RequestCard';

const pushMock = jest.fn();
const CLASS_ID = 1;

jest.mock('next/router', () => ({
  useRouter: () => ({
    push: pushMock,
    query: { id: CLASS_ID },
  }),
}));
jest.mock('pages/requests/RequestCard');
jest.mock('pages/class/ClassService', () => ({
    getJoinRequests: jest.fn()
}));

describe('requests page', () => {
  jest.mocked(RequestCard).mockImplementationOnce(MockRequestCard);


  it('should show requests', async () => {
    const requests = getRequestsWithClassId(CLASS_ID, 10);
    jest.mocked(getJoinRequests).mockResolvedValue(requests);
    renderWithProviders(<RequestsPage/>);

    await waitFor(() => {
      expect(jest.mocked(getJoinRequests)).toHaveBeenCalled();
      for (const request of requests) {
        screen.findByText(`${request.userId}-${request.classId}`);
      }
    });
  });

  it('should show message, when there are no requests', async () => {
    const requests = [];
    jest.mocked(getJoinRequests).mockResolvedValue(requests);
    renderWithProviders(<RequestsPage />);

    await waitFor(() => {
      expect(jest.mocked(getJoinRequests)).toHaveBeenCalled();
      screen.findByTestId('no-join-requests');
    });
  });

});
