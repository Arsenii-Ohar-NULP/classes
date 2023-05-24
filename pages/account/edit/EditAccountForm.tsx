import React, { useState } from 'react';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { EditAccountInput } from './EditAccountInput';
import { useAppDispatch, useAppSelector } from 'pages/redux/store';
import EditButton from './EditButton';
import { editUser } from 'pages/account/UserService';
import InvalidCredentials from 'pages/errors/InvalidCredentials';
import { logout } from 'pages/login/AuthService';
import { useRouter } from 'next/router';
import { authActions } from 'pages/redux/auth';

interface IChangedData {
  Password: string;
  Email: string;
  Phone: string;
}

export default function EditAccountForm() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);
  const [error, setError] = useState('');

  const schema = yup
    .object({
      Password: yup.string().notRequired(),
      Phone: yup.string().notRequired().min(8),
      Email: yup.string().email().notRequired(),
    })
    .required();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm({
    resolver: yupResolver(schema),
  });
  const password = watch('Password', '');
  const email = watch('Email', user?.email ? user.email : '');
  const phone = watch('Phone', user?.phone ? user.phone : '');

  const cleanChangedData = (data: IChangedData) => {
    const changedData = {};
    if (!user){
      return changedData;
    }
    for (const key of Object.keys(data)) {
      if (user[key.toLowerCase()] !== data[key] && data[key] !== '') {
        changedData[key.toLowerCase()] = data[key];
      }
    }

    return changedData;
  };

  const hasDataChanged = (data) => {
    console.log(Object.keys(data).length !== 0);
    return Object.keys(data).length !== 0;
  };

  const onSubmit = (data: {
    Password: string;
    Phone: string;
    Email: string;
  }) => {
    const changedData = cleanChangedData(data);
    changedData['id'] = user.id;

    if (!hasDataChanged(changedData)) {
      alert('Data has not been changed');
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
      <h3 className="p-3">Edit account information</h3>
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
        <EditButton
          onClick={handleSubmit(onSubmit)}
          disabled={!hasDataChanged(cleanChangedData({
            Email: email,
            Phone: phone,
            Password: password
          }))}
        />
      </form>
    </div>
  );
}
