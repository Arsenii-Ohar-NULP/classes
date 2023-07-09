import React from 'react';

export default function EditButton({ onClick, disabled }: { onClick: () => void, disabled: boolean }) {
  return (
    <div className="text-center">
      <button type="submit" className="btn btn-primary" onClick={onClick} disabled={disabled}>
        Save
      </button>
    </div>
  );
}
