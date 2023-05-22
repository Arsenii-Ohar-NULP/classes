import React from 'react';
import { renderWithProviders } from '__test__/testUtils';
import Header from 'pages/header/header';
import ClassPage from 'pages/class/[id]';

jest.mock('next/router', () => ({
    useRouter: () => ({
      pathname: '/',
      push: jest.fn((url) => console.log(url)),
    }),
  }));

describe('header test', () => {
    it('when no component, should match a snapshot', () => {
        const header = renderWithProviders(<Header currentComponent={null}/>);
        expect(header).toMatchSnapshot();
    })

    it('when ClassPage component, should match a snapshot', () => {
        const header = renderWithProviders(<Header currentComponent={ClassPage}/>);
        expect(header).toMatchSnapshot();
    })
})