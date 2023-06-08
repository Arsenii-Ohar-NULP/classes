import * as React from 'react';
import styles from 'pages/class/class.module.scss'
import { InputProps } from './InputProps';

export function TransparentField({ defaultValue, placeholder, id, register }: InputProps) {
    return (
      <input
        type="text"
        className={styles['transparent-input']}
        id={id}
        defaultValue={defaultValue}
        placeholder={placeholder}
        {...register}
      ></input>
    );
  }