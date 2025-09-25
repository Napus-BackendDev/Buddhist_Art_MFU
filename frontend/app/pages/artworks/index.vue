<template>
    <div class="w-full flex flex-col px-10">
        <div class="flex flex-col items-center gap-2 my-8">
            <h1 class="text-4xl md:text-5xl leading-tight font-extrabold text-red-600">ผลงานศิลปะทั้งหมด</h1>
            <p class="text-gray-600 text-base md:text-lg">คอลเลกชันผลงานศิลปะคุณภาพสูงจากศิลปินมากความสามารถ</p>
        </div>
        <div class=" flex items-center justify-between gap-5 mb-3">
            <div class="relative flex-1">
                <span class="pointer-events-none absolute inset-y-0 left-3 flex items-center text-gray-400">🔎</span>
                <input type="text" placeholder="ค้นหาผลงานศิลปะ, ศิลปิน, หรือหมวดหมู่..."
                    class="w-full border rounded-xl pl-10 pr-4 py-3" />
            </div>
            <div>
                <select class="border rounded-xl px-4 py-3">
                    <option value="showAllType">ทุกหมวด</option>
                    <option v-for="type in uniqueTypes" :key="type" :value="type">{{ type }}</option>
                </select>
            </div>
            <div>
                <select class="border rounded-xl px-4 py-3">
                    <option value="newest">ใหม่ล่าสุด</option>
                    <option value="price-low">ราคาต่ำไปสูง</option>
                    <option value="price-high">ราคาสูงไปต่ำ</option>
                </select>
            </div>
        </div>
        <div class=" flex flex-col gap-4 mb-8">
            <h1> ผลงานทั้งหมด {{ artworks?.length }} ชิ้น</h1>
            <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
                <NuxtLink v-for="art in artworks" :key="art._id" :to="`/artworks/${art.artname}`">
                    <ArtworkCard :art="art" />
                </NuxtLink>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { Arts } from '../../../shared/types/art';

const { artworks } = useFetchArtworks<Arts>()
const uniqueTypes = computed(() => { return [...new Set(artworks.value?.map(art => art.type) ?? [])] })

</script>