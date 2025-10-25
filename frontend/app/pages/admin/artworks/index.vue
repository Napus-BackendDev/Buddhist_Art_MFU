<template>
    <!-- Navbar -->
    <UDashboardNavbar title="Users" icon="lucide:users" :ui="{ title: 'text-black' }">
        <template #right>
            <UButton icon="lucide:plus" color="primary" variant="solid" label="New Artwork" :ui="{ base: 'text-white' }"
                @click="showCreateModal = true" />
        </template>
    </UDashboardNavbar>

    <!-- Main Content -->
    <div class="grid grid-rows gap-6 p-6 ">
        <!-- Search Bar -->
        <UInput v-model="searchQuery" icon="material-symbols:search" size="xl" variant="outline" placeholder="Search"
            class="w-full max-w-xs" highlight
            :ui="{ base: 'bg-white text-black rounded-xl ring ring-inset ring-gray-300 focus-visible:ring-2 focus-visible:ring-red-500 transition duration-200' }" />

        <!-- Table -->
        <UTable ref="table" v-model:pagination="pagination" :data="filteredArtworks || []" :columns="columns"
            :pagination-options="{ getPaginationRowModel: getPaginationRowModel() }"
            class="flex-1 [&_thead_th]:text-black [&_tbody_td]:text-black">
            <template #actions-cell="{ row }">
                <div className="flex items-center gap-6">
                    <UCheckbox v-model="approve" label="Approve" :ui="{ label: 'text-success' }"
                        @update:modelValue="val => { if (val) deny = false }" />
                    <UCheckbox v-model="deny" label="Deny" color="error" icon="i-lucide-x" :ui="{ label: 'text-error' }"
                        @update:modelValue="val => { if (val) approve = false }" />
                    <UDropdownMenu :items="getDropdownActions(row.original)">
                        <UButton icon="i-lucide-ellipsis-vertical" variant="ghost" aria-label="Actions"
                            :ui="{ base: 'text-black' }" />
                    </UDropdownMenu>
                </div>
            </template>
        </UTable>

        <!-- Pagination -->
        <div class="flex justify-end border-t border-default pt-4">
            <UPagination :default-page="(table?.tableApi?.getState().pagination.pageIndex || 0) + 1"
                :items-per-page="table?.tableApi?.getState().pagination.pageSize" :total="filteredArtworks.length"
                @update:page="(p) => table?.tableApi?.setPageIndex(p - 1)" />
        </div>
    </div>

    <!-- Create Modal -->
    <div v-if="showCreateModal" class="absolute inset-0 bg-black/40 flex justify-center items-center z-50 p-12">
        <UCard class="bg-white text-black w-full max-w-lg rounded-2xl shadow-xl relative max-h-screen overflow-y-auto">
            <UButton icon="i-lucide-x" variant="ghost" color="neutral" class="absolute top-3 right-3"
                @click="closeCreateModal" />

            <div class="p-6 flex flex-col gap-6">
                <h2 class="text-xl font-semibold text-center">เพิ่มผลงานศิลปะ</h2>
                <form class="grid grid-cols-1 gap-4" @submit.prevent="saveArtwork">
                    <div class="flex flex-col space-y-4">
                        <!-- Art ID -->
                        <div class="flex flex-col space-y-2">
                            <label class="text-sm font-semibold text-gray-700">รหัสผลงานศิลปะ
                                <label class="text-error">*</label>
                            </label>
                            <UInput v-model="artworkData.artId" variant="outline" required
                                :ui="{ base: 'bg-white text-black' }" />
                        </div>

                        <!-- Art Name -->
                        <div class="flex flex-col space-y-2">
                            <label class="text-sm font-semibold text-gray-700">ชื่อผลงานศิลปะ
                                <label class="text-error">*</label>
                            </label>
                            <UInput v-model="artworkData.artname" variant="outline" required
                                :ui="{ base: 'bg-white text-black' }" />
                        </div>

                        <!-- Size -->
                        <div class="flex flex-col space-y-2">
                            <label class="text-sm font-semibold text-gray-700">ขนาด
                                <label class="text-error">*</label>
                            </label>
                            <UInput v-model="artworkData.size" variant="outline" required
                                :ui="{ base: 'bg-white text-black' }" />
                        </div>

                        <!-- Technique -->
                        <div class="flex flex-col space-y-2">
                            <label class="text-sm font-semibold text-gray-700">เทคนิก
                                <label class="text-error">*</label>
                            </label>
                            <UInput v-model="artworkData.technique" variant="outline" required
                                :ui="{ base: 'bg-white text-black' }" />
                        </div>

                        <!-- Price -->
                        <div class="flex flex-col space-y-2">
                            <label class="text-sm font-semibold text-gray-700">ราคา
                                <label class="text-error">*</label>
                            </label>
                            <UInput v-model="artworkData.price" variant="outline" required
                                :ui="{ base: 'bg-white text-black' }" />
                        </div>

                        <!-- Concept -->
                        <div class="flex flex-col space-y-2">
                            <label class="text-sm font-semibold text-gray-700">แนวคิด
                                <label class="text-error">*</label>
                            </label>
                            <UInput v-model="artworkData.concept" variant="outline" required
                                :ui="{ base: 'bg-white text-black' }" />
                        </div>

                        <!-- Type -->
                        <div class="flex flex-col space-y-2">
                            <label class="text-sm font-semibold text-gray-700">ประเภท
                                <label class="text-error">*</label>
                            </label>
                            <UInput v-model="artworkData.type" variant="outline" required
                                :ui="{ base: 'bg-white text-black' }" />
                        </div>

                        <!-- Presentation -->
                        <div class="flex flex-col space-y-2">
                            <label class="text-sm font-semibold text-gray-700">รูปแบบการนำเสนอ
                                <label class="text-error">*</label>
                            </label>
                            <UInput v-model="artworkData.presentation" variant="outline" required
                                :ui="{ base: 'bg-white text-black' }" />
                        </div>

                        <!-- Art Address -->
                        <div class="flex flex-col space-y-2">
                            <label class="text-sm font-semibold text-gray-700">สถานที่จัดเก็บผลงาน
                                <label class="text-error">*</label>
                            </label>
                            <UInput v-model="artworkData.artAddress" variant="outline" required
                                :ui="{ base: 'bg-white text-black' }" />
                        </div>

                        <!-- Ratio -->
                        <div class="flex flex-col space-y-2">
                            <label class="text-sm font-semibold text-gray-700">อัตราส่วน
                                <label class="text-error">*</label>
                            </label>
                            <UInput v-model="artworkData.ratio" variant="outline" required
                                :ui="{ base: 'bg-white text-black' }" />
                        </div>

                        <!-- User -->
                        <div class="flex flex-col space-y-2">
                            <label class="text-sm font-semibold text-gray-700">ผู้ใช้
                                <label class="text-error">*</label>
                            </label>
                            <UInput v-model="artworkData.user" variant="outline" required
                                :ui="{ base: 'bg-white text-black' }" />
                        </div>

                        <!-- Picture -->
                        <div class="flex flex-col space-y-2">
                            <label class="text-sm font-semibold text-gray-700">รูปโปรไฟล์
                                <label class="text-error">*</label>
                            </label>
                            <UInput type="file" accept="image/*" :required="!isEditing"
                                :ui="{ base: 'bg-white text-black' }" @change="onFileChange" />
                        </div>
                    </div>

                    <div class="flex justify-end gap-2 mt-4">
                        <UButton label="Cancel" color="neutral" variant="soft" @click="closeCreateModal" />
                        <UButton label="Create" color="primary" type="submit" :loading="isCreating" />
                    </div>
                </form>
            </div>
        </UCard>
    </div>

    <!-- View Modal -->
    <div v-if="showViewModal" class="absolute inset-0 bg-black/40 flex justify-center items-center z-50 p-12">
        <UCard
            class="bg-white text-black w-full max-w-lg rounded-2xl shadow-xl relative overflow-hidden max-h-screen overflow-y-auto">
            <UButton icon="i-lucide-x" variant="ghost" color="neutral" class="absolute top-3 right-3 z-10"
                @click="showViewModal = false" />

            <div class="flex flex-col gap-6 p-6">
                <img :src="selectedArtwork?.picture ? getPictureUrl(selectedArtwork.picture) : ''" alt="Artwork"
                    class="w-full object-cover border border-gray-200 rounded-xl" />
                <div class="grid grid-cols-1 gap-4">
                    <div class="border border-gray-300 rounded-lg p-3">
                        <p class="text-sm text-gray-500 font-medium">Artwork ID</p>
                        <p class="text-base font-semibold">{{ selectedArtwork?.artId }}</p>
                    </div>

                    <div class="border border-gray-300 rounded-lg p-3">
                        <p class="text-sm text-gray-500 font-medium">Artist</p>
                        <p class="text-base font-semibold">{{ selectedArtwork?.user?.username?.th }}</p>
                    </div>

                    <div class="border border-gray-300 rounded-lg p-3">
                        <p class="text-sm text-gray-500 font-medium">Price</p>
                        <p class="text-base font-semibold">{{ selectedArtwork?.price }}</p>
                    </div>

                    <div class="border border-gray-300 rounded-lg p-3">
                        <p class="text-sm text-gray-500 font-medium">Status</p>
                        <p class="text-base font-semibold">{{ selectedArtwork?.status }}</p>
                    </div>
                </div>
            </div>
        </UCard>
    </div>

