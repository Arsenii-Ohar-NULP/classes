import * as React from 'react';
import { InputProps } from './InputProps';
import styles from 'pages/class/class.module.scss';

export default function TransparentTextArea({
  defaultValue,
  placeholder,
  id,
  rows,
  register
}: InputProps & {
  rows: number;
}) {
  return (
    <textarea
      className={styles['transparent-input']}
      id={id}
      defaultValue={defaultValue}
      placeholder={placeholder}
      rows={rows}
      {...register}
    ></textarea>
  );
}