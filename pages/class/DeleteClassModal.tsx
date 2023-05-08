import React from 'react';
import { useRouter } from 'next/router';
import { useAppDispatch } from 'pages/redux/store';
import { Button, Modal } from 'react-bootstrap';
import { classesActions } from 'pages/redux/classes';
import { removeClass } from './ClassService';
import InvalidCredentials from 'pages/errors/InvalidCredentials';
import { logout } from 'pages/login/authService';


export default function DeleteClassModal({
    classId,
    onDelete,
    show,
    close
  }: {
    classId: number;
    onDelete: () => void;
    show: boolean;
    close: () => void;
  }) {
    const router = useRouter();
    const dispatch = useAppDispatch();
  
    function deleteClass() {
        removeClass(classId).then(() => {
            dispatch(classesActions.deleteUserClass(classId));
            router.push('/classes');
          })
          .catch((error) => {
            if (error instanceof InvalidCredentials){
              logout(dispatch, router);
            }
          });
    }
  
    return (
      <>
        <Modal show={show} backdrop={true} onHide={close} keyboard={false}>
          <Modal.Header closeButton>
            <Modal.Title>Are you sure?</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            The class will be deleted and there is no way to undo this. Are you
            sure?
          </Modal.Body>
          <Modal.Footer>
            <Button variant="danger" onClick={deleteClass}>
              Delete
            </Button>
            <Button variant="success" onClick={close}>
              No, take me back
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }