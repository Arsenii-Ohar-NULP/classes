import '_base.scss';
import React, { useEffect } from 'react';
import App from 'pages/app';

type MyAppProps = {
  Component: (props: object) => JSX.Element;
  pageProps: object;
}
export default function MyApp({ Component, pageProps }: MyAppProps) {
  useEffect(
    () => {
      require("bootstrap/dist/js/bootstrap.bundle.js");
    }
  )
  return <App component={<Component {...pageProps}/>}/>;
}