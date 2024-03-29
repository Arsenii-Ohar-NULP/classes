"use client";
import React, {useEffect, useRef, useState} from 'react';
import {useLoginForm} from "components/login/useLoginForm";
import {useRouter} from "next/navigation";
import {useAppDispatch} from "components/redux/store";
import {useMainPageRedirect} from "../../../components/utils/hooks";
import {saveToken, useLogout} from "components/login/AuthService";
import {authActions} from "components/redux/auth";
import Head from "next/head";
import {RememberMe} from "components/login/RememberMe";
import {ServerError} from "components/login/ServerError";
import {LoginButton} from "components/login/LoginButton";
import {Footer} from "components/login/Footer";
import {SignUpButton} from "components/login/SignUpButton";
import {useLazyGetCurrentUserQuery, useLoginMutation} from "components/redux/userApi";
import {FetchBaseQueryError} from "@reduxjs/toolkit/query";
import {SerializedError} from "@reduxjs/toolkit";
import LoginFormInputs from "components/login/LoginFormInputs";

export default function LoginPage() {
    const [login, loginResponse] = useLoginMutation();
    const [getUser, userInfoResponse] = useLazyGetCurrentUserQuery();
    const {register, handleSubmit, errors, getValues} = useLoginForm();
    const [isRemember, setRememberMe] = useState(true);
    const [serverError, setServerError] = useState<FetchBaseQueryError | SerializedError>();
    const loginButton = useRef<HTMLButtonElement>();
    const logout = useLogout();
    const router = useRouter();
    const dispatch = useAppDispatch();

    useMainPageRedirect();

    const onLoginClick = async (credentials) => {
        credentials = {
            username: credentials.Username,
            password: credentials.Password,
        };
        login(credentials).unwrap()
            .then((accessToken) => {
                saveToken(accessToken, isRemember);
                getUser()
                    .unwrap()
                    .then((user) => {
                        dispatch(authActions.login(user))
                        router.push('/main/classes');
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            })
            .catch((error) => {
                if ('status' in error) {
                    const status = error['status'];

                    if (status === 401) {
                        logout();
                    }
                }
            });

    };

    useEffect(() => {
        if (loginResponse.isError) {
            setServerError(loginResponse.error);
        } else if (userInfoResponse.error) {
            setServerError(userInfoResponse.error);
        }
    }, [loginResponse.error, userInfoResponse.error]);

    useEffect(() => {
        loginResponse.reset();
    }, [errors.Username, errors.Password]);

    const onKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
        if (e.key === 'Enter') {
            loginButton.current.click();
        }
    }

    return (
        <div className="d-flex w-100" onKeyDown={onKeyDown}>
            <Head>
                <title>Classes - Login</title>
            </Head>
            <div className="container-lg justify-content-center align-items-center text-center">
                <form name="form" className="main needs-validation" id="form">
                    <LoginFormInputs register={register} errors={errors}/>
                    <RememberMe onChange={setRememberMe}/>
                    <ServerError errors={errors} serverError={serverError}/>
                    <div className="d-flex my-2 gap-2 h-50 justify-content-center">
                        <LoginButton
                            onSubmit={handleSubmit(onLoginClick)}
                            isLogging={loginResponse.isLoading || userInfoResponse.isLoading}
                            ref={loginButton}
                        />
                        <div className="vr m-1"></div>
                        <SignUpButton
                            router={router}
                            getUsername={() => getValues().Username}
                        />
                    </div>
                </form>
                <Footer/>
            </div>
        </div>
    );
}