import React, { useState } from 'react';
import { useAppSelector } from 'components/redux/store';
import Message from 'components/class/messages/Message';
import { Role } from 'components/account/User';
import DeleteMessageButtonAbsolute from './DeleteMessageButtonAbsolute';
import clsx from 'clsx';

export default function MessageCard({
  message,
  onDelete,
  deleteModalId,
}: {
  message: Message;
  onDelete: () => void;
  deleteModalId: string;
}) {
  const role = useAppSelector((state) => state.auth?.user?.role);
  const userId = useAppSelector((state) => state.auth?.user?.id);
  const [isHover, setIsHover] = useState<boolean>();

  return (
    <div>
      <div
        className={clsx(
          'd-flex p-2 flex-row align-items-center gap-3',
          message.user == userId && 'justify-content-end'
        )}
        data-testid={`msg-${message.id}`}
      >
        <img
          className="border rounded-circle"
          height={48}
          width={48}
          src={`https://api.dicebear.com/6.x/lorelei/svg/seed=${message.username}`}
          alt={'Pic'}
        />
        <div
          className="position-relative"
          onMouseOver={() => setIsHover(true)}
          onMouseOut={() => setIsHover(false)}
        >
          <div className="vstack inline card shadow-sm p-2 m-0 fs-5 rounded-4 px-3">
            <div className="inline fs-6">
              <b>{message.fullname}</b>
            </div>
            <div className="inline fs-6">{message.content}</div>
          </div>
          {isHover && (role === Role.Teacher || userId == message?.user) && (
            <DeleteMessageButtonAbsolute
              onDelete={onDelete}
              deleteModalId={deleteModalId}
            />
          )}
        </div>
        {/* {(role === Role.Teacher || userId == message?.user) && (
          <DeleteMessageButton
            onDelete={onDelete}
            deleteModalId={deleteModalId}
          />
        )} */}
      </div>
    </div>
  );
}
