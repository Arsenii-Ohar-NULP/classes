import { redirect } from 'next/navigation';
import { AccessTokenKey } from './contexts';
import { AuthService } from './authService';
import { useContext, useEffect } from 'react';
import Login from './login';

export default function Index() {
    const accessTokenKey = useContext(AccessTokenKey);
    useEffect(() => {
        const getAccessToken = () => new AuthService(accessTokenKey).getAccessToken();

        if (getAccessToken()){
            redirect('/classes');
        }
    })
    

    return <><Login/></>;
}
