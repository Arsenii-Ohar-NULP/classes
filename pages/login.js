import { useState, useEffect, useRef } from 'react';
import styles from './login.module.scss';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";

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

function RememberMe() {
    return <div className="form-check mx-auto text-start">
        <input
            id="remember-me"
            name="remember-me"
            className="form-check-input"
            type="checkbox"
            defaultValue=""
            formNoValidate
        />
        <label htmlFor="remember-me" className="form-check-label">
            Remember me
        </label>
    </div>
}

export default function Login() {
    const formRef = useRef(null);
    const schema = yup.object(
        {
            Username: yup.string().required().min(8),
            Password: yup.string().required().min(8)
        }
    ).required();
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    });


    const login = (data) => {

    }

    return (
        <div className="d-flex align-items-center justify-content-center vh-100">
            <div className="d-flex card text-center shadow rounded-5 p-4">
                <form
                    ref={formRef}
                    name="form"
                    className="main needs-validation"
                    id="form"
                >
                    <p className="fs-3 p-3">Hi, please log in.</p>
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
                    <RememberMe/>

                    <div className="row m-2 g-0">
                        <div className="col-md text-center m-1">
                            <button
                                className="btn btn-primary rounded-pill"
                                type="button"
                                id="loginButton"
                                onClick={handleSubmit(login)}

                            >
                                Log in
                            </button>
                        </div>
                        <div className="col-md text-center m-1">
                            <button
                                className="btn btn-secondary rounded-pill"
                                type="button"
                            >
                                Sign up
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
