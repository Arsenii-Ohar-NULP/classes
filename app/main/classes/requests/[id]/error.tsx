"use client";
import React from 'react';
import InvalidCredentials from "components/errors/InvalidCredentials";
import {useEffect} from "react";
import {useLogout} from "components/login/AuthService";

export default function Error({error}: {error: Error, reset: VoidFunction}){
    const logout = useLogout();
    useEffect(() => {
        if (error instanceof InvalidCredentials){
            logout();
        }
    }, [error]);

    return <div className={'d-flex justify-content-center align-content-center'}>
        Error
    </div>;
}