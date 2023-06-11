import React from 'react';
import 'components/_base.scss';
import App from 'pages/app';
import { useBootstrap } from 'components/utils/hooks';
import { Provider } from 'react-redux';
import store from 'components/redux/store';
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
        <link rel='icon' href='/images/favicon.ico'/>
      </Head>
      <App component={<Component {...pageProps} />} />
    </Provider>
  );
}
