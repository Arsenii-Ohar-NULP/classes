import React from 'react';
import styles from 'pages/header/header.module.scss';

export default function Loading() {
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