</template>

<script setup lang="ts">
import type { TableColumn, DropdownMenuItem } from '@nuxt/ui'
import { getPaginationRowModel } from '@tanstack/vue-table';
import { UUser, UButton } from '#components';
import { ref } from 'vue'

const table = useTemplateRef('table');
const config = useRuntimeConfig()

const approve = ref(false)
const deny = ref(false)

const showCreateModal = ref(false)
const showViewModal = ref(false)

const isCreating = ref(false)
const isEditing = ref(false)

const editingId = ref<string | null>(null)
const selectedArtwork = ref<Arts | null>(null)
const searchQuery = ref('')

const pagination = ref({
    pageIndex: 0,
    pageSize: 5
})

definePageMeta({
    layout: 'admin'
})

const artworkData = reactive({
    artId: '',
    artname: '',
    size: '',
    technique: '',
    price: '',
    concept: '',
    type: '',
    presentation: '',
    artAddress: '',
    ratio: '',
    user: '',
    picture: null as File | null
})

function resetArtworkData() {
    Object.assign(artworkData, {
        artId: '',
        artname: '',
        size: '',
        technique: '',
        price: '',
        concept: '',
        type: '',
        presentation: '',
        artAddress: '',
        ratio: '',
        user: '',
        picture: null
    })
}

