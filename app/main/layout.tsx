"use client";
import React, {useEffect} from 'react';
import {ReactNode} from "react";
import Header from "components/header/Header";
import {authActions, AuthStatus} from "components/redux/auth";
import {useLogout} from "components/login/AuthService";
import {useAppDispatch, useAppSelector} from "components/redux/store";
import {useLoginRedirect} from "components/utils/hooks";
import {useLazyGetCurrentUserQuery} from "../../components/redux/userApi";
import {getAccessToken} from "components/account/TokenService";

export default function MainPage({children}: { children: ReactNode }) {
    const authStatus = useAppSelector((state) => state.auth.status);
    const [getUserInfo] = useLazyGetCurrentUserQuery();
    const logout = useLogout();
    const dispatch = useAppDispatch();

    useLoginRedirect();

    useEffect(() => {
        if (authStatus == AuthStatus.LOGGED_IN) {
            dispatch(authActions.fetch());
        }

        if (authStatus == AuthStatus.LOGGED_OUT) {
            const token = getAccessToken();
            if (token) {
                getUserInfo().unwrap().then((user) =>
                    dispatch(authActions.login(user))
                ).catch(error => {
                    if ('status' in error) {
                        const status = error['status'];
                        if (status === 401) {
                            logout();
                        }
                    }
                })
            }
        }
    });
    return (<>
        <Header/>
        {children}
    </>)
}