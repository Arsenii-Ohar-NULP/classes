import React from 'react';
import Head from 'next/head';
import Class from 'pages/classes/Class';
import styles from 'pages/class/class.module.scss';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useLoginRedirect } from 'pages/utils/hooks';
import { EditClassData, editClass, findClass } from 'pages/class/ClassService';
import { MessagesBar } from 'pages/class/MessagesBar';
import { useAppSelector } from 'pages/redux/store';
import { RequestsButton } from 'pages/class/RequestsButton';
import DeleteClassButton from 'pages/class/DeleteClassButton';
import JoinButton from 'pages/class/JoinButton';
import ClassThumbnail from 'pages/classes/ClassThumbnail';
import { Loading } from 'pages/class/Loading';
import DeleteClassModal from 'pages/class/DeleteClassModal';
import { TransparentField } from 'pages/class/TransparentField';
import TransparentTextArea from 'pages/class/TransparentTextArea';
import EditClassButton from 'pages/class/EditClassButton';
import SaveEditButton from 'pages/class/SaveEditButton';
import CancelEditButton from 'pages/class/CancelEditButton';
import { IClassData, useClassForm } from './useClassForm';
import { useLogout } from 'pages/login/AuthService';
import InvalidCredentials from 'pages/errors/InvalidCredentials';

export default function ClassPage() {
  useLoginRedirect();

  const router = useRouter();
  const [editMode, setEditMode] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [cls, setClass] = useState<Class>(null);
  const [joined, setJoined] = useState<boolean>(false);
  const [showDelete, setShowDelete] = useState<boolean>();
  
  const logout = useLogout();

  const userId = useAppSelector((state) => state.auth.user?.id);
  const {register, handleSubmit} = useClassForm();

  function redirectToUnknown() {
    router.push('/404');
  }

  function noIdSpecified(): boolean {
    return !router.query['id'];
  }

  function fetchClass() {
    const id = Number.parseInt(router.query.id as string);
    findClass(id)
      .then((cls) => {
        setClass(cls);
      })
      .catch((e) => console.log(e));
  }

  const cleanChangedData = (data: IClassData) => {
    const changedData = {};
    if (!cls){
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

  function saveEditing(data) {
    const changedData = cleanChangedData(data);
    changedData['id'] = cls.id;

    if (!hasDataChanged(changedData)){
      alert('Class information has not been changed')
      return;
    }
    setIsSaving(true);
    editClass(changedData as EditClassData)
    .then(() => {
      setClass({...cls, ...changedData});
      setEditMode(false);
    })
    .catch(
      (error) => 
      {
        if (error instanceof InvalidCredentials){
          logout(); 
        }
      }
    )
    .finally(
      () => setIsSaving(false)
    )
  }

  function cancelEditing() {
    setEditMode(false);
  }

  useEffect(() => {
    if (noIdSpecified()) {
      return;
    }

    if (!cls) {
      try {
        fetchClass();
      } catch (e) {
        redirectToUnknown();
      }
    }
  }, [cls]);

  if (!cls)
    return (
      <div className="vh-100 d-flex justify-content-center align-items-center">
        <Loading />
      </div>
    );
  return (
    <>
      <div>
        <Head>
          <title>Classes - {cls?.title ? cls.title : 'loading'}</title>
        </Head>
        <div className="container">
          <div className="container card bg-secondary text-white w-auto rounded shadow mt-sm-1 py-2">
            <div className="d-flex flex-wrap justify-content-center gap-2">
              <ClassThumbnail cls={cls} />
              <div className="d-flex flex-column align-items-center">
                <form>
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
                  <div>
                    
                  </div>
                  {editMode ? (
                    <div className="d-flex flex-sm-row flex-lg-row gap-1">
                      <SaveEditButton handleClick={handleSubmit(saveEditing)} isSaving={isSaving}/>
                      <CancelEditButton handleClick={cancelEditing} isSaving={isSaving}/>
                    </div>
                  ) : userId == cls?.teacher_id && (
                    <EditClassButton
                      handleClick={() => setEditMode(!editMode)}
                    />
                  )}
                </form>
                
              </div>
              
              <div
                className={
                  'd-flex justify-content-end align-items-center mb-2 ' +
                  styles['join-button']
                }
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
            </div>
          </div>

          <MessagesBar cls={cls} onForbidden={() => setJoined(false)} />
        </div>
      </div>
    </>
  );
}
