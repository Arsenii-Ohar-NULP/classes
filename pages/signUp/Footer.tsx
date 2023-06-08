import Logo from 'pages/utils/logo';
import * as React from 'react';
export default function Footer() {
    return (
      <footer className="d-flex justify-content-center p-3 align-items-end">
        <a href="example.com" className="text-decoration-none">
          <Logo />
        </a>
      </footer>
    );
  }