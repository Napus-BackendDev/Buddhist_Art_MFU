<script setup>
import { ref, computed, onMounted } from 'vue'
import { Palette, Search, Filter, Check, X, Eye, Trash2, Clock, Plus } from 'lucide-vue-next'
import { RouterLink  } from 'vue-router'
import useArtwork from '@/composables/useArtwork'

// Data
const { fetchArtworksAdmin, updateArtworkAdmin, deleteArtworkAdmin } = useArtwork()
const artworks = ref([])
const isLoading = ref(false)
const searchQuery = ref('')
const filterStatus = ref('all') // all, pending, approved, rejected

// Fetch artworks
const fetchArtworks = async () => {
  try {
    isLoading.value = true
    artworks.value = await fetchArtworksAdmin()
  } catch (error) {
    console.error('Error fetching artworks:', error)
  } finally {
    isLoading.value = false
  }
}


// Filtered artworks
const filteredArtworks = computed(() => {
  let filtered = artworks.value

  // Filter by status
  if (filterStatus.value !== 'all') {
    filtered = filtered.filter(art => art.approvalStatus === filterStatus.value)
  }

  // Search
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(art =>
      art.artname?.th?.toLowerCase().includes(query) ||
      art.artname?.en?.toLowerCase().includes(query) ||
      art.owner?.username?.th?.toLowerCase().includes(query) ||
      art.owner?.username?.en?.toLowerCase().includes(query) ||
      art.artId?.toLowerCase().includes(query)
    )
  }

  return filtered
})

// Actions
const handleApprove = async (artId) => {
  if (!confirm('ยืนยันการอนุมัติผลงานนี้?')) return

  try {
    await updateArtworkAdmin(artId, { approvalStatus: 'approved' })
    await fetchArtworks()
  } catch (error) {
    console.error('Error approving artwork:', error)
  }
}

const handleReject = async (artId) => {
  try {
    const reason = window.prompt('กรุณากรอกเหตุผลในการปฏิเสธผลงาน:');
    await updateArtworkAdmin(artId, { approvalStatus: 'rejected' , reason })
    await fetchArtworks()
  } catch (error) {
    console.error('Error rejecting artwork:', error)
  }
}

const handleDelete = async (artId) => {
  if (!confirm('ยืนยันการลบผลงานนี้? การกระทำนี้ไม่สามารถย้อนกลับได้')) return

  try {
    await deleteArtworkAdmin(artId)
    await fetchArtworks()
  } catch (error) {
    console.error('Error deleting artwork:', error)
  }
}

const getStatusColor = (status) => {
  if (status === 'approved') return 'bg-green-100 text-green-700 border-green-300'
  if (status === 'rejected') return 'bg-red-100 text-red-700 border-red-300'
  return 'bg-yellow-100 text-yellow-700 border-yellow-300'
}

const getStatusLabel = (status) => {
  if (status === 'approved') return 'อนุมัติแล้ว'
  if (status === 'rejected') return 'ปฏิเสธ'
  return 'รออนุมัติ'
}

onMounted(fetchArtworks)
</script>

