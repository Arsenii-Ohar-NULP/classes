import PropTypes from "prop-types";
import React from "react";

interface LoginButtonProps {
    onSubmit: VoidFunction;
    isLogging?: boolean;
}

export function LoginButton({onSubmit, isLogging}: LoginButtonProps) {
    return <button
        className="btn btn-primary rounded-pill px-3"
        type="button"
        id="loginButton"
        disabled={isLogging}
        onClick={onSubmit}
    >
        {isLogging &&
            <span className="spinner-border spinner-border-sm text-light me-1" role="status" aria-hidden="true"></span>}
        Log in
    </button>;
}
