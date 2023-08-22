import {TopSection} from "./TopSection";
import {FormInput} from "./FormInput";
import React from "react";
import {FieldErrors} from "react-hook-form";

interface LoginFormInputsProps {
    register: (name: string) => object;
    errors: FieldErrors
}

export default function LoginFormInputs({register, errors}: LoginFormInputsProps) {
    return <React.Fragment>
        <TopSection/>
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
    </React.Fragment>
}