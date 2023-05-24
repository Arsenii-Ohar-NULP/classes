import React from 'react';
type FormInputProps = {
  errorMessage?: string;
  id: string;
  placeholder: string;
  registration: object;
  value?: string;
  type?: string;
};
export function EditAccountInput({
  errorMessage,
  id,
  placeholder,
  registration,
  value="",
  ...other
}: FormInputProps) {
  return (
    <div className="my-2 has-validation">
      <label htmlFor={id} className="form-label">{id}</label>
      <input
        placeholder={placeholder}
        id={id}
        defaultValue={value}
        className={
          'form-control rounded p-1 px-2' +
          (errorMessage ? ' invalid-input' : '')
        }
        {...registration}
        {...other}
      />
      <div className={'invalid'}>{errorMessage ? errorMessage : ''}</div>
    </div>
  );
}
