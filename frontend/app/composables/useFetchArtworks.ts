export function useFetchArtworks<T>(limit?: number) {
  const config = useRuntimeConfig();
  const { data, pending: isLoading, error, refresh: fetchArtworks } = useFetch<T[]>(`${config.public.apiUrl}/arts`)

  const artworks = computed(() => {
    if (!data.value) return []
    return limit ? data.value.slice(0, limit) : data.value
  })

  return { artworks, isLoading, error, fetchArtworks };
}

export function useFetchArtworksDetail<T>(artname: string) {
  const config = useRuntimeConfig();
  const {
    data: artworkDetails,
    pending: isLoading,
    error,
    refresh: fetchArtworkDetails,
  } = useAsyncData<T>(`${config.public.apiUrl}/arts/${artname}`, () =>
    $fetch<T>(`${config.public.apiUrl}/arts/${artname}`)
  );

  return {
    artworkDetails,
    isLoading,
    error,
    fetchArtworkDetails,
  };
}

export function useFetchArtworksByUser(usernameTh: string) {
  const config = useRuntimeConfig();
  const {
    data: artworksByUser,
    pending: isLoading,
    error,
    refresh: fetchArtworksByUser,
  } = useAsyncData<Arts[]>(
    `${config.public.apiUrl}/arts/user/${usernameTh}`,
    () => $fetch<Arts[]>(`${config.public.apiUrl}/arts/user/${usernameTh}`)
  );

  return {
    artworksByUser,
    isLoading,
    error,
    fetchArtworksByUser,
  };
}
