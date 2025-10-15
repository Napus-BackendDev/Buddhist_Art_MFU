<template>
    <UDashboardNavbar title="Dashboard" icon="i-lucide-house" :ui="{ title: 'text-black' }" />
    <div class="grid grid-cols-4 gap-4 px-10 py-8">
        <UCard :ui="{ root: 'bg-gray-50' }">
            <h2 class="text-lg font-medium">Total Artworks</h2>
            <p v-if="artsPending" class="text-gray-400">Loading...</p>
            <p v-else class="text-2xl font-bold">{{ artsData?.length || 0 }}</p>
        </UCard>
        <UCard :ui="{ root: 'bg-gray-50' }">
            <h2 class="text-lg font-medium">Total Users</h2>
            <p v-if="userPending" class="text-gray-400">Loading...</p>
            <p v-else class="text-2xl font-bold">{{ usersData?.length || 0 }}</p>
        </UCard>
        <UCard :ui="{ root: 'bg-gray-50' }">
            <h2 class="text-lg font-medium">Total Order</h2>
            <p class="text-2xl font-bold">256</p>
        </UCard>
        <UCard :ui="{ root: 'bg-gray-50' }">
            <h2 class="text-lg font-medium">Total News</h2>
            <p v-if="newsPending" class="text-gray-400">Loading...</p>
            <p v-else class="text-2xl font-bold">{{ newsData?.length || 0 }}</p>
        </UCard>

        <UCard class="col-span-2">
            <h2 class="text-lg font-medium">Total Users</h2>
            <p class="text-2xl font-bold">512</p>
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
const config = useRuntimeConfig()
const { data: usersData, pending: userPending, error: userError } = useFetch<UserProfile[]>(`${config.public.apiUrl}/admin/user`, { credentials: 'include', transform: (data) => data.filter((user: UserProfile) => user.role !== 'admin') })
const { data: artsData, pending: artsPending, error: artsError } = useFetch<Arts[]>(`${config.public.apiUrl}/arts`)
const { data: newsData, pending: newsPending, error: newsError } = useFetch<News[]>(`${config.public.apiUrl}/news`)
</script>