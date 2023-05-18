import React from 'react';
import PersonalInfoBar from './PersonalInfoBar';
import Link from 'next/link';
import { useMainPageRedirect, useUserData } from 'pages/utils/hooks';

export default function AccountPage() {
  useMainPageRedirect();
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
