import * as React from 'react';

import DeleteMessageButtonModal from 'pages/class/DeleteMessageButtonModal';
import { renderWithProviders } from '__test__/testUtils';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import { removeMessage } from 'pages/class/MessageService';
import { logout } from 'pages/login/AuthService';
import InvalidCredentials from 'pages/errors/InvalidCredentials';

jest.mock('pages/class/MessageService')
jest.mock('pages/login/AuthService')
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

  it('should call onDelete, when clicked', async () => {
    const onDelete = jest.fn();
    jest.mocked(removeMessage).mockResolvedValue({msg: 'Good'})
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
      expect(removeMessage).toHaveBeenCalled();
      expect(onDelete).toHaveBeenCalled();
    })
  })

  it('should call logout, when removeMessage throws 401', async () => {
    const onDelete = jest.fn();
    jest.mocked(removeMessage).mockRejectedValue(new InvalidCredentials('You should be logged in'));
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
      expect(removeMessage).toHaveBeenCalled();
      expect(logout).toHaveBeenCalled();      
    })
  })
});
