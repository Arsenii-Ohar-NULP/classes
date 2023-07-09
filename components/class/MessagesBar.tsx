import React, { useState } from 'react';
import Message from 'components/class/Message';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAppDispatch } from 'components/redux/store';
import { getMessages } from 'components/class/MessageService';
import { getAccessToken, removeToken } from 'components/login/AuthService';
import { authActions } from 'components/redux/auth';
import { MessageInput } from 'components/class/MessageInput';
import Class from 'components/classes/Class';
import MessageCard from 'components/class/MessageCard';
import DeleteMessageButtonModal from 'components/class/DeleteMessageButtonModal';
import InvalidCredentials from 'components/errors/InvalidCredentials';
import Forbidden from 'components/errors/Forbidden';
import { MessageType } from './MessageType';
import { socket } from 'components/utils/socket';
import { useSocket } from 'components/utils/hooks';

export function MessagesBar({
  cls,
  onForbidden,
}: {
  cls: Class;
  onForbidden: () => void;
}) {
  const DELETE_MODAL_ID = 'deleteModal';

  const [messages, setMessages] = useState<Message[]>(null);
  const [isForbidden, setForbidden] = useState<boolean>(false);

  const [deleteId, setDeleteId] = useState<number>(-1);

  const dispatch = useAppDispatch();
  const router = useRouter();
  useSocket();

  useEffect(() => {
    if (!messages) {
      getMessages({ classId: cls.id })
        .then((data) => setMessages(data))
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
          else{
            setForbidden(false);
          }
        });
    }
  }, [messages]);

  useEffect(() => {
    if (isForbidden) {
      return;
    }

    socket.auth['token'] = getAccessToken();
    socket.on('message', (type: MessageType, message: Message) => {
      if (message?.cls !== cls?.id) {
        return;
      }
      console.log(message);

      if (type === MessageType.TEXT) {
        if (!messages) {
          setMessages([message]);
        } else {
          setMessages([...messages, message]);
        }
      }
    });

    return () => {
      if (!isForbidden) {
        socket.off('message');
      }
    };
  }, [isForbidden]);

  useEffect(() => {
    if (isForbidden) {
      return;
    }

    socket.on('deleteMessage', (deletedMessage: Message) => {
      if (deletedMessage?.cls !== cls?.id) {
        return;
      }

      setMessages(messages?.filter((msg) => deletedMessage.id !== msg.id));
    });

    return () => {
      if (!isForbidden) socket.off('deleteMessage');
    };
  }, [isForbidden]);

  function messagesList() {
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
                deleteModalId={DELETE_MODAL_ID}
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
        <h5 className="p-3">You have to join this class to access messages.</h5>
      </div>
    );
  }

  return (
    <div className="pb-5">
      <div className="fs-3 px-2 py-1">
        <b>Messages</b>
        {messagesList()}
        <DeleteMessageButtonModal
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
