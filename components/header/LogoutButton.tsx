import { useLogout } from 'components/login/AuthService';
import React from 'react';

export default function LogoutButton() {
    const logout = useLogout();
    return (
      <button
        type="button"
        className="btn btn-primary"
        onClick={() => logout()}
      >
        Logout
      </button>
    );
  }