import { useContext, useEffect} from 'react';
import { AuthService, TokenPersistanceService } from './authService';
import { AccessTokenKey } from './contexts';
import { useRouter } from 'next/router';
import ClassRepository from './classes/ClassRepository';

function useAuthService(){
    const accessTokenKey = useContext(AccessTokenKey);
    const authService = new AuthService(accessTokenKey)

    return authService;
}

function useLoginRedirect(){
    const authService = useAuthService();
    const router = useRouter();

    useEffect(() => {
        const getAccessToken = () => authService.getAccessToken();

        if (!getAccessToken()) {
            router.push("/login");
        }
    });

    return authService;
}

function useClassRepository(){
    const authService = useAuthService();
    const classRepository = new ClassRepository(authService);

    return classRepository;
}

function useTokenPersistanceService(){
    const accessTokenKey = useContext(AccessTokenKey);
    const tokenPersistanceService = new TokenPersistanceService(accessTokenKey);
    
    return tokenPersistanceService;
}
export {useAuthService, useLoginRedirect, useClassRepository, useTokenPersistanceService};