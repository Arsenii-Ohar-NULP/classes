import '_base.scss';
import React from 'react';
import App from 'pages/app';
import { useBootstrap } from 'pages/utils/hooks';
import { Provider } from 'react-redux';
import store from './redux/store';
import Head from 'next/head';

type MyAppProps = {
  Component: (props: object) => JSX.Element;
  pageProps: object;
};
export default function MyApp({ Component, pageProps }: MyAppProps) {
  useBootstrap();
  return (
    <Provider store={store}>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
        />
      </Head>
      <App component={<Component {...pageProps} />} />
    </Provider>
  );
}
