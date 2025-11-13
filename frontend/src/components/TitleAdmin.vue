<script setup>
import { defineProps } from 'vue';

const props = defineProps({
    icon: { type: Object },
    title: { type: String },
    description: { type: String }
})
</script>

<template>
    <header class="w-full p-5  bg-gray-600 text-white shadow-md border border-red-100">
        <div class="flex items-center gap-4">   
            <!-- Icon -->
            <div class="w-12 h-12 rounded-xl bg-white flex items-center justify-center ">
                <component :is="props.icon" class="w-6 h-6 text-red-600" />
            </div>

            <!-- Title & Description -->
            <div>
                <h1 class="text-2xl md:text-3xl font-extrabold ">{{ props.title }}</h1>
                <p class="text-md">{{ props.description }}</p>
            </div>

        </div>
    </header>
</template>
