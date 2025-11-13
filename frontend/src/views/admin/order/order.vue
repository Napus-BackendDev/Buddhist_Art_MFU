<script setup>

import { ref, onMounted, computed } from 'vue'
import { ShoppingCart, Search, Filter, Eye, Trash2, Plus, Calendar } from 'lucide-vue-next'
import useArtwork from '@/composables/useArtwork'
import { formatDate } from '@/utils/formatData.js'

const { fetchArtworksAdmin } = useArtwork()
const orders = ref([])
const artworks = ref([])
const isLoading = ref(false)
const searchQuery = ref('')
const sortBy = ref('newest')

const LoadData = async () => {
  try {
    isLoading.value = true
    artworks.value = await fetchArtworksAdmin()
    console.log('Fetched artworks:', artworks.value)
    orders.value = artworks.value.filter(a => a.orders && a.orders.length > 0)
    console.log('Fetched orders:', orders.value)
  } catch (err) {
    console.error('Error fetching orders:', err)
    orders.value = []
  } finally {
    isLoading.value = false
  }
}

onMounted(LoadData)

const totalOrders = computed(() => orders.value.length)
const newTodayCount = computed(() => orders.value.filter(o => {
  const d = new Date(o.createdAt || o.createdAtAt || 0)
  return d.toDateString() === new Date().toDateString()
}).length)

const pendingCount = computed(() => orders.value.filter(o => (o.status || '').toLowerCase() === 'pending').length)

const filteredOrders = computed(() => {
  let list = [...orders.value]
  // search by id, buyer email/name
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter(o => {
      const id = (o._id || o.id || '').toString().toLowerCase()
      const buyerName = (o.buyer?.username?.th || o.buyer?.username?.en || o.buyer?.email || o.buyer?.name || '').toLowerCase()
      const total = (o.total || '').toString().toLowerCase()
      return id.includes(q) || buyerName.includes(q) || total.includes(q)
    })
  }

  if (sortBy.value === 'newest') {
    list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  } else if (sortBy.value === 'oldest') {
    list.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
  }

  return list
})

// Actions (view/delete) — placeholders for now
const handleView = (id) => {
  // navigate to order detail if route exists
  window.location.href = `/admin/orders/${id}`
}

const handleDelete = async (id) => {
  if (!confirm('ยืนยันการลบคำสั่งซื้อ?')) return
  try {
    // call backend delete if available — using fetch directly as composable doesn't provide delete
    const res = await fetch(`http://localhost:8080/api/orders/${id}`, { method: 'DELETE' })
    if (!res.ok) throw new Error('Delete failed')
    await LoadData()
  } catch (err) {
    console.error('Delete order error:', err)
    alert('ไม่สามารถลบคำสั่งซื้อได้')
  }
}

</script>


