import { useContext, useEffect, useState } from 'react';
import { AuthService, TokenPersistanceService } from 'pages/login/authService';
import { AccessTokenKey } from 'pages/utils/contexts';
import { useRouter } from 'next/router';
import ClassRepository from 'pages/ClassRepository';
import UserService from 'pages/userService';
import ClassThumbnailRepository from 'pages/ClassThumbnailRepository';
import SignUpService from 'pages/signUp/signUpService';
import User from 'pages/User';
import InvalidCredentials from 'pages/errors/InvalidCredentials';
import MessageRepository from 'pages/class/MessageRepository';

function useAuthService() {
  const accessTokenKey = useContext(AccessTokenKey);
  const authService = new AuthService(accessTokenKey);

  return authService;
}

function useLoginRedirect() {
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

function useClassRepository() {
  const authService = useAuthService();
  const classRepository = new ClassRepository(authService);

  return classRepository;
}

function useThumbnailRepository(): ClassThumbnailRepository {
  const thumbnailRepository = new ClassThumbnailRepository();

  return thumbnailRepository;
}

function useTokenPersistanceService() {
  const accessTokenKey = useContext(AccessTokenKey);
  const tokenPersistanceService = new TokenPersistanceService(accessTokenKey);

  return tokenPersistanceService;
}

function useUserData() {
  const authService = useAuthService();
  const tokenPersistanceService = useTokenPersistanceService();
  const router = useRouter();
  const userService = new UserService();
  const [user, setUser] = useState<User>(null);
  useEffect(() => {
    if (!user) {
      const token = authService.getAccessToken();
      userService
        .getUserInfo(token)
        .then((fetchedUser) => setUser(fetchedUser))
        .catch((e) => {
            if (e instanceof InvalidCredentials){
                tokenPersistanceService.removeToken();
                router.push('/login');
            }
        });
    }
  });

  return user;
}

function useUserService(): UserService {
  const userService = new UserService();

  return userService;
}

function useSingUpService(){
  const service = new SignUpService();

  return service;
}

function useMessagesRepository(){
  const authService = useAuthService();
  const messageRepository = new MessageRepository(authService);

  return messageRepository;
}

function useMainPageRedirect() {
  const mainPagePath = '/classes';
  const authService = useAuthService();
  const userService = useUserService();
  const router = useRouter();

  useEffect(
      () => {
          const token = authService.getAccessToken();
          if (token) {
              userService.getUserInfo(token).then(() => router.push(mainPagePath));
          }
      }
  )
}

export {
  useAuthService,
  useLoginRedirect,
  useClassRepository,
  useTokenPersistanceService,
  useUserData,
  useThumbnailRepository,
  useSingUpService,
  useMessagesRepository,
  useUserService,
  useMainPageRedirect
};
