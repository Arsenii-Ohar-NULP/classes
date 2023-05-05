import '_base.scss';
import React from 'react';
import App from 'pages/app';
import { useBootstrap } from 'pages/utils/hooks';
import { Provider } from 'react-redux';
import store from './redux/store';

type MyAppProps = {
  Component: (props: object) => JSX.Element;
  pageProps: object;
};
export default function MyApp({ Component, pageProps }: MyAppProps) {
  useBootstrap();
  return (
    <Provider store={store}>
      <App component={<Component {...pageProps} />} />
    </Provider>
  );
}
