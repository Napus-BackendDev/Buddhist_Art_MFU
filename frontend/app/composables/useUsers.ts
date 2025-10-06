export function useUser<User>() {
  const config = useRuntimeConfig();
  const { data: users, pending: isLoading, error, refresh: fetchUser } = useFetch<User[]>(`${config.public.apiUrl}/admin/user` , { credentials: "include"});
  return { users, isLoading, error, fetchUser };
}
