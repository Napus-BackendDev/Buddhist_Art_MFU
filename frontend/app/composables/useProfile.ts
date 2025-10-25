import { ref, computed } from "vue";
import type { User } from "~~/shared/types/user";

const user = ref<User | null>(null);
const role = computed(() => user.value?.role ?? null);

export function useProfile() {
  const config = useRuntimeConfig();

  const fetchProfile = async () => {
    const { data } = await useFetch(`${config.public.apiUrl}/auth/profile`, {
      credentials: "include",
    });
    user.value = data.value as User;
  };

  return { user, role, fetchProfile };
}
