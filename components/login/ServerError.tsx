import React from "react";
import {FieldErrors} from "react-hook-form";

export function ServerError({serverError, errors}: { serverError: string; errors: FieldErrors; }) {
    return <p className={serverError && (!errors.Password && !errors.Username)
        ? 'invalid' : 'visually-hidden'} data-testid={'error'}>
        {serverError}
    </p>;
}