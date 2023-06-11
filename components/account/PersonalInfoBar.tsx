import React from 'react';
import { useLoginRedirect } from 'components/utils/hooks';
import PersonalInfoCard from 'components/account/PersonalInfoCard';
import User from 'components/account/User';

export default function PersonalInfoBar({user}: {user: User}) {
  useLoginRedirect();
  
  return (
    <div className="d-inline-block">
      <div className="d-flex flex-column gap">
        <PersonalInfoCard label={'Username'} data={user?.username} />
        <PersonalInfoCard label={'Email'} data={user?.email} />
        <PersonalInfoCard label={'Phone'} data={user?.phone} />
        <PersonalInfoCard label={'First Name'} data={user?.firstName} />
        <PersonalInfoCard label={'Last Name'} data={user?.lastName} />
      </div>
    </div>
  );
}
