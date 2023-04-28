import { findClassThumbnail } from 'pages/ClassThumbnailService';
import React from 'react';
import { useState, useEffect } from 'react';
import Class from './Class';
import styles from 'pages/classes/classes.module.scss';

function ImageLoading() {
    return (
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    );
  }

export function ClassUI({ cls }: { cls: Class }) {
    const [image, setImage] = useState(null);
  
    useEffect(() => {
      findClassThumbnail(cls.id).then((data) => {
        setImage(data);
      });
    }, [image]);
  
    return (
      <div className={'text-center m-2 p-4'} title={cls.title}>
        {image ? (
          <img
            className={
              'rounded text-center border border-dark ' + styles['thumbnail']
            }
            alt={cls.title}
            src={`data:image/png; base64, ${image}`}
          />
        ) : (
          <ImageLoading />
        )}
        <h5 className="text-wrap mt-3">{cls.title}</h5>
      </div>
    );
  }