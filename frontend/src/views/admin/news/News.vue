<script setup>
import { ref, computed, onMounted } from 'vue'
import { Newspaper, Search, Filter, Eye, Trash2, Edit2, Plus, Calendar } from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import { formatDate } from '@/utils/formatData.js'
import useNews from '@/composables/useNews'

const { fetchNewsAdmin, deleteNews } = useNews()
const router = useRouter()

// Data
const newsList = ref([])
const isLoading = ref(false)
const searchQuery = ref('')
const sortBy = ref('newest')

// Fetch news
const loadNews = async () => {
  try {
    isLoading.value = true
    newsList.value = await fetchNewsAdmin()
  } catch (error) {
    console.error('Error fetching news:', error)
  } finally {
    isLoading.value = false
  }
}

// Filtered and sorted news
const filteredNews = computed(() => {
  let filtered = [...newsList.value]

  // Search
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(news =>
      news.title?.th?.toLowerCase().includes(query) ||
      news.title?.en?.toLowerCase().includes(query) ||
      news.description?.th?.toLowerCase().includes(query) ||
      news.description?.en?.toLowerCase().includes(query)
    )
  }

  // Sort
  if (sortBy.value === 'newest') {
    filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  } else if (sortBy.value === 'oldest') {
    filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
  } else if (sortBy.value === 'title') {
    filtered.sort((a, b) => (a.title?.th || '').localeCompare(b.title?.th || ''))
  }

  return filtered
})


const handleEdit = (newsId) => {
  router.push({ name: 'EditNews', params: { id: newsId } })
}

const handleView = (newsId) => {
  router.push(`/news/${newsId}`)
}

const handleDelete = async (newsId, newsTitle) => {
  if (!confirm(`ยืนยันการลบข่าว "${newsTitle}"? การดำเนินการนี้ไม่สามารถย้อนกลับได้`)) return

  try {
    await deleteNews(newsId)
    newsList.value = await fetchNewsAdmin()
  } catch (error) {
    console.error('Error deleting news:', error)
    alert('เกิดข้อผิดพลาด: ' + (error.response?.data?.message || error.message))
  }
}

// Truncate text
const truncate = (text, length = 100) => {
  if (!text) return '-'
  return text.length > length ? text.substring(0, length) + '...' : text
}

onMounted(loadNews)
</script>

