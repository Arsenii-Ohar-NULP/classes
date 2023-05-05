import React, { useEffect, useState } from 'react';
import { getAccessToken, logout } from 'pages/login/authService';
import { getUserInfo } from 'pages/account/UserService';
import User from 'pages/account/User';
import ProfilePicture from 'pages/ProfilePic';
import { acceptRequest, declineRequest } from './RequestService';
import InvalidCredentials from 'pages/errors/InvalidCredentials';
import { useAppDispatch } from 'pages/redux/store';
import { useRouter } from 'next/router';

export default function RequestCard({
  userId,
  classId,
  onResolved,
}: {
  userId: number;
  classId: number;
  onResolved: () => void;
}) {
  const [user, setUser] = useState<User>();
  const dispatch = useAppDispatch();
  const router = useRouter();

  function fetchUser() {
    const token = getAccessToken();
    getUserInfo(token, userId)
      .then((user) => setUser(user))
      .catch((error) => {
        alert(error);
        if (error instanceof InvalidCredentials) {
          logout(dispatch, router);
        }
      });
  }

  useEffect(() => {
    if (!user) {
      fetchUser();
    }
  }, [user]);

  function accept() {
    acceptRequest({ userId, classId })
      .then(onResolved)
      .catch((error) => {
        if (error instanceof InvalidCredentials) {
          logout(dispatch, router);
        }
      });
  }

  function decline() {
    declineRequest({ userId, classId })
      .then(onResolved)
      .catch((error) => {
        if (error instanceof InvalidCredentials) {
          logout(dispatch, router);
        }
      });
  }

  return (
    <div className="card m-2 text-center d-flex flex-row justify-content-center p-3 align-items-center gap-2">
      <ProfilePicture user={user} hoverOn={false} />
      <div>
        {user?.firstName} {user?.lastName}
      </div>
      <div className="d-flex flex-column justify-content-center align-items-center flex-wrap gap-1">
        <button className="btn btn-success" onClick={accept}>
          Accept
        </button>
        <button className="btn btn-danger" onClick={decline}>
          Decline
        </button>
      </div>
    </div>
  );
}
