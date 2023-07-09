import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useAppDispatch } from 'components/redux/store';
import { Button, Modal } from 'react-bootstrap';
import { classesActions } from 'components/redux/classes';
import { removeClass } from './ClassService';
import InvalidCredentials from 'components/errors/InvalidCredentials';
import { logout } from 'components/login/AuthService';


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
    const [isDeleting, setIsDeleting] = useState<boolean>(false);
    const router = useRouter();
    const dispatch = useAppDispatch();
  
    function deleteClass() {
      setIsDeleting(true);
        removeClass(classId).then(() => {
            dispatch(classesActions.deleteUserClass(classId));
            router.push('/classes');
          })
          .catch((error) => {
            if (error instanceof InvalidCredentials){
              logout(dispatch, router);
            }
            setIsDeleting(false)
          })
    }
  
    return (
      <>
        <Modal show={show} backdrop={true} onHide={close} keyboard={false}>
          <Modal.Header closeButton={!isDeleting}>
            <Modal.Title>Are you sure?</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            The class will be deleted and there is no way to undo this. Are you
            sure?
          </Modal.Body>
          <Modal.Footer>
            <Button variant="danger" onClick={deleteClass} disabled={isDeleting}>
              Delete
            </Button>
            <Button variant="success" onClick={close} disabled={isDeleting}>
              No, take me back
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }