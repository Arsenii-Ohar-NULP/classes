import { useRouter } from 'next/router';
import * as React from 'react';

export default function LogInButton() {
    const router = useRouter();
    return (
      <button
        type="button"
        className="btn btn-secondary rounded-4 px-3"
        onClick={() => router.push('/login')}
      >
        Log in
      </button>
    );
  }