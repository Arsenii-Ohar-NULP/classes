import React, {forwardRef, RefObject} from "react";

interface LoginButtonProps {
    onSubmit: VoidFunction;
    isLogging?: boolean;
}

export function Button({onSubmit, isLogging}: LoginButtonProps, ref: RefObject<HTMLButtonElement>) {
    return <button
        className="btn btn-primary rounded-pill px-3"
        type="button"
        id="loginButton"
        disabled={isLogging}
        onClick={onSubmit}
        ref={ref}
    >
        {isLogging &&
            <span className="spinner-border spinner-border-sm text-light me-1" role="status" aria-hidden="true"></span>}
        Log in
    </button>;
}

export const LoginButton = forwardRef<HTMLButtonElement, LoginButtonProps>(Button);


