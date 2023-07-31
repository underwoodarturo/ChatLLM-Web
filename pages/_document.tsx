import { Head, Html, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <title>
          ChatLLM Habi
        </title>
        <meta
          name="description"
          content="ChatLLM"
        ></meta>
        <meta name="application-name" content="ChatLLM" />
        <meta name="theme-color" content="#fff" />
        <link rel="apple-touch-icon" href="/assets/icon-48x48.png"></link>
        <link rel="manifest" href="/manifest.json" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
