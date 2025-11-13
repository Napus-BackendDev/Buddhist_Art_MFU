export default function useOrder() {

  const submitOrder = async (orderData) => {
    try {
      const response = await fetch('http://localhost:8080/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      })
      if (!response.ok) throw new Error('Failed to create order')
    } catch (error) {
      console.error('Error creating order:', error)
      throw error
    }
  }

  const fetchOrders = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/admin/orders', {
        method: 'GET',
        credentials: 'include'
      })
      if (!response.ok) throw new Error('Failed to fetch orders')
      return await response.json()
    } catch (error) {
      console.error('Error fetching orders:', error)
      throw error
    }
  }

  return { submitOrder , fetchOrders }
}
