import Classes from 'pages/classes/index';
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from 'pages/header/header.module.scss';
import AccountPage from '../account';
import Logo from '../utils/logo';
import ClassPage from '../class/[id]';
import User, { Role } from '../account/User';
import { useAppDispatch, useAppSelector } from '../redux/store';
import RequestsPage from '../requests/[id]';
import ProfilePicture from '../ProfilePic';
import { logout } from '../login/AuthService';
import AddClassPage from 'pages/addClass';
import EditAccountPage from 'pages/account/edit';
import AddClassButton from './AddClassButton';

function LogoutButton() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  return (
    <button
      type="button"
      className="btn btn-outline-primary"
      onClick={() => logout(dispatch, router)}
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
  currentComponent: any;
};

function AccountButton({ user }: { user: User }) {
  
  return (
    <Link href={'/account'} className={"nav-link px-2 text-secondary d-inline"}>
      <ProfilePicture user={user} hoverOn={true}/>
    </Link>
  );
}

function Header({ currentComponent }: HeaderParams) {
  const tabs = [Classes, AccountPage, ClassPage, RequestsPage, AddClassPage, EditAccountPage];

  if (!tabs.find((element) => element.name == currentComponent?.name))
    return <></>;

  const user = useAppSelector((state) => state.auth.user);

  function HeaderDiv() {
    return (
      <header className="p-3 bg-dark text-white">
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
                  className="nav-link px-2 text-light"
                >
                  Home
                </Link>
              </li>
            </ul>
            <div className="text-center text-lg-end">
              {user?.role === Role.Teacher && <AddClassButton/>}
              {user ? <AccountButton user={user} /> : <Loading />}
              <LogoutButton />
            </div>
          </div>
        </div>
      </header>
    );
  }

  return tabs.find((element) => element.name == currentComponent.name) && (
    HeaderDiv()
  );
}

export default Header;
