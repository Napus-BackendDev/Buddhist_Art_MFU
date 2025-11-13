<script setup>
import { RouterView } from 'vue-router'
import Navbar from '@/components/Navbar.vue'
</script>

<template>
    <Navbar />
    <div className="flex min-h-screen items-center justify-center">
        <main className="flex min-h-screen w-full max-w-7xl flex-col items-center  py-8  sm:items-start">
            <RouterView />
        </main>
    </div>
</template>
