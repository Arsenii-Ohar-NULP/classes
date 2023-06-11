import React from 'react';

export default function DescriptionInput({
    errorMessage,
    registration,
  }: {
    errorMessage?: string;
    registration: object;
  }) {
    return (
      <form className="my-2 has-validation">
        <textarea
          placeholder='Enter a description'
          id='description'
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