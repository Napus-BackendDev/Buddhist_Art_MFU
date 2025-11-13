import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    loadingUser: true,
  }),

  actions: {
    setUser(user) {
      this.user = user
    },

    clear() { 
      this.user = null
    },

    async fetchUser() {
      this.loadingUser = true
      try {
        const res = await fetch('http://localhost:8080/api/user/data', {
          credentials: 'include'
        })

        if (res.ok) {
          this.user = await res.json()
        } else {
          // If server explicitly returns 401 Unauthorized, clear user (logged out).
          // For other non-OK statuses, keep current user to avoid accidental logout on transient errors.
          if (res.status === 401) {
            this.user = null
          } else {
            console.error('fetchUser returned non-OK status', res.status)
            // do not overwrite this.user here
          }
        }
      } catch (err) {
        // Network error or CORS — don't clear existing user to avoid unexpected logout due to transient issues
        console.error('fetchUser network/error:', err)
      } finally {
        this.loadingUser = false
      }
    },
  }
})
