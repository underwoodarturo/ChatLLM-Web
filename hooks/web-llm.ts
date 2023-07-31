import {
  LLMEngine,
  ResFromWorkerMessageEventData,
  SendToWorkerMessageEventData,
} from '@/types/web-llm';

class WebLLM {
  private worker?: Worker = undefined;

  public destroy(): void {
    globalThis.tvmjsGlobalEnv?.asyncOnReset();
    this.worker?.terminate();
  }

  public setConversationHistroy(data: SendToWorkerMessageEventData): void {
    if (!this.worker) {
      this.worker = new Worker(
        new URL('web-worker/web-llm.worker.ts', import.meta.url),
        { name: 'WebLLM' },
      );
    }
    this.worker?.postMessage(data);
  }

  public async chat(
    data: SendToWorkerMessageEventData,
    workerMessageCb: (data: ResFromWorkerMessageEventData) => void,
  ): Promise<void> {
    const res = await fetch(
      process.env.NEXT_PUBLIC_URL || 'http://127.0.0.1:8000',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      },
    );
    const json = await res.json();
    workerMessageCb(json);
    return json;

    // if (!this.worker) {
    //   this.worker = new Worker(
    //     new URL('web-worker/web-llm.worker.ts', import.meta.url),
    //     { name: 'WebLLM' },
    //   );
    // }
    // this.worker?.postMessage(data);

    // this.worker?.addEventListener(
    //   'message',
    //   ({ data }: { data: ResFromWorkerMessageEventData }) => {
    //     workerMessageCb(data);
    //   },
    // );

    // requestAnimationFrame(() => this.worker?.postMessage(message));

    // return new Promise((resolve) => {
    //   this.worker?.addEventListener('message', ({ data }: { data: string }) =>
    //     resolve(data),
    //   );
    // });
  }
}

const WebLLMInstance = new WebLLM();
export { WebLLMInstance };
