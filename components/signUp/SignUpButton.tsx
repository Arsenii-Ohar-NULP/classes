import * as React from 'react';

export default function SignUpButton({ onClick, isSigning }: { onClick: VoidFunction, isSigning: boolean }) {
    return (
      <button
        id="signUpButton"
        type="button"
        className="btn btn-primary rounded-4 p-2 px-4"
        onClick={onClick}
        disabled={isSigning}
      >
        {isSigning ?
            <span className="spinner-border spinner-border-sm text-light me-1" role="status" aria-hidden="true"></span>
            : ""}
        Sign up
      </button>
    );
  }