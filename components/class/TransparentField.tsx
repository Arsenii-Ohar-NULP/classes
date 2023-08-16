import * as React from 'react';
import styles from 'components/class/class.module.scss'
import { InputProps } from 'components/class/InputProps';
import clsx from "clsx";

export function TransparentField({ defaultValue, placeholder, id, register, className }: InputProps) {
    return (
      <input
        type="text"
        className={clsx(styles['transparent-input'], className)}
        id={id}
        defaultValue={defaultValue}
        placeholder={placeholder}
        {...register}
      ></input>
    );
  }