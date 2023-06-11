import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useAppDispatch } from 'components/redux/store';
import InvalidCredentials from 'components/errors/InvalidCredentials';
import { removeMessage } from 'components/class/MessageService';
import { logout } from 'components/login/AuthService';
import { Button, Modal } from 'react-bootstrap';


export default function DeleteMessageButtonModal({
    messageId,
    onDelete,
    show,
    close,
  }: {
    messageId: number;
    onDelete: () => void;
    show: boolean;
    close: () => void;
  }) {
    const [isDeleting, setIsDeleting] = useState<boolean>(false);

    const router = useRouter();
    const dispatch = useAppDispatch();
  
    function deleteMessage() {
      setIsDeleting(true);
      removeMessage(messageId)
        .then(() => {
          onDelete();
          close();
        })
        .catch((error) => {
          if (error instanceof InvalidCredentials) {
            logout(dispatch, router);
          }
        })
        .finally(
          () => setIsDeleting(false)
        );
    }
  
    return (
      <>
        <Modal show={show} backdrop={true} onHide={close} keyboard={false}>
          <Modal.Header closeButton={!isDeleting}>
            <Modal.Title>Are you sure?</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            The message will be deleted and there is no way to undo this. Are you
            sure?
          </Modal.Body>
          <Modal.Footer>
            <Button variant="danger" onClick={deleteMessage} disabled={isDeleting}>
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