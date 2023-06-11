import React, { useState } from 'react';
import Image from 'next/image';
import sendIcon from 'icons/send.svg';
import Message from 'components/class/Message';
import InvalidCredentials from 'components/errors/InvalidCredentials';
import { useAppDispatch, useAppSelector } from 'components/redux/store';
import { saveMessage } from 'components/class/MessageService';
import { authActions } from 'components/redux/auth';
import { useRouter } from 'next/router';
import { Button, Spinner } from 'react-bootstrap';
import styles from 'components/class/class.module.scss';
import clsx from 'clsx';

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

  const dispatch = useAppDispatch();
  const router = useRouter();

  function send() {
    const message = {
      content: messageText,
      user: userId,
      cls: classId,
    } as Message;
    setIsSending(true);
    saveMessage({ message })
      .then((data) => {
        message.username = username;
        message.fullname = `${firstName} ${lastName}`;
        message.id = data?.id;
        onSend(message);
        setMessage('');
      })
      .catch((error) => {
        if (error instanceof InvalidCredentials) {
          dispatch(authActions.logout());
          router.push('/login');
        }
      })
      .finally(
        () => {
          setIsSending(false);
        }
      )
  }

  function isEmptyOrSpaces(str: string) {
    return str === null || str.match(/^ *$/) !== null;
  }

  return (
    <div className="fixed-bottom m-4">
      <form>
        <div className="input-group">
          <input
            className="form-control bg-dark text-light"
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
              'px-3 py-2': true
            })}
            onClick={send}
            disabled={isSending}
          >
            {
            isSending ? 
            <Spinner className={styles['send-message-spinner']}/> : 
            <Image alt={'Send Icon'} src={sendIcon} width={24} height={24} />
}
          </Button>
        </div>
      </form>
    </div>
  );
}
