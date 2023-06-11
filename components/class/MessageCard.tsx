import React from 'react';
import { useAppSelector } from 'components/redux/store';
import Message from 'components/class/Message';
import { Role } from 'components/account/User';
import DeleteMessageButton from 'components/class/DeleteMessageButton';

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
  const userId  = useAppSelector((state) => state.auth?.user?.id);
  return (
    <div>
      <div className="d-flex p-2 flex-row align-items-center gap-3" data-testid={`msg-${message.id}`}>
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
        {(role === Role.Teacher || userId == message?.user) && (
          <DeleteMessageButton
            onDelete={onDelete}
            deleteModalId={deleteModalId}
          />
        )}
      </div>
    </div>
  );
}