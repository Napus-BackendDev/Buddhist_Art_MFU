<template>
    <div class="w-full flex flex-col px-10">
        <header class="justify-between items-center space-y-5 mb-6">
            <div class="flex flex-col items-center gap-2 my-8">
                <h1 class="text-4xl md:text-5xl leading-tight font-extrabold text-red-600">ผลงานศิลปะทั้งหมด</h1>
                <p class="text-gray-600 text-base md:text-lg">คอลเลกชันผลงานศิลปะคุณภาพสูงจากศิลปินมากความสามารถ</p>
            </div>

            <div class="flex items-center justify-between mb-3">
                <!-- Search Bar -->
                <UInput
v-model="searchQuery" icon="material-symbols:search" size="xl" variant="outline"
                    placeholder="ค้นหาผลงานศิลปะ" class="w-full max-w-2xl" highlight
                    :ui="{ base: 'bg-white text-black rounded-xl ring ring-inset ring-gray-300 focus-visible:ring-2 focus-visible:ring-red-500 transition duration-200' }" />

                <div class="flex gap-3">
                    <!-- Category Filter -->
                    <USelect
v-model="categoryFilter" :items="categoryOptions"
                        icon="material-symbols:filter-alt-outline" size="xl" variant="outline"
                        placeholder="กรองตามประเภท" highlight color="error"
                        :ui="{ base: 'bg-white text-black rounded-xl ring ring-inset ring-gray-300 focus-visible:ring-2 focus-visible:ring-red-500 transition duration-200', trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-200', content: 'bg-white shadow-lg ring-1 ring-gray-200 max-h-fit', item: 'hover:bg-red-50 data-highlighted:bg-red-400 text-gray-800 rounded-md' }" />
                    <!-- Sort Filter -->
                    <USelect
v-model="sortBy" :items="sortOptions" icon="material-symbols:sort" size="xl"
                        variant="outline" placeholder="เรียงตาม" highlight color="error"
                        :ui="{ base: 'bg-white text-black rounded-xl ring ring-inset ring-gray-300 focus-visible:ring-2 focus-visible:ring-red-500 transition duration-200', trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-200', content: 'bg-white shadow-lg ring-1 ring-gray-200', item: 'hover:bg-red-50 data-highlighted:bg-red-400 text-gray-800 rounded-md' }" />
                </div>
            </div>

            <!-- Results Header -->
            <div class="flex items-center justify-between ">
                <h2 class="text-xl font-bold text-gray-800">
                    ผลงานทั้งหมด
                    <span class="text-red-600">{{ artworks?.length || 0 }}</span>
                    ชิ้น
                </h2>
                <div class="flex items-center gap-2 text-sm text-gray-500">
                    <Icon name="material-symbols:grid-view" size="16" />
                    <span>มุมมองแบบตาราง</span>
                </div>
            </div>
        </header>
        <!-- Artworks Grid -->
        <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
            <NuxtLink v-for="art in filteredArtworks" :key="art._id" :to="`/artworks/${art.artname}`" class="group">
                <div class="transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
                    <ArtworkCard :art="art" :button-sell="true" :editor="false" />
                </div>
            </NuxtLink>
        </div>

        <!-- Loading State -->
        <div v-if="!filteredArtworks?.length" class="flex flex-col items-center justify-center py-16">
            <Icon name="material-symbols:search-off" size="64" class="text-gray-300 mb-4" />
            <h3 class="text-xl font-semibold text-gray-500 mb-2">ไม่พบผลงานศิลปะ</h3>
            <p class="text-gray-400">ลองค้นหาด้วยคำค้นอื่น หรือเปลี่ยนตัวกรอง</p>
        </div>
    </div>
</template>

<script setup lang="ts">
const { artworks } = useFetchArtworks<Arts>()
const searchQuery = ref('')
const categoryFilter = ref<'all' | string>('all')
const sortBy = ref<'newest' | 'oldest' | 'price-low' | 'price-high' | 'name-asc' | 'name-desc'>('newest')

const categoryOptions = computed(() => {
    const types = [...new Set((artworks.value || []).map(a => a.type))].filter(Boolean)
    return [{ label: 'ทุกประเภท', value: 'all' }, ...types.map(t => ({ label: t, value: t }))]
})

const sortOptions = [
    { label: 'ใหม่ล่าสุด', value: 'newest' },
    { label: 'เก่าที่สุด', value: 'oldest' },
    { label: 'ราคาต่ำไปสูง', value: 'price-low' },
    { label: 'ราคาสูงไปต่ำ', value: 'price-high' }
]

const filteredArtworks = computed<Arts[]>(() => {
    let list = [...(artworks.value || [])]

    // search
    if (searchQuery.value.trim()) {
        const q = searchQuery.value.toLowerCase()
        list = list.filter(a => {
            const fields = [
                a.artname,
                a.type,
                a.user.username.th
            ].map(v => (v || '').toString().toLowerCase())
            return fields.some(f => f.includes(q))
        })
    }

    if (categoryFilter.value && categoryFilter.value !== 'all') {
        list = list.filter(a => a.type === categoryFilter.value)
    }

    // sort
    switch (sortBy.value) {
        case 'oldest':
            list.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
            break
        case 'price-low':
            list.sort((a, b) => a.price - b.price)
            break
        case 'price-high':
            list.sort((a, b) => b.price - a.price)
            break
        case 'name-asc':
            list.sort((a, b) => a.artname.localeCompare(b.artname))
            break
        case 'name-desc':
            list.sort((a, b) => b.artname.localeCompare(a.artname))
            break
        default: // newest
            list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    }

    return list
})

</script>