<template>
  <div class="w-full p-6 space-y-6">
    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="bg-white rounded-xl p-4 shadow-md border border-gray-100">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-500 text-sm mb-1">คำสั่งซื้อทั้งหมด</p>
            <p class="text-3xl font-bold text-gray-800">{{ totalOrders }}</p>
          </div>
          <div class="bg-red-100 p-3 rounded-full">
            <ShoppingCart :size="28" class="text-red-600" />
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl p-4 shadow-md border border-gray-100">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-500 text-sm mb-1">สั่งซื้อวันนี้</p>
            <p class="text-3xl font-bold text-blue-600">{{ newTodayCount }}</p>
          </div>
          <div class="bg-blue-100 p-3 rounded-full">
            <Calendar :size="28" class="text-blue-600" />
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl p-4 shadow-md border border-gray-100">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-500 text-sm mb-1">รอดำเนินการ</p>
            <p class="text-3xl font-bold text-green-600">{{ pendingCount }}</p>
          </div>
          <div class="bg-green-100 p-3 rounded-full">
            <Calendar :size="28" class="text-green-600" />
          </div>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-xl p-4 shadow-md border border-gray-100">
      <div class="flex flex-col md:flex-row gap-4">
        <!-- Search -->
        <div class="flex-1 relative">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" :size="20" />
          <input v-model="searchQuery" type="text" placeholder="ค้นหา ID คำสั่งซื้อ หรือ ลูกค้า..."
            class="w-full pl-10 pr-4 py-2.5 border-2 border-red-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500">
        </div>

        <!-- Sort -->
        <div class="relative">
          <Filter class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" :size="20" />
          <select v-model="sortBy"
            class="pl-10 pr-10 py-2.5 border-2 border-red-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white appearance-none cursor-pointer">
            <option value="newest">ใหม่สุด</option>
            <option value="oldest">เก่าสุด</option>
          </select>
        </div>

        <!-- (optional) Create Button placeholder -->
        <button disabled class="inline-flex items-center gap-2 bg-gray-200 text-gray-500 py-2 px-4 rounded">
          <Plus :size="18" />
          <span>สร้างคำสั่งซื้อ</span>
        </button>

      </div>

      <!-- Result count -->
      <p v-if="searchQuery" class="text-sm text-gray-600 mt-3">
        แสดง {{ filteredOrders.length }} จาก {{ orders.length }} คำสั่งซื้อ
      </p>
    </div>

    <!-- Table -->
    <div class="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
      <!-- Loading State -->
      <div v-if="isLoading" class="p-12 text-center">
        <div class="inline-block w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
        <p class="mt-4 text-gray-500">กำลังโหลดข้อมูล...</p>
      </div>

      <!-- Table Content -->
      <div v-else-if="filteredOrders.length > 0" class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 border-b-2 border-gray-200">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Order ID</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ลูกค้า</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">จำนวนรายการ</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ยอดรวม</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">สถานะ</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">วันที่</th>
              <th class="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">จัดการ</th>
            </tr>
          </thead>

          <tbody class="divide-y divide-gray-200">
            <tr v-for="o in filteredOrders" :key="o._id" class="hover:bg-gray-50 transition-colors">
              <td class="px-4 py-3 text-sm text-gray-800">{{ o._id || o.id }}</td>
              <td class="px-4 py-3 text-sm text-gray-600">{{ o.buyer?.username?.th || o.buyer?.username?.en || o.buyer?.email || '-' }}</td>
              <td class="px-4 py-3 text-sm text-gray-600">{{ (o.items && o.items.length) || o.itemCount || 0 }}</td>
              <td class="px-4 py-3 text-sm font-bold text-red-600">฿{{ Number(o.total || 0).toLocaleString() }}</td>
              <td class="px-4 py-3 text-sm text-gray-600">{{ o.status || '-' }}</td>
              <td class="px-4 py-3 text-sm text-gray-600">{{ formatDate(o.createdAt) }}</td>
              <td class="px-4 py-3">
                <div class="flex items-center justify-center gap-2">
                  <button @click="handleView(o._id || o.id)" class="p-2 bg-blue-100 hover:bg-blue-500 text-blue-600 hover:text-white rounded-lg transition-all" title="ดู">
                    <Eye :size="18" />
                  </button>
                  <button @click="handleDelete(o._id || o.id)" class="p-2 bg-gray-100 hover:bg-red-500 text-gray-600 hover:text-white rounded-lg transition-all" title="ลบ">
                    <Trash2 :size="18" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty State -->
      <div v-else class="p-12 text-center">
        <div class="bg-gray-100 w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center">
          <ShoppingCart :size="40" class="text-gray-400" />
        </div>
        <h3 class="text-xl font-bold text-gray-700 mb-2">ไม่พบคำสั่งซื้อ</h3>
        <p class="text-gray-500 mb-6">{{ searchQuery ? 'ลองเปลี่ยนคำค้นหา' : 'ยังไม่มีคำสั่งซื้อในระบบ' }}</p>
      </div>
    </div>
  </div>
</template>