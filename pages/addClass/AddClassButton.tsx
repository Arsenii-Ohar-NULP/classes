import React from 'react';
export default function AddClassButton({disabled}: {disabled: boolean}) {
    return (
      <button type="submit" className="btn btn-primary" disabled={disabled}>
        Add
      </button>
    );
  }