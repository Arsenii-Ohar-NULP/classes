import Class from 'components/classes/Class';
import React, { FunctionComponent, useState } from 'react';
import { TransparentField } from 'components/class/TransparentField';
import TransparentTextArea from 'components/class/TransparentTextArea';
import EditClassButton from 'components/class/EditClassButton';
import SaveEditButton from 'components/class/SaveEditButton';
import CancelEditButton from 'components/class/CancelEditButton';
import { useLogout } from 'components/login/AuthService';
import {
    EditClassData,
    editClass,
  } from 'components/class/ClassService';
  import { IClassData, useClassForm } from 'components/class/useClassForm';
import InvalidCredentials from 'components/errors/InvalidCredentials';
import { useAppSelector } from 'components/redux/store';

interface ClassInfoProps {
    cls: Class;
    joined: boolean;
    saveClass: (cls: Class) => void
}

const ClassInfo: FunctionComponent<ClassInfoProps> = ({cls, joined, saveClass}) => {
  const [editMode, setEditMode] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const { register, handleSubmit } = useClassForm();
  const userId = useAppSelector((state) => state.auth.user?.id);
  const logout = useLogout();

  function saveEditing(data) {
    const changedData = cleanChangedData(data);
    changedData['id'] = cls.id;

    if (!hasDataChanged(changedData)) {
      alert('Class information has not been changed');
      return;
    }
    setIsSaving(true);
    editClass(changedData as EditClassData)
      .then(() => {
        saveClass({ ...cls, ...changedData });
        setEditMode(false);
      })
      .catch((error) => {
        if (error instanceof InvalidCredentials) {
          logout();
        }
      })
      .finally(() => setIsSaving(false));
  }

  function cancelEditing() {
    setEditMode(false);
  }

  const cleanChangedData = (data: IClassData) => {
    const changedData = {};
    if (!cls) {
      return changedData;
    }
    for (const key of Object.keys(data)) {
      if (cls[key.toLowerCase()] !== data[key] && data[key] !== '') {
        changedData[key.toLowerCase()] = data[key];
      }
    }

    return changedData;
  };

  const hasDataChanged = (data) => {
    return Object.keys(data).length !== 0;
  };

  return (
    <div className="d-flex flex-column align-items-start flex-grow-1">
      <form className="w-100">
        <div className="pt-lg-3 px-3 pb-0">
          <p className="m-0 fs-3">
            {editMode ? (
              <TransparentField
                defaultValue={cls.title}
                placeholder={'Enter a title'}
                id={'titleInput'}
                register={register('Title')}
              />
            ) : (
              cls.title + ' '
            )}

            {joined && (
              <span className="badge badge-primary align-middle text-dark bg-primary fs-6 me-2">
                Joined
              </span>
            )}
            {userId == cls.teacher_id && !editMode && (
              <span className="badge badge-primary align-middle text-dark bg-primary fs-6">
                Teacher
              </span>
            )}
          </p>
        </div>
        <div className="px-3">
          <a>
            <p className="fs-5">{`${cls['teacher_first_name']} ${cls['teacher_last_name']}`}</p>
          </a>
        </div>
        <div className="px-3">
          {editMode ? (
            <TransparentTextArea
              placeholder="Enter a description"
              id={'descriptionInput'}
              defaultValue={cls.description}
              rows={3}
              register={register('Description')}
            />
          ) : (
            <p className="fs-6">{cls.description}</p>
          )}
        </div>
        <div></div>
        <div className="px-3">
          {editMode ? (
            <div className="d-flex flex-sm-row flex-lg-row gap-1">
              <SaveEditButton
                handleClick={handleSubmit(saveEditing)}
                isSaving={isSaving}
              />
              <CancelEditButton
                handleClick={cancelEditing}
                isSaving={isSaving}
              />
            </div>
          ) : (
            userId == cls?.teacher_id && (
              <EditClassButton handleClick={() => setEditMode(!editMode)} />
            )
          )}
        </div>
      </form>
    </div>
  );
};

export default ClassInfo;
