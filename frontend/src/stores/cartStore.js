import { defineStore } from 'pinia'

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: []
  }),
  getters: {
    totalItems: (state) => state.items.length,
    totalPrice: (state) => state.items.reduce((sum, item) => sum + Number(item.price || 0), 0)
  },
  actions: {
    addToCart(item) {
      if (!this.items.some(i => i._id === item._id)) {
        this.items.push(item)
      }
    },
    removeFromCart(itemId) {
      this.items = this.items.filter(i => i._id !== itemId)
    },
    clearCart() {
      this.items = []
    }
  }
})