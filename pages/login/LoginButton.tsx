import PropTypes from "prop-types";
import React from "react";

export function LoginButton({onSubmit, isLogging}) {
    return <button
        className="btn btn-primary rounded-pill px-3"
        type="button"
        id="loginButton"
        disabled={isLogging}
        onClick={onSubmit}
    >
        {isLogging ?
            <span className="spinner-border spinner-border-sm text-light me-1" role="status" aria-hidden="true"></span>
            : ""}
        Log in
    </button>;
}

LoginButton.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    isLogging: PropTypes.bool
}