// Fetch
const {
    data: artworks,
    refresh,
} = useFetch<Arts[]>(`${config.public.apiUrl}/arts`, { credentials: "include" });

// Create & Update
async function saveArtwork() {
    isCreating.value = true
    try {
        const form = new FormData()
        Object.entries(artworkData).forEach(([key, value]) => {
            if (value !== null && key !== 'user') {
                form.append(key, value as string | Blob);
            }
        })

        if (isEditing.value && editingId.value) {
            // Update
            await $fetch(`${config.public.apiUrl}/arts/${editingId.value}`, {
                method: "PATCH",
                body: form,
                credentials: "include",
            })
        } else {
            // Create
            await $fetch(`${config.public.apiUrl}/arts`, {
                method: "POST",
                body: form,
                credentials: "include",
            })
        }

        await refresh()
        closeCreateModal()
    } catch (err) {
        console.error("Save user failed:", err)
    } finally {
        isCreating.value = false
    }
}

// Delete
async function deleteArtwork(id: string) {
    try {
        await $fetch(`${config.public.apiUrl}/arts/${id}`, {
            method: "DELETE",
            credentials: "include",
        })
        await refresh()
    } catch (err) {
        console.error("Delete artwork failed:", err)
    }
}

const filteredArtworks = computed(() => {
    const q = searchQuery.value.toLowerCase().trim()
    if (!q) return artworks.value || []

    return (artworks.value || []).filter((artwork) => {
        const name = artwork.user.username?.th?.toLowerCase() || ''
        const id = artwork.artId?.toLowerCase() || ''
        const price = artwork.price.toString() || ''
        const status = artwork.status?.toLowerCase() || ''

        return [name, id, price, status].some((field) => field.includes(q))
    })
})

function onFileChange(e: Event) {
    const target = e.target as HTMLInputElement
    if (target.files && target.files[0]) {
        artworkData.picture = target.files[0]
    }
}

function getPictureUrl(picture: string): string {
    return encodeURI(picture.replace(/\/uploads\/[^/]+\//, '/uploads/Admin/'));
}

function onView(art: Arts) {
    selectedArtwork.value = art
    showViewModal.value = true
}

function closeCreateModal() {
    showCreateModal.value = false
    isEditing.value = false
    editingId.value = null
    resetArtworkData()
}

async function onEdit(art: Arts) {
    isEditing.value = true
    editingId.value = art._id
    showCreateModal.value = true

    Object.assign(artworkData, {
        artId: art.artId,
        artname: art.artname,
        size: art.size,
        technique: art.technique,
        price: art.price.toString(),
        concept: art.concept,
        type: art.type,
        presentation: art.presentation,
        artAddress: art.artAddress,
        ratio: art.ratio,
        user: art.user?.username?.th ?? '',
    })
}

const columns: TableColumn<Arts>[] = [
    {
        header: 'Artwork',
        cell: ({ row }) => {
            const { artname, artId, picture } = row.original;
            return (
                h(UUser,
                    {
                        name: artname ?? "",
                        description: artId,
                        avatar: { src: getPictureUrl(picture) },
                        ui: {
                            name: 'text-normal text-black',
                            description: 'text-sm text-gray-500',
                            avatar: 'rounded-none border border-gray-200 w-16 h-16'
                        }
                    }
                )
            )
        }
    },
    {
        header: 'Price',
        accessorKey: 'price',
    },
    {
        header: 'Status',
        accessorKey: 'status',
    },
    {
        header: 'Actions',
        id: 'actions'
    },
]

function getDropdownActions(art: Arts): DropdownMenuItem[] {
    return [
        {
            label: 'View',
            icon: 'lucide:eye',
            onClick: () => onView(art),
        },
        {
            label: 'Edit',
            icon: 'i-lucide-edit',
            onClick: () => onEdit(art),
        },
        {
            label: 'Delete',
            icon: 'i-lucide-trash',
            color: 'error',
            onClick: () => deleteArtwork(art._id),
        }
    ]
}

</script>