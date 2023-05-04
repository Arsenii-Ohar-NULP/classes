import React from 'react';

export default function EditButton({ onClick }: { onClick: () => void }) {
  return (
    <div className="text-center">
      <button type="submit" className="btn btn-primary" onClick={onClick}>
        Edit
      </button>
    </div>
  );
}
