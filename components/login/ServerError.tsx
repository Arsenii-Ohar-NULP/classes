import React, {useMemo} from "react";
import {FieldErrors} from "react-hook-form";
import {FetchBaseQueryError} from "@reduxjs/toolkit/query";
import {SerializedError} from "@reduxjs/toolkit";

export function ServerError({serverError, errors}: { serverError: FetchBaseQueryError | SerializedError; errors: FieldErrors; }) {
    const errorMessage = useMemo(() => {
        let typicalMessage = "Something went wrong, check the fields and try again later"
        if (serverError){
            if ('status' in serverError){
                const queryError = serverError as FetchBaseQueryError;
                if (queryError.data['msg'] !== undefined){
                    typicalMessage = queryError.data['msg'];
                }
            }
        }

        return typicalMessage;
    },[serverError])

    return <p className={serverError && (!errors.Password && !errors.Username)
        ? 'invalid' : 'visually-hidden'} data-testid={'error'}>
        {errorMessage}
    </p>;
}