import { useAuthenticator } from '@aws-amplify/ui-react';
import React, { useEffect, useRef, useState } from 'react';

import Link from 'next/link';

import { useGetFile, useGetFiles, usePostFile } from '../hooks/useSearch';

import { IconAdd, IconDone, IconInfo, IconLogout } from './Icons';

import { useChatStore } from '@/store/chat';
import { format } from 'date-fns';
import es from 'date-fns/locale/es';

function BottomSettings() {
  const chatStore = useChatStore();
  return (
    <div className="flex items-center justify-between py-5 relative bottom-0 px-4">
      <div className="flex"></div>
      <button
        onClick={chatStore.newConversation}
        className="btn btn-ghost btn-xs"
      >
        <IconAdd />
      </button>
    </div>
  );
}

export const ChatItem = (props: {
  onClick?: () => void;
  title: string;
  timeText: string;
  index: number;
  messageCount: number;
  isActive: boolean;
}) => {
  return (
    <li key={props.index} onClick={props.onClick} className="my-2">
      <a className={props.isActive ? 'active' : ''}>
        <div className="flex flex-col h-full w-full">
          <div className="">{props.title}</div>
          <div className="flex justify-between h-full menu-title">
            <div>Mensajes: {props.messageCount}</div>
            <div className="ml-2">{props.timeText}</div>
          </div>
        </div>
      </a>
    </li>
  );
};

const Files = () => {
  const { data: files, isLoading, refetch } = useGetFiles();
  const { mutate } = useGetFile();

  const handleClick = (filename: string) => {
    mutate(
      { filename },
      {
        onSuccess: (result) => {
          window.open(result.url);
        },
      },
    );
  };

  useEffect(() => {
    let timer: any = '';
    if (files && files.some((f: any) => !f.processed)) {
      timer = setTimeout(() => {
        refetch();
      }, 5000);
    }
    return () => clearTimeout(timer);
  }, [files]);

  const { mutate: mutatePostFile } = usePostFile();

  const fileRef = useRef<HTMLInputElement>(null);

  const handleUpload = () => {
    const form = new FormData();
    const file = fileRef.current?.files?.[0];
    if (file) {
      form.append('file', file);
      mutatePostFile(form, {
        onSuccess: () => {
          if (fileRef.current) {
            fileRef.current.value = '';
          }
        },
      });
    }
  };

  if (isLoading || !files?.length) {
    return null;
  }
  return (
    <div>
      <div className="flex flex-col gap-2 pt-2">
        <div className="flex gap-2">
          <div role="alert" className="alert shadow-lg border border-secondary">
            <input
              type="file"
              className="file-input file-input-bordered file-input-primary w-full "
              ref={fileRef}
            />
            <button className="btn btn-primary" onClick={handleUpload}>
              Cargar
            </button>
          </div>
        </div>
        <div className="alert border">
          <div className="flex justify-between">
            <span>Archivos cargados</span>
          </div>
          <div>{files.length}</div>
        </div>
        {files?.map((file: any, key: number) => (
          <div key={key}>
            <div
              role="alert"
              className="flex  items-center shadow-lg border border-secondary rounded-xl p-2"
            >
              <div className="flex items-center p-2 gap-2 flex-grow">
                {file.processed ? <IconDone /> : <IconInfo />}
                <div className="flex flex-col gap-0 flex-grow">
                  <h3 className="font-bold">{file.originalname}</h3>
                  <div className="flex flex-row justify-between w-full">
                    <div className="text-xs">
                      {file.name.substring(0, 5)}...
                      {file.name.substring(
                        file.name.length - 8,
                        file.name.length,
                      )}
                    </div>
                    <div className="text-xs">
                      {format(new Date(file.updated), 'Ppp', {
                        locale: es as any,
                      })}
                    </div>
                  </div>
                </div>
              </div>
              <button
                className="btn btn-sm"
                onClick={() => handleClick(file.name)}
              >
                Ver
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const Sidebar = () => {
  const [conversations, curConversationIndex] = useChatStore((state) => [
    state.conversations,
    state.curConversationIndex,
  ]);
  const chatStore = useChatStore();
  const { signOut } = useAuthenticator();
  const [tab, setTab] = useState('docs');
  const handleLogout = () => {
    signOut();
  };
  return (
    <div className="top-0 p-2 flex flex-col relative max-h-[100vh] h-[100vh]">
      <div className="bg-base-200 bg-opacity-90 backdrop-blur sticky top-0 items-center gap-2 px-4 py-2">
        <div className="flex justify-between">
          <Link href="#" target="_blank" className="btn btn-ghost px-2">
            <div className="font-title transition-all duration-200 md:text-2xl">
              <div className="my-1 text-xl font-bold capitalize">
                Habi - ChatLLM
              </div>
            </div>
          </Link>
          <button className="btn btn-ghost" onClick={handleLogout}>
            <IconLogout />
          </button>
        </div>
        <div className="text-base-content text-xs opacity-40 font-bold px-2">
          Asistente IA.
        </div>
      </div>
      <div className="overflow-auto flex-1 overflow-x-hidden ">
        <ul className="menu menu-compact menu-vertical flex flex-col p-0 px-4">
          <div role="tablist" className="tabs tabs-boxed">
            <a
              role="tab"
              className={tab === 'docs' ? 'tab tab-active' : 'tab'}
              onClick={() => setTab('docs')}
            >
              Documentos
            </a>
            <a
              role="tab"
              className={tab === 'conv' ? 'tab tab-active' : 'tab'}
              onClick={() => setTab('conv')}
            >
              Conversaciones
            </a>
          </div>
        </ul>
        {tab === 'docs' ? (
          <ul className="menu menu-compact menu-vertical flex flex-col p-0 px-4">
            <Files />
          </ul>
        ) : (
          <ul className="menu menu-compact menu-vertical flex flex-col p-0 px-4">
            {conversations.map((item, i) => (
              <ChatItem
                key={item.id}
                index={i}
                title={item.title}
                messageCount={item.messages.length}
                isActive={i === curConversationIndex}
                timeText={item.updateTime}
                onClick={() => chatStore.chooseConversation(i)}
              />
            ))}
          </ul>
        )}
        <div className="from-base-200 pointer-events-none sticky bottom-0 flex h-20 bg-gradient-to-t to-transparent" />
      </div>
      <BottomSettings />
    </div>
  );
};
