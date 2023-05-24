import React from 'react';

export default function TextInput({
    errorMessage,
    id,
    placeholder,
    registration,
    ...other
  }: {
    errorMessage?: string;
    id: string;
    placeholder: string;
    registration: object;
  }) {
    return (
      <form className="my-2 has-validation">
        <input
          placeholder={placeholder}
          id={id}
          className={
            'form-control-lg rounded-4 p-1 px-2' +
            (errorMessage ? ' invalid-input' : '')
          }
          {...registration}
          {...other}
        />
        <div className={'invalid'}>{errorMessage ? errorMessage : ''}</div>
      </form>
    );
  }