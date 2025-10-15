<template>
    <div class="relative  rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-lg transition-shadow duration-300">
        <div class="relative">
            <img :src="art.picture" :alt="art.artname" class="w-full h-64 object-cover" >
            <div class="absolute top-3 right-3 flex gap-2">
                <template v-if="editor">
                    <!-- Editor Mode: Edit & Delete buttons -->
                    <UButton icon="lucide:edit" class="text-blue-600" color="neutral" @click="handleEdit" />
                    <UButton icon="lucide:trash-2" class="text-red-600" color="neutral" @click="handleDelete" />
                </template>
                <template v-else>
                    <!-- Normal Mode: Like & Bookmark buttons -->
                    <button
                        class="bg-white/80 backdrop-blur px-2 py-2 rounded-md shadow hover:bg-white transition-colors">
                        <Icon name="lucide:heart" size="16" class="text-red-500" />
                    </button>
                    <button
                        class="bg-white/80 backdrop-blur px-2 py-2 rounded-md shadow hover:bg-white transition-colors">
                        <Icon name="lucide:bookmark" size="16" class="text-gray-600" />
                    </button>
                </template>
            </div>
            <div v-if="art.status === 'sold'" class="absolute inset-0 flex items-center justify-center">
                <span class="bg-red-500 text-white font-semibold px-6 py-3 rounded-full shadow">ขายแล้ว</span>
            </div>
        </div>
        <div class="p-5">
            <div class="flex items-center justify-between">
                <span
                    class="inline-flex items-center text-xs font-semibold bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
                    {{ art.type }}
                </span>
                <span class="text-red-600 font-extrabold text-lg">฿{{ (art.price) }}</span>
            </div>

            <div class="mt-3">
                <h3 class="font-bold text-lg">{{ art.artname }}</h3>
                <p class="text-gray-600">โดย {{ art.user.username.th }}</p>
            </div>

            <div class="mt-3 text-sm text-gray-700 space-y-1">
                <p>ขนาด: {{ art.size }}</p>
                <p>เทคนิค: {{ art.technique }}</p>
            </div>

            <button
v-if="buttonSell" class="mt-5 w-full px-4 py-3 rounded-lg flex items-center justify-center gap-2"
                :class="art.status === 'sold' ? 'bg-rose-200 text-rose-700 cursor-not-allowed' : 'bg-rose-500 hover:bg-rose-600 text-white'"
                :disabled="art.status === 'available'">
                <span v-if="art.status === 'sold'">สินค้าหมด</span>
                <span v-else>🛒 เพิ่มในตะกร้า</span>
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
const { art, buttonSell, editor } = defineProps<{ art: Arts, buttonSell: boolean, editor: boolean }>()
const config = useRuntimeConfig()
const emit = defineEmits<{ delete: [] }>()

function handleEdit() {
    try {
        navigateTo(`/profile/upload/${art._id}`)
    } catch (error) {
        console.error('Error navigating to edit page:', error)
    }
}

async function handleDelete() {
    try {
        await $fetch(`${config.public.apiUrl}/profile/art/${art._id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include'
        })
        emit('delete')
    } catch (error) {
        console.error('Error deleting artwork:', error)
    }
}
</script>