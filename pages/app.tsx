import React from 'react';
import Header from 'pages/header';

type AppParams = {
  component: JSX.Element;
};
export default function App({ component }: AppParams) {
  return (
    <div>
      <Header currentComponent={component} />
      {component}
    </div>
  );
}
