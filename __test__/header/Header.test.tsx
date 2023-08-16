import React from 'react';
import { renderWithProviders } from '__test__/testUtils';
import Header from 'components/header/header';

const mockNavigate = jest.fn((url) => console.log(url));
jest.mock('next/navigation', () => ({
    useRouter: () => ({
      push: mockNavigate,
        replace: mockNavigate
    }),
  }));

describe('header test', () => {
    it('should match a snapshot', () => {
        const header = renderWithProviders(<Header/>);
        expect(header).toMatchSnapshot();
    })
})