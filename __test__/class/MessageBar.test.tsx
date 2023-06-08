import React from 'react';
import { renderWithProviders } from '__test__/testUtils';
import { MessagesBar } from 'pages/class/MessagesBar';
import { getMessages } from 'pages/class/MessageService';
import InvalidCredentials from 'pages/errors/InvalidCredentials';
import Forbidden from 'pages/errors/Forbidden';
import { waitFor } from '@testing-library/react';
import { sampleFiveClasses } from '__test__/data/classes';
import { useRouter } from 'next/router';

jest.mock('pages/class/MessageService');
const pushMock = jest.fn((url) => console.log(url))
jest.mock('next/router', () => ({
    useRouter: () => ({
      push: pushMock,
    }),
  }));

describe('MessagesBar', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should render messages if there are any', async () => {
    const cls = sampleFiveClasses[0];
    const messages = [
      { id: 1, content: 'Hello', user: 1, cls: 1 },
      { id: 2, content: 'World', user: 2, cls: 1 },
    ];

    jest.mocked(getMessages).mockResolvedValue(messages);
    const onForbidden = jest.fn();
    const { getByText } = renderWithProviders(
      <MessagesBar cls={cls} onForbidden={onForbidden} />
    );

    await waitFor(() => {
      expect(getMessages).toHaveBeenCalled();
      expect(getByText('Hello')).toBeInTheDocument();
      expect(getByText('World')).toBeInTheDocument();
    });
  });

  it('should render a message when there are no messages', async () => {
    const cls = sampleFiveClasses[0];
    const messages = [];

    jest.mocked(getMessages).mockResolvedValue(messages);
    const onForbidden = jest.fn();
    const { getByText } = renderWithProviders(
      <MessagesBar cls={cls} onForbidden={onForbidden} />,
    );

    await waitFor(() => {
      expect(getMessages).toHaveBeenCalled();
      expect(
        getByText('There are no messages in this class. Be the first one to text something.')
      ).toBeInTheDocument();
    });
  });

  it('should handle InvalidCredentials error', async () => {
    const cls = sampleFiveClasses[0];
    const error = new InvalidCredentials('Wow');

    jest.mocked(getMessages).mockRejectedValue(error);
    const onForbidden = jest.fn();
    renderWithProviders(
      <MessagesBar cls={cls} onForbidden={onForbidden} />,
    );

    await waitFor(() => {
      expect(getMessages).toHaveBeenCalled();
      expect(useRouter().push).toHaveBeenCalled();
    });
  });

  it('should handle Forbidden error', async () => {
    const cls = sampleFiveClasses[0];
    const error = new Forbidden('Okay');

    jest.mocked(getMessages).mockRejectedValue(error);

    const onForbiddenMock = jest.fn();

    const { getByText } = renderWithProviders(
      <MessagesBar cls={cls} onForbidden={onForbiddenMock} />,
    );

    await waitFor(() => {
      expect(getMessages).toHaveBeenCalled();
      expect(getByText('You have to join this class to access messages.')).toBeInTheDocument();
      expect(onForbiddenMock).toHaveBeenCalled();
    });
  });
});