<template>
  <div class="w-full  p-6 space-y-6">
    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="bg-white rounded-xl p-4 shadow-md border border-gray-100">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-500 text-sm mb-1">ข่าวทั้งหมด</p>
            <p class="text-3xl font-bold text-gray-800">{{ newsList.length }}</p>
          </div>
          <div class="bg-red-100 p-3 rounded-full">
            <Newspaper :size="28" class="text-red-600" />
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl p-4 shadow-md border border-gray-100">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-500 text-sm mb-1">ข่าวใหม่วันนี้</p>
            <p class="text-3xl font-bold text-blue-600">
              {{newsList.filter(n => new Date(n.createdAt).toDateString() === new Date().toDateString()).length}}
            </p>
          </div>
          <div class="bg-blue-100 p-3 rounded-full">
            <Calendar :size="28" class="text-blue-600" />
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl p-4 shadow-md border border-gray-100">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-500 text-sm mb-1">ข่าวสัปดาห์นี้</p>
            <p class="text-3xl font-bold text-green-600">
              {{newsList.filter(n => {
                const newsDate = new Date(n.createdAt)
                const weekAgo = new Date()
                weekAgo.setDate(weekAgo.getDate() - 7)
                return newsDate >= weekAgo
              }).length}}
            </p>
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
          <input v-model="searchQuery" type="text" placeholder="ค้นหาหัวข้อหรือเนื้อหาข่าว..."
            class="w-full pl-10 pr-4 py-2.5 border-2 border-red-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500">
        </div>

        <!-- Sort -->
        <div class="relative">
          <Filter class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" :size="20" />
          <select v-model="sortBy"
            class="pl-10 pr-10 py-2.5 border-2 border-red-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white appearance-none cursor-pointer">
            <option value="newest">ใหม่สุด</option>
            <option value="oldest">เก่าสุด</option>
            <option value="title">เรียงตามชื่อ</option>
          </select>
        </div>

        <!-- Create Button -->
        <RouterLink :to="{ name: 'CreateNews' }"
          class="inline-flex items-center gap-2 bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition-colors duration-300">
          <Plus :size="18" />
          <span>เพิ่มข่าวใหม่</span>
        </RouterLink>

      </div>

      <!-- Result count -->
      <p v-if="searchQuery" class="text-sm text-gray-600 mt-3">
        แสดง {{ filteredNews.length }} จาก {{ newsList.length }} ข่าว
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
      <div v-else-if="filteredNews.length > 0" class="overflow-x-auto">
        <table class="w-full">
          <!-- Table Header -->
          <thead class="bg-gray-50 border-b-2 border-gray-200">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">รูปภาพ</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ข้อมูลข่าว
              </th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">เนื้อหา</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">วันที่สร้าง
              </th>
              <th class="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">จัดการ</th>
            </tr>
          </thead>

          <!-- Table Body -->
          <tbody class="divide-y divide-gray-200">
            <tr v-for="news in filteredNews" :key="news._id" class="hover:bg-gray-50 transition-colors">
              <!-- Image -->
              <td class="px-4 py-3">
                <img :src="news.photo || '/placeholder-news.png'" :alt="news.title?.th"
                  class="w-24 h-16 object-cover rounded-lg shadow-sm border border-gray-200">
              </td>

              <!-- News Info -->
              <td class="px-4 py-3">
                <div class="space-y-1 max-w-xs">
                  <p class="font-semibold text-gray-800 line-clamp-2">{{ news.title?.th || news.title?.en ||
                    'ไม่มีหัวข้อ'
                  }}</p>
                  <p class="text-sm text-gray-500 line-clamp-1">{{ news.title?.en }}</p>
                </div>
              </td>

              <!-- Description -->
              <td class="px-4 py-3">
                <p class="text-sm text-gray-600 max-w-md line-clamp-3">
                  {{ truncate(news.description?.th || news.description?.en || '-', 120) }}
                </p>
              </td>

              <!-- Date -->
              <td class="px-4 py-3">
                <div class="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar :size="16" class="text-gray-400" />
                  <span>{{ formatDate(news.createdAt) }}</span>
                </div>
              </td>

              <!-- Actions -->
              <td class="px-4 py-3">
                <div class="flex items-center justify-center gap-2">
                  <!-- Edit Button -->
                  <button @click="handleEdit(news._id)"
                    class="p-2 bg-blue-100 hover:bg-blue-500 text-blue-600 hover:text-white rounded-lg transition-all shadow-sm hover:shadow-md"
                    title="แก้ไข">
                    <Edit2 :size="18" />
                  </button>

                  <!-- View Button -->
                  <button @click="handleView(news._id)"
                    class="p-2 bg-green-100 hover:bg-green-500 text-green-600 hover:text-white rounded-lg transition-all shadow-sm hover:shadow-md"
                    title="ดูรายละเอียด">
                    <Eye :size="18" />
                  </button>

                  <!-- Delete Button -->
                  <button @click="handleDelete(news._id, news.title?.th || news.title?.en)"
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
          <Newspaper :size="40" class="text-gray-400" />
        </div>
        <h3 class="text-xl font-bold text-gray-700 mb-2">ไม่พบข่าวสาร</h3>
        <p class="text-gray-500 mb-6">{{ searchQuery ? 'ลองเปลี่ยนคำค้นหา' : 'ยังไม่มีข่าวในระบบ' }}</p>
        <RouterLink :to="{ name: 'CreateNews' }"
          class="inline-flex items-center gap-2 bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition-colors duration-300">
          <Plus :size="18" />
          <span>เพิ่มข่าวใหม่</span>
        </RouterLink>
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