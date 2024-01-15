import React, { useRef, useState } from 'react';

import Link from 'next/link';

import { useChatStore } from '@/store/chat';

function InitItem(props: { content: string; isError: boolean }) {
  return (
    <>
      <li className={`py-1 ${props.isError ? 'text-error' : ''}`}>
        {props.content}
      </li>
    </>
  );
}
export function InitModal() {
  const [initInfoTmp] = useChatStore((state) => [state.initInfoTmp]);

  const chatStore = useChatStore();
  return (
    <>
      <div className={`modal ${initInfoTmp.showModal ? 'modal-open' : ''}`}>
        <div className="modal-box w-11/12 max-w-5xl">
          {initInfoTmp.initMsg.findIndex((msg) => msg.isError) !== -1 && (
            <label
              htmlFor="my-modal-3"
              className="btn btn-sm btn-circle absolute right-2 top-2"
              onClick={() => chatStore.toggleInitModal(false)}
            >
              ✕
            </label>
          )}
          <h3 className="font-bold text-lg">Loading Model...</h3>
          <ul>
            {initInfoTmp.initMsg.map((msg) => (
              <InitItem
                content={msg.content}
                isError={!!msg.isError}
                key={msg.id}
              />
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}

export function InstructionModal() {
  const [instructionModalStatus] = useChatStore((state) => [
    state.instructionModalStatus,
  ]);

  const chatStore = useChatStore();

  const [error, setError] = useState('');

  const user = useRef<HTMLInputElement>(null);
  const password = useRef<HTMLInputElement>(null);

  return (
    <>
      <div className={`modal ${instructionModalStatus ? 'modal-open' : ''}`}>
        <div className="modal-box w-11/12 max-w-5xl">
          <h3 className="font-bold text-lg">Instrucciones</h3>
          <div className="py-4">
            <h2 className=" font-bold">
              Ingresa una pregunta, considerando lo siguiente:
            </h2>
            <ul>
              <li>Se específico con lo que quieres saber.</li>
              <li>El modelo aprenderá en base a las preguntas que realices.</li>
              <li>
                Considerá que esto es una Prueba de Concepto, no tomes las
                respuestas como una verdad absoluta.
              </li>
            </ul>
          </div>

          <div className="flex flex-col justify-center align-middle gap-2">
            <input
              className=" textarea-bordered textarea-sm  text-center"
              placeholder="Usuario"
              ref={user}
            ></input>
            <input
              className=" textarea-bordered textarea-sm  text-center"
              placeholder="Contraseña"
              type="password"
              ref={password}
            ></input>

            <label className="py-3 text-rose-700">{error}</label>
            <label className="btn">Iniciar sesión</label>
          </div>
        </div>
      </div>
    </>
  );
}
