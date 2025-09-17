export function useFetchArtworks<T>(fetchUrl: string) {
  const {
    data: artworks,
    pending: isLoading,
    error,
    refresh: fetchArtworks,
  } = useAsyncData<T[]>(fetchUrl, () => $fetch<T[]>(fetchUrl));

  return {
    artworks,
    isLoading,
    error,
    fetchArtworks,
  };
}

export function useFetchArtworksDetail<T>(fetchUrl: string) {
  const {
    data: artworkDetails,
    pending: isLoading,
    error,
    refresh: fetchArtworkDetails,
  } = useAsyncData<T>(fetchUrl, () => $fetch<T>(fetchUrl));

  return {
    artworkDetails,
    isLoading,
    error,
    fetchArtworkDetails,
  };
}


