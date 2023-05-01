import React, { useState } from 'react';
import Message from './Message';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAppDispatch, useAppSelector } from 'pages/redux/store';
import { getMessages, removeMessage } from './MessageService';
import { logout, removeToken } from 'pages/login/authService';
import InvalidCredentials from 'pages/errors/InvalidCredentials';
import { authActions } from 'pages/redux/auth';
import Forbidden from 'pages/errors/Forbidden';
import { MessageInput } from './MessageInput';
import Class from 'pages/classes/Class';
import deleteIcon from 'icons/delete.svg';
import Image from 'next/image';
import { useDispatch } from 'react-redux';
import { Role } from 'pages/User';

function DeleteMessageButton({
  message,
  onDelete,
}: {
  message: Message;
  onDelete: () => void;
}) {
  const router = useRouter();
  const dispatch = useDispatch();

  function deleteMessage() {
    removeMessage(message)
      .then(() => onDelete())
      .catch((error) => {
        if (error instanceof InvalidCredentials) {
          logout(dispatch, router);
        }
      });
  }

  return (
    <div>
      <button className="btn btn-danger" onClick={deleteMessage}>
        <Image src={deleteIcon} width={24} height={24} alt={'Delete'} />
      </button>
    </div>
  );
}

function MessageCard({
  message,
  onDelete,
}: {
  message: Message;
  onDelete: () => void;
}) {
  const role = useAppSelector((state) => state.auth?.user?.role);
  return (
    <div>
      <div className="d-flex p-2 flex-row align-items-center gap-3">
        <img
          className="border rounded-circle"
          height={48}
          width={48}
          src={`https://api.dicebear.com/6.x/lorelei/svg/seed=${message.username}`}
          alt={'Pic'}
        />
        <div>
          <div className="vstack inline card p-2 m-0 fs-5 rounded-4 px-3">
            <div className="inline fs-6">
              <b>{message.fullname}</b>
            </div>
            <div className="inline fs-6">{message.content}</div>
          </div>
        </div>
        {role === Role.Teacher && (
          <DeleteMessageButton message={message} onDelete={onDelete} />
        )}
      </div>
    </div>
  );
}

export function MessagesBar({
  cls,
  onForbidden,
}: {
  cls: Class;
  onForbidden: () => void;
}) {
  const [messages, setMessages] = useState<Message[]>(null);
  const router = useRouter();
  const [isForbidden, setForbidden] = useState<boolean>(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!messages) {
      getMessages({ classId: cls.id })
        .then((data) => setMessages(data.filter((_, index) => index < 5)))
        .catch((e) => {
          if (e instanceof InvalidCredentials) {
            removeToken();
            dispatch(authActions.logout());
            router.push('/login');
          }

          if (e instanceof Forbidden) {
            setForbidden(true);
            onForbidden();
          }
        });
    }
  }, [messages]);
  if (isForbidden) {
    return (
      <div>
        <h5 className="p-2">You have to join this class to access messages.</h5>
      </div>
    );
  }
  return (
    <div className='mb-5'>
      <div className="fs-3 px-2 py-1">
        <b>Messages</b>
        {messages &&
          (messages.length === 0 ? (
            <h5 className="p-2">
              There are no messages in this class. Be the first one to text
              something.
            </h5>
          ) : (
            <div>
              {messages.map((msg, index) => {
                return (
                  <MessageCard
                    key={msg.id}
                    message={msg}
                    onDelete={() =>
                      setMessages(
                        messages.filter((message) => message.id !== msg.id)
                      )
                    }
                  />
                );
              })}
            </div>
          ))}
      </div>
      <MessageInput
        classId={cls.id}
        forbidden={isForbidden}
        onSend={(message) => setMessages(messages.concat(message))}
      />
    </div>
  );
}
