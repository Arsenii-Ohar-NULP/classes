import * as React from 'react';

import { fireEvent, screen, waitFor } from '@testing-library/react';
import { sampleUser } from '__test__/data/user';
import { renderWithProviders } from '__test__/testUtils';
import EditAccountForm from 'components/account/edit/EditAccountForm';
import { editUser } from 'components/account/UserService';
import InvalidCredentials from 'components/errors/InvalidCredentials';
import { logout } from 'components/login/AuthService';

jest.mock('components/login/AuthService');
jest.mock('components/account/UserService');

const navigateMock = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: navigateMock,
      replace: navigateMock
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

describe('edit account form', () => {
    it('should match a snapshot', () => {
        const page = renderWithProviders(<EditAccountForm/>);
        expect(page.container).toMatchSnapshot();
    })
})