<template>
  <div class="w-full mx-auto p-6 space-y-6">
    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div class="bg-white rounded-xl p-4 shadow-md border border-gray-100">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-500 text-sm mb-1">ทั้งหมด</p>
            <p class="text-3xl font-bold text-gray-800">{{ artworks.length }}</p>
          </div>
          <div class="bg-red-100 p-3 rounded-full">
            <Palette :size="28" class="text-red-600" />
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl p-4 shadow-md border border-gray-100">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-500 text-sm mb-1">รออนุมัติ</p>
            <p class="text-3xl font-bold text-yellow-600">{{ artworks.filter(a => a.approvalStatus === 'pending').length }}</p>
          </div>
          <div class="bg-yellow-100 p-3 rounded-full">
            <Clock :size="28" class="text-yellow-600" />
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl p-4 shadow-md border border-gray-100">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-500 text-sm mb-1">อนุมัติแล้ว</p>
            <p class="text-3xl font-bold text-green-600">{{ artworks.filter(a => a.approvalStatus === 'approved').length }}</p>
          </div>
          <div class="bg-green-100 p-3 rounded-full">
            <Check :size="28" class="text-green-600" />
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl p-4 shadow-md border border-gray-100">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-500 text-sm mb-1">ปฏิเสธ</p>
            <p class="text-3xl font-bold text-red-600">{{ artworks.filter(a => a.approvalStatus === 'rejected').length }}</p>
          </div>
          <div class="bg-red-100 p-3 rounded-full">
            <X :size="28" class="text-red-600" />
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
          <input v-model="searchQuery" type="text" placeholder="ค้นหาชื่อผลงาน, รหัสผลงาน, หรือชื่อเจ้าของ..."
            class="w-full pl-10 pr-4 py-2.5 border-2 border-red-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500">
        </div>

        <!-- Status Filter -->
        <div>
          <select v-model="filterStatus"
            class="pl-10 pr-10 py-2.5 border-2 border-red-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white appearance-none cursor-pointer">
            <option value="all">ทุกสถานะ</option>
            <option value="approved">อนุมัติแล้ว</option>
            <option value="pending">รออนุมัติ</option>
            <option value="rejected">ปฏิเสธ</option>
          </select>
        </div>

        <!-- Add Artwork Button -->
        <RouterLink :to="{ name: 'CreateArtwork' }"
          class="inline-flex items-center gap-2 bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition-colors duration-300">
          <Plus :size="18" />
          <span> เพิ่มผลงาน </span>
        </RouterLink>

      </div>

      <!-- Result count -->
      <p v-if="searchQuery || filterStatus !== 'all'" class="text-sm text-gray-600 mt-3">
        แสดง {{ filteredArtworks.length }} จาก {{ artworks.length }} ผลงาน
      </p>
    </div>

    <!-- Table -->
    <div class="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
      <!-- Loading State -->
      <div v-if="isLoading" class="p-12 text-center">
        <div class="inline-block w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin">
        </div>
        <p class="mt-4 text-gray-500">กำลังโหลดข้อมูล...</p>
      </div>

      <!-- Table Content -->
      <div v-else-if="filteredArtworks.length > 0" class="overflow-x-auto">
        <table class="w-full">
          <!-- Table Header -->
          <thead class="bg-gray-50 border-b-2 border-gray-200">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">รูปภาพ</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ข้อมูลผลงาน
              </th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">เจ้าของ</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ราคา</th>
              <th class="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">สถานะ</th>
              <th class="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">จัดการ</th>
            </tr>
          </thead>

          <!-- Table Body -->
          <tbody class="divide-y divide-gray-200">
            <tr v-for="art in filteredArtworks" :key="art._id" class="hover:bg-gray-50 transition-colors">
              <!-- Image -->
              <td class="px-4 py-3">
                <img :src="art.photo" :alt="art.artname?.th"
                  class="w-20 h-20 object-cover rounded-lg shadow-sm border border-gray-200">
              </td>

              <!-- Artwork Info -->
              <td class="px-4 py-3">
                <div class="space-y-1">
                  <p class="font-semibold text-gray-800">{{ art.artname?.th || art.artname?.en }}</p>
                  <p class="text-sm text-gray-500">รหัส: {{ art.artId }}</p>
                  <div class="flex gap-2 text-xs">
                    <span class="bg-gray-100 text-gray-700 px-2 py-1 rounded">{{ art.type?.th || art.type?.en }}</span>
                    <span class="bg-gray-100 text-gray-700 px-2 py-1 rounded">{{ art.size }}</span>
                  </div>
                </div>
              </td>

              <!-- Owner -->
              <td class="px-4 py-3">
                <p class="font-medium text-gray-800">{{ art.owner?.username?.th }}</p>
                <p class="text-sm text-gray-500">{{ art.owner?.studentId }}</p>
              </td>

              <!-- Price -->
              <td class="px-4 py-3">
                <p class="font-bold text-red-600">฿{{ Number(art.price || 0).toLocaleString() }}</p>
              </td>

              <!-- Status -->
              <td class="px-4 py-3">
                <div class="flex justify-center">
                  <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border"
                    :class="getStatusColor(art.approvalStatus)">
                    <Clock v-if="art.approvalStatus === 'pending'" :size="14" />
                    <Check v-else-if="art.approvalStatus === 'approved'" :size="14" />
                    <X v-else :size="14" />
                    {{ getStatusLabel(art.approvalStatus) }}
                  </span>
                </div>
              </td>

              <!-- Actions -->
              <td class="px-4 py-3">
                <div class="flex items-center justify-center gap-2">
                  <!-- Approve Button (only for pending) -->
                  <button v-if="art.approvalStatus === 'pending'" @click="handleApprove(art._id)"
                    class="p-2 bg-green-100 hover:bg-green-500 text-green-600 hover:text-white rounded-lg transition-all shadow-sm hover:shadow-md"
                    title="อนุมัติ">
                    <Check :size="18" />
                  </button>

                  <!-- Reject Button (only for pending) -->
                  <button v-if="art.approvalStatus === 'pending'" @click="handleReject(art._id)"
                    class="p-2 bg-red-100 hover:bg-red-500 text-red-600 hover:text-white rounded-lg transition-all shadow-sm hover:shadow-md"
                    title="ปฏิเสธ">
                    <X :size="18" />
                  </button>

                  <!-- View Button -->
                  <button :to="{ name: 'artworkDetail', params: { id: art._id } }" class="p-2 bg-blue-100 hover:bg-blue-500 text-blue-600 hover:text-white rounded-lg transition-all shadow-sm hover:shadow-md" title="ดูรายละเอียด">
                    <Eye :size="18" />
                  </button>

                  <!-- Delete Button -->
                  <button @click="handleDelete(art._id)"
                    class="p-2 bg-gray-100 hover:bg-red-500 text-gray-600 hover:text-white rounded-lg transition-all shadow-sm hover:shadow-md"
                    title="ลบ">
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
          <Palette :size="40" class="text-gray-400" />
        </div>
        <h3 class="text-xl font-bold text-gray-700 mb-2">ไม่พบผลงาน</h3>
        <p class="text-gray-500">{{ searchQuery || filterStatus !== 'all' ? 'ลองเปลี่ยนคำค้นหาหรือตัวกรอง' :
          'ยังไม่มีผลงานในระบบ' }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Custom scrollbar for table */
.overflow-x-auto::-webkit-scrollbar {
  height: 8px;
}

.overflow-x-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
  background: #DC2626;
  border-radius: 10px;
}

.overflow-x-auto::-webkit-scrollbar-thumb:hover {
  background: #B91C1C;
}

/* Loading spinner animation */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>