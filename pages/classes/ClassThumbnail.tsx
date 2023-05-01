import React from 'react';
import styles from 'pages/classes/classes.module.scss';
import unknownPic from 'public/images/unknown.jpg';
import { useState, useEffect } from 'react';
import { findClassThumbnail } from 'pages/header/ClassThumbnailService';
import Class from './Class';

function ImageLoading() {
  return (
    <div className="spinner-border text-primary" role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
  );
}

export default function ClassThumbnail({ cls }: { cls: Class }) {
  const [image, setImage] = useState(null);

  useEffect(() => {
    findClassThumbnail(cls.id)
      .then((data) => {
        if (data == null) {
          throw new Error();
        }
        setImage(`data:image/png; base64, ${data}`);
      })
      .catch(() => {
        setImage(unknownPic.src);
      });
  }, [image]);

  return (
    <>
      {image ? (
        <img
          className={
            'rounded text-center border border-dark ' + styles['thumbnail']
          }
          alt={cls.title}
          src={image}
        />
      ) : (
        <ImageLoading />
      )}
    </>
  );
}
