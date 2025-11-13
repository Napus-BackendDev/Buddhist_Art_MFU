<script setup>
import { computed, ref } from 'vue'
import { formatPrice } from '@/utils/formatPrice.js'

const isLoading = ref(true)
const props = defineProps({
    art: { type: Object, required: true },
})

const handleImageLoad = () => {
    isLoading.value = false
}

const isSold = computed(() => {
    const s = props.art?.saleStatus || props.art?.status || ''
    return String(s).toLowerCase() === 'sold'
})

const saleStatusLabel = computed(() => {
    return isSold.value ? 'ขายแล้ว' : 'พร้อมขาย'
})

const saleStatusClass = computed(() => {
    return isSold.value
        ? 'bg-red-100 text-red-700 border border-red-300'
        : 'bg-green-100 text-green-700 border border-green-300'
})

const approvalStatusLabel = computed(() => {
    const status = props.art?.approvalStatus
    if (status === 'approved') return 'อนุมัติแล้ว'
    if (status === 'rejected') return 'ปฏิเสธ'
    return 'รออนุมัติ'
})

const approvalStatusClass = computed(() => {
    const status = props.art?.approvalStatus
    if (status === 'approved') return 'bg-green-100 text-green-700 border border-green-300'
    if (status === 'rejected') return 'bg-red-100 text-red-700 border border-red-300'
    return 'bg-yellow-100 text-yellow-700 border border-yellow-300'
})

const imageUrl = computed(() => props.art?.photo || props.art?.image || '/placeholder-art.png')
const artName = computed(() => props.art?.artname?.th || props.art?.artname?.en || props.art?.title || 'Untitled')
const ownerName = computed(() => props.art?.owner?.username?.th || props.art?.owner?.username?.en || props.art?.owner?.name || 'Unknown')
</script>

<template>
    <div class="relative rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-lg transition-shadow duration-300">
        <div class="relative">
            <div v-if="isLoading" class="w-full h-64 bg-gray-300 animate-pulse"></div>

            <img v-show="!isLoading" :src="imageUrl" :alt="artName"
                class="w-full h-64 object-cover transition-opacity duration-300" @load="handleImageLoad" />

        </div>


        <div class="p-5">
            <div class="flex items-center justify-between">
                <div class="flex flex-wrap gap-2">
                    <span
                        class="inline-flex items-center text-xs font-semibold bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
                        {{ props.art?.type?.th || props.art?.type || 'ประเภท' }}
                    </span>
                    <span class="inline-flex items-center text-xs font-semibold px-3 py-1 rounded-full"
                        :class="saleStatusClass">
                        {{ saleStatusLabel }}
                    </span>
                    <span v-if="props.art?.approvalStatus"
                        class="inline-flex items-center text-xs font-semibold px-3 py-1 rounded-full"
                        :class="approvalStatusClass">
                        {{ approvalStatusLabel }}
                    </span>
                </div>
                <span class="text-red-600 font-extrabold text-lg">฿{{ formatPrice(props.art?.price) }}</span>
            </div>

            <div class="mt-3">
                <h3 class="font-bold text-lg">{{ artName }}</h3>
                <p class="text-gray-600">โดย {{ ownerName }}</p>
            </div>

            <div class="text-sm text-gray-600 grid grid-cols-2 gap-2 pt-2">
                <div><span class="font-medium">ขนาด:</span> {{ props.art?.size || '-' }}</div>
                <div><span class="font-medium">อัตราส่วน:</span> {{ props.art?.ratio || '-' }}</div>
                <div><span class="font-medium">เทคนิค:</span> {{ props.art?.technique?.th || props.art?.technique ||
                    '-' }}</div>
                <div><span class="font-medium">การนำเสนอ:</span> {{ props.art?.presentation?.th
                    || props.art?.presentation || '-' }}</div>
            </div>

            <button class="mt-5 w-full px-4 py-3 rounded-lg flex items-center justify-center gap-2 transition-all"
                :class="isSold ? 'bg-gray-300 text-gray-600 cursor-not-allowed' : props.isInCart ? 'bg-green-500 hover:bg-green-600 text-white' : 'bg-rose-500 hover:bg-rose-600 text-white'"
                :disabled="isSold">
                <span v-if="isSold">ขายแล้ว ไม่สามารถซื้อได้</span>
                <span v-else-if="props.isInCart" class="flex items-center gap-1">✓ อยู่ในตะกร้าแล้ว (คลิกเพื่อลบ)</span>
                <span v-else class="flex items-center gap-1">
                    <ShoppingCart class="w-4 h-4" /> เพิ่มในตะกร้า
                </span>
            </button>
            
        </div>
    </div>
</template>
