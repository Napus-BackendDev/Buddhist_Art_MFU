<script setup>
import { useCartStore } from '@/stores/cartStore'
import { ShoppingCart, Grid2x2, SearchX } from 'lucide-vue-next'
import { RouterLink } from 'vue-router'
import { ref, computed, onMounted } from 'vue'
import useArtwork  from '@/composables/useArtwork.js'
import Artcard from '@/components/ArtworkCard/ArtworkCard.vue'

const artworks = ref([])
const cartStore = useCartStore()    
const { fetchArtworks } = useArtwork()

// Search and Filter state
const searchQuery = ref('')
const sortBy = ref('')
const filterType = ref('')
const filterSaleStatus = ref('')

const loadArtworks = async () => {
    const data = await fetchArtworks()
    artworks.value = data.filter(a => a.approvalStatus !== 'pending')
}

onMounted(loadArtworks)

// Filtered and sorted artworks
const filteredArtworks = computed(() => {
    let result = [...artworks.value]

    // 1. Filter by search query
    if (searchQuery.value.trim()) {
        const query = searchQuery.value.toLowerCase()
        result = result.filter(art => {
            const nameTh = art.artname?.th?.toLowerCase() || ''
            const nameEn = art.artname?.en?.toLowerCase() || ''
            const artId = art.artId?.toLowerCase() || ''
            const typeTh = art.type?.th?.toLowerCase() || ''
            const typeEn = art.type?.en?.toLowerCase() || ''
            const ownerName = art.owner?.username?.th?.toLowerCase() || art.owner?.username?.en?.toLowerCase() || ''

            return nameTh.includes(query) ||
                nameEn.includes(query) ||
                artId.includes(query) ||
                typeTh.includes(query) ||
                typeEn.includes(query) ||
                ownerName.includes(query)
        })
    }

    // 2. Filter by art type
    if (filterType.value) {
        result = result.filter(art => {
            const typeTh = art.type?.th || ''
            const typeEn = art.type?.en || ''
            return typeTh === filterType.value || typeEn === filterType.value
        })
    }

    // 3. Filter by sale status
    if (filterSaleStatus.value) {
        result = result.filter(art => art.saleStatus === filterSaleStatus.value)
    }

    // 4. Sort
    if (sortBy.value === 'newest') {
        result.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
    } else if (sortBy.value === 'oldest') {
        result.sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0))
    } else if (sortBy.value === 'price_high') {
        result.sort((a, b) => (b.price || 0) - (a.price || 0))
    } else if (sortBy.value === 'price_low') {
        result.sort((a, b) => (a.price || 0) - (b.price || 0))
    } else if (sortBy.value === 'most_viewed') {
        result.sort((a, b) => (b.views || 0) - (a.views || 0))
    }

    return result
})

// Get unique art types for filter
const artTypes = computed(() => {
    const types = new Set()
    artworks.value.forEach(art => {
        if (art.type?.th) types.add(art.type.th)
    })
    return Array.from(types).sort()
})

const isInCart = (id) => cartStore.items.some(item => item._id === id)

const toggleCart = (art) => {
    if (cartStore.items.some(i => i._id === art._id)) {
        cartStore.removeFromCart(art._id)
    } else {
        cartStore.addToCart(art)
    }
}

</script>


<template>
    <header class="w-full justify-center items-center mb-6">
        <h1 class="text-5xl text-center font-extrabold text-red-600">ผลงานศิลปะทั้งหมด</h1>
        <p class="text-gray-600 text-center text-xl">คอลเลกชันผลงานศิลปะคุณภาพสูงจากศิลปินมากความสามารถ</p>
        <div class="flex justify-between my-4">
            <input v-model="searchQuery" type="text" placeholder="ค้นหาผลงานศิลปะ (ชื่อ, ศิลปิน, Art ID, ประเภท)"
                class="w-full max-w-lg border border-gray-300 rounded-lg py-2 px-4 " />
            <div class="flex gap-3">
                <select v-model="sortBy"
                    class="border border-gray-300 rounded-lg py-2 px-4 focus:ring-2 focus:ring-red-500 focus:border-transparent">
                    <option value="">เรียงตาม</option>
                    <option value="newest">ใหม่ล่าสุด</option>
                    <option value="oldest">เก่าสุด</option>
                    <option value="price_high">ราคาสูงสุด</option>
                    <option value="price_low">ราคาต่ำสุด</option>
                    <option value="most_viewed">ยอดวิวสูงสุด</option>
                </select>
                <select v-model="filterType"
                    class="border border-gray-300 rounded-lg py-2 px-4 focus:ring-2 focus:ring-red-500 focus:border-transparent">
                    <option value="">ประเภททั้งหมด</option>
                    <option v-for="type in artTypes" :key="type" :value="type">{{ type }}</option>
                </select>
                <select v-model="filterSaleStatus"
                    class="border border-gray-300 rounded-lg py-2 px-4 focus:ring-2 focus:ring-red-500 focus:border-transparent">
                    <option value="">สถานะทั้งหมด</option>
                    <option value="available">พร้อมขาย</option>
                    <option value="sold">ขายแล้ว</option>
                </select>
            </div>
        </div>
        <div class="flex justify-between">
            <div>
                <h1>ผลงานทั้งหมด {{ artworks.length }} ชิ้น</h1>
                <p v-if="searchQuery || filterType || filterSaleStatus" class="text-sm text-gray-500 mt-1">
                    แสดง {{ filteredArtworks.length }} ผลงานจากการค้นหา/กรอง
                </p>
            </div>
            <!-- <div class="flex items-center gap-2 text-sm text-gray-500">
                <Grid2x2 size="16" />
                <span>มุมมองแบบตาราง</span>
            </div> -->
        </div>
    </header>
    <main class="w-full">
        <div v-if="filteredArtworks.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="art in filteredArtworks" :key="art._id" class="relative">
                <Artcard :art="art" :is-in-cart="isInCart(art._id)" class="mb-6" @add-to-cart="toggleCart" />
                <div v-if="isInCart(art._id)"
                    class="absolute top-2 right-2 bg-green-500 text-white rounded-full px-3 py-1 text-sm font-semibold shadow-lg">
                    ✓ อยู่ในตะกร้า
                </div>
            </div>
        </div>
        <div v-else class="flex flex-col items-center justify-center py-16">
            <SearchX size="64" class="text-gray-300 mb-4" />
            <h3 class="text-xl font-semibold text-gray-500 mb-2">ไม่พบผลงานศิลปะ</h3>
            <p class="text-gray-400">ลองค้นหาด้วยคำค้นอื่น หรือเปลี่ยนตัวกรอง</p>
        </div>

        <!-- 🛒 ปุ่มตะกร้าขวาล่าง -->
        <RouterLink :to="{ name: 'order' }"
            class="fixed bottom-6 right-6 bg-red-600 text-white rounded-full p-4 shadow-lg flex items-center gap-2 hover:bg-red-700 transition">
            <ShoppingCart size="24" />
            <span>ซื้อสินค้า ({{ cartStore.totalItems }})</span>
        </RouterLink>
    </main>

</template>