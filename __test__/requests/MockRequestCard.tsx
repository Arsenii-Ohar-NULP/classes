import * as React from 'react';

export const MockRequestCard = ({
    userId,
    classId,
    onResolved
}: {
  userId: number;
  classId: number;
  onResolved: VoidFunction;
}) => (
  <div>
    {userId}-{classId}
  </div>
);
