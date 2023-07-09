import clsx from 'clsx';
import React, { FunctionComponent, useState } from 'react';
import styles from 'components/class/class.module.scss';
import JoinButton from './JoinButton';
import { RequestsButton } from './RequestsButton';
import DeleteClassButton from './DeleteClassButton';
import DeleteClassModal from './DeleteClassModal';
import Class from 'components/classes/Class';
import { useAppSelector } from 'components/redux/store';

interface ClassInfoManagementProps {
  cls: Class;
}

const ClassInfoManagement: FunctionComponent<ClassInfoManagementProps> = ({
  cls,
}) => {
  const [showDelete, setShowDelete] = useState<boolean>();
  const userId = useAppSelector((state) => state.auth.user?.id);

  return (
    <div
      className={clsx(
        'd-flex justify-content-end align-items-center mb-2',
        styles['join-button']
      )}
    >
      <div className="d-flex flex-sm-row flex-lg-column align-items-center flex-column gap-2">
        <JoinButton userId={userId} cls={cls} />
        <RequestsButton classId={cls.id} />
        <DeleteClassButton onDelete={() => setShowDelete(true)} />
        <DeleteClassModal
          classId={cls.id}
          onDelete={() => null}
          show={showDelete}
          close={() => setShowDelete(false)}
        />
      </div>
    </div>
  );
};

export default ClassInfoManagement;
