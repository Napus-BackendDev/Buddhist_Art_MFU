<script setup>
import { onMounted, ref, computed } from 'vue'
import { Image, Users, Newspaper, ShoppingCart } from 'lucide-vue-next'

const artworks = ref(null)
const users = ref(null)
const orders = ref(null)
const news = ref(null)

onMounted(async () => {
  try {
    const [artworksRes, usersRes, ordersRes, newsRes] = await Promise.all([
      fetch('http://localhost:8080/api/arts', { credentials: 'include' }),
      fetch('http://localhost:8080/api/admin/user', { credentials: 'include' }),
      fetch('http://localhost:8080/api/admin/orders', { credentials: 'include' }),
      fetch('http://localhost:8080/api/news', { credentials: 'include' })
    ])
    artworks.value = await artworksRes.json()
    users.value = await usersRes.json()
    orders.value = await ordersRes.json()
    news.value = await newsRes.json()
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
  }
})

const totalArtworks = computed(() => (Array.isArray(artworks.value) ? artworks.value.length : 0))
const totalUsers = computed(() => (Array.isArray(users.value) ? users.value.length : 0))
const totalNews = computed(() => (Array.isArray(news.value) ? news.value.length : 0))
const totalOrders = computed(() => (Array.isArray(orders.value) ? orders.value.length : 0))

const formatNumber = (n) => {
  try {
    return (Number(n) || 0).toLocaleString('th-TH')
  } catch (e) {
    return String(n)
  }
}
</script>

<template>
  <div class="p-6">
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <!-- Artwork card (big) -->
      <div class="bg-white rounded-2xl p-6 shadow-md border border-gray-100 flex flex-col justify-between">
        <div class="flex items-start gap-4">
          <div class="p-3 rounded-lg bg-red-50 text-red-600">
            <Image :size="28" />
          </div>
          <div>
            <p class="text-sm text-gray-500">Artworks</p>
            <p class="text-2xl font-bold text-gray-800">{{ formatNumber(totalArtworks) }}</p>
            <p class="text-xs text-gray-400 mt-1">จำนวนผลงานทั้งหมดในระบบ</p>
          </div>
        </div>
        <div class="mt-4 text-right">
          <router-link to="/admin/artworks" class="text-sm text-red-600 hover:underline">ดูผลงานทั้งหมด</router-link>
        </div>
      </div>

      <!-- Users card -->
      <div class="bg-white rounded-2xl p-6 shadow-md border border-gray-100 flex flex-col justify-between">
        <div class="flex items-start gap-4">
          <div class="p-3 rounded-lg bg-blue-50 text-blue-600">
            <Users :size="28" />
          </div>
          <div>
            <p class="text-sm text-gray-500">Users</p>
            <p class="text-2xl font-bold text-gray-800">{{ formatNumber(totalUsers) }}</p>
            <p class="text-xs text-gray-400 mt-1">สมาชิกและผู้ดูแลระบบ</p>
          </div>
        </div>
        <div class="mt-4 text-right">
          <router-link to="/admin/user" class="text-sm text-blue-600 hover:underline">จัดการผู้ใช้</router-link>
        </div>
      </div>

      <!-- News card -->
      <div class="bg-white rounded-2xl p-6 shadow-md border border-gray-100 flex flex-col justify-between">
        <div class="flex items-start gap-4">
          <div class="p-3 rounded-lg bg-green-50 text-green-600">
            <Newspaper :size="28" />
          </div>
          <div>
            <p class="text-sm text-gray-500">News</p>
            <p class="text-2xl font-bold text-gray-800">{{ formatNumber(totalNews) }}</p>
            <p class="text-xs text-gray-400 mt-1">ประกาศและข่าวสาร</p>
          </div>
        </div>
        <div class="mt-4 text-right">
          <router-link to="/admin/news" class="text-sm text-green-600 hover:underline">จัดการข่าว</router-link>
        </div>
      </div>

      <!-- Orders card -->
      <div class="bg-white rounded-2xl p-6 shadow-md border border-gray-100 flex flex-col justify-between">
        <div class="flex items-start gap-4">
          <div class="p-3 rounded-lg bg-yellow-50 text-yellow-600">
            <ShoppingCart :size="28" />
          </div>
          <div>
            <p class="text-sm text-gray-500">Orders</p>
            <p class="text-2xl font-bold text-gray-800">{{ formatNumber(totalOrders) }}</p>
            <p class="text-xs text-gray-400 mt-1">รายการสั่งซื้อทั้งหมด</p>
          </div>
        </div>
        <div class="mt-4 text-right">
          <router-link to="/admin/order" class="text-sm text-yellow-600 hover:underline">ดูคำสั่งซื้อ</router-link>
        </div>
      </div>
    </div>
  </div>
</template>