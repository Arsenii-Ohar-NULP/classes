import Classes from 'pages/classes/index';
import React from 'react';
import Link from 'next/link';
import AccountPage from '../account';
import Logo from '../utils/Logo';
import ClassPage from '../class/[id]';
import  { Role } from '../account/User';
import { useAppSelector } from '../redux/store';
import Requests from '../requests/[id]';
import AddClassPage from 'pages/addClass';
import EditAccountPage from 'pages/account/edit';
import AddClassButton from './AddClassButton';
import Loading from './Loading';
import AccountButton from './AccountButton';
import LogoutButton from './LogoutButton';
import styles from 'pages/header/header.module.scss';

type HeaderParams = {
  currentComponent: any;
};

function Header({ currentComponent }: HeaderParams) {
  const tabs = [
    Classes,
    AccountPage,
    ClassPage,
    Requests,
    AddClassPage,
    EditAccountPage,
  ];

  if (!tabs.find((element) => element.name == currentComponent?.name))
    return <></>;

  const user = useAppSelector((state) => state.auth.user);

  function HeaderDiv() {
    return (
      <header className={'p-3 text-white position-relative'}>
        <div className={styles['blur-100']}>
          <div className={styles['header-background']}></div>
        </div>
        <div className="navbar navbar-expand-lg">
          <div className="navbar-brand rounded me-2">
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
              {user?.role === Role.Teacher && <AddClassButton />}
              {user ? <AccountButton user={user} /> : <Loading />}
              <LogoutButton />
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    tabs.find((element) => element.name == currentComponent.name) && HeaderDiv()
  );
}

export default Header;
