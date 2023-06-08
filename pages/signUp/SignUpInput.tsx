import * as React from 'react';
import { useMessageReplacer } from 'pages/utils/hooks';
type SignUpInputProps = {
    id: string;
    placeholder: string;
    defaultValue?: string;
    label: string;
    isColumnized?: boolean;
    registration: object;
    error: string;
    type?: string;
  };
  
export default function SignUpInput({
    id,
    placeholder,
    defaultValue,
    label,
    isColumnized,
    registration,
    error,
    ...other
  }: SignUpInputProps) {
    const normalizer = useMessageReplacer({
      FirstName: 'First Name',
      LastName: 'Last Name',
      PhoneNumber: 'Phone Number',
    });
    return (
      <div className={'p-1 ' + (isColumnized ? 'col-lg' : '')}>
        <label htmlFor={id} className="form-label">
          <b>{label}</b>
        </label>
  
        <input
          className="form-control"
          id={id}
          placeholder={placeholder}
          defaultValue={defaultValue}
          {...registration}
          {...other}
        />
  
        <div className={'invalid'}>{error ? normalizer(error) : ''}</div>
      </div>
    );
  }