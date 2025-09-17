<template>
    <div class="flex flex-col items-center justify-center gap-2 my-8">
        <h1 class="text-5xl font-extrabold text-red-600">ข่าวสารและกิจกรรม</h1>
        <h2 class="text-xl text-gray-600">อัพเดทข่าวสารใหม่ๆ จากวงการศิลปะและกิจกรรมที่น่าสนใจ</h2>
    </div>
    <div class="w-full grid grid-cols-1 md:grid-cols-3 gap-8  px-10">
        <div v-for="news in newsList" :key="news._id" class="border rounded-2xl p-4 my-4 flex flex-col gap-2">
            <div v-if="news?.image">
                <img :src="news.image" alt="News Image"
                    class="w-full h-64 object-cover" />
            </div>
            <h1 class="text-2xl text-red-600 font-extrabold">{{ news?.title }}</h1>
            <p class="text-gray-600">{{ news?.description }}</p>
            <p class="text-end text-sm text-gray-500">วันที่: {{ new Date(news.createdAt).toLocaleDateString() }}</p>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { News } from '../../../shared/types/new';

const { data: newsList } = await useAsyncData<News[]>(() =>
    $fetch<News[]>('http://localhost:8080/api/news').then(res => res.slice(0,3))
);

</script>