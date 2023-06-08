import * as React from 'react';

import { act, fireEvent, screen, waitFor } from '@testing-library/react';
import { sampleUser } from '__test__/data/user';
import { renderWithProviders } from '__test__/testUtils';
import EditAccountForm from 'pages/account/edit/EditAccountForm';
import { editUser } from 'pages/account/UserService';
import InvalidCredentials from 'pages/errors/InvalidCredentials';
import { logout } from 'pages/login/AuthService';

jest.mock('pages/login/AuthService');
jest.mock('pages/account/UserService');
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn((url) => console.log(url)),
  }),
}));

window.alert = jest.fn();

describe('edit account form', () => {
  it(
    'should send PATCH request to edit data, ' +
      'when some data has been changed and a save button has been clicked',
    async () => {
      jest.mocked(editUser).mockResolvedValue(null);
      renderWithProviders(<EditAccountForm />, {
        preloadedState: {
          auth: { user: sampleUser },
        } as any,
      });
      const emailInput = screen.getByTestId('Email');
      fireEvent.change(emailInput, {
        target: { value: 'senka666228@gmail.com' },
      });

      const saveButton = screen.getByText('Save');
      console.log(fireEvent.click(saveButton));

      await waitFor(() => {
        expect(jest.mocked(editUser)).toHaveBeenCalled();
      });
    }
  );

  it('should logout a user, when PATCH request gives 401', async () => {
    jest
      .mocked(editUser)
      .mockRejectedValue(new InvalidCredentials('A token has expired'));
    renderWithProviders(<EditAccountForm />, {
      preloadedState: {
        auth: { user: sampleUser },
      } as any,
    });
      const emailInput = screen.getByTestId('Email');
      fireEvent.change(emailInput, {
        target: { value: 'senka666228@gmail.com' },
      });

    const saveButton = screen.getByText('Save');
    console.log(fireEvent.click(saveButton));

    await waitFor(() => {
      expect(jest.mocked(alert)).toHaveBeenCalled();
      expect(jest.mocked(editUser)).toHaveBeenCalled();
      expect(jest.mocked(logout)).toHaveBeenCalled();
    });
  });
});
