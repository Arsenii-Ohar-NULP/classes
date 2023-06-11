import React from 'react';
import Head from 'next/head';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { useMainPageRedirect } from 'components/utils/hooks';
import { signUp } from 'components/signUp/signUpService';
import useSignUpForm from 'components/signUp/useSignupForm';
import useUsername from 'components/signUp/useUsername';
import FormTop from 'components/signUp/FormTop';
import SignUpInput from 'components/signUp/SignUpInput';
import SignUpButton from 'components/signUp/SignUpButton';
import LogInButton from 'components/signUp/LogInButton';
import Footer from 'components/signUp/Footer';

// eslint-disable-next-line no-empty-pattern
export default function SignUp({}) {
  const [isSigning, setIsSigning] = useState<boolean>(false);
  const { register, handleSubmit, errors } = useSignUpForm();
  const [serverError, setServerError] = useState(null);
  const initialUsername = useUsername();
  const router = useRouter();

  useMainPageRedirect();

  function parseUserInfo(user) {
    return {
      username: user.Username,
      password: user.Password,
      firstName: user.FirstName,
      lastName: user.LastName,
      email: user.Email,
      phone: user.PhoneNumber,
    };
  }

  function onSignUpClick(userInfo) {
    setIsSigning(true);
    userInfo = parseUserInfo(userInfo);
    signUp(userInfo)
      .then(() => {
        router.push('/login');
      })
      .catch((e) => {
        setServerError(e.message);
      })
      .finally(
        () => setIsSigning(false)
      );
  }

  return (
    <div>
      <Head>
        <title>Classes - Sign up</title>
      </Head>
      <div className="container w-100 h-100 d-relative">
        <div className="grid p-3">
          <FormTop />
          <div className="row">
            <form id="form" name="form" className="needs-validation grid gy-3">
              <div className="row">
                <SignUpInput
                  id={'Username'}
                  placeholder={'Enter your username'}
                  defaultValue={initialUsername ? initialUsername : ''}
                  label={'Username'}
                  registration={register('Username')}
                  error={errors?.Username?.message.toString()}
                />
              </div>
              <div className="row">
                <SignUpInput
                  id={'Password'}
                  placeholder={'Enter your password'}
                  label={'Password'}
                  registration={register('Password')}
                  error={errors?.Password?.message.toString()}
                  type="password"
                />
              </div>
              <div className="row">
                <SignUpInput
                  id={'FirstName'}
                  placeholder={'Enter your first name'}
                  label={'First Name'}
                  registration={register('FirstName')}
                  isColumnized={true}
                  error={errors?.FirstName?.message.toString()}
                />
                <SignUpInput
                  id={'LastName'}
                  placeholder={'Enter your last name'}
                  label={'Last Name'}
                  isColumnized={true}
                  registration={register('LastName')}
                  error={errors?.LastName?.message.toString()}
                />
              </div>
              <div className="row">
                <SignUpInput
                  id={'Email'}
                  placeholder={'Enter your email'}
                  label={'Email'}
                  registration={register('Email')}
                  isColumnized={true}
                  error={errors?.Email?.message.toString()}
                />
                <SignUpInput
                  id={'PhoneNumber'}
                  placeholder={'Enter your phone number'}
                  label={'Phone Number'}
                  isColumnized={true}
                  registration={register('PhoneNumber')}
                  error={errors?.PhoneNumber?.message.toString()}
                />
              </div>
              <div className={'invalid'}>{serverError ? serverError : ''}</div>
              <hr />
              <div className="container d-flex gap-2 justify-content-center mx-auto my-3 text-center p-3 start-0">
                <SignUpButton onClick={handleSubmit(onSignUpClick)} isSigning={isSigning}/>
                <div className="vr my-1"></div>
                <LogInButton />
              </div>
            </form>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}
