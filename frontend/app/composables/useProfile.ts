import { ref, computed } from "vue";
const user = ref<UserProfile | null>(null);
const role = computed(() => user.value?.role ?? null);

export function useProfile() {
  const config = useRuntimeConfig();

  const fetchProfile = async () => {
    const { data } = await useFetch(`${config.public.apiUrl}/auth/profile`, {
      credentials: "include",
    });
    console.log('fetchProfile data:', data.value)
    user.value = data.value as UserProfile;
  };

  return { user, role, fetchProfile };
}
