<script setup>
import { Calendar, TrendingUp, ArrowRight } from 'lucide-vue-next'
import { formatDate } from '@/utils/formatData.js'

const props = defineProps({
    newsItem: { type: Object, required: true }
})

</script>

<template>
    <article class="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer">
        <!-- Image -->
        <div class="relative h-48 overflow-hidden bg-gray-100">
            <img v-if="props.newsItem?.photo" :src="props.newsItem.photo" :alt="props.newsItem.title?.th"
                class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
            <div v-else class="w-full h-full flex items-center justify-center">
                <TrendingUp :size="48" class="text-gray-300" />
            </div>

            <!-- Date Badge -->
            <div
                class="absolute top-3 left-3 bg-red-600 text-white px-3 py-1 rounded-lg text-xs font-semibold shadow-md">
                <Calendar :size="12" class="inline mr-1" />
                {{ formatDate(props.newsItem?.createdAt) }}
            </div>
        </div>

        <!-- Content -->
        <div class="p-5">
            <h3 class="text-lg font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-red-600 transition-colors">
                {{ props.newsItem?.title?.th || 'ไม่มีหัวข้อ' }}
            </h3>
            <p v-if="props.newsItem?.description?.th" class="text-sm text-gray-600 line-clamp-3">
                {{ props.newsItem?.description?.th }}
            </p>

            <!-- Read More Link -->
            <div
                class="mt-4 flex items-center gap-2 text-red-600 font-semibold text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                <span>อ่านเพิ่มเติม</span>
                <ArrowRight :size="16" class="group-hover:translate-x-1 transition-transform" />
            </div>
        </div>
    </article>
</template>
