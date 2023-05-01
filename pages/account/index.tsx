import React from 'react';
import PersonalInfoBar from './PersonalInfoBar';
import Link from 'next/link';
import { useUserData } from 'pages/utils/hooks';

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

export default function AccountPage() {
  const user = useUserData();

  if (!user){
    return <></>;
  }
  return (
    <div className="container">
      <h1 className="p-2 text-center">Personal Information</h1>
      <div className="d-flex justify-content-center">
        <PersonalInfoBar user={user}/>
      </div>
      <div className="text-center">
        <Link href={'/account/edit'}>
          <button className="btn btn-primary">Edit</button>
        </Link>
      </div>
    </div>
  );
}
