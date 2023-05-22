import React, { useEffect, useState } from 'react';
import { useMainPageRedirect } from 'pages/utils/hooks';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { login, saveToken } from 'pages/login/AuthService';
import { useAppDispatch } from 'pages/redux/store';
import { authActions } from 'pages/redux/auth';
import { getUserInfo } from 'pages/account/UserService';
import { useLoginForm } from './useLoginForm';
import { FormInput } from './FormInput';
import { RememberMe } from './RememberMe';
import { LoginButton } from './LoginButton';
import { SignUpButton } from './SignUpButton';
import { TopSection } from './TopSection';
import { ServerError } from './ServerError';
import { Footer } from './Footer';

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
      await router.push('/classes');
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
