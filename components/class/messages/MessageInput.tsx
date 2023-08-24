import React, { useState } from 'react';
import Image from 'next/image';
import sendIcon from 'icons/send.svg';
import Message from 'components/class/messages/Message';
import { useAppSelector } from 'components/redux/store';
import { Button, Spinner } from 'react-bootstrap';
import styles from 'components/class/class.module.scss';
import clsx from 'clsx';
import { socket } from 'components/utils/socket';
import { MessageType } from './MessageType';
import { MessageReceivedStatus } from './MessageReceivedStatus';

export function MessageInput({
  forbidden,
  onSend,
  classId,
}: {
  forbidden: boolean;
  onSend: (message: Message) => void;
  classId: number;
}) {
  const [messageText, setMessage] = useState<string>(null);
  const [isSending, setIsSending] = useState<boolean>(false);

  const userId = useAppSelector((state) => state.auth.user?.id);
  const username = useAppSelector((state) => state.auth.user?.username);
  const firstName = useAppSelector((state) => state.auth.user?.firstName);
  const lastName = useAppSelector((state) => state.auth.user?.lastName);

  async function socketSend() {
    const message = {
      content: messageText,
      user: userId,
      cls: classId,
    } as Message;
    setIsSending(true);
    if (socket.disconnected) {
      console.log("Damn, it's disconnected");
    }
    const response = await socket.emitWithAck(
      'message',
      MessageType.TEXT,
      message
    );
    if (response.status === MessageReceivedStatus.OK) {
      onSuccess(message, { id: response.id });
    }
    setIsSending(false);
  }

  function onSuccess(message: Message, data) {
    message.username = username;
    message.fullname = `${firstName} ${lastName}`;
    message.id = data?.id;
    onSend(message);
    setMessage('');
  }

  function isEmptyOrSpaces(str: string) {
    return str === null || str.match(/^ *$/) !== null;
  }

  return (
    <div className="fixed-bottom m-4">
      <form>
        <div className="input-group">
          <input
            className="form-control rounded-3 bg-dark text-light"
            placeholder="Enter any message you like"
            onChange={(e) => setMessage(e.target.value)}
            value={messageText}
            disabled={forbidden}
          ></input>
          <Button
            variant="primary"
            className={clsx({
              'visually-hidden':
                messageText == null || isEmptyOrSpaces(messageText),
              'px-3 py-1': true,
            })}
            onClick={socketSend}
            disabled={isSending}
          >
            {isSending ? (
              <Spinner className={styles['send-message-spinner']} />
            ) : (
              <Image alt={'Send Icon'} src={sendIcon} width={24} height={24} />
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
