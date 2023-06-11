import React from 'react';
import User from 'components/account/User';
import Link from 'next/link';
import ProfilePicture from 'components/ProfilePic';

export default function AccountButton({ user }: { user: User }) {
    return (
      <Link href={'/account'} className={"nav-link px-2 text-secondary d-inline"}>
        <ProfilePicture user={user} hoverOn={true}/>
      </Link>
    );
  }