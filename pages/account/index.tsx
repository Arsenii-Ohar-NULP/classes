import React from 'react';
import { useUserData, useLoginRedirect } from 'pages/utils/hooks';

type SimpleValueOutputProps = {
  title: string;
  value: string | number;
};
function SimpleValueOutput({ title, value }: SimpleValueOutputProps) {
  return (
    <div>
      <h3>
        {title.toUpperCase()}: {value.toString().toUpperCase()}
      </h3>
    </div>
  );
}

export default function Account() {
  useLoginRedirect();
  const user = useUserData();
  if (!user) return <></>;
  return (
    <div className='container text-center'>
      <h1 className='p-2'>
        Personal Information
      </h1>
      <hr />
      <div>
        {Object.keys(user).sort((a, b) => -a.localeCompare(b)).filter((el) => el !== 'password' && el !== 'id').map(function (prop) {
          return (
            <SimpleValueOutput key={prop.toString()} title={prop.toString()} value={user[prop]} />
          );
        })}
      </div>
    </div>
  );
}
