import React from 'react';
export default function FileInput({
    id,
    placeholder,
    registration,
  }: {
    id: string;
    placeholder: string;
    registration: object;
  }) {
    return (
      <div className="mb-3">
        <label htmlFor="formFile" className="form-label">
          {placeholder}
        </label>
        <input
          className="form-control form-control-sm"
          accept=".jpg, .png"
          type="file"
          id={id}
          data-testid={'file-input'}
          {...registration}
        />
      </div>
    );
  }