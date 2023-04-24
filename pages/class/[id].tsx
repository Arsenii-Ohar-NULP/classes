import React from 'react';
import { useRouter } from 'next/router';
import {
  useClassRepository,
  useLoginRedirect,
  useMessagesRepository,
  useThumbnailRepository,
  useTokenPersistanceService,
  useUserData,
} from 'pages/utils/hooks';
import { useEffect, useState } from 'react';
import Head from 'next/head';
import Class from 'pages/classes/Class';
import styles from 'pages/class/class.module.scss';
import InvalidCredentials from 'pages/errors/InvalidCredentials';
import sendIcon from 'icons/send.svg';
import Image from 'next/image';
import Forbidden from 'pages/errors/Forbidden';
function Loading() {
  return (
    <div className="">
      <div className="spinner-border text-primary text-center" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
}

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

function MessageInput({forbidden}: {forbidden: boolean}) {
  return (
    <div className="fixed-bottom">
      <form>
        <div className="input-group">
          <input
            className="form-control bg-dark text-light"
            placeholder="Enter any message you like"
            disabled={forbidden}
          ></input>
          <button type="submit" className="btn btn-primary">
            <Image alt={'Send Icon'} src={sendIcon} width={24} height={24} />
          </button>
        </div>
      </form>
    </div>
  );
}

function MessagesBar({ cls }: { cls: Class }) {
  const [messages, setMessages] = useState<Message[]>(null);
  const messageRepository = useMessagesRepository();
  const router = useRouter();
  const tokenPersistanceService = useTokenPersistanceService();
  const [isForbidden, setForbidden] = useState<boolean>(false);

  useEffect(() => {
    if (!messages) {
      messageRepository
        .getMessages({ classId: cls.id })
        .then((data) => setMessages(data.filter((_, index) => index < 5)))
        .catch((e) => {
          if (e instanceof InvalidCredentials) {
            tokenPersistanceService.removeToken();
            router.push('/login');
          }

          if (e instanceof Forbidden) {
            setForbidden(true);
          }
        });
    }
  }, [messages]);
  if (isForbidden) {
    return (
      <div>
        <h5 className="p-2">
          You have to join this class to access messages.
        </h5>
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
      <MessageInput forbidden={isForbidden}/>
    </div>
  );
}

export default function ClassPage() {
  useLoginRedirect();
  const router = useRouter();
  const classRepository = useClassRepository();
  const thumbnailRepository = useThumbnailRepository();
  const [_class, setClass] = useState<Class>(null);
  const [image, setImage] = useState(null);

  useEffect(() => {
    if (!_class) {
      return;
    }

    thumbnailRepository.findClassThumbnail(_class.id).then((data) => {
      setImage(`data:image/png; base64, ${data}`);
    });
  }, [_class, image]);

  function redirectToUnknown() {
    router.push('/404');
  }

  function noIdSpecified(): boolean {
    return !router.query['id'];
  }

  function fetchClass() {
    const id = Number.parseInt(router.query.id as string);
    classRepository.find(id).then((cls) => {
      setClass(cls);
    });
  }

  useEffect(() => {
    if (noIdSpecified()) {
      return;
    }

    if (!_class) {
      try {
        fetchClass();
      } catch (e) {
        redirectToUnknown();
      }
    }
  }, [_class, router.query]);

  if (!_class)
    return (
      <div className="vh-100 d-flex justify-content-center align-items-center">
        <Loading />
      </div>
    );
  return (
    <>
      <div>
        <Head>
          <title>Classes - {_class?.title ? _class.title : 'loading'}</title>
        </Head>
        <div className="container">
          <div className="container card bg-secondary text-white w-auto rounded shadow mt-sm-1 py-2">
            <div className="d-flex flex-wrap justify-content-center gap-2">
              {image ? (
                <img className={'rounded-2 ' + styles['pic']} src={image}></img>
              ) : (
                <div className="d-flex justify-content-center align-items-center">
                  <Loading />
                </div>
              )}
              <div className="d-flex flex-column align-items-center">
                <div>
                  <div className="pt-lg-3 px-3 pb-0">
                    <p className="m-0 fs-3">{_class.title}</p>
                  </div>
                  <div className="px-3">
                    <a>
                      <p className="fs-5">{`${_class['teacher_first_name']} ${_class['teacher_last_name']}`}</p>
                    </a>
                  </div>
                  <div className="px-3">
                    <p className="fs-6">{_class.description}</p>
                  </div>
                </div>
              </div>
              <div
                className={
                  'd-flex justify-content-end align-items-center mb-2 ' +
                  styles['join-button']
                }
              >
                <button className="btn btn-primary mx-3">Join</button>
              </div>
            </div>
          </div>
          <MessagesBar cls={_class} />
        </div>
      </div>
    </>
  );
}
