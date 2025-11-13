<script setup>
import Sidebar from '@/components/Sidebar.vue';
import Title from '@/components/TitleAdmin.vue';
import { useRoute } from 'vue-router';

const route = useRoute();
</script>

<template>
    <div class="flex">
        <Sidebar />
        <main class="flex-1 bg-gray-100 min-h-screen">
            <Title :icon="route.meta.icon" :title="route.meta.title" :description="route.meta.description"/>
            <router-view />
        </main>
    </div>
</template>