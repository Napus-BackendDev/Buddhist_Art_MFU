export function useFetchArtworks<T>() {
  const config = useRuntimeConfig();
  const {
    data: artworks,
    pending: isLoading,
    error,
    refresh: fetchArtworks,
  } = useAsyncData<T>(`${config.public.apiUrl}/arts`, () =>
    $fetch<T>(`${config.public.apiUrl}/arts`)
  );

  return {
    artworks,
    isLoading,
    error,
    fetchArtworks,
  };
}

export function useFetchArtworksDetail<T>(artname: string) {
  const config = useRuntimeConfig();
  const {
    data: artworkDetails,
    pending: isLoading,
    error,
    refresh: fetchArtworkDetails,
  } = useAsyncData<T>(`${config.public.apiUrl}/arts/${artname}`, () => $fetch<T>(`${config.public.apiUrl}/arts/${artname}`));

  return {
    artworkDetails,
    isLoading,
    error,
    fetchArtworkDetails,
  };
}
