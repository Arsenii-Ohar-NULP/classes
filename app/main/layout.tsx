"use client";
import React, {useEffect} from 'react';
import {ReactNode} from "react";
import Header from "components/header/header";
import {authActions, AuthStatus} from "../../components/redux/auth";
import {fetchUserData} from "../../components/redux/classesActions";
import {getAccessToken, useLogout} from "../../components/login/AuthService";
import {getUserInfo} from "../../components/account/UserService";
import InvalidCredentials from "../../components/errors/InvalidCredentials";
import {useAppDispatch, useAppSelector} from "../../components/redux/store";

export default function MainPage({children}: { children: ReactNode }) {
    const authStatus = useAppSelector((state) => state.auth.status);
    const userId = useAppSelector((state) => state.auth.user?.id);
    const logout = useLogout();
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (authStatus == AuthStatus.LOGGED_IN) {
            dispatch(fetchUserData(userId));
        }

        if (authStatus == AuthStatus.LOGGED_OUT) {
            const token = getAccessToken();
            if (token) {
                getUserInfo(token).then((user) =>
                    dispatch(authActions.login(user))
                ).catch(error => {
                    if (error instanceof InvalidCredentials) {
                        logout();
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