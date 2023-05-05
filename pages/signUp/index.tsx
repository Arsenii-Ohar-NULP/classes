import React from 'react';
import Head from 'next/head';
import * as yup from 'yup';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMainPageRedirect, useMessageReplacer } from 'pages/utils/hooks';
import Logo from 'pages/utils/logo';
import { signUp } from './signUpService';

function useUsername() {
  const router = useRouter();
  const [username, setUsername] = useState(null);
  useEffect(() => {
    if (!username) {
      setUsername(router.query['username']);
    }
  });

  return username;
}

function useSignUpForm() {
  const schema = yup.object({
    Username: yup.string().min(8).required(), // TODO: Add some RegEx
    Password: yup.string().min(8).required(),
    FirstName: yup.string().required(),
    LastName: yup.string().required(),
    Email: yup.string().email().required(),
    PhoneNumber: yup.string().required(),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm({
    resolver: yupResolver(schema),
  });

  return { register, handleSubmit, errors, getValues };
}

type SignUpInputProps = {
  id: string;
  placeholder: string;
  defaultValue?: string;
  label: string;
  isColumnized?: boolean;
  registration: object;
  error: string;
  type?: string;
};

function SignUpInput({
  id,
  placeholder,
  defaultValue,
  label,
  isColumnized,
  registration,
  error,
  ...other
}: SignUpInputProps) {
  const normalizer = useMessageReplacer({
    FirstName: 'First Name',
    LastName: 'Last Name',
    PhoneNumber: 'Phone Number',
  });
  return (
    <div className={'p-1 ' + (isColumnized ? 'col-lg' : '')}>
      <label htmlFor={id} className="form-label">
        <b>{label}</b>
      </label>

      <input
        className="form-control"
        id={id}
        placeholder={placeholder}
        defaultValue={defaultValue}
        {...registration}
        {...other}
      />

      <div className={'invalid'}>{error ? normalizer(error) : ''}</div>
    </div>
  );
}

function Footer() {
  return (
    <footer className="d-flex justify-content-center p-3 align-items-end">
      <a href="example.com" className="text-decoration-none">
        <Logo />
      </a>
    </footer>
  );
}

function SignUpButton({ onClick }: { onClick: VoidFunction }) {
  return (
    <button
      id="signUpButton"
      type="button"
      className="btn btn-primary rounded-4 p-2 px-4"
      onClick={onClick}
    >
      Sign up
    </button>
  );
}

function LogInButton() {
  const router = useRouter();
  return (
    <button
      type="button"
      className="btn btn-secondary rounded-4 px-3"
      onClick={() => router.push('/login')}
    >
      Log in
    </button>
  );
}

function FormTop() {
  return (
    <div className="d-flex align-middle">
      <h1 className="p-3">Sign up</h1>
      <hr />
    </div>
  );
}

// eslint-disable-next-line no-empty-pattern
export default function SignUp({}) {
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
    userInfo = parseUserInfo(userInfo);
    signUp(userInfo)
      .then(() => {
        router.push('/login');
      })
      .catch((e) => {
        setServerError(e.message);
      });
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
                <SignUpButton onClick={handleSubmit(onSignUpClick)} />
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
