import React from 'react';
import User from './User';
import styles from 'pages/header.module.scss';
import { Loading } from './class/[id]';
export default function ProfilePicture({
  user,
  hoverOn,
}: {
  user: User;
  hoverOn: boolean;
}) {
  function getProfilePicSource(): string {
    return user
      ? `https://api.dicebear.com/6.x/lorelei/svg/seed=${user.username}`
      : '';
  }

  return (
    <>
      {user ? (
        <img
          id="profilePic"
          height="48"
          width="48"
          className={
            'rounded-circle bg-light border border-primary mx-2 ' +
            (hoverOn ? styles['account-button'] : '')
          }
          alt={`Profile picture for ${user ? user.username : 'user'}`}
          src={getProfilePicSource()}
        />
      ) : (
        <Loading />
      )}
    </>
  );
}
