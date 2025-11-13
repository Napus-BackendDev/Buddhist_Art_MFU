<script setup>
import { ref, computed } from 'vue'
import { Grid2x2, SearchX, Plus } from 'lucide-vue-next'
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import useArtwork from '@/composables/useArtwork'
import Artcard from '@/components/ArtworkCard/ArtworkCard.vue'

const { deleteArtwork } = useArtwork()
const router = useRouter()
const auth = useAuthStore()
const user = computed(() => auth.user)
const userArt = computed(() => user.value?.arts || [])

// Search and Filter state
const searchQuery = ref('')
const sortBy = ref('')
const filterStatus = ref('')

// Filtered and sorted arts
const filteredArts = computed(() => {
    let result = [...userArt.value]

    // 1. Filter by search query
    if (searchQuery.value.trim()) {
        const query = searchQuery.value.toLowerCase()
        result = result.filter(art => {
            const nameTh = art.artname?.th?.toLowerCase() || ''
            const nameEn = art.artname?.en?.toLowerCase() || ''
            const artId = art.artId?.toLowerCase() || ''
            const typeTh = art.type?.th?.toLowerCase() || ''
            const typeEn = art.type?.en?.toLowerCase() || ''

            return nameTh.includes(query) ||
                nameEn.includes(query) ||
                artId.includes(query) ||
                typeTh.includes(query) ||
                typeEn.includes(query)
        })
    }

    // 2. Filter by approval status
    if (filterStatus.value) {
        result = result.filter(art => art.approvalStatus === filterStatus.value)
    }

    // 3. Sort
    if (sortBy.value === 'newest') {
        result.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
    } else if (sortBy.value === 'oldest') {
        result.sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0))
    } else if (sortBy.value === 'price_high') {
        result.sort((a, b) => (b.price || 0) - (a.price || 0))
    } else if (sortBy.value === 'price_low') {
        result.sort((a, b) => (a.price || 0) - (b.price || 0))
    }

    return result
})
const handleEdit = (art) => {
    router.push({ name: 'EditArt', params: { id: art._id } })
}

const handleDelete = async (art) => {
    const artName = art.artname?.th || art.artname?.en || 'ผลงานนี้'
 
    if (!confirm(`คุณต้องการลบผลงาน "${artName}" ใช่หรือไม่?\n\nการลบจะไม่สามารถกู้คืนได้`)) {
        return
    }

    try {
        await deleteArtwork(art._id)
        alert('ลบผลงานสำเร็จ')
        await auth.fetchUser()
    } catch (error) {
        console.error('Error deleting art:', error)
        alert('เกิดข้อผิดพลาดในการลบผลงาน: ' + (error?.message || 'Unknown error'))
    }
}
</script>

<template>
    <header class="w-full justify-center items-center mb-6">
        <h1 class="text-5xl text-center font-extrabold text-red-600">ผลงานศิลปะของฉัน</h1>
        <p class="text-gray-600 text-center text-xl">จัดการผลงานศิลปะที่คุณได้ส่งมาแสดงในแพลตฟอร์มของเรา</p>
        <div class="flex justify-between my-4">
            <input v-model="searchQuery" type="text" placeholder="ค้นหาผลงานศิลปะ (ชื่อ, Art ID, ประเภท)"
                class="w-full max-w-lg border border-gray-300 rounded-lg py-2 px-4 " />
            <div class="flex gap-3">
                <select v-model="sortBy"
                    class="border border-gray-300 rounded-lg py-2 px-4 focus:ring-2 focus:ring-red-500 focus:border-transparent">
                    <option value="">เรียงตาม</option>
                    <option value="newest">ใหม่ล่าสุด</option>
                    <option value="oldest">เก่าสุด</option>
                    <option value="price_high">ราคาสูงสุด</option>
                    <option value="price_low">ราคาต่ำสุด</option>
                </select>
                <select v-model="filterStatus"
                    class="border border-gray-300 rounded-lg py-2 px-4 focus:ring-2 focus:ring-red-500 focus:border-transparent">
                    <option value="">สถานะทั้งหมด</option>
                    <option value="approved">อนุมัติแล้ว</option>
                    <option value="pending">รอการอนุมัติ</option>
                    <option value="rejected">ถูกปฏิเสธ</option>
                </select>
                <RouterLink to="/user/create/art"
                    class="inline-flex items-center gap-2 bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition-colors duration-300">
                    <Plus :size="18" />
                    เพิ่มผลงานใหม่
                </RouterLink>
            </div>
        </div>
        <div class="flex justify-between">
            <div>
                <h1>ผลงานทั้งหมด {{ userArt.length }} ชิ้น</h1>
                <p v-if="searchQuery || filterStatus" class="text-sm text-gray-500 mt-1">
                    แสดง {{ filteredArts.length }} ผลงานจากการค้นหา/กรอง
                </p>
            </div>
            <div class="flex items-center gap-2 text-sm text-gray-500">
                <Grid2x2 size="16" />
                <span>มุมมองแบบตาราง</span>
            </div>
        </div>
    </header>
    <main class="w-full">
        <div v-if="filteredArts.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="art in filteredArts" :key="art._id">
                <Artcard :art="art" :showAddToCart="false" :showEditButton="true" @edit="handleEdit(art)" @delete="handleDelete(art)" class="mb-6" />
            </div>
        </div>
        <div v-else class="flex flex-col items-center justify-center py-16">
            <SearchX size="64" class="text-gray-300 mb-4" />
            <h3 class="text-xl font-semibold text-gray-500 mb-2">ไม่พบผลงานศิลปะ</h3>
            <p class="text-gray-400">ลองค้นหาด้วยคำค้นอื่น หรือเปลี่ยนตัวกรอง</p>
        </div>
    </main>
</template>