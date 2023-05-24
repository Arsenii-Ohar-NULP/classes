import React, { useState } from 'react';
import Message from './Message';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAppDispatch } from 'pages/redux/store';
import { getMessages } from './MessageService';
import { removeToken } from 'pages/login/AuthService';
import { authActions } from 'pages/redux/auth';
import { MessageInput } from './MessageInput';
import Class from 'pages/classes/Class';
import MessageCard from './MessageCard';
import DeleteMessageModal from './DeleteButtonModal';
import InvalidCredentials from 'pages/errors/InvalidCredentials';
import Forbidden from 'pages/errors/Forbidden';


export function MessagesBar({
  cls,
  onForbidden,
}: {
  cls: Class;
  onForbidden: () => void;
}) {
  const [messages, setMessages] = useState<Message[]>(null);
  const [isForbidden, setForbidden] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [deleteId, setDeleteId] = useState<number>(-1);
  const deleteModalId = 'deleteModal';

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

  function messagesIfAny() {
    if (messages) {
      if (messages.length === 0) {
        return (
          <h5 className="p-2">
            There are no messages in this class. Be the first one to text
            something.
          </h5>
        );
      }
      return (
        <div>
          {messages.map((msg) => {
            return (
              <MessageCard
                key={msg.id}
                message={msg}
                deleteModalId={deleteModalId}
                onDelete={() => setDeleteId(msg.id)}
              />
            );
          })}
        </div>
      );
    }
  }

  if (isForbidden) {
    return (
      <div>
        <h5 className="p-2">You have to join this class to access messages.</h5>
      </div>
    );
  }

  return (
    <div className="mb-5">
      <div className="fs-3 px-2 py-1">
        <b>Messages</b>
        {messagesIfAny()}
        <DeleteMessageModal
          messageId={deleteId}
          show={deleteId != -1}
          onDelete={() =>
            setMessages(messages.filter((message) => message.id !== deleteId))
          }
          close={() => setDeleteId(-1)}
        />
      </div>
      <MessageInput
        classId={cls.id}
        forbidden={isForbidden}
        onSend={(message) => setMessages(messages.concat(message))}
      />
    </div>
  );
}
