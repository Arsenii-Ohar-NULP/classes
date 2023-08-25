import React, {useEffect, useState} from 'react';
import Message from 'components/class/messages/Message';
import {useLogout} from 'components/login/AuthService';
import {MessageInput} from 'components/class/messages/MessageInput';
import Class from 'components/classes/Class';
import MessageCard from 'components/class/messages/MessageCard';
import DeleteMessageButtonModal from 'components/class/messages/DeleteMessageButtonModal';
import {MessageType} from './MessageType';
import {socket} from 'components/utils/socket';
import {useSocket} from 'components/utils/hooks';
import {getAccessToken} from "components/account/TokenService";
import {useLazyGetMessagesQuery} from "../../redux/classesApi";

export function MessagesBar({
                                cls,
                                onForbidden,
                            }: {
    cls: Class;
    onForbidden: () => void;
}) {
    const DELETE_MODAL_ID = 'deleteModal';

    const [getInitialMessages] = useLazyGetMessagesQuery();
    const [messages, setMessages] = useState<Message[]>();
    const [isForbidden, setForbidden] = useState<boolean>(false);
    const [deleteId, setDeleteId] = useState<number>(-1);
    const logout = useLogout();
    useSocket();

    useEffect(() => {
        if (cls?.id) {
            getInitialMessages(cls?.id)
                .unwrap()
                .then((initialMessages) => setMessages(initialMessages))
                .catch((error) => {
                    if ("status" in error) {
                        const status = error['status'];

                        if (status === 401) {
                            logout();
                        }
                        if (status === 403) {
                            setForbidden(true);
                            onForbidden();
                        }
                    }
                })
        }
    }, [cls.id]);

    useEffect(() => {
        if (isForbidden) {
            return;
        }

        socket.auth['token'] = getAccessToken();
        socket.on('message', (type: MessageType, message: Message) => {
            if (message?.cls !== cls?.id) {
                return;
            }

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
                <p className={'pt-2 fs-4'}><b>Messages</b></p>
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
