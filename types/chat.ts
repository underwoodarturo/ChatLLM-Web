import { IResults } from "./web-llm";

export type ids = {
    "paisbase": string;
    "linea": string;
    "codigo": string;
    "documentoprincipal": string;
    "documentosecundario": string;
    "clausula": string;
    "periodicidad": string;
    "responsableprincipal": string;
    "responsablesecundario": string;
    "parteobligada": string;
    "estado": string;
    "probabilidaddeincumplimiento": string;
    "consecuencia": string;
    "calificacion": string;
    "nivel": string;
    "tipodeconsecuencia": string;
    "control": string;
    "tipodecontrol": string;
    "niveldedificultaddelcontrol": string;
    "efectividaddelcontrol": string;
    "riesgocontrolado": string;
    "riesgoresidual": string;
    "text": string
}

export type Message = {
  content: string;
  type: 'assistant' | 'system' | 'user' | 'init';
  createTime: string;
  id: number;
  isStreaming?: boolean;
  isError?: boolean;
  isInit?: boolean;
  isLoading?: boolean;
  updateTime?: string;
  statsText?: string;
  ids?: Array<ids>
  results?: Array<IResults>
};

export type ChatConversation = {
  id: number;
  messages: Message[];
  createTime: string;
  updateTime: string;
  title: string;
};

export type UpdateBotMsg = (msg: Partial<Message>) => void;

export type UpdateInitMsg = (msg: Partial<Message>) => void;

export type InitInfo = {
  showModal: boolean;
  initMsg: Message[];
};
