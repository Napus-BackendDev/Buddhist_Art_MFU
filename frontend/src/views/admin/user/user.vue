<script setup>
import { onMounted, ref, computed } from 'vue'
import { Edit2, Trash2, Plus, Search, Users as UsersIcon, User } from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import useUsers from '@/composables/useUser.js'
import { formatDate } from '@/utils/formatData.js'

const { fetchUsersAdmin , deleteUserAdmin } = useUsers()
const router = useRouter()

// state
const users = ref([])
const isLoading = ref(false)
const error = ref('')

// search & filter
const searchQuery = ref('')
const filterRole = ref('all')

// fetch users
const LoadData = async () => {
  isLoading.value = true
  try {
    users.value = await fetchUsersAdmin()
    console.log('Fetched users:', users.value)
  } catch (e) {
    console.error('Error fetching users data:', e)
    error.value = 'ไม่สามารถโหลดข้อมูลผู้ใช้ได้'
  } finally {
    isLoading.value = false
  }
}

onMounted(LoadData)

// derived info for stats and filters
const totalUsers = computed(() => users.value.length)
const adminsCount = computed(() => users.value.filter(u => (u.role || '').toLowerCase() === 'admin').length)
const newTodayCount = computed(() => users.value.filter(u => {
  const d = new Date(u.createdAt || u.createdAtAt || u.createdAtDate || 0)
  const today = new Date()
  return d.toDateString() === today.toDateString()
}).length)

const roles = computed(() => {
  const set = new Set(users.value.map(u => u.role || 'None'))
  return Array.from(set)
})

const filteredUsers = computed(() => {
  let list = users.value
  if (filterRole.value !== 'all') {
    list = list.filter(u => (u.role || 'None') === filterRole.value)
  }
  if (!searchQuery.value) return list
  const q = searchQuery.value.toLowerCase()
  return list.filter(u => {
    return (u.name || '').toLowerCase().includes(q) ||
      (u.email || '').toLowerCase().includes(q) ||
      (u.role || '').toLowerCase().includes(q)
  })
})

function handleEdit(userId) {
  router.push({ name: 'EditUser', params: { id: userId } }).catch(() => {})
}

async function handleDelete(userId, displayName) {
  if (!confirm(`ยืนยันการลบผู้ใช้ "${displayName}"?`)) return
  try {
    await deleteUserAdmin(userId)
    await LoadData()

  } catch (e) {
    console.error('Delete user failed', e)
    alert('เกิดข้อผิดพลาดในการลบผู้ใช้')
  }
}

</script>

<template>
  <div class="w-full mx-auto p-6 space-y-6">
    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="bg-white rounded-xl p-4 shadow-md border border-gray-100">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-500 text-sm mb-1">ผู้ใช้ทั้งหมด</p>
            <p class="text-3xl font-bold text-gray-800">{{ totalUsers }}</p>
          </div>
          <div class="bg-red-100 p-3 rounded-full">
            <UsersIcon :size="28" class="text-red-600" />
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl p-4 shadow-md border border-gray-100">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-500 text-sm mb-1">เพิ่มวันนี้</p>
            <p class="text-3xl font-bold text-blue-600">{{ newTodayCount }}</p>
          </div>
          <div class="bg-blue-100 p-3 rounded-full">
            <User :size="28" class="text-blue-600" />
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl p-4 shadow-md border border-gray-100">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-500 text-sm mb-1">ผู้ดูแลระบบ</p>
            <p class="text-3xl font-bold text-green-600">{{ adminsCount }}</p>
          </div>
          <div class="bg-green-100 p-3 rounded-full">
            <User :size="28" class="text-green-600" />
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
          <input v-model="searchQuery" type="text" placeholder="ค้นหาชื่อหรืออีเมล..."
            class="w-full pl-10 pr-4 py-2.5 border-2 border-red-600 rounded-lg ">
        </div>

        <!-- Role Filter -->
        <div class="relative">
          <select v-model="filterRole"
            class="pl-4 pr-4 py-2.5 border-2 border-red-600 rounded-lg  bg-white appearance-none cursor-pointer">
            <option value="all">ทุกบทบาท</option>
            <option v-for="r in roles" :key="r" :value="r">{{ r }}</option>
          </select>
        </div>

        <!-- Add Button -->
        <RouterLink :to="{name: 'CreateUser'}" class="inline-flex items-center gap-2 bg-red-600 text-white pl-4 pr-4 py-2.5 border-2 rounded-lg hover:bg-red-700 transition-colors duration-300">
            <Plus :size="18" />
            <span>เพิ่มผู้ใช้</span>
        </RouterLink>
      </div>

      <p v-if="searchQuery || filterRole !== 'all'" class="text-sm text-gray-600 mt-3">
        แสดง {{ filteredUsers.length }} จาก {{ users.length }} ผู้ใช้
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
      <div v-else-if="filteredUsers.length > 0" class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 border-b-2 border-gray-200">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ผู้ใช้</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">รหัสนักเรียน</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">อีเมล</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">บทบาท</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">วันที่สร้าง</th>
              <th class="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">จัดการ</th>
            </tr>
          </thead>

          <tbody class="divide-y divide-gray-200">
            <tr v-for="u in filteredUsers" :key="u.id" class="hover:bg-gray-50 transition-colors">
              <td class="px-4 py-3">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                    <img v-if="u.photo" :src="u.photo" alt="Avatar" class="w-10 h-10 rounded-full object-cover" />
                    <User :size="24" />
                  </div>
                  <div>
                    <p class="font-semibold text-gray-800">{{ u.username.en || '-' }}</p>
                    <p class="text-xs text-gray-500">{{ u.username.th }}</p>
                  </div>
                </div>
              </td>

              <td class="px-4 py-3">
                <div class="text-sm text-gray-600">{{ u.studentId || '-' }}</div>
              </td>

              <td class="px-4 py-3">
                <div class="text-sm text-gray-600">{{ u.email.personal || '-' }}</div>
                <p class="text-xs text-gray-500">{{ u.email.university || '-' }}</p>
              </td>

              <td class="px-4 py-3">
                <div class="text-sm text-gray-600">{{ u.role || '-' }}</div>
              </td>

              <td class="px-4 py-3">
                <div class="text-sm text-gray-600">{{ formatDate(u.createdAt) }}</div>
              </td>

              <td class="px-4 py-3">
                <div class="flex items-center justify-center gap-2">
                  <button @click="handleEdit(u._id)" class="p-2 bg-blue-100 hover:bg-blue-500 text-blue-600 hover:text-white rounded-lg transition-all" title="แก้ไข">
                    <Edit2 :size="18" />
                  </button>
                  <button @click="handleDelete(u._id, u.username.th)" class="p-2 bg-gray-100 hover:bg-red-500 text-gray-600 hover:text-white rounded-lg transition-all" title="ลบ">
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
          <UsersIcon :size="40" class="text-gray-400" />
        </div>
        <h3 class="text-xl font-bold text-gray-700 mb-2">ไม่พบผู้ใช้</h3>
        <p class="text-gray-500">{{ searchQuery || filterRole !== 'all' ? 'ลองเปลี่ยนคำค้นหาหรือตัวกรอง' : 'ยังไม่มีผู้ใช้ในระบบ' }}</p>
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

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>