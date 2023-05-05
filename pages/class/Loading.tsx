import React from 'react';
export function Loading() {
    return (
      <div className="">
        <div className="spinner-border text-primary text-center" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }