import React, { useState } from 'react';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { EditAccountInput } from './EditAccountInput';
import { useAppDispatch, useAppSelector } from 'pages/redux/store';
import EditButton from './EditButton';
import { editUser } from 'pages/account/UserService';
import InvalidCredentials from 'pages/errors/InvalidCredentials';
import { logout } from 'pages/login/authService';
import { useRouter } from 'next/router';
import { authActions } from 'pages/redux/auth';

export default function EditAccountForm() {
  const schema = yup
    .object({
      Password: yup.string().notRequired(),
      Phone: yup.string().notRequired().min(8),
      Email: yup.string().email().notRequired(),
    })
    .required();
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const [error, setError] = useState('');

  const onSubmit = (data: {
    Password: string;
    Phone: string;
    Email: string;
  }) => {
    console.log("in");
    const changedData = { id: user.id };
    for (const key of Object.keys(data)) {
      if (user[key.toLowerCase()] !== data[key] && data[key] !== '') {
        changedData[key.toLowerCase()] = data[key];
      }
    }
    console.log(Object.keys(changedData));
    if (Object.keys(changedData).length === 1) {
      alert("You haven't changed the data");
      return;
    }

    editUser(changedData)
      .then(() => {
        alert('Successfully edited a user');
        dispatch(authActions.updateUser(changedData));
      })
      .catch((error) => {
        if (error instanceof InvalidCredentials) {
          logout(dispatch, router);
        }
        setError(error.message);
      });
  };

  return (
    <div className="d-flex align-items-center flex-column container">
      <h3 className='p-3'>Edit account information</h3>
      <form>
        <EditAccountInput
          type={'password'}
          id={'Password'}
          placeholder="Enter a new password"
          errorMessage={errors?.Password?.message.toString()}
          registration={register('Password')}
        />
        <EditAccountInput
          id={'Phone'}
          placeholder="Enter a new phone number"
          errorMessage={errors?.Phone?.message.toString()}
          value={user?.phone}
          registration={register('Phone')}
        />
        <EditAccountInput
          id={'Email'}
          placeholder="Enter an email"
          errorMessage={errors?.Email?.message.toString()}
          type={'email'}
          value={user?.email}
          registration={register('Email')}
        />
        <hr />
        <h6>{error}</h6>
      </form>
      <EditButton onClick={handleSubmit(onSubmit)}/>
    </div>
  );
}