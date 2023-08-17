import LogoPic from 'components/utils/Logo';
import * as React from 'react';
export default function Footer() {
    return (
      <footer className="d-flex justify-content-center p-3 align-items-end">
        <a href="example.com" className="text-decoration-none">
          <LogoPic />
        </a>
      </footer>
    );
  }