import Classes from 'pages/classes/index';
import React from 'react';
import Link from 'next/link';
import { useTokenPersistanceService, useUserData } from 'pages/utils/hooks';
import { useRouter } from 'next/router';
import styles from 'pages/header.module.scss';
import Account from './account';
import Logo from './logo';
import Script from 'next/script';
import ClassPage from './class/[id]';

function LogoutButton() {
  const tokenService = useTokenPersistanceService();
  const router = useRouter();

  function removeToken() {
    tokenService.removeToken();
    router.push('/login');
  }

  return (
    <button
      type="button"
      className="btn btn-outline-primary"
      onClick={removeToken}
    >
      Logout
    </button>
  );
}

function Loading() {
  return (
    <div className={styles['profile-pic-size'] + ' d-inline'}>
      <div
        className={
          'spinner-grow text-primary align-middle mx-2 p-3 ' +
          styles['spinner-size']
        }
        role="status"
      >
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
}

type HeaderParams = {
  currentComponent: JSX.Element;
};
function Header({ currentComponent }: HeaderParams) {
  const tabs = [Classes, Account, ClassPage];

  if (!tabs.find((element) => element.name == currentComponent.type.name))
    return <></>;

  const user = useUserData();
  function getProfilePicSource(): string {
    return user
      ? `https://api.dicebear.com/6.x/lorelei/svg/seed=${user.username}`
      : '';
  }

  function headerDiv() {
    return (
      <header className="p-3 bg-dark text-white">
        {/* <Script src={"./node_modules/bootstrap/dist/js/bootstrap.bundle"}/> */}
        <div className="navbar navbar-expand-lg navbar-dark">
          <div className="navbar-brand border rounded me-2">
            <Logo />
          </div>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse col" id="navbarNav">
            <ul className="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">
              <li>
                <Link
                  href={'/classes'}
                  className="nav-link px-2 text-secondary"
                >
                  Home
                </Link>
              </li>
            </ul>
            <div className="text-center text-lg-end">
              {user ? (
                <img
                  id="profilePic"
                  height="48"
                  width="48"
                  className="rounded-circle bg-light border border-primary mx-2"
                  alt={`Profile picture for ${user ? user.username : 'user'}`}
                  src={getProfilePicSource()}
                />
              ) : (
                <Loading />
              )}
              <LogoutButton />
            </div>
          </div>
        </div>
        <Script src="" />
      </header>
    );
  }
  
  return tabs.find((element) => element.name == currentComponent.type.name) ? (
    headerDiv()
  ) : (
    <></>
  );
}

export default Header;
