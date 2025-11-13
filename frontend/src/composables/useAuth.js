import { useAuthStore } from '@/stores/auth'
import { ref } from 'vue'

export function useAuth() {
  const authStore = useAuthStore()
  const loading = ref(false)
  const error = ref(null)

  const login = async (email, password) => {
    try {
      loading.value = true
      const res = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      })
      if (!res.ok) {
        const errData = await res.json()
        throw new Error(errData.message || 'Login failed')
      }
      authStore.fetchUser()
    } catch (err) {
      error.value = err
      console.error('Login error:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const logout = async () => {
    loading.value = true
    try {
      await fetch('http://localhost:8080/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      })
      authStore.clear()
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  return { login, logout, loading, error }
}
