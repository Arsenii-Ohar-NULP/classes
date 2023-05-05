import React from 'react';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMainPageRedirect } from 'pages/utils/hooks';
import { useRouter } from 'next/router';
import Logo from 'pages/utils/logo';
import PropTypes from 'prop-types';
import Image from 'next/image';
import smilingFace from 'public/images/Slightly Smiling Face.svg';
import Head from 'next/head';
import * as yup from "yup";
import { login, saveToken } from 'pages/login/authService.ts';
import { useAppDispatch } from 'pages/redux/store';
import { authActions } from 'pages/redux/auth';
import { getUserInfo } from 'pages/account/UserService';

function useLoginForm() {
    const schema = yup.object(
        {
            Username: yup.string().required().min(8),
            Password: yup.string().required().min(8)
        }
    ).required();
    const { register, handleSubmit, formState: { errors }, getValues } = useForm({
        resolver: yupResolver(schema)
    });

    return { register, handleSubmit, errors, getValues };
}

function FormInput({ errorMessage, id, placeholder, registration, ...other }) {
    return <div className="my-2 has-validation">
        <input
            placeholder={placeholder}
            id={id}
            className={"form-control-lg rounded-4 p-1 px-2" + (errorMessage ? " invalid-input" : "")}
            {...registration}
            {...other}
        />
        <div className={'invalid'}>{errorMessage ? errorMessage : ""}</div>
    </div>
}
FormInput.propTypes = {
    errorMessage: PropTypes.string,
    id: PropTypes.string.isRequired,
    placeholder: PropTypes.string.isRequired,
    registration: PropTypes.any.isRequired
}

function RememberMe({ onChange }) {
    const [isRemember, setRememberMe] = useState(true);
    return <div className="form-check d-inline-block justify-content-center align-items-center ">
        <input
            id="remember-me"
            name="remember-me"
            className="form-check-input"
            type="checkbox"
            onChange={() => onChange(!isRemember) & setRememberMe(!isRemember)}
            formNoValidate
            defaultChecked
        />
        <label htmlFor="remember-me" className="form-check-label">
            Remember me
        </label>
    </div>
}
RememberMe.propTypes = {
    onChange: PropTypes.func.isRequired
}

function LoginButton({ onSubmit, isLogging }) {
    return <button
        className="btn btn-primary rounded-pill px-3"
        type="button"
        id="loginButton"
        onClick={onSubmit}
    >
        {isLogging ? <span className="spinner-border spinner-border-sm text-light me-1" role="status" aria-hidden="true"></span>
            : ""}
        Log in
    </button>;
}
LoginButton.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    isLogging: PropTypes.bool
}

function SignUpButton({ router, getUsername }) {
    return (
        <button
            className="btn btn-secondary rounded-pill px-3"
            type="button"
            onClick={() => {
                const username = getUsername();
                if (username) {
                    router.push(`signUp/?username=${username}`);
                }
                else {
                    router.push("/signUp");
                }
            }}
        >
            Sign up
        </button>
    );
}
SignUpButton.propTypes = {
    router: PropTypes.object.isRequired,
    getUsername: PropTypes.func.isRequired
}


function TopSection() {
    return <>
        <div className='p-2'>
            <div className='d-flex justify-content-center align-items-center p-2'>
                <Logo />
            </div>
            <hr className='w-100' />
        </div>
        <p className="fs-5 position-relative"><b>Hi, please log in </b>
            <Image width="28" height="28"
                src={smilingFace}
                alt="Smiling Face" />
        </p></>
}

function ServerError({ serverError, errors }) {
    return <p className={serverError && (!errors.Password && !errors.Username) ? 'invalid' : 'visually-hidden'}>
        {serverError}
    </p>;
}
ServerError.propTypes = {
    serverError: PropTypes.string,
    errors: PropTypes.object
};

function Footer() {
    return (
        <footer>

        </footer>
    );
}



export default function Login() {
    const { register, handleSubmit, errors, getValues } = useLoginForm();
    const [isRemember, setRememberMe] = useState(false);
    const [serverError, setServerError] = useState();
    const [isLogging, setIsLogging] = useState(false);
    const router = useRouter();
    const dispatch = useAppDispatch();

    useMainPageRedirect();

    const onLoginClick = async (credentials) => {
        credentials = { username: credentials.Username, password: credentials.Password }
        setIsLogging(true);
        try {
            const accessToken = await login(credentials);
            saveToken(accessToken, isRemember);
            const user = await getUserInfo(accessToken);
            dispatch(authActions.login(user));
        }
        catch (e) {
            setServerError(e.message);
            return;
        }
        finally {
            setIsLogging(false);
        }
        router.push('/classes');
    }
    useEffect(
        () => {
            setServerError(null);
        },
        [errors.Username, errors.Password]
    )

    return (
        <div className="d-flex w-100">
            <Head>
                <title>Classes - Login</title>
            </Head>
            <div className="container-lg justify-content-center align-items-center text-center">

                <form
                    name="form"
                    className="main needs-validation"
                    id="form"
                >
                    <TopSection />

                    <FormInput
                        placeholder="Username or email"
                        id="Username"
                        type="text"
                        registration={register("Username")}
                        errorMessage={errors.Username?.message}
                    />
                    <FormInput
                        placeholder="Password"
                        id="Password"
                        type="password"
                        registration={register("Password")}
                        errorMessage={errors.Password?.message}
                    />
                    <RememberMe onChange={setRememberMe} />
                    <ServerError errors={errors} serverError={serverError} />
                    <div className="d-flex my-2 gap-2 h-50 justify-content-center">
                        <LoginButton onSubmit={handleSubmit(onLoginClick)} isLogging={isLogging} />
                        <div className='vr m-1'></div>
                        <SignUpButton router={router} getUsername={() => getValues().Username} />
                    </div>
                </form>
                <Footer />
            </div>
        </div>


    );
}
