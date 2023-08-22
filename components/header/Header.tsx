import React from 'react';
import Link from 'next/link';
import LogoPic from 'components/utils/Logo';
import  { Role } from 'components/account/User';
import { useAppSelector } from 'components/redux/store';
import AddClassButton from 'components/header/AddClassButton';
import Loading from 'components/header/Loading';
import AccountButton from 'components/header/AccountButton';
import LogoutButton from 'components/header/LogoutButton';
import styles from 'components/header/header.module.scss';
import {Navbar, NavbarBrand} from "react-bootstrap";
import NavbarToggle from "react-bootstrap/NavbarToggle";


export default function Header() {

  const user = useAppSelector((state) => state.auth.user);

    return (
      <header className={'p-3 text-white position-relative'}>
        <div className={styles['blur-100']}>
          <div className={styles['header-background']}></div>
        </div>
        <Navbar expand={'lg'}>
          <NavbarBrand className="rounded me-2">
            <LogoPic />
          </NavbarBrand>
          <NavbarToggle
            type="button"
            aria-controls="navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </NavbarToggle>
          <Navbar.Collapse className="col" id="navbarNav">
            <ul className="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">
              <li>
                <Link
                  href={'/main/classes'}
                  className="nav-link px-2 text-dark"
                >
                  <b>Home</b>
                </Link>
              </li>
            </ul>

            <div className="text-center text-lg-end">
              {user?.role === Role.Teacher && <AddClassButton />}
              {user ? <AccountButton user={user} /> : <Loading />}
              <LogoutButton />
            </div>
          </Navbar.Collapse>
        </Navbar>
      </header>
    );
}
