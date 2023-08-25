import React from 'react';
import { renderWithProviders } from '__test__/testUtils';
import { MessagesBar } from 'components/class/messages/MessagesBar';
import { waitFor } from '@testing-library/react';
import { sampleFiveClasses } from '__test__/data/classes';
import { useRouter } from 'next/navigation';
import {rest} from "msw";
import {CLASSES_API_URL} from "../../components/redux/utils";
import {server} from "__test__/api/server";
import Message from "components/class/messages/Message";
import Class from "components/classes/Class";

const navigateMock = jest.fn((url) => console.log(url))
jest.mock('next/navigation', () => ({
    useRouter: () => ({
      push: navigateMock,
      replace: navigateMock
    }),
  }));
jest.mock('components/utils/socket')

describe('MessagesBar', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  type MockMessagesInfo = {messages: Message[], status: number, cls: Class};
  function mockMessages({messages, status, cls}: MockMessagesInfo) {
    server.use(rest.get(`${CLASSES_API_URL}/class/messages/${cls.id}`, (req, res, ctx) =>
      res(ctx.status(status), ctx.json(messages))
    ))
  }



  it('should render messages if there are any', async () => {
    const cls = sampleFiveClasses[0];
    const messages: Message[] = [
      { id: 1, content: 'Hello', user: 1, cls: 1 },
      { id: 2, content: 'World', user: 2, cls: 1 },
    ];

    mockMessages({messages, status: 200, cls});
    const onForbidden = jest.fn();
    const { getByText } = renderWithProviders(
      <MessagesBar cls={cls} onForbidden={onForbidden} />
    );

    await waitFor(() => {
      expect(getByText('Hello')).toBeInTheDocument();
      expect(getByText('World')).toBeInTheDocument();
    });
  });

  it('should render a message when there are no messages', async () => {
    const cls = sampleFiveClasses[0];
    const messages = [];

    mockMessages({messages, status: 200, cls});
    const onForbidden = jest.fn();
    const { getByText } = renderWithProviders(
      <MessagesBar cls={cls} onForbidden={onForbidden} />,
    );

    await waitFor(() => {
      expect(
        getByText('There are no messages in this class. Be the first one to text something.')
      ).toBeInTheDocument();
    });
  });

  it('should handle Invalid Credentials error', async () => {
    const cls = sampleFiveClasses[0];

    mockMessages({messages: null, status: 401, cls});

    const onForbidden = jest.fn();
    renderWithProviders(
      <MessagesBar cls={cls} onForbidden={onForbidden} />,
    );

    await waitFor(() => {
      expect(useRouter().push).toHaveBeenCalled();
    });
  });

  it('should handle Forbidden error', async () => {
    const cls = sampleFiveClasses[0];

    mockMessages({messages: null, status: 403, cls});

    const onForbiddenMock = jest.fn();

    const { getByText } = renderWithProviders(
      <MessagesBar cls={cls} onForbidden={onForbiddenMock} />,
    );

    await waitFor(() => {
      expect(getByText('You have to join this class to access messages.')).toBeInTheDocument();
      expect(onForbiddenMock).toHaveBeenCalled();
    });
  });
});
