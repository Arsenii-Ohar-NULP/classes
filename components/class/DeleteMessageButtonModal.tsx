import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { socket } from 'components/utils/socket';
import { DeleteMessageStatus } from './DeleteMessageStatus';

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

  async function deleteMessageSocket() {
    setIsDeleting(true);
    const response = await socket.emitWithAck('deleteMessage', messageId);
    if (response.status === DeleteMessageStatus.OK) {
      onDelete();
      close();
    }
    // TODO: Handle stuff here
    setIsDeleting(false);
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
          <Button
            variant="danger"
            onClick={deleteMessageSocket}
            disabled={isDeleting}
          >
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
