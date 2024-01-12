import '@aws-amplify/ui-react/styles.css';
import {
  HydrationBoundary,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { Analytics } from '@vercel/analytics/react';
import { useState } from 'react';

import type { AppProps } from 'next/app';

import '@/styles/globals.css';
import { Amplify } from 'aws-amplify';

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: process.env.NEXT_PUBLIC_USER_POOL_ID!,
      userPoolClientId: process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID!,
    },
  },
});

export default function App({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <HydrationBoundary state={pageProps.dehydratedState}>
          <Component {...pageProps} />
        </HydrationBoundary>
        <Analytics />
      </QueryClientProvider>
    </>
  );
}
