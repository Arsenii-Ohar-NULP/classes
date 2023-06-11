import { useRouter } from 'next/router';
import { logout } from 'components/login/AuthService';
import { useAppDispatch } from 'components/redux/store';
import React from 'react';

export default function LogoutButton() {
    const router = useRouter();
    const dispatch = useAppDispatch();
  
    return (
      <button
        type="button"
        className="btn btn-primary"
        onClick={() => logout(dispatch, router)}
      >
        Logout
      </button>
    );
  }