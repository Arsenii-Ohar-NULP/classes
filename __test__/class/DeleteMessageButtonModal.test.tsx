import * as React from 'react';

import DeleteMessageButtonModal from 'components/class/DeleteMessageButtonModal';
import { renderWithProviders } from '__test__/testUtils';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import { removeMessage } from 'components/class/MessageService';
import { socket } from 'components/utils/socket';
import { DeleteMessageStatus } from 'components/class/DeleteMessageStatus';

jest.mock('components/class/MessageService')
jest.mock('components/login/AuthService')
jest.mock('components/utils/socket', () => ({
  socket: ({
    emitWithAck: jest.fn()
  })
}))

const pushMock = jest.fn((url) => console.log(url));
jest.mock('next/router', () => ({
  useRouter: () => ({
    pathname: '/',
    push: pushMock,
    query: { id: '1' },
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
    expect(page).toMatchSnapshot();
  });

  it('should call onDelete, when delete button is clicked', async () => {
    const onDelete = jest.fn();
    const close =  jest.fn();
    jest.mocked(removeMessage).mockResolvedValue({msg: 'Good'})
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

  // it('should call logout, when delete button is clicked and invalid credentials is received', async () => {
  //   const onDelete = jest.fn();
  //   jest.mocked(removeMessage).mockRejectedValue(new InvalidCredentials('You should be logged in'));
  //   jest.mocked(socket.emitWithAck).mockResolvedValue(DeleteMessageStatus.FAILED);
  //   renderWithProviders(
  //     <DeleteMessageButtonModal
  //       messageId={1}
  //       onDelete={onDelete}
  //       show={true}
  //       close={jest.fn()}
  //     />
  //   );

  //   const button = await screen.findByRole('button', {name: 'Delete'});
  //   fireEvent.click(button);

  //   await waitFor(() => {
  //     expect(removeMessage).toHaveBeenCalled();
  //     expect(logout).toHaveBeenCalled();      
  //   })
  // })
});
