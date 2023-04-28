import React, { useState } from 'react';
import { useUserData } from 'pages/utils/hooks';
import Message from './Message';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAppDispatch } from 'pages/redux/store';
import { getMessages } from './MessageService';
import { removeToken } from 'pages/login/authService';
import InvalidCredentials from 'pages/errors/InvalidCredentials';
import { authActions } from 'pages/redux/auth';
import Forbidden from 'pages/errors/Forbidden';
import { MessageInput } from './MessageInput';
import Class from 'pages/classes/Class';

function MessageCard({ message }: { message: Message }) {
  const userInfo = useUserData();
  return (
    <div className="d-flex p-2 flex-row align-items-center gap-3">
      <img
        className="border rounded-circle"
        height={48}
        width={48}
        src={
          message.user === userInfo?.id
            ? `https://api.dicebear.com/6.x/lorelei/svg/seed=${userInfo.username}`
            : `https://api.dicebear.com/6.x/lorelei/svg/seed=${message.id}`
        }
        alt={'Pic'}
      />
      <p className="card p-2 m-0 fs-5 rounded-4 px-3">{message.content}</p>
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
    <div>
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
              {messages.map((msg) => {
                return <MessageCard key={msg.id} message={msg} />;
              })}
            </div>
          ))}
      </div>
      <MessageInput forbidden={isForbidden} />
    </div>
  );
}
