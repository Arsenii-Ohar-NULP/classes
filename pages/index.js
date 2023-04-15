import { AccessTokenKey } from './contexts';
import { AuthService } from './authService';
import React, { useContext, useEffect } from 'react';
import Login from './login';
import { useRouter } from 'next/router';

export default function Index() {
    const accessTokenKey = useContext(AccessTokenKey);
    const router = useRouter();
    useEffect(() => {
        const getAccessToken = () => new AuthService(accessTokenKey).getAccessToken();

        if (getAccessToken()){
            router.push('./classes');
        }
    })

    return <><Login/></>;
}
