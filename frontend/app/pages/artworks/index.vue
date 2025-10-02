<template>
    <div class="w-full flex flex-col px-10">
        <div class="flex flex-col items-center gap-2 my-8">
            <h1 class="text-4xl md:text-5xl leading-tight font-extrabold text-red-600">ผลงานศิลปะทั้งหมด</h1>
            <p class="text-gray-600 text-base md:text-lg">คอลเลกชันผลงานศิลปะคุณภาพสูงจากศิลปินมากความสามารถ</p>
        </div>
        
        <div class="flex items-center justify-between gap-5 mb-8">
            <!-- Search Bar -->
            <div class="relative flex-1 w-full max-w-2xl">
                <span class="pointer-events-none absolute inset-y-0 left-3 flex items-center text-gray-400">
                    <Icon name="material-symbols:search" size="20" />
                </span>
                <input 
                    type="text" 
                    placeholder="ค้นหาผลงานศิลปะ, ศิลปิน, หรือหมวดหมู่..."
                    class="w-full border border-gray-300 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"  
                />
            </div>
            
            <!-- Filters -->
            <div class="flex items-center gap-3">
                <!-- Category Filter -->
                <div class="border border-gray-300 rounded-xl px-4 py-3 flex items-center gap-2 bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
                    <Icon name="material-symbols:filter-alt-outline" size="20" class="text-gray-600" />
                    <select class="outline-none bg-transparent cursor-pointer text-sm font-medium">
                        <option value="showAllType">ทุกหมวดหมู่</option>
                        <option v-for="type in uniqueTypes" :key="type" :value="type">{{ type }}</option>
                    </select>
                </div>
                
                <!-- Sort Filter -->
                <div class="border border-gray-300 rounded-xl px-4 py-3 bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
                    <select class="outline-none bg-transparent cursor-pointer text-sm font-medium">
                        <option value="newest">ใหม่ล่าสุด</option>
                        <option value="price-low">ราคาต่ำไปสูง</option>
                        <option value="price-high">ราคาสูงไปต่ำ</option>
                    </select>
                </div>
            </div>
        </div>
        
        <!-- Results Header -->
        <div class="flex items-center justify-between mb-6">
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
        
        <!-- Artworks Grid -->
        <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
            <NuxtLink 
                v-for="art in artworks" 
                :key="art._id" 
                :to="`/artworks/${art.artname}`"
                class="group"
            >
                <div class="transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
                    <ArtworkCard :art="art" :buttonSell="true" :editor="false" />
                </div>
            </NuxtLink>
        </div>
        
        <!-- Loading State -->
        <div v-if="!artworks?.length" class="flex flex-col items-center justify-center py-16">
            <Icon name="material-symbols:search-off" size="64" class="text-gray-300 mb-4" />
            <h3 class="text-xl font-semibold text-gray-500 mb-2">ไม่พบผลงานศิลปะ</h3>
            <p class="text-gray-400">ลองค้นหาด้วยคำค้นอื่น หรือเปลี่ยนตัวกรอง</p>
        </div>
    </div>
</template>

<script setup lang="ts">
const { artworks } = useFetchArtworks<Arts>()
const uniqueTypes = computed(() => { return [...new Set(artworks.value?.map(art => art.type) ?? [])] })
</script>