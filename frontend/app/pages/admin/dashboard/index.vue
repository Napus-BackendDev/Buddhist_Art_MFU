<template>
    <UDashboardNavbar title="Dashboard" icon="i-lucide-house" :ui="{ title: 'text-black' }" />
    <div class="grid grid-cols-4 gap-4 px-10 py-8">
        <UCard :ui="{ root: 'bg-gray-50'}">
            <h2 class="text-lg font-medium">Total Artworks</h2>
            <p class="text-2xl font-bold">1,024</p>
        </UCard>
        <UCard :ui="{ root: 'bg-gray-50'}">
            <h2 class="text-lg font-medium">Total Users</h2>
            <p class="text-2xl font-bold">512</p>
        </UCard>
        <UCard :ui="{ root: 'bg-gray-50'}">
            <h2 class="text-lg font-medium">Total Order</h2>
            <p class="text-2xl font-bold">256</p>
        </UCard>
        <UCard :ui="{ root: 'bg-gray-50'}">
            <h2 class="text-lg font-medium">Total News</h2>
            <p class="text-2xl font-bold">$12,345</p>
        </UCard>
        <UCard class="col-span-2">
            <h2 class="text-lg font-medium">Total Artworks</h2>
            <p class="text-2xl font-bold">1,024</p>
        </UCard>
        <UCard class="col-span-2">
            <h2 class="text-lg font-medium">Total Users</h2>
            <p class="text-2xl font-bold">512</p>
        </UCard>
    </div>
</template>

<script setup lang="ts">
definePageMeta({
    layout: 'admin'
})
</script>