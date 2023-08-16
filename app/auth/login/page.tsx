"use client";
import React, {useEffect, useState} from 'react';
import {useLoginForm} from "../../../components/login/useLoginForm";
import {useRouter} from "next/navigation";
import {useAppDispatch} from "../../../components/redux/store";
import {useMainPageRedirect} from "../../../components/utils/hooks";
import {login, saveToken} from "../../../components/login/AuthService";
import {getUserInfo} from "../../../components/account/UserService";
import {authActions} from "../../../components/redux/auth";
import Head from "next/head";
import {TopSection} from "../../../components/login/TopSection";
import {FormInput} from "../../../components/login/FormInput";
import {RememberMe} from "../../../components/login/RememberMe";
import {ServerError} from "../../../components/login/ServerError";
import {LoginButton} from "../../../components/login/LoginButton";
import {Footer} from "../../../components/login/Footer";
import {SignUpButton} from "../../../components/login/SignUpButton";
export default function LoginPage() {
    const { register, handleSubmit, errors, getValues } = useLoginForm();
  const [isRemember, setRememberMe] = useState(true);
  const [isLogging, setIsLogging] = useState(false);
  const [serverError, setServerError] = useState();
  const router = useRouter();
  const dispatch = useAppDispatch();

  useMainPageRedirect();

  const onLoginClick = async (credentials) => {
    credentials = {
      username: credentials.Username,
      password: credentials.Password,
    };
    setIsLogging(true);
    try {
      const accessToken = await login(credentials);
      saveToken(accessToken, isRemember);
      const user = await getUserInfo(accessToken);
      dispatch(authActions.login(user));
      router.replace('/main/classes');
    } catch (e) {
      setServerError(e.message);
    } finally {
      setIsLogging(false);
    }
  };
  useEffect(() => {
    setServerError(null);
  }, [errors.Username, errors.Password]);

  return (
    <div className="d-flex w-100">
      <Head>
        <title>Classes - Login</title>
      </Head>
      <div className="container-lg justify-content-center align-items-center text-center">
        <form name="form" className="main needs-validation" id="form">
          <TopSection />
          <FormInput
            placeholder="Enter a username"
            id="Username"
            type="text"
            registration={register('Username')}
            errorMessage={errors.Username?.message.toString()}
          />
          <FormInput
            placeholder="Enter a password"
            id="Password"
            type="password"
            registration={register('Password')}
            errorMessage={errors.Password?.message.toString()}
          />
          <RememberMe onChange={setRememberMe} />
          <ServerError errors={errors} serverError={serverError} />
          <div className="d-flex my-2 gap-2 h-50 justify-content-center">
            <LoginButton
              onSubmit={handleSubmit(onLoginClick)}
              isLogging={isLogging}
            />
            <div className="vr m-1"></div>
            <SignUpButton
              router={router}
              getUsername={() => getValues().Username}
            />
          </div>
        </form>
        <Footer />
      </div>
    </div>
  );
}