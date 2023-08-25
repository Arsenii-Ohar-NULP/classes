import * as React from 'react';

import DeleteMessageButtonModal from 'components/class/messages/DeleteMessageButtonModal';
import { renderWithProviders } from '__test__/testUtils';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import { socket } from 'components/utils/socket';
import { DeleteMessageStatus } from 'components/class/messages/DeleteMessageStatus';
import {useLogout} from "../../components/login/AuthService";

const logoutMock = jest.fn();
jest.mock('components/login/AuthService', () => ({
  useLogout: () => logoutMock
}))
jest.mock('components/utils/socket', () => ({
  socket: ({
    emitWithAck: jest.fn()
  })
}))

const navigateMock = jest.fn((url) => console.log(url));
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    pathname: '/',
    push: navigateMock,
    replace: navigateMock
  }),
}));

describe('delete message button modal', () => {
  it('should match a snapshot', () => {
    const page = renderWithProviders(
      <DeleteMessageButtonModal
        messageId={1}
        onDelete={jest.fn()}
        show={true}
        close={jest.fn()}
      />
    );
    expect(page.container).toMatchSnapshot();
  });

  it('should call onDelete, when delete button is clicked', async () => {
    const onDelete = jest.fn();
    const close =  jest.fn();
    jest.mocked(socket.emitWithAck).mockResolvedValueOnce({status: DeleteMessageStatus.OK });
    renderWithProviders(
      <DeleteMessageButtonModal
        messageId={1}
        onDelete={onDelete}
        show={true}
        close={close}
      />
    );

    const button = await screen.findByRole('button', {name: 'Delete'});
    fireEvent.click(button);

    await waitFor(() => {
      expect(jest.mocked(socket.emitWithAck)).toHaveBeenCalled();
      expect(onDelete).toHaveBeenCalled();
      expect(close).toHaveBeenCalled();
    })
  })

  it('should call logout, when delete button is clicked and invalid credentials is received', async () => {
    const onDelete = jest.fn();
    jest.mocked(socket.emitWithAck).mockResolvedValue({status: DeleteMessageStatus.FAILED});
    renderWithProviders(
      <DeleteMessageButtonModal
        messageId={1}
        onDelete={onDelete}
        show={true}
        close={jest.fn()}
      />
    );

    const button = await screen.findByRole('button', {name: 'Delete'});
    fireEvent.click(button);

    await waitFor(() => {
      expect(logoutMock).toHaveBeenCalled();
    })
  })
});
