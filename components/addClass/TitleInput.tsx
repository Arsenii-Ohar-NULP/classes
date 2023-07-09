import React from 'react';

export default function TitleInput({
    errorMessage,
    registration,
  }: {
    errorMessage?: string;
    id: string;
    placeholder: string;
    registration: object;
  }) {
    return (
      <form className="my-2 has-validation">
        <input
          placeholder='Enter a title'
          id='title'
          className={
            'form-control rounded p-1 px-2' +
            (errorMessage ? ' invalid-input' : '')
          }
          {...registration}
        />
        <div className={'invalid'}>{errorMessage ? errorMessage : ''}</div>
      </form>
    );
  }