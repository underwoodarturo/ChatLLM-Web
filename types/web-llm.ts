import { Message, ids } from './chat';

type Prompts = [string, string][];
type WorkerHistoryMsg = [string, string][];

declare global {
  var Tokenizer: {
    TokenizerWasm: new (config: string) => (name: string) => Promise<unknown>;
    init: () => Promise<void>;
  };
  var sentencepiece: {
    sentencePieceProcessor: (url: string) => void;
  };
  var tvmjsGlobalEnv: {
    covId: any;
    asyncOnGenerate: () => Promise<void>;
    asyncOnReset: () => Promise<void>;
    getTokenizer: (name: string) => Promise<unknown>;
    initialized: boolean;
    sentencePieceProcessor: (url: string) => void;
    message: string;
    curConversationIndex: number;
    workerHistoryMsg: WorkerHistoryMsg;
  };
  var tvmjs: any;
  var EmccWASI: any;
  var importScripts: (...url: string[]) => void;
}

export type LLMEngine = {
  chat: (message: string, updateBotMsg?: any) => Promise<void>;
  destroy?: () => void;
  greeting?: Message;
  init: any;
};

export type PostToWorker = {
  type: 'init' | 'chat';
  msg: string;
};

export type ListenFromWorker = {
  type: 'init' | 'chat';
  msg: string;
};

export type SendToWorkerMessageEventData = {
  curConversationIndex: number;
  msg: string;
  workerHistoryMsg?: WorkerHistoryMsg;
  ifNewConverstaion?: boolean;
};

enum IType {
  'initing' = 'initing',
  'chatting' = 'chatting',
  'stats' = 'stats',
}
export class ResFromWorkerMessageEventData {
  type!: IType;
  action!: 'append' | 'updateLast';
  msg!: string;
  ifError?: boolean;
  ifFinish?: boolean;
  ids?: Array<ids>;
  results?: Array<IResults>;
}

interface DocumentData {
  name: string;
  id: string;
  schemaId: string;
  derivedStructData: {
    fields: {
      title: {
        stringValue: string;
        kind: string;
      };
      link: {
        stringValue: string;
        kind: string;
      };
      extractive_answers: {
        listValue: {
          values: {
            structValue: {
              fields: {
                content: {
                  stringValue: string;
                  kind: string;
                };
                pageNumber: {
                  stringValue: string;
                  kind: string;
                };
              };
            };
            kind: string;
          }[];
        };
        kind: string;
      };
    };
  };
  parentDocumentId: string;
  content: any; // Change 'any' to the appropriate type if you have specific content type information
}

export interface IResults {
  modelScores: Record<string, any>; // Change 'any' to the appropriate type for modelScores values
  id: string;
  document: DocumentData;
}



interface SearchResult {
  modelScores: Record<string, any>; // Change 'any' to the appropriate type for modelScores values
  id: string;
  document: Record<string, any>; // Change 'Record<string, any>' to the appropriate document structure
}

interface Summary {
  summarySkippedReasons: any[]; // Change 'any' to the appropriate type for summarySkippedReasons values
  summaryText: string;
  safetyAttributes: {
    categories: any[]; // Change 'any' to the appropriate type for categories values
    scores: any[]; // Change 'any' to the appropriate type for scores values
  };
}

interface GuidedSearchResult {
  refinementAttributes: any[]; // Change 'any' to the appropriate type for refinementAttributes values
  followUpQuestions: any[]; // Change 'any' to the appropriate type for followUpQuestions values
}

export interface CombinedInterface {
  results: {
    modelScores: Record<string, any>;
    id: string;
    document: Record<string, any>;
  }[];
  facets: any[];
  appliedControls: any[];
  totalSize: number;
  attributionToken: string;
  nextPageToken: string;
  correctedQuery: string;
  guidedSearchResult: GuidedSearchResult;
  summary: Summary;
  redirectUri: string;
  queryExpansionInfo: null | Record<string, any>;
}