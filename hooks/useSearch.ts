import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { ResFromWorkerMessageEventData } from '@/types/web-llm';

import { fetchAuthSession } from '@aws-amplify/auth';

const url = process.env.NEXT_PUBLIC_URL || 'http://localhost:3001';

const fetcher = async ({ path, body, method, params }: any) => {
  const { accessToken } = (await fetchAuthSession()).tokens ?? {};
  const request = await fetch(`${url}${path}`, {
    headers: {
      'Content-type': 'application/json',
      Authorization: `${accessToken}`,
    },
    method,
    body: JSON.stringify(body),
  });
  const parsed = await request.json();
  return parsed;
};

const postFile = async (body: any): Promise<any> => {
  const { accessToken } = (await fetchAuthSession()).tokens ?? {};
  const request = await fetch(`${url}${'/upload'}`, {
    headers: {
      Authorization: `${accessToken}`,
    },
    method: 'POST',
    body,
  });
  const parsed = await request.json();
  return parsed;
};

const importFiles = async () => {
  return fetcher({ method: 'POST', path: '/import' });
};

const postSearch = async (body: {
  search: string;
}): Promise<ResFromWorkerMessageEventData> => {
  return fetcher({
    path: `/search`,
    method: 'POST',
    body,
  });
};

const getFiles = async (): Promise<any> => {
  return fetcher({ path: `/files` });
};

const useGetFile = () => {
  return useMutation({
    mutationFn: async (props: { filename: string }) => {
      return fetcher({
        path: `/files/${encodeURIComponent(props.filename)}`,
      });
    },
  });
};

const useGetFiles = () => {
  return useQuery<any, any>({
    queryKey: ['files'],
    queryFn: () => getFiles(),
  });
};

const useSearch = () => {
  return useMutation({
    mutationFn: (body: { search: string }) => postSearch(body),
  });
};

const useImport = () => {
  return useMutation({
    mutationFn: () => importFiles(),
  });
};

const usePostFile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: any) => postFile(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['files'] });
    },
  });
};

export {
  useImport,
  useSearch,
  postSearch,
  useGetFiles,
  useGetFile,
  postFile,
  usePostFile,
};
