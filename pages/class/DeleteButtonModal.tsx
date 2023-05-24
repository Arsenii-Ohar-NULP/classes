import React from 'react';
import { useRouter } from 'next/router';
import { useAppDispatch } from 'pages/redux/store';
import InvalidCredentials from 'pages/errors/InvalidCredentials';
import { removeMessage } from './MessageService';
import { logout } from 'pages/login/AuthService';
import { Button, Modal } from 'react-bootstrap';


export default function DeleteMessageModal({
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
    const router = useRouter();
    const dispatch = useAppDispatch();
  
    function deleteMessage() {
      removeMessage(messageId)
        .then(() => {
          onDelete();
          close();
        })
        .catch((error) => {
          if (error instanceof InvalidCredentials) {
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
            The message will be deleted and there is no way to undo this. Are you
            sure?
          </Modal.Body>
          <Modal.Footer>
            <Button variant="danger" onClick={deleteMessage}>
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