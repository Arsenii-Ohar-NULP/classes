'use client';
import React from 'react';
import Head from 'next/head';
import {useRouter} from 'next/navigation';
import {useMainPageRedirect} from 'components/utils/hooks';
import useSignUpForm from 'components/signUp/useSignupForm';
import useUsername from 'components/signUp/useUsername';
import FormTop from 'components/signUp/FormTop';
import SignUpInput from 'components/signUp/SignUpInput';
import SignUpButton from 'components/signUp/SignUpButton';
import LogInButton from 'components/signUp/LogInButton';
import Footer from 'components/signUp/Footer';
import {useSignUpMutation} from "components/redux/userApi";
import {ServerError} from "components/login/ServerError";
import VerticalRule from "components/signUp/VerticalRule";
import {Container, Row} from "react-bootstrap";

// eslint-disable-next-line no-empty-pattern
export default function SignUp({}) {
    const {
        register,
        handleSubmit,
        errors
    } = useSignUpForm();
    const [signUp, response] = useSignUpMutation();
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
        signUp(userInfo).unwrap()
            .then(() => {
                router.push('/auth/login');
            })
    }

    return (
        <div>
            <Head>
                <title>Classes - Sign up</title>
            </Head>
            <Container className="h-100 d-relative">
                <Row className="grid p-3">
                    <FormTop/>
                    <Row>
                        <form id="form" name="form" className="needs-validation grid gy-3">
                            <Row>
                                <SignUpInput
                                    id={'Username'}
                                    placeholder={'Enter your username'}
                                    defaultValue={initialUsername ? initialUsername : ''}
                                    label={'Username'}
                                    registration={register('Username')}
                                    error={errors?.Username?.message.toString()}
                                />
                            </Row>
                            <Row>
                                <SignUpInput
                                    id={'Password'}
                                    placeholder={'Enter your password'}
                                    label={'Password'}
                                    registration={register('Password')}
                                    error={errors?.Password?.message.toString()}
                                    type="password"
                                />
                            </Row>
                            <Row>
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
                            </Row>
                            <Row>
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
                            </Row>
                            <ServerError serverError={response.error} errors={errors}/>
                            <hr/>
                            <div
                                className="container d-flex gap-2 justify-content-center mx-auto my-3 text-center p-3 start-0">
                                <SignUpButton onClick={handleSubmit(onSignUpClick)} isSigning={response.isLoading}/>
                                <VerticalRule/>
                                <LogInButton/>
                            </div>
                        </form>
                    </Row>
                </Row>
                <Footer/>
            </Container>
        </div>
    );
}
