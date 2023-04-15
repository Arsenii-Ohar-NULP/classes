import * as yup from "yup";
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Image from 'next/image';
import styles from './login.module.scss';
import smilingFace from '../public/images/Slightly Smiling Face.svg';
import { useRouter } from 'next/router';
import { useTokenPersistanceService, useAuthService } from './hooks';
function useLoginForm(){
    const schema = yup.object(
        {
            Username: yup.string().required().min(8),
            Password: yup.string().required().min(8)
        }
    ).required();
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    });

    return {register, handleSubmit, errors};

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
        <div className={styles.invalid}>{errorMessage ? errorMessage : ""}</div>
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
            checked
        />
        <label htmlFor="remember-me" className="form-check-label">
            Remember me
        </label>
    </div>
}
RememberMe.propTypes = {
    onChange: PropTypes.func.isRequired
}
function LoginButton({ onSubmit }) {
    return <button
        className="btn btn-primary rounded-pill px-3"
        type="button"
        id="loginButton"
        onClick={onSubmit}
    >
        Log in
    </button>;
}
LoginButton.propTypes = {
    onSubmit: PropTypes.func.isRequired
}

function SignUpButton() {
    return <button
        className="btn btn-secondary rounded-pill px-3"
        type="button"
    >
        Sign up
    </button>
}

function Header() {
    return <><div>
        <p className="fs-2 pt-3">Classes</p>
        <hr className="w-100" />
    </div>
        <p className="fs-5 position-relative"><b>Hi, please log in </b>
            <Image width="28" height="28"
                src={smilingFace}
                alt="Smiling Face" />
        </p></>
}

export default function Login() {
    const {register, handleSubmit, errors} = useLoginForm();
    const [isRemember, setRememberMe] = useState(false);
    const [serverError, setServerError] = useState();
    const router = useRouter();
    const authService = useAuthService();
    const tokenService = useTokenPersistanceService();

    const login = async (credentials) => {
        credentials = { username: credentials.Username, password: credentials.Password }
        try {
            const accessToken = await authService.login(credentials);
            tokenService.saveToken(accessToken, isRemember);
        }
        catch (e) {
            setServerError(e.message);
            return;
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
        <div className="container justify-content-center align-items-center text-center">
            <form
                name="form"
                className="main needs-validation"
                id="form"
            >
                <Header />

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
                <p className={serverError && (!errors.Password && !errors.Username) ? styles.invalid : 'visually-hidden'}>
                    {serverError}
                </p>
                <div className="d-flex my-2 gap-2 h-50 justify-content-center">
                    <LoginButton onSubmit={handleSubmit(login)} />
                    <SignUpButton />
                </div>
            </form>
        </div>

    );
}
