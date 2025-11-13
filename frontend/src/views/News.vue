<script setup>
import { ref, computed, onMounted } from 'vue'
import { SearchX } from 'lucide-vue-next'
import useNews from '@/composables/useNews.js'
import Newcard from '@/components/NewCard.vue'

const news = ref([])
const searchQuery = ref('')

const { fetchNews } = useNews()

const loadNews = async () => {
    news.value = await fetchNews()
}

const filteredNews = computed(() => {
    if (!searchQuery.value) return news.value
    return news.value.filter(item => {
        const titleTh = item.title?.th || ''
        const titleEn = item.title?.en || ''
        return (
            titleTh.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
            titleEn.toLowerCase().includes(searchQuery.value.toLowerCase())
        )
    })
})

onMounted(loadNews)

</script>

<template>
    <header class="w-full items-center justify-center mb-6">
        <h1 class="text-5xl text-center font-extrabold text-red-600">ข่าวสารและกิจกรรม</h1>
        <h2 class="text-xl text-gray-600 text-center">อัพเดทข่าวสารใหม่ๆ จากวงการศิลปะและกิจกรรมที่น่าสนใจ</h2>
        <div class="flex justify-start my-4">
            <input v-model="searchQuery" type="text" placeholder="ค้นหาหัวข้อหรือเนื้อหาข่าว"
                class="w-full max-w-lg border border-gray-300 rounded-lg py-2 px-4" />
        </div>
        <div class="flex justify-between">
            <h1>ผลงานทั้งหมด {{ news.length }} ชิ้น</h1>
        </div>
    </header>
    <main class="w-full">
        <div v-if="filteredNews.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Newcard v-for="item in filteredNews" :key="item._id" :newsItem="item" />

        </div>
        <div v-else class="flex flex-col items-center justify-center py-16">
            <SearchX size="64" class="text-gray-300 mb-4" />
            <h3 class="text-xl font-semibold text-gray-500 mb-2">ไม่พบข่าว</h3>
            <p class="text-gray-400">ลองค้นหาด้วยคำค้นอื่นหรือรอสักครู่</p>
        </div>
    </main>
</template>