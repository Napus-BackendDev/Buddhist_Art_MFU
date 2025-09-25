export function useNews<T>() {
  const config = useRuntimeConfig();
  const {
    data: news,
    pending: isLoading,
    error,
    refresh: fetchNews,
  } = useAsyncData<T[]>(`${config.public.apiBaseUrl}/news`, () =>
    $fetch<T[]>(`${config.public.apiBaseUrl}/news`)
  );

  console.log(news);

  return { news, isLoading, error, fetchNews };
}
