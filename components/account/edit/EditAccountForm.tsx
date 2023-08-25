import React, {useState} from 'react';
import EditAccountInput from 'components/account/edit/EditAccountInput';
import {useAppDispatch, useAppSelector} from 'components/redux/store';
import EditButton from 'components/account/edit/EditButton';
import {logout} from 'components/login/AuthService';
import {useRouter} from 'next/navigation';
import {authActions} from 'components/redux/auth';
import {useEditAccountForm} from "components/account/edit/useEditAccountForm";
import {EditUserData, useEditUserMutation} from "components/redux/userApi";
import User from "components/account/User";

interface ChangedData {
    Password: string;
    Email: string;
    Phone: string;
}

export default function EditAccountForm() {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const user = useAppSelector((state) => state.auth.user);
    const [error, setError] = useState('');
    const [editUser, response] = useEditUserMutation();

    const {
        register,
        handleSubmit,
        formState: {errors},
        watch
    } = useEditAccountForm();

    const formData = {
        Password: watch('Password', '') as string,
        Email: watch('Email', user?.email ? user.email : '') as string,
        Phone: watch('Phone', user?.phone ? user.phone : '') as string
    };

    const findDifference = (obj1: ChangedData, obj2: User) => {
        if (!obj1 || !obj2) {
            return null;
        }
        const changedData: EditUserData = {id: obj2?.id};
        const keys: Array<keyof ChangedData> = Object.keys(obj1) as Array<keyof ChangedData>;
        for (const key of keys) {
            if (obj2[key.toLowerCase()] !== obj1[key] && obj1[key] !== '') {
                changedData[key.toLowerCase()] = obj1[key];
            }
        }

        return changedData;
    };

    const getUserChanges = () => {
        const userDifference = findDifference(formData, user);
        return userDifference && hasKeysNumber(userDifference, 1) ? userDifference : null;
    };

    const hasKeysNumber = (data: object, target: number) => {
        return Object.keys(data).length !== target;
    };

    const onSubmit = () => {
        const userChanges = getUserChanges();
        if (!userChanges) {
            alert('Data has not been changed');
            return;
        }

        editUser(userChanges).unwrap()
            .then(() => {
                dispatch(authActions.updateUser(userChanges));
                router.push('/main/account');
            })
            .catch((error) => {
                if ("status" in error) {
                    if (error['status'] === 401) {
                        logout(dispatch, router);
                    }
                }
                setError(error.message);
            })
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
                <hr/>
                <h6>{error}</h6>
                <EditButton
                    onClick={handleSubmit(onSubmit)}
                    disabled={!getUserChanges() || response.isLoading}
                />
            </form>
        </div>
    );
}
