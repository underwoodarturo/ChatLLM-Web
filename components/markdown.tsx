import { FC, RefObject, memo, useState } from 'react';
import ReactMarkdown, { Options } from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/cjs/styles/prism';

import { useGetFile } from '@/hooks/useSearch';

import { generateRandomString, programmingLanguages } from '@/utils/codeblock';

import { Message, ids } from '@/types/chat';

import { IconCopy, IconDone, IconDownload } from './Icons';

import rehypeMathjax from 'rehype-mathjax';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';

const MemoizedReactMarkdown: FC<Options> = memo(
  ReactMarkdown,
  (prevProps, nextProps) => prevProps.children === nextProps.children,
);

interface Props {
  language: string;
  value: string;
}

const CodeBlock: FC<Props> = memo(({ language, value }) => {
  const [isCopied, setIsCopied] = useState<Boolean>(false);

  const copyToClipboard = () => {
    if (!navigator.clipboard || !navigator.clipboard.writeText) {
      return;
    }

    navigator.clipboard.writeText(value).then(() => {
      setIsCopied(true);

      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    });
  };
  const downloadAsFile = () => {
    const fileExtension = programmingLanguages[language] || '.file';
    const suggestedFileName = `file-${generateRandomString(
      3,
      true,
    )}${fileExtension}`;
    const fileName = window.prompt('Enter file name', suggestedFileName);

    if (!fileName) {
      // user pressed cancel on prompt
      return;
    }

    const blob = new Blob([value], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = fileName;
    link.href = url;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  return (
    <div className="codeblock relative font-sans text-[16px]">
      <div className="flex items-center justify-between py-2">
        <span className="text-xs lowercase text-white">{language}</span>

        <div className="flex items-center">
          <button className="btn btn-ghost btn-xs" onClick={copyToClipboard}>
            {isCopied ? <IconDone /> : <IconCopy />}
          </button>
          <button className="btn btn-ghost btn-xs" onClick={downloadAsFile}>
            <IconDownload />
          </button>
        </div>
      </div>

      <SyntaxHighlighter
        language={language}
        style={dracula}
        customStyle={{ margin: 0 }}
      >
        {value}
      </SyntaxHighlighter>
    </div>
  );
});

const Doc: FC<ids> = ({ text, control, consecuencia }) => {
  return (
    <>
      <tr>
        <td>{text}</td>
        <td>{control}</td>
        <td>{consecuencia}</td>
      </tr>
    </>
  );
};

export function Markdown(
  props: {
    message: Message;
    loading?: boolean;
    fontSize?: number;
    parentRef?: RefObject<HTMLDivElement>;
    defaultShow?: boolean;
  } & React.DOMAttributes<HTMLDivElement>,
) {
  const [showMore, setShowMore] = useState(true);
  console.log(props.message);
  const { mutate } = useGetFile();
  const handleDownload = (filename: string) => {
    mutate(
      { filename },
      {
        onSuccess: (file) => {
          window.open(file.url);
        },
      },
    );
  };
  return (
    <>
      <MemoizedReactMarkdown
        className="prose dark:prose-invert flex-1 chat-markdown"
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeMathjax]}
        components={{
          code({ node, inline, className, children, ...props }) {
            if (children.length) {
              if (children[0] == '▍') {
                return (
                  <span className="animate-pulse cursor-default mt-1">▍</span>
                );
              }

              children[0] = (children[0] as string).replace('`▍`', '▍');
            }

            const match = /language-(\w+)/.exec(className || '');

            return !inline ? (
              <CodeBlock
                key={Math.random()}
                language={(match && match[1]) || ''}
                value={String(children).replace(/\n$/, '')}
                {...props}
              />
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
          table({ children }) {
            return (
              <table className="border-collapse border border-black px-3 py-1 dark:border-white">
                {children}
              </table>
            );
          },
          th({ children }) {
            return (
              <th className="break-words border border-black bg-gray-500 px-3 py-1 text-white dark:border-white">
                {children}
              </th>
            );
          },
          td({ children }) {
            return (
              <td className="break-words border border-black px-3 py-1 dark:border-white">
                {children}
              </td>
            );
          },
        }}
      >
        {props.message.content}
      </MemoizedReactMarkdown>
      <small
        style={{ cursor: 'pointer' }}
        onClick={() => setShowMore(!showMore)}
      >
        {showMore ? 'Ver menos' : 'Ver más'}
      </small>
      {showMore && props.message.ids?.length && (
        <div>
          <table className="table">
            <tr>
              <th>Texto</th>
              <th>Control</th>
              <th>Consecuencia</th>
            </tr>
            {props.message.ids?.map((c, index) => (
              <Doc key={index} {...c} />
            ))}
          </table>
        </div>
      )}

      {showMore && props.message.results?.length && (
        <div className="">
          <table className="">
            <tr>
              <th>Id</th>
              <th>Texto</th>
              <th>Página</th>
            </tr>
            {props.message.results?.map((c, index) => (
              <tr key={index}>
                {c?.document?.derivedStructData?.fields?.extractive_answers?.listValue?.values?.map(
                  (v, key) => (
                    <>
                      <td>[{key + 1}]</td>
                      <td key={key} className="">
                        <div
                          dangerouslySetInnerHTML={{
                            __html: v.structValue.fields.content.stringValue,
                          }}
                        ></div>
                      </td>
                      <td>{v.structValue.fields.pageNumber.stringValue}</td>
                      <td>
                        <button
                          className="btn btn-secondary"
                          onClick={() =>
                            handleDownload(
                              c.document.derivedStructData.fields.link
                                .stringValue,
                            )
                          }
                        >
                          Ver
                        </button>
                      </td>
                    </>
                  ),
                )}
              </tr>
            ))}
          </table>
        </div>
      )}
    </>
  );
}

CodeBlock.displayName = 'CodeBlock';
