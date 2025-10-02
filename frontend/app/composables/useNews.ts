export function useNews<News>() {
  const config = useRuntimeConfig();
  const { data: news, pending: isLoading, error, refresh: fetchNews } = useFetch<News>(`${config.public.apiUrl}/news`);
  return { news, isLoading, error, fetchNews };
}
