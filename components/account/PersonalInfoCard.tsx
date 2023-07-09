import React from 'react';
function PersonalInfoCard({ label, data }: { label: string; data: string }) {
  return (
    <>
      <div className="d-flex gap-5">
        <h6 className="col">{label}</h6>
        <h6 className="col">{data}</h6>
      </div>
      <hr />

    </>
  );
}

export default PersonalInfoCard;
