import Class from 'components/classes/Class';
import React from 'react';
export default function ClassMock({ cls }: { cls: Class }) {
  return <div data-testid={`class-${cls.id}`}>{cls.title}</div>